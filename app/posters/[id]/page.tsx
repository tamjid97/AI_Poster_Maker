'use client';

import { useEffect, useState, useRef, Suspense } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Download,
  RefreshCw,
  Trash2,
  Loader2,
  ArrowLeft,
  Calendar,
  User,
  Tag,
  Image as ImageIcon,
  AlertCircle,
  Maximize2,
  Minimize2,
  FileImage,
  X,
} from 'lucide-react';
import { Navbar } from '@/components/navbar';
import { Footer } from '@/components/footer';
import { AuthGuard } from '@/hooks/use-require-auth';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { toast } from 'sonner';
import { generatePosterHTML } from '@/lib/services/poster-render-service';
import { fetchPoster, deletePoster, regeneratePoster } from '@/lib/api';
import { DEFAULT_TEMPLATES } from '@/lib/default-templates';
import type { Poster, LayoutSuggestion, PosterStatus, Template } from '@/types';
import { STATUS_LABELS, OCCASION_LABELS, MAX_REGENERATE_COUNT } from '@/types';

/**
 * Escape HTML to prevent XSS
 */
function escapeHtml(text: string | undefined | null): string {
  if (!text) return '';
  return String(text)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

function StatusBadge({ status }: { status: PosterStatus }) {
  const styles: Record<PosterStatus, string> = {
    DRAFT: 'bg-muted text-muted-foreground',
    GENERATING: 'bg-warning/20 text-warning',
    COMPLETED: 'bg-success/20 text-success',
    FAILED: 'bg-destructive/20 text-destructive',
  };
  return <Badge variant="secondary" className={styles[status]}>{STATUS_LABELS[status]}</Badge>;
}

function PosterPreviewContent() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const posterRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [poster, setPoster] = useState<Poster | null>(null);
  const [loading, setLoading] = useState(true);
  const [regenerating, setRegenerating] = useState(false);
  const [downloading, setDownloading] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [html, setHtml] = useState('');
  const [scale, setScale] = useState(0.45);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [fullscreenScale, setFullscreenScale] = useState(0.7);
  const [zoomLevel, setZoomLevel] = useState<'fit' | '100'>('fit');

  const loadPoster = async () => {
    setLoading(true);
    
    // First, check if this is a temporary poster and we have data in localStorage
    if (id.startsWith('temp-')) {
      const tempData = localStorage.getItem(`temp-poster-${id}`);
      if (tempData) {
        try {
          const data = JSON.parse(tempData);
          setPoster(data.poster);
          setHtml(data.html);
          setLoading(false);
          console.log('[POSTER PREVIEW] Using data from localStorage for temporary poster');
          return;
        } catch (err) {
          console.error('Error parsing temporary poster data:', err);
        }
      }
    }

    const result = await fetchPoster(id);
    if (result.success && result.data) {
      const p = result.data.poster;
      setPoster(p);

      // Try to get HTML from creation response first (stored in poster or localStorage)
      let htmlToUse = '';

      // Check if HTML was passed in the data (from creation response)
      if (result.data.html) {
        htmlToUse = result.data.html;
        console.log('[POSTER PREVIEW] Using HTML from creation response');
      } else {
        // Fallback: regenerate HTML
        try {
          const templatesRes = await fetch('/api/templates').catch(() => null);
          const templatesData = templatesRes ? await templatesRes.json() : null;
          const templates: Template[] = templatesData?.data?.templates || DEFAULT_TEMPLATES;

          console.log('========================================');
          console.log('[CRITICAL DEBUG] POSTER PREVIEW - template resolution');
          console.log('[CRITICAL DEBUG] poster.id:', p.id);
          console.log('[CRITICAL DEBUG] poster.template_id:', p.template_id);
          console.log('[CRITICAL DEBUG] poster.occasion:', p.occasion);
          console.log('[CRITICAL DEBUG] poster.layout_suggestion:', JSON.stringify(p.layout_suggestion));
          console.log('[CRITICAL DEBUG] layout_suggestion.templateId:', (p.layout_suggestion as any)?.templateId);
          console.log('[CRITICAL DEBUG] templates returned from API:', templates.map(t => ({ id: t.id, title: t.title, thumbnail_url: t.thumbnail_url })));
          console.log('========================================');

          const storedTemplateId = p.template_id;
          const layoutTemplateId = (p.layout_suggestion as any)?.templateId;
          const targetTemplateId = storedTemplateId || layoutTemplateId;

          let template: Template | undefined;

          if (targetTemplateId) {
            template = templates.find((t) => t.id === targetTemplateId);
            if (!template) {
              template = templates.find(
                (t) =>
                  t.id.includes(targetTemplateId) ||
                  targetTemplateId.includes(t.id)
              );
            }
          }

          if (!template) {
            console.error('[CRITICAL DEBUG] TEMPLATE NOT FOUND IN PREVIEW - using fallback template');
            // Use the first template as fallback
            template = templates[0];
          }

          console.log('[CRITICAL DEBUG] RESOLVED template id:', template?.id);
          console.log('[CRITICAL DEBUG] RESOLVED template title:', template?.title);

          const posterWithTemplateId = {
            ...p,
            template_id: targetTemplateId || (template?.id ?? null),
          };

          htmlToUse = await generatePosterHTML(posterWithTemplateId, p.layout_suggestion || undefined, template);
          console.log('[POSTER PREVIEW] Regenerated HTML');
        } catch (err) {
          console.error('Failed to render poster HTML:', err);
          try {
            const fallbackHtml = await generatePosterHTML(p, p.layout_suggestion || undefined);
            htmlToUse = fallbackHtml;
          } catch (fallbackErr) {
            console.error('Fallback HTML generation also failed:', fallbackErr);
            htmlToUse = `<div style="display:flex;align-items:center;justify-content:center;height:100vh;background:#1a1a2e;color:#ffffff;font-family:sans-serif;text-align:center;padding:40px;">
              <div style="border:3px solid #ffd700;padding:30px;border-radius:12px;background:#16213e;max-width:600px;">
                <h2 style="font-size:28px;margin-bottom:20px;color:#ffd700;">${escapeHtml(poster?.headline || 'Poster')}</h2>
                <p style="font-size:24px;color:#ffffff;margin-bottom:10px;">${escapeHtml(poster?.name || 'Unknown')}</p>
                <p style="font-size:18px;color:#cccccc;">${escapeHtml(poster?.designation || '')}</p>
              </div>
            </div>`;
          }
        }
      }

      setHtml(htmlToUse);
    } else {
      toast.error(result.message || 'Failed to load poster');
    }
    setLoading(false);
  };

  useEffect(() => {
    loadPoster();
  }, [id]);

  // Dynamically compute preview scale to fit container width
  useEffect(() => {
    const updateScale = () => {
      if (containerRef.current) {
        const width = containerRef.current.clientWidth;
        if (width > 0) {
          setScale(width / 1200);
        }
      }
    };

    updateScale();
    const ro = new ResizeObserver(updateScale);
    if (containerRef.current) {
      ro.observe(containerRef.current);
    }
    window.addEventListener('resize', updateScale);
    return () => {
      ro.disconnect();
      window.removeEventListener('resize', updateScale);
    };
  }, [html]);

  // Compute fullscreen scale & handle ESC key
  useEffect(() => {
    if (!isFullscreen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setIsFullscreen(false);
    };
    window.addEventListener('keydown', handleKeyDown);

    const updateFullscreenScale = () => {
      const availH = window.innerHeight - 130;
      const availW = window.innerWidth - 64;
      const sH = availH / 1600;
      const sW = availW / 1200;
      setFullscreenScale(Math.min(sH, sW, 1));
    };

    updateFullscreenScale();
    window.addEventListener('resize', updateFullscreenScale);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('resize', updateFullscreenScale);
    };
  }, [isFullscreen]);

  const handleDownload = async () => {
    if (!posterRef.current) return;
    setDownloading(true);
    try {
      const { toPng } = await import('html-to-image');
      const dataUrl = await toPng(posterRef.current, {
        width: 1200,
        height: 1600,
        pixelRatio: 2,
        cacheBust: true,
        backgroundColor: '#ffffff',
      });
      const link = document.createElement('a');
      const fileName = `poster-${poster?.name?.replace(/\s+/g, '-').toLowerCase() || 'untitled'}-${Date.now()}.png`;
      link.download = fileName;
      link.href = dataUrl;
      link.click();
      toast.success('Poster downloaded successfully');
    } catch (error) {
      toast.error('Failed to download poster');
      console.error(error);
    }
    setDownloading(false);
  };

  const handleRegenerate = async () => {
    if (!poster) return;
    if (poster.regenerate_count >= MAX_REGENERATE_COUNT) {
      toast.error(`Maximum regeneration limit (${MAX_REGENERATE_COUNT}) reached`);
      return;
    }
    setRegenerating(true);
    const result = await regeneratePoster(poster.id);
    if (result.success && result.data) {
      toast.success(`Poster regenerated (${result.data.poster.regenerate_count}/${MAX_REGENERATE_COUNT})`);
      // Re-fetch the poster and re-inject SVG on the client side
      await loadPoster();
    } else {
      toast.error(result.message || 'Failed to regenerate poster');
    }
    setRegenerating(false);
  };

  const handleDelete = async () => {
    if (!poster) return;
    setDeleting(true);
    const result = await deletePoster(poster.id);
    if (result.success) {
      toast.success('Poster deleted successfully');
      router.push('/posters');
    } else {
      toast.error(result.message || 'Failed to delete poster');
    }
    setDeleting(false);
  };

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!poster) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center gap-4">
        <AlertCircle className="h-12 w-12 text-destructive" />
        <p className="text-lg font-semibold">Poster not found</p>
        <Button asChild><Link href="/posters">Back to Posters</Link></Button>
      </div>
    );
  }

  const remainingRegens = MAX_REGENERATE_COUNT - poster.regenerate_count;

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="container mx-auto px-4 py-8">
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          <div className="mb-6 flex items-center gap-4">
            <Button variant="outline" size="icon" asChild>
              <Link href="/posters"><ArrowLeft className="h-4 w-4" /></Link>
            </Button>
            <div>
              <h1 className="text-2xl font-bold tracking-tight">{poster.headline}</h1>
              <p className="text-sm text-muted-foreground">Poster Preview</p>
            </div>
          </div>

          <div className="grid gap-8 lg:grid-cols-[1fr_350px]">
            {/* Poster Preview */}
            <div className="space-y-4">
              <Card className="overflow-hidden">
                <CardHeader className="flex flex-row items-center justify-between pb-3 border-b">
                  <div className="flex items-center gap-2">
                    <FileImage className="h-4 w-4 text-primary" />
                    <CardTitle className="text-base font-semibold">Poster Preview</CardTitle>
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setIsFullscreen(true)}
                    className="flex items-center gap-1.5 text-xs font-medium"
                  >
                    <Maximize2 className="h-3.5 w-3.5 text-primary" />
                    Fullscreen View
                  </Button>
                </CardHeader>
                <CardContent className="p-4 sm:p-6 flex flex-col items-center justify-center bg-muted/20">
                  <div
                    ref={containerRef}
                    className="relative w-full max-w-[560px] mx-auto overflow-hidden rounded-xl shadow-2xl border border-border/80 bg-neutral-950"
                    style={{
                      aspectRatio: '3/4',
                    }}
                  >
                    <div
                      style={{
                        width: 1200,
                        height: 1600,
                        transform: `scale(${scale})`,
                        transformOrigin: 'top left',
                        position: 'absolute',
                        top: 0,
                        left: 0,
                      }}
                    >
                      <div ref={posterRef} dangerouslySetInnerHTML={{ __html: html }} />
                    </div>
                  </div>
                  <p className="mt-3 text-xs text-muted-foreground text-center">
                    Print-ready 1200 × 1600 px • Click Fullscreen to preview in high resolution
                  </p>
                </CardContent>
              </Card>
            </div>

            {/* Sidebar Info */}
            <div className="space-y-4">
              {/* Status */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-base">Status</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">Current Status</span>
                    <StatusBadge status={poster.status} />
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">Created</span>
                    <span className="text-sm font-medium">
                      {new Date(poster.created_at).toLocaleDateString('en-US', {
                        year: 'numeric', month: 'short', day: 'numeric',
                      })}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">Regenerations</span>
                    <span className="text-sm font-medium">
                      {poster.regenerate_count}/{MAX_REGENERATE_COUNT}
                    </span>
                  </div>
                </CardContent>
              </Card>

              {/* Actions */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-base">Actions</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  <Button
                    variant="outline"
                    className="w-full"
                    onClick={() => setIsFullscreen(true)}
                  >
                    <Maximize2 className="mr-2 h-4 w-4" />View Fullscreen
                  </Button>
                  <Button className="w-full" onClick={handleDownload} disabled={downloading}>
                    {downloading ? (
                      <><Loader2 className="mr-2 h-4 w-4 animate-spin" />Downloading...</>
                    ) : (
                      <><Download className="mr-2 h-4 w-4" />Download PNG</>
                    )}
                  </Button>
                  <Button
                    variant="outline"
                    className="w-full"
                    onClick={handleRegenerate}
                    disabled={regenerating || remainingRegens <= 0}
                  >
                    {regenerating ? (
                      <><Loader2 className="mr-2 h-4 w-4 animate-spin" />Regenerating...</>
                    ) : (
                      <><RefreshCw className="mr-2 h-4 w-4" />Regenerate ({remainingRegens} left)</>
                    )}
                  </Button>
                  {remainingRegens <= 0 && (
                    <p className="text-xs text-muted-foreground text-center">
                      Regeneration limit reached
                    </p>
                  )}
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button variant="destructive" className="w-full" disabled={deleting}>
                        <Trash2 className="mr-2 h-4 w-4" />Delete Poster
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>Delete this poster?</AlertDialogTitle>
                        <AlertDialogDescription>
                          This action cannot be undone. The poster will be permanently removed.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction onClick={handleDelete}>Delete</AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </CardContent>
              </Card>

              {/* Poster Info */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-base">Poster Information</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex items-start gap-2">
                    <Tag className="mt-0.5 h-4 w-4 text-muted-foreground" />
                    <div>
                      <p className="text-xs text-muted-foreground">Occasion</p>
                      <p className="text-sm font-medium">{OCCASION_LABELS[poster.occasion] || poster.occasion}</p>
                    </div>
                  </div>
                  <Separator />
                  <div className="flex items-start gap-2">
                    <User className="mt-0.5 h-4 w-4 text-muted-foreground" />
                    <div>
                      <p className="text-xs text-muted-foreground">Name</p>
                      <p className="text-sm font-medium">{poster.name}</p>
                    </div>
                  </div>
                  {poster.designation && (
                    <>
                      <Separator />
                      <div className="flex items-start gap-2">
                        <User className="mt-0.5 h-4 w-4 text-muted-foreground" />
                        <div>
                          <p className="text-xs text-muted-foreground">Designation</p>
                          <p className="text-sm font-medium">{poster.designation}</p>
                        </div>
                      </div>
                    </>
                  )}
                  {poster.party && (
                    <>
                      <Separator />
                      <div>
                        <p className="text-xs text-muted-foreground">Party</p>
                        <p className="text-sm font-medium">{poster.party}</p>
                      </div>
                    </>
                  )}
                  {poster.organization && (
                    <>
                      <Separator />
                      <div>
                        <p className="text-xs text-muted-foreground">Organization</p>
                        <p className="text-sm font-medium">{poster.organization}</p>
                      </div>
                    </>
                  )}
                  {(poster.union_or_thana || poster.district) && (
                    <>
                      <Separator />
                      <div>
                        <p className="text-xs text-muted-foreground">Location</p>
                        <p className="text-sm font-medium">
                          {[poster.union_or_thana, poster.district].filter(Boolean).join(', ')}
                        </p>
                      </div>
                    </>
                  )}
                  {poster.photo_urls && poster.photo_urls.length > 0 && (
                    <>
                      <Separator />
                      <div>
                        <p className="mb-2 text-xs text-muted-foreground">Photos ({poster.photo_urls.length})</p>
                        <div className="grid grid-cols-3 gap-2">
                          {poster.photo_urls.map((url, i) => (
                            <div key={i} className="aspect-square overflow-hidden rounded-md border border-border">
                              <img src={url} alt={`Photo ${i + 1}`} className="h-full w-full object-cover" />
                            </div>
                          ))}
                        </div>
                      </div>
                    </>
                  )}
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Fullscreen View Modal */}
          <AnimatePresence>
            {isFullscreen && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 z-50 flex flex-col bg-background/95 backdrop-blur-md"
              >
                {/* Fullscreen Top Toolbar */}
                <div className="flex items-center justify-between px-4 sm:px-6 py-3 border-b bg-card/90">
                  <div className="flex items-center gap-3 min-w-0">
                    <Badge variant="outline">{OCCASION_LABELS[poster.occasion] || poster.occasion}</Badge>
                    <span className="font-semibold text-sm sm:text-base truncate max-w-xs sm:max-w-md">
                      {poster.headline}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button
                      size="sm"
                      variant={zoomLevel === 'fit' ? 'secondary' : 'ghost'}
                      onClick={() => setZoomLevel('fit')}
                      className="hidden sm:inline-flex text-xs"
                    >
                      Fit Screen
                    </Button>
                    <Button
                      size="sm"
                      variant={zoomLevel === '100' ? 'secondary' : 'ghost'}
                      onClick={() => setZoomLevel('100')}
                      className="hidden sm:inline-flex text-xs"
                    >
                      100% Size
                    </Button>
                    <Button size="sm" onClick={handleDownload} disabled={downloading}>
                      {downloading ? (
                        <><Loader2 className="mr-1.5 h-3.5 w-3.5 animate-spin" />Downloading...</>
                      ) : (
                        <><Download className="mr-1.5 h-3.5 w-3.5" />Download PNG</>
                      )}
                    </Button>
                    <Button
                      size="icon"
                      variant="ghost"
                      onClick={() => setIsFullscreen(false)}
                      title="Close (Esc)"
                    >
                      <X className="h-5 w-5" />
                    </Button>
                  </div>
                </div>

                {/* Poster Canvas Display Area */}
                <div className="flex-1 overflow-auto flex items-center justify-center p-4 sm:p-6 bg-neutral-950/60">
                  <div
                    className="relative overflow-hidden rounded-xl shadow-2xl border border-border/80 transition-all duration-150"
                    style={{
                      width: zoomLevel === 'fit' ? `${1200 * fullscreenScale}px` : '1200px',
                      height: zoomLevel === 'fit' ? `${1600 * fullscreenScale}px` : '1600px',
                    }}
                  >
                    <div
                      style={{
                        width: 1200,
                        height: 1600,
                        transform: zoomLevel === 'fit' ? `scale(${fullscreenScale})` : 'scale(1)',
                        transformOrigin: 'top left',
                        position: 'absolute',
                        top: 0,
                        left: 0,
                      }}
                      dangerouslySetInnerHTML={{ __html: html }}
                    />
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </div>
      <Footer />
    </div>
  );
}

export default function PosterPreviewPage() {
  return (
    <AuthGuard>
      <Suspense fallback={<div className="flex min-h-screen items-center justify-center"><Loader2 className="h-8 w-8 animate-spin text-primary" /></div>}>
        <PosterPreviewContent />
      </Suspense>
    </AuthGuard>
  );
}
