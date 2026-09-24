'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Search, Layout as LayoutIcon, Loader2, ArrowRight } from 'lucide-react';
import { Navbar } from '@/components/navbar';
import { Footer } from '@/components/footer';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { fetchTemplates } from '@/lib/api';
import type { Template } from '@/types';
import { OCCASION_LABELS, OCCASION_OPTIONS } from '@/types';

export default function TemplatesPage() {
  const [templates, setTemplates] = useState<Template[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [occasion, setOccasion] = useState('');

  useEffect(() => {
    const loadTemplates = async () => {
      setLoading(true);
      const result = await fetchTemplates({
        search: search || undefined,
        occasion: occasion || undefined,
      });
      if (result.success && result.data) {
        setTemplates(result.data.templates);
      }
      setLoading(false);
    };

    const debounce = setTimeout(loadTemplates, 300);
    return () => clearTimeout(debounce);
  }, [search, occasion]);

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="container mx-auto px-4 py-8">
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          <div className="mb-8 text-center">
            <h1 className="text-3xl font-bold tracking-tight md:text-4xl">
              Template Library
            </h1>
            <p className="mt-2 text-muted-foreground">
              Choose from our collection of professionally designed poster templates.
            </p>
          </div>

          {/* Search and Filter */}
          <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Search templates..."
                className="pl-9"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
            <div className="flex flex-wrap gap-2">
              <Button
                size="sm"
                variant={occasion === '' ? 'default' : 'outline'}
                onClick={() => setOccasion('')}
              >
                All
              </Button>
              {OCCASION_OPTIONS.map((opt) => (
                <Button
                  key={opt.value}
                  size="sm"
                  variant={occasion === opt.value ? 'default' : 'outline'}
                  onClick={() => setOccasion(opt.value)}
                >
                  {opt.label}
                </Button>
              ))}
            </div>
          </div>

          {/* Templates Grid */}
          {loading ? (
            <div className="flex items-center justify-center py-20">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
          ) : templates.length === 0 ? (
            <Card className="border-dashed">
              <CardContent className="flex flex-col items-center justify-center py-16 text-center">
                <LayoutIcon className="mb-4 h-12 w-12 text-muted-foreground" />
                <h3 className="mb-2 text-lg font-semibold">No templates found</h3>
                <p className="text-sm text-muted-foreground">
                  Try adjusting your search or filters.
                </p>
              </CardContent>
            </Card>
          ) : (
            <div className="mx-auto grid max-w-5xl gap-8 sm:grid-cols-2 lg:grid-cols-2">
              {templates.map((template, i) => (
                <motion.div
                  key={template.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: i * 0.1 }}
                >
                  <Card className="group overflow-hidden border border-border/60 transition-all duration-300 hover:border-primary/50 hover:shadow-2xl">
                    <div className="aspect-[3/4] overflow-hidden bg-muted relative">
                      {template.thumbnail_url ? (
                        <img
                          src={template.thumbnail_url}
                          alt={template.title}
                          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                          onError={(e) => {
                            console.error('Failed to load thumbnail:', template.thumbnail_url);
                            (e.target as HTMLImageElement).style.display = 'none';
                            (e.target as HTMLImageElement).nextElementSibling?.classList.remove('hidden');
                          }}
                        />
                      ) : null}
                      <div className={`flex h-full w-full items-center justify-center bg-gradient-primary ${template.thumbnail_url ? 'hidden' : ''}`}>
                        <LayoutIcon className="h-16 w-16 text-white/50" />
                      </div>
                    </div>
                    <CardContent className="p-5">
                      <div className="mb-3 flex items-center justify-between">
                        <Badge variant="secondary" className="font-medium">
                          {OCCASION_LABELS[template.occasion_type] || template.occasion_type}
                        </Badge>
                        {template.is_active ? (
                          <Badge variant="outline" className="border-emerald-500/30 bg-emerald-500/10 text-emerald-500">Active</Badge>
                        ) : (
                          <Badge variant="outline" className="text-muted-foreground">Inactive</Badge>
                        )}
                      </div>
                      <h3 className="mb-4 text-xl font-bold tracking-tight">{template.title}</h3>
                      <Button size="lg" className="w-full font-semibold shadow-sm" asChild>
                        <Link href={`/create-poster?template=${template.id}`}>
                          Use This Template
                          <ArrowRight className="ml-2 h-4 w-4" />
                        </Link>
                      </Button>
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
