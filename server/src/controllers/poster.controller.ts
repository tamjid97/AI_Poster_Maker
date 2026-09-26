import { Response } from 'express';
import { PrismaClient } from '@prisma/client';
import { AuthRequest } from '../middleware/auth';
import { getLayoutSuggestion } from '../../../lib/services/gemini-service';
import { generatePosterHTML } from '../../../lib/services/poster-render-service';
import { renderPosterToImage } from '../../../lib/services/puppeteer-render';
import { uploadImageToCloudinary, isCloudinaryConfigured } from '../../../lib/services/cloudinary-service';
import { DEFAULT_TEMPLATES } from '../../../lib/default-templates';
import { MAX_REGENERATE_COUNT } from '../../../types';

const prisma = new PrismaClient();

export async function createPoster(req: AuthRequest, res: Response) {
  try {
    if (!req.user) {
      return res.status(401).json({ success: false, message: 'Authentication required' });
    }

    const {
      templateId,
      name,
      designation,
      party,
      organization,
      unionOrThana,
      district,
      occasion,
      headline,
      photoUrls = [],
    } = req.body;

    const errors: string[] = [];
    if (!name?.trim()) errors.push('Name is required');
    if (!occasion?.trim()) errors.push('Occasion is required');
    if (!headline?.trim()) errors.push('Headline is required');

    if (errors.length > 0) {
      return res.status(400).json({ success: false, message: 'Validation failed', errors });
    }

    // Match template
    let matchedTemplate = DEFAULT_TEMPLATES.find((t) => t.id === templateId) || null;
    let dbTemplateId: string | undefined = undefined;

    try {
      if (templateId) {
        const dbTpl = await prisma.template.findFirst({
          where: { OR: [{ slug: templateId }, { id: templateId }] },
        });
        if (dbTpl) {
          dbTemplateId = dbTpl.id;
          if (!matchedTemplate) {
            matchedTemplate = {
              id: dbTpl.slug,
              title: dbTpl.title,
              occasion_type: dbTpl.occasionType,
              thumbnail_url: dbTpl.thumbnailUrl,
              layout_config: dbTpl.layoutConfig as any,
              is_active: dbTpl.isActive,
              created_at: dbTpl.createdAt.toISOString(),
            };
          }
        }
      }
    } catch { }

    // 1. Get Gemini layout suggestion
    const layoutSuggestion = await getLayoutSuggestion({
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
        layoutSuggestion: layoutSuggestion as any,
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
      message: null,
      phone: null,
      email: null,
      event_date: null,
      venue: null,
      event_time: null,
      photo_urls: poster.photoUrls,
      generated_image_url: null,
      layout_suggestion: layoutSuggestion,
      status: poster.status as any,
      regenerate_count: poster.regenerateCount,
      created_at: poster.createdAt.toISOString(),
    };

    const html = await generatePosterHTML(posterDataForHtml, layoutSuggestion, matchedTemplate || undefined);

    // 4. Render with Puppeteer (1200x1600 print-ready PNG)
    let generatedImageUrl: string | null = null;
    try {
      const renderResult = await renderPosterToImage(html, poster.id);
      if (isCloudinaryConfigured()) {
        const uploadResult = await uploadImageToCloudinary(
          renderResult.buffer,
          `poster-final-${poster.id}`,
          'posters/final'
        );
        generatedImageUrl = uploadResult.secure_url;
      } else if (renderResult.localUrl) {
        generatedImageUrl = renderResult.localUrl;
      }
    } catch (renderError) {
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
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Poster creation failed';
    return res.status(500).json({ success: false, message: 'Poster creation failed', errors: [message] });
  }
}

export async function getPosters(req: AuthRequest, res: Response) {
  try {
    if (!req.user) {
      return res.status(401).json({ success: false, message: 'Authentication required' });
    }

    const page = Math.max(1, parseInt(req.query.page as string) || 1);
    const limit = Math.max(1, parseInt(req.query.limit as string) || 10);
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
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Failed to fetch posters';
    return res.status(500).json({ success: false, message: 'Server error', errors: [message] });
  }
}

export async function getPosterById(req: AuthRequest, res: Response) {
  try {
    if (!req.user) {
      return res.status(401).json({ success: false, message: 'Authentication required' });
    }

    const id = req.params.id as string;

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
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Failed to fetch poster';
    return res.status(500).json({ success: false, message: 'Server error', errors: [message] });
  }
}

export async function deletePoster(req: AuthRequest, res: Response) {
  try {
    if (!req.user) {
      return res.status(401).json({ success: false, message: 'Authentication required' });
    }

    const id = req.params.id as string;

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
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Failed to delete poster';
    return res.status(500).json({ success: false, message: 'Server error', errors: [message] });
  }
}

export async function regeneratePoster(req: AuthRequest, res: Response) {
  try {
    if (!req.user) {
      return res.status(401).json({ success: false, message: 'Authentication required' });
    }

    const id = req.params.id as string;

    const poster = await prisma.poster.findFirst({
      where: { id, userId: req.user.userId },
    });

    if (!poster) {
      return res.status(404).json({ success: false, message: 'Poster not found', errors: ['Poster not found'] });
    }

    if (poster.regenerateCount >= MAX_REGENERATE_COUNT) {
      return res.status(400).json({
        success: false,
        message: `Maximum regeneration limit (${MAX_REGENERATE_COUNT}) reached`,
        errors: [`You can only regenerate a poster ${MAX_REGENERATE_COUNT} times`],
      });
    }

    let template = DEFAULT_TEMPLATES.find((t) => t.id === poster.templateId) || null;

    if (!template && poster.templateId) {
      try {
        const dbTpl = await prisma.template.findFirst({
          where: { OR: [{ id: poster.templateId }, { slug: poster.templateId }] },
        });
        if (dbTpl) {
          template = {
            id: dbTpl.slug,
            title: dbTpl.title,
            occasion_type: dbTpl.occasionType,
            thumbnail_url: dbTpl.thumbnailUrl,
            layout_config: dbTpl.layoutConfig as any,
            is_active: dbTpl.isActive,
            created_at: dbTpl.createdAt.toISOString(),
          };
        }
      } catch { }
    }

    const layoutSuggestion = await getLayoutSuggestion({
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
      message: null,
      phone: null,
      email: null,
      event_date: null,
      venue: null,
      event_time: null,
      photo_urls: poster.photoUrls,
      generated_image_url: poster.generatedImageUrl,
      layout_suggestion: layoutSuggestion,
      status: 'COMPLETED' as any,
      regenerate_count: poster.regenerateCount + 1,
      created_at: poster.createdAt.toISOString(),
    };

    const html = await generatePosterHTML(posterForHtml, layoutSuggestion, template || undefined);

    let generatedImageUrl = poster.generatedImageUrl;
    try {
      const renderResult = await renderPosterToImage(html, poster.id);
      if (isCloudinaryConfigured()) {
        const uploadResult = await uploadImageToCloudinary(
          renderResult.buffer,
          `poster-regen-${poster.id}-${poster.regenerateCount + 1}`,
          'posters/final'
        );
        generatedImageUrl = uploadResult.secure_url;
      } else if (renderResult.localUrl) {
        generatedImageUrl = renderResult.localUrl;
      }
    } catch (renderError) {
      console.warn('Puppeteer regenerate notice:', renderError);
    }

    const updated = await prisma.poster.update({
      where: { id },
      data: {
        layoutSuggestion: layoutSuggestion as any,
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
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Regeneration failed';
    return res.status(500).json({ success: false, message: 'Regeneration failed', errors: [message] });
  }
}
