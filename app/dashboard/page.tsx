'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import {
  LayoutDashboard,
  FileImage,
  CheckCircle2,
  Loader2,
  XCircle,
  Plus,
  Layout as LayoutIcon,
  ArrowRight,
  Image as ImageIcon,
} from 'lucide-react';
import { Navbar } from '@/components/navbar';
import { Footer } from '@/components/footer';
import { AuthGuard } from '@/hooks/use-require-auth';
import { useAuth } from '@/providers/auth-provider';
import { useLanguage } from '@/providers/language-provider';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { fetchPosters } from '@/lib/api';
import type { Poster, PosterStatus } from '@/types';
import { STATUS_LABELS, OCCASION_LABELS } from '@/types';

function StatCard({
  icon: Icon,
  label,
  value,
  color,
}: {
  icon: React.ElementType;
  label: string;
  value: number;
  color: string;
}) {
  return (
    <Card>
      <CardContent className="flex items-center gap-4 p-6">
        <div className={`flex h-12 w-12 items-center justify-center rounded-lg ${color}`}>
          <Icon className="h-6 w-6" />
        </div>
        <div>
          <p className="text-sm text-muted-foreground">{label}</p>
          <p className="text-2xl font-bold">{value}</p>
        </div>
      </CardContent>
    </Card>
  );
}

function StatusBadge({ status }: { status: PosterStatus }) {
  const styles: Record<PosterStatus, string> = {
    DRAFT: 'bg-muted text-muted-foreground',
    GENERATING: 'bg-warning/20 text-warning',
    COMPLETED: 'bg-success/20 text-success',
    FAILED: 'bg-destructive/20 text-destructive',
  };
  return (
    <Badge variant="secondary" className={styles[status]}>
      {STATUS_LABELS[status]}
    </Badge>
  );
}

function DashboardContent() {
  const { user } = useAuth();
  const { t } = useLanguage();
  const [posters, setPosters] = useState<Poster[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadPosters = async () => {
      const result = await fetchPosters(1, 5);
      if (result.success && result.data) {
        setPosters(result.data.posters);
      }
      setLoading(false);
    };
    loadPosters();
  }, []);

  const stats = {
    total: posters.length,
    completed: posters.filter((p) => p.status === 'COMPLETED').length,
    generating: posters.filter((p) => p.status === 'GENERATING').length,
    failed: posters.filter((p) => p.status === 'FAILED').length,
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="container mx-auto px-4 py-8">
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h1 className="text-3xl font-bold tracking-tight">
                {t('dashboard.welcome')}, {user?.name || 'User'}
              </h1>
              <p className="mt-1 text-muted-foreground">
                {t('dashboard.subtitle')}
              </p>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" asChild className="btn-hover">
                <Link href="/templates">
                  <LayoutIcon className="mr-2 h-4 w-4" />
                  {t('nav.browseTemplates')}
                </Link>
              </Button>
              <Button asChild className="btn-hover">
                <Link href="/create-poster">
                  <Plus className="mr-2 h-4 w-4" />
                  {t('nav.createPoster')}
                </Link>
              </Button>
            </div>
          </div>

          {/* Stats */}
          <div className="mb-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <StatCard icon={FileImage} label={t('dashboard.totalPosters')} value={stats.total} color="bg-primary/10 text-primary" />
            <StatCard icon={CheckCircle2} label={t('dashboard.completed')} value={stats.completed} color="bg-success/10 text-success" />
            <StatCard icon={Loader2} label={t('dashboard.generating')} value={stats.generating} color="bg-warning/10 text-warning" />
            <StatCard icon={XCircle} label={t('dashboard.failed')} value={stats.failed} color="bg-destructive/10 text-destructive" />
          </div>

          {/* Recent Posters */}
          <div className="mb-6 flex items-center justify-between">
            <h2 className="text-xl font-semibold">{t('dashboard.recentPosters')}</h2>
            {posters.length > 0 && (
              <Link href="/posters" className="flex items-center gap-1 text-sm text-primary hover:underline">
                {t('dashboard.viewAll')}
                <ArrowRight className="h-3 w-3" />
              </Link>
            )}
          </div>

          {loading ? (
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="h-80 rounded-lg bg-muted animate-pulse" />
              ))}
            </div>
          ) : posters.length === 0 ? (
            <Card className="border-dashed">
              <CardContent className="flex flex-col items-center justify-center py-16 text-center">
                <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-muted">
                  <ImageIcon className="h-8 w-8 text-muted-foreground" />
                </div>
                <h3 className="mb-2 text-lg font-semibold">{t('dashboard.noPosters')}</h3>
                <p className="mb-4 max-w-sm text-sm text-muted-foreground">
                  {t('dashboard.noPostersDesc')}
                </p>
                <Button asChild className="btn-hover">
                  <Link href="/create-poster">
                    <Plus className="mr-2 h-4 w-4" />
                    {t('dashboard.createFirst')}
                  </Link>
                </Button>
              </CardContent>
            </Card>
          ) : (
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {posters.map((poster, i) => (
                <motion.div
                  key={poster.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: i * 0.05 }}
                >
                  <Card className="group overflow-hidden card-hover">
                    <div className="aspect-[3/4] overflow-hidden bg-muted">
                      {poster.generated_image_url ? (
                        <img
                          src={poster.generated_image_url}
                          alt={poster.headline}
                          className="h-full w-full object-cover transition-transform group-hover:scale-105"
                        />
                      ) : poster.photo_urls[0] ? (
                        <img
                          src={poster.photo_urls[0]}
                          alt={poster.headline}
                          className="h-full w-full object-cover transition-transform group-hover:scale-105"
                        />
                      ) : (
                        <div className="flex h-full w-full items-center justify-center">
                          <FileImage className="h-12 w-12 text-muted-foreground" />
                        </div>
                      )}
                    </div>
                    <CardContent className="p-4">
                      <div className="mb-2 flex items-center justify-between">
                        <Badge variant="outline">{OCCASION_LABELS[poster.occasion] || poster.occasion}</Badge>
                        <StatusBadge status={poster.status} />
                      </div>
                      <p className="truncate font-semibold">{poster.headline}</p>
                      <p className="truncate text-sm text-muted-foreground">{poster.name}</p>
                      <div className="mt-3 flex gap-2">
                        <Button size="sm" variant="outline" className="flex-1" asChild>
                          <Link href={`/posters/${poster.id}`}>View</Link>
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          )}
        </motion.div>
      </div>
      <Footer />
    </div>
  );
}

export default function DashboardPage() {
  return (
    <AuthGuard>
      <DashboardContent />
    </AuthGuard>
  );
}
