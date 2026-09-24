import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import { DEFAULT_TEMPLATES } from '../../../lib/default-templates';

const prisma = new PrismaClient();

const ALLOWED_TEMPLATE_SLUGS = new Set(DEFAULT_TEMPLATES.map((t: any) => t.id));

export async function getTemplates(req: Request, res: Response) {
  try {
    const search = ((req.query.search as string) || '').toLowerCase().trim();
    const occasion = ((req.query.occasion as string) || '').trim();

    let dbTemplates: any[] = [];
    try {
      dbTemplates = await prisma.template.findMany({
        where: {
          slug: { in: Array.from(ALLOWED_TEMPLATE_SLUGS) },
          isActive: true,
        },
        orderBy: { createdAt: 'asc' },
      });
    } catch (err) {
      // In case MongoDB is offline or not yet connected, gracefully use DEFAULT_TEMPLATES
    }

    // Merge or fallback to DEFAULT_TEMPLATES
    const templatesMap = new Map<string, any>();
    for (const t of DEFAULT_TEMPLATES) {
      templatesMap.set(t.id, t);
    }

    for (const t of dbTemplates) {
      if (ALLOWED_TEMPLATE_SLUGS.has(t.slug)) {
        templatesMap.set(t.slug, {
          id: t.slug,
          dbId: t.id,
          title: t.title,
          occasion_type: t.occasionType,
          thumbnail_url: t.thumbnailUrl,
          layout_config: t.layoutConfig,
          is_active: t.isActive,
          created_at: t.createdAt.toISOString(),
        });
      }
    }

    let result = Array.from(templatesMap.values());

    if (occasion) {
      result = result.filter((t) => t.occasion_type === occasion);
    }

    if (search) {
      result = result.filter(
        (t) =>
          t.title.toLowerCase().includes(search) ||
          t.occasion_type.toLowerCase().includes(search)
      );
    }

    return res.status(200).json({
      success: true,
      message: 'Templates fetched successfully',
      data: { templates: result },
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Failed to fetch templates';
    return res.status(500).json({ success: false, message: 'Server error', errors: [message] });
  }
}

export async function getTemplateById(req: Request, res: Response) {
  try {
    const id = req.params.id as string;

    if (!ALLOWED_TEMPLATE_SLUGS.has(id)) {
      // Check if it's an ObjectId in db
      try {
        const dbTpl = await prisma.template.findUnique({ where: { id } });
        if (dbTpl && ALLOWED_TEMPLATE_SLUGS.has(dbTpl.slug)) {
          return res.status(200).json({
            success: true,
            message: 'Template fetched successfully',
            data: {
              template: {
                id: dbTpl.slug,
                dbId: dbTpl.id,
                title: dbTpl.title,
                occasion_type: dbTpl.occasionType,
                thumbnail_url: dbTpl.thumbnailUrl,
                layout_config: dbTpl.layoutConfig,
                is_active: dbTpl.isActive,
                created_at: dbTpl.createdAt.toISOString(),
              },
            },
          });
        }
      } catch { }
    }

    const tpl = DEFAULT_TEMPLATES.find((t) => t.id === id);
    if (!tpl) {
      return res.status(404).json({
        success: false,
        message: 'Template not found',
        errors: ['Template not found'],
      });
    }

    return res.status(200).json({
      success: true,
      message: 'Template fetched successfully',
      data: { template: tpl },
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Failed to fetch template';
    return res.status(500).json({ success: false, message: 'Server error', errors: [message] });
  }
}
