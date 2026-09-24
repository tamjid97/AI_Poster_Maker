"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.regeneratePoster = exports.deletePoster = exports.getPosterById = exports.getPosters = exports.createPoster = void 0;
const client_1 = require("@prisma/client");
const gemini_service_1 = require("../../../lib/services/gemini-service");
const poster_render_service_1 = require("../../../lib/services/poster-render-service");
const puppeteer_render_1 = require("../../../lib/services/puppeteer-render");
const cloudinary_service_1 = require("../../../lib/services/cloudinary-service");
const default_templates_1 = require("../../../lib/default-templates");
const types_1 = require("../../../types");
const prisma = new client_1.PrismaClient();
async function createPoster(req, res) {
    try {
        if (!req.user) {
            return res.status(401).json({ success: false, message: 'Authentication required' });
        }
        const { templateId, name, designation, party, organization, unionOrThana, district, occasion, headline, photoUrls = [], } = req.body;
        const errors = [];
        if (!name?.trim())
            errors.push('Name is required');
        if (!occasion?.trim())
            errors.push('Occasion is required');
        if (!headline?.trim())
            errors.push('Headline is required');
        if (errors.length > 0) {
            return res.status(400).json({ success: false, message: 'Validation failed', errors });
        }
        // Match template
        let matchedTemplate = default_templates_1.DEFAULT_TEMPLATES.find((t) => t.id === templateId) || null;
        let dbTemplateId = undefined;
        try {
            if (templateId) {
                const dbTpl = await prisma.template.findFirst({
                    where: { OR: [{ slug: templateId }, { id: templateId }] },
                });
                if (dbTpl) {
                    dbTemplateId = dbTpl.id;
                }
            }
        }
        catch { }
        // 1. Get Gemini layout suggestion
        const layoutSuggestion = await (0, gemini_service_1.getLayoutSuggestion)({
            occasion,
            headline,
            name,
            designation,
            party,
            organization,
            unionOrThana,
            district,
            photoCount: photoUrls.length,
            template: matchedTemplate,
        });
        // 2. Save initial poster to Prisma
        const poster = await prisma.poster.create({
            data: {
                userId: req.user.userId,
                templateId: dbTemplateId,
                name: name.trim(),
                designation: designation?.trim() || null,
                party: party?.trim() || null,
                organization: organization?.trim() || null,
                unionOrThana: unionOrThana?.trim() || null,
                district: district?.trim() || null,
                occasion: occasion.trim(),
                headline: headline.trim(),
                photoUrls: Array.isArray(photoUrls) ? photoUrls : [],
                layoutSuggestion: layoutSuggestion,
                status: 'GENERATING',
            },
        });
        // 3. Generate HTML/CSS
        const posterDataForHtml = {
            id: poster.id,
            user_id: poster.userId,
            template_id: poster.templateId,
            name: poster.name,
            designation: poster.designation,
            party: poster.party,
            organization: poster.organization,
            union_or_thana: poster.unionOrThana,
            district: poster.district,
            occasion: poster.occasion,
            headline: poster.headline,
            photo_urls: poster.photoUrls,
            generated_image_url: null,
            layout_suggestion: layoutSuggestion,
            status: poster.status,
            regenerate_count: poster.regenerateCount,
            created_at: poster.createdAt.toISOString(),
        };
        const html = (0, poster_render_service_1.generatePosterHTML)(posterDataForHtml, layoutSuggestion);
        // 4. Render with Puppeteer (1200x1600 print-ready PNG)
        let generatedImageUrl = null;
        try {
            const renderResult = await (0, puppeteer_render_1.renderPosterToImage)(html, poster.id);
            if ((0, cloudinary_service_1.isCloudinaryConfigured)()) {
                const uploadResult = await (0, cloudinary_service_1.uploadImageToCloudinary)(renderResult.buffer, `poster-final-${poster.id}`, 'posters/final');
                generatedImageUrl = uploadResult.secure_url;
            }
            else if (renderResult.localUrl) {
                generatedImageUrl = renderResult.localUrl;
            }
        }
        catch (renderError) {
            console.warn('Puppeteer background rendering notice (fallback to client render):', renderError);
        }
        // 5. Update poster to COMPLETED in Prisma
        const updatedPoster = await prisma.poster.update({
            where: { id: poster.id },
            data: {
                status: 'COMPLETED',
                generatedImageUrl,
            },
        });
        const responsePoster = {
            id: updatedPoster.id,
            user_id: updatedPoster.userId,
            template_id: updatedPoster.templateId,
            name: updatedPoster.name,
            designation: updatedPoster.designation,
            party: updatedPoster.party,
            organization: updatedPoster.organization,
            union_or_thana: updatedPoster.unionOrThana,
            district: updatedPoster.district,
            occasion: updatedPoster.occasion,
            headline: updatedPoster.headline,
            photo_urls: updatedPoster.photoUrls,
            generated_image_url: updatedPoster.generatedImageUrl,
            layout_suggestion: updatedPoster.layoutSuggestion,
            status: updatedPoster.status,
            regenerate_count: updatedPoster.regenerateCount,
            created_at: updatedPoster.createdAt.toISOString(),
        };
        return res.status(201).json({
            success: true,
            message: 'Poster created successfully',
            data: {
                poster: responsePoster,
                html,
                layout: layoutSuggestion,
            },
        });
    }
    catch (error) {
        const message = error instanceof Error ? error.message : 'Poster creation failed';
        return res.status(500).json({ success: false, message: 'Poster creation failed', errors: [message] });
    }
}
exports.createPoster = createPoster;
async function getPosters(req, res) {
    try {
        if (!req.user) {
            return res.status(401).json({ success: false, message: 'Authentication required' });
        }
        const page = Math.max(1, parseInt(req.query.page) || 1);
        const limit = Math.max(1, parseInt(req.query.limit) || 10);
        const skip = (page - 1) * limit;
        const [posters, total] = await Promise.all([
            prisma.poster.findMany({
                where: { userId: req.user.userId },
                orderBy: { createdAt: 'desc' },
                skip,
                take: limit,
            }),
            prisma.poster.count({
                where: { userId: req.user.userId },
            }),
        ]);
        const formattedPosters = posters.map((p) => ({
            id: p.id,
            user_id: p.userId,
            template_id: p.templateId,
            name: p.name,
            designation: p.designation,
            party: p.party,
            organization: p.organization,
            union_or_thana: p.unionOrThana,
            district: p.district,
            occasion: p.occasion,
            headline: p.headline,
            photo_urls: p.photoUrls,
            generated_image_url: p.generatedImageUrl,
            layout_suggestion: p.layoutSuggestion,
            status: p.status,
            regenerate_count: p.regenerateCount,
            created_at: p.createdAt.toISOString(),
        }));
        return res.status(200).json({
            success: true,
            message: 'Posters fetched successfully',
            data: {
                posters: formattedPosters,
                total,
                page,
                totalPages: Math.ceil(total / limit),
            },
        });
    }
    catch (error) {
        const message = error instanceof Error ? error.message : 'Failed to fetch posters';
        return res.status(500).json({ success: false, message: 'Server error', errors: [message] });
    }
}
exports.getPosters = getPosters;
async function getPosterById(req, res) {
    try {
        if (!req.user) {
            return res.status(401).json({ success: false, message: 'Authentication required' });
        }
        const { id } = req.params;
        const poster = await prisma.poster.findFirst({
            where: {
                id,
                userId: req.user.userId,
            },
        });
        if (!poster) {
            return res.status(404).json({ success: false, message: 'Poster not found', errors: ['Poster not found'] });
        }
        const formattedPoster = {
            id: poster.id,
            user_id: poster.userId,
            template_id: poster.templateId,
            name: poster.name,
            designation: poster.designation,
            party: poster.party,
            organization: poster.organization,
            union_or_thana: poster.unionOrThana,
            district: poster.district,
            occasion: poster.occasion,
            headline: poster.headline,
            photo_urls: poster.photoUrls,
            generated_image_url: poster.generatedImageUrl,
            layout_suggestion: poster.layoutSuggestion,
            status: poster.status,
            regenerate_count: poster.regenerateCount,
            created_at: poster.createdAt.toISOString(),
        };
        return res.status(200).json({
            success: true,
            message: 'Poster fetched successfully',
            data: { poster: formattedPoster },
        });
    }
    catch (error) {
        const message = error instanceof Error ? error.message : 'Failed to fetch poster';
        return res.status(500).json({ success: false, message: 'Server error', errors: [message] });
    }
}
exports.getPosterById = getPosterById;
async function deletePoster(req, res) {
    try {
        if (!req.user) {
            return res.status(401).json({ success: false, message: 'Authentication required' });
        }
        const { id } = req.params;
        const existing = await prisma.poster.findFirst({
            where: { id, userId: req.user.userId },
        });
        if (!existing) {
            return res.status(404).json({ success: false, message: 'Poster not found', errors: ['Poster not found'] });
        }
        await prisma.poster.delete({
            where: { id },
        });
        return res.status(200).json({
            success: true,
            message: 'Poster deleted successfully',
            data: null,
        });
    }
    catch (error) {
        const message = error instanceof Error ? error.message : 'Failed to delete poster';
        return res.status(500).json({ success: false, message: 'Server error', errors: [message] });
    }
}
exports.deletePoster = deletePoster;
async function regeneratePoster(req, res) {
    try {
        if (!req.user) {
            return res.status(401).json({ success: false, message: 'Authentication required' });
        }
        const { id } = req.params;
        const poster = await prisma.poster.findFirst({
            where: { id, userId: req.user.userId },
        });
        if (!poster) {
            return res.status(404).json({ success: false, message: 'Poster not found', errors: ['Poster not found'] });
        }
        if (poster.regenerateCount >= types_1.MAX_REGENERATE_COUNT) {
            return res.status(400).json({
                success: false,
                message: `Maximum regeneration limit (${types_1.MAX_REGENERATE_COUNT}) reached`,
                errors: [`You can only regenerate a poster ${types_1.MAX_REGENERATE_COUNT} times`],
            });
        }
        let template = default_templates_1.DEFAULT_TEMPLATES.find((t) => t.id === poster.templateId) || null;
        const layoutSuggestion = await (0, gemini_service_1.getLayoutSuggestion)({
            occasion: poster.occasion,
            headline: poster.headline,
            name: poster.name,
            designation: poster.designation || undefined,
            party: poster.party || undefined,
            organization: poster.organization || undefined,
            unionOrThana: poster.unionOrThana || undefined,
            district: poster.district || undefined,
            photoCount: poster.photoUrls.length,
            template,
        });
        const posterForHtml = {
            id: poster.id,
            user_id: poster.userId,
            template_id: poster.templateId,
            name: poster.name,
            designation: poster.designation,
            party: poster.party,
            organization: poster.organization,
            union_or_thana: poster.unionOrThana,
            district: poster.district,
            occasion: poster.occasion,
            headline: poster.headline,
            photo_urls: poster.photoUrls,
            generated_image_url: poster.generatedImageUrl,
            layout_suggestion: layoutSuggestion,
            status: 'COMPLETED',
            regenerate_count: poster.regenerateCount + 1,
            created_at: poster.createdAt.toISOString(),
        };
        const html = (0, poster_render_service_1.generatePosterHTML)(posterForHtml, layoutSuggestion);
        let generatedImageUrl = poster.generatedImageUrl;
        try {
            const renderResult = await (0, puppeteer_render_1.renderPosterToImage)(html, poster.id);
            if ((0, cloudinary_service_1.isCloudinaryConfigured)()) {
                const uploadResult = await (0, cloudinary_service_1.uploadImageToCloudinary)(renderResult.buffer, `poster-regen-${poster.id}-${poster.regenerateCount + 1}`, 'posters/final');
                generatedImageUrl = uploadResult.secure_url;
            }
            else if (renderResult.localUrl) {
                generatedImageUrl = renderResult.localUrl;
            }
        }
        catch (renderError) {
            console.warn('Puppeteer regenerate notice:', renderError);
        }
        const updated = await prisma.poster.update({
            where: { id },
            data: {
                layoutSuggestion: layoutSuggestion,
                regenerateCount: poster.regenerateCount + 1,
                generatedImageUrl,
                status: 'COMPLETED',
            },
        });
        const formattedPoster = {
            id: updated.id,
            user_id: updated.userId,
            template_id: updated.templateId,
            name: updated.name,
            designation: updated.designation,
            party: updated.party,
            organization: updated.organization,
            union_or_thana: updated.unionOrThana,
            district: updated.district,
            occasion: updated.occasion,
            headline: updated.headline,
            photo_urls: updated.photoUrls,
            generated_image_url: updated.generatedImageUrl,
            layout_suggestion: updated.layoutSuggestion,
            status: updated.status,
            regenerate_count: updated.regenerateCount,
            created_at: updated.createdAt.toISOString(),
        };
        return res.status(200).json({
            success: true,
            message: 'Poster regenerated successfully',
            data: {
                poster: formattedPoster,
                html,
                layout: layoutSuggestion,
            },
        });
    }
    catch (error) {
        const message = error instanceof Error ? error.message : 'Regeneration failed';
        return res.status(500).json({ success: false, message: 'Regeneration failed', errors: [message] });
    }
}
exports.regeneratePoster = regeneratePoster;
