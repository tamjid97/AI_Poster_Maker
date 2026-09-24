'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import {
  FileImage,
  Loader2,
  Plus,
  Download,
  Eye,
  Trash2,
  Image as ImageIcon,
  ChevronRight,
} from 'lucide-react';
import { Navbar } from '@/components/navbar';
import { Footer } from '@/components/footer';
import { AuthGuard } from '@/hooks/use-require-auth';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
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
import { fetchPosters, deletePoster } from '@/lib/api';
import type { Poster, PosterStatus } from '@/types';
import { STATUS_LABELS, OCCASION_LABELS } from '@/types';

function StatusBadge({ status }: { status: PosterStatus }) {
  const styles: Record<PosterStatus, string> = {
    DRAFT: 'bg-muted text-muted-foreground',
    GENERATING: 'bg-warning/20 text-warning',
    COMPLETED: 'bg-success/20 text-success',
    FAILED: 'bg-destructive/20 text-destructive',
  };
  return <Badge variant="secondary" className={styles[status]}>{STATUS_LABELS[status]}</Badge>;
}

function PosterHistoryContent() {
  const [posters, setPosters] = useState<Poster[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const loadPosters = async (pageNum: number) => {
    setLoading(true);
    const result = await fetchPosters(pageNum, 12);
    if (result.success && result.data) {
      setPosters(result.data.posters);
      setTotal(result.data.total);
      setTotalPages(result.data.totalPages);
    }
    setLoading(false);
  };

  useEffect(() => {
    loadPosters(page);
  }, [page]);

  const handleDelete = async (posterId: string) => {
    setDeletingId(posterId);
    const result = await deletePoster(posterId);
    if (result.success) {
      toast.success('Poster deleted successfully');
      setPosters((prev) => prev.filter((p) => p.id !== posterId));
      setTotal((prev) => prev - 1);
    } else {
      toast.error(result.message || 'Failed to delete poster');
    }
    setDeletingId(null);
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
              <h1 className="text-3xl font-bold tracking-tight">My Posters</h1>
              <p className="mt-1 text-muted-foreground">
                {total > 0 ? `${total} poster${total !== 1 ? 's' : ''} created` : 'No posters yet'}
              </p>
            </div>
            <Button asChild>
              <Link href="/create-poster">
                <Plus className="mr-2 h-4 w-4" />
                Create Poster
              </Link>
            </Button>
          </div>

          {loading ? (
            <div className="flex items-center justify-center py-20">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
          ) : posters.length === 0 ? (
            <Card className="border-dashed">
              <CardContent className="flex flex-col items-center justify-center py-16 text-center">
                <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-muted">
                  <ImageIcon className="h-8 w-8 text-muted-foreground" />
                </div>
                <h3 className="mb-2 text-lg font-semibold">No posters yet</h3>
                <p className="mb-4 max-w-sm text-sm text-muted-foreground">
                  You haven&apos;t created any posters yet. Get started by creating your first poster.
                </p>
                <Button asChild>
                  <Link href="/create-poster">
                    <Plus className="mr-2 h-4 w-4" />
                    Create Your First Poster
                  </Link>
                </Button>
              </CardContent>
            </Card>
          ) : (
            <>
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                {posters.map((poster, i) => (
                  <motion.div
                    key={poster.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, delay: i * 0.05 }}
                  >
                    <Card className="group overflow-hidden transition-shadow hover:shadow-lg">
                      <Link href={`/posters/${poster.id}`}>
                        <div className="aspect-[3/4] overflow-hidden bg-muted">
                          {poster.photo_urls[0] ? (
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
                      </Link>
                      <CardContent className="p-4">
                        <div className="mb-2 flex items-center justify-between">
                          <Badge variant="outline">
                            {OCCASION_LABELS[poster.occasion] || poster.occasion}
                          </Badge>
                          <StatusBadge status={poster.status} />
                        </div>
                        <p className="truncate font-semibold">{poster.headline}</p>
                        <p className="truncate text-sm text-muted-foreground">{poster.name}</p>
                        <p className="mt-1 text-xs text-muted-foreground">
                          {new Date(poster.created_at).toLocaleDateString('en-US', {
                            year: 'numeric', month: 'short', day: 'numeric',
                          })}
                        </p>
                        <div className="mt-3 flex gap-2">
                          <Button size="sm" variant="outline" className="flex-1" asChild>
                            <Link href={`/posters/${poster.id}`}>
                              <Eye className="mr-1 h-3 w-3" />View
                            </Link>
                          </Button>
                          <AlertDialog>
                            <AlertDialogTrigger asChild>
                              <Button size="sm" variant="outline" className="px-2">
                                <Trash2 className="h-3 w-3 text-destructive" />
                              </Button>
                            </AlertDialogTrigger>
                            <AlertDialogContent>
                              <AlertDialogHeader>
                                <AlertDialogTitle>Delete this poster?</AlertDialogTitle>
                                <AlertDialogDescription>
                                  This action cannot be undone.
                                </AlertDialogDescription>
                              </AlertDialogHeader>
                              <AlertDialogFooter>
                                <AlertDialogCancel>Cancel</AlertDialogCancel>
                                <AlertDialogAction
                                  onClick={() => handleDelete(poster.id)}
                                  disabled={deletingId === poster.id}
                                >
                                  {deletingId === poster.id ? 'Deleting...' : 'Delete'}
                                </AlertDialogAction>
                              </AlertDialogFooter>
                            </AlertDialogContent>
                          </AlertDialog>
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                ))}
              </div>

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="mt-8 flex items-center justify-center gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setPage((p) => Math.max(1, p - 1))}
                    disabled={page === 1}
                  >
                    Previous
                  </Button>
                  <span className="text-sm text-muted-foreground">
                    Page {page} of {totalPages}
                  </span>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                    disabled={page === totalPages}
                  >
                    Next
                  </Button>
                </div>
              )}
            </>
          )}
        </motion.div>
      </div>
      <Footer />
    </div>
  );
}

export default function PostersPage() {
  return (
    <AuthGuard>
      <PosterHistoryContent />
    </AuthGuard>
  );
}
