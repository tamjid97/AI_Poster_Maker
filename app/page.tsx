'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import {
  Sparkles,
  Wand2,
  Layout,
  Image as ImageIcon,
  Download,
  ShieldCheck,
  Zap,
  Palette,
  FileImage,
  ArrowRight,
  CheckCircle2,
} from 'lucide-react';
import { Navbar } from '@/components/navbar';
import { Footer } from '@/components/footer';
import { useLanguage } from '@/providers/language-provider';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

export const dynamic = 'force-dynamic';
export const fetchCache = 'force-no-store';

export default function Home() {
  const { t } = useLanguage();

  const features = [
    {
      icon: Wand2,
      title: t('home.features.aiLayouts.title'),
      description: t('home.features.aiLayouts.description'),
    },
    {
      icon: Layout,
      title: t('home.features.templateLibrary.title'),
      description: t('home.features.templateLibrary.description'),
    },
    {
      icon: ImageIcon,
      title: t('home.features.photoUpload.title'),
      description: t('home.features.photoUpload.description'),
    },
    {
      icon: Download,
      title: t('home.features.highResExport.title'),
      description: t('home.features.highResExport.description'),
    },
    {
      icon: Palette,
      title: t('home.features.banglaEnglish.title'),
      description: t('home.features.banglaEnglish.description'),
    },
    {
      icon: ShieldCheck,
      title: t('home.features.securePrivate.title'),
      description: t('home.features.securePrivate.description'),
    },
  ];

  const categories = [
    { label: t('home.categories.victoryDay'), icon: '🇧🇩', color: 'from-green-600 to-red-500' },
    { label: t('home.categories.eidGreeting'), icon: '🌙', color: 'from-green-700 to-yellow-500' },
    { label: t('home.categories.condolence'), icon: '🕯', color: 'from-gray-700 to-gray-900' },
    { label: t('home.categories.politicalCampaign'), icon: '📢', color: 'from-blue-700 to-blue-500' },
  ];

  const steps = [
    {
      icon: FileImage,
      title: t('home.howItWorks.step1.title'),
      description: t('home.howItWorks.step1.description'),
    },
    {
      icon: ImageIcon,
      title: t('home.howItWorks.step2.title'),
      description: t('home.howItWorks.step2.description'),
    },
    {
      icon: Wand2,
      title: t('home.howItWorks.step3.title'),
      description: t('home.howItWorks.step3.description'),
    },
    {
      icon: Download,
      title: t('home.howItWorks.step4.title'),
      description: t('home.howItWorks.step4.description'),
    },
  ];
  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-grid opacity-30" />
        <div className="absolute left-1/2 top-0 -z-10 h-[600px] w-[600px] -translate-x-1/2 rounded-full bg-primary/10 blur-3xl" />
        <div className="container relative mx-auto px-4 py-20 md:py-32">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="mx-auto max-w-3xl text-center"
          >
            <Badge variant="secondary" className="mb-6 gap-1.5 px-4 py-1.5 text-sm">
              <Sparkles className="h-3.5 w-3.5" />
              {t('home.hero.badge')}
            </Badge>
            <h1 className="text-balance text-4xl font-bold tracking-tight md:text-6xl">
              {t('home.hero.title')}
            </h1>
            <p className="mx-auto mt-6 max-w-2xl text-balance text-lg text-muted-foreground md:text-xl">
              {t('home.hero.subtitle')}
            </p>
            <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
              <Button size="lg" className="h-12 gap-2 px-8 text-base btn-hover" asChild>
                <Link href="/create-poster">
                  {t('home.hero.createPoster')}
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </Button>
              <Button size="lg" variant="outline" className="h-12 gap-2 px-8 text-base btn-hover" asChild>
                <Link href="/templates">
                  {t('home.hero.browseTemplates')}
                </Link>
              </Button>
            </div>
            <div className="mt-8 flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-sm text-muted-foreground">
              <div className="flex items-center gap-1.5">
                <CheckCircle2 className="h-4 w-4 text-success" />
                {t('home.hero.noDesignSkills')}
              </div>
              <div className="flex items-center gap-1.5">
                <CheckCircle2 className="h-4 w-4 text-success" />
                {t('home.hero.banglaFontSupport')}
              </div>
              <div className="flex items-center gap-1.5">
                <CheckCircle2 className="h-4 w-4 text-success" />
                {t('home.hero.printReady')}
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Features Section */}
      <section className="container mx-auto px-4 py-20">
        <div className="mx-auto mb-12 max-w-2xl text-center">
          <h2 className="text-3xl font-bold tracking-tight md:text-4xl">
            {t('home.features.title')}
          </h2>
          <p className="mt-4 text-muted-foreground">
            {t('home.features.subtitle')}
          </p>
        </div>
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {features.map((feature, i) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: i * 0.1 }}
            >
              <Card className="h-full card-hover">
                <CardHeader>
                  <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
                    <feature.icon className="h-6 w-6 text-primary" />
                  </div>
                  <CardTitle className="text-xl">{feature.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-base leading-relaxed">
                    {feature.description}
                  </CardDescription>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Categories Section */}
      <section className="border-y border-border/40 bg-card/30 py-20">
        <div className="container mx-auto px-4">
          <div className="mx-auto mb-12 max-w-2xl text-center">
            <h2 className="text-3xl font-bold tracking-tight md:text-4xl">
              {t('home.categories.title')}
            </h2>
            <p className="mt-4 text-muted-foreground">
              {t('home.categories.subtitle')}
            </p>
          </div>
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4">
            {categories.map((category, i) => (
              <motion.div
                key={category.label}
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.3, delay: i * 0.05 }}
              >
                <div className="group relative overflow-hidden rounded-xl border border-border/40 bg-card p-6 text-center card-hover hover:border-primary/50">
                  <div className={`absolute inset-0 bg-gradient-to-br ${category.color} opacity-0 transition-opacity group-hover:opacity-10`} />
                  <div className="relative">
                    <div className="mb-3 text-4xl">{category.icon}</div>
                    <p className="font-semibold">{category.label}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="container mx-auto px-4 py-20">
        <div className="mx-auto mb-12 max-w-2xl text-center">
          <Badge variant="secondary" className="mb-4 gap-1.5">
            <Zap className="h-3.5 w-3.5" />
            {t('home.howItWorks.badge')}
          </Badge>
          <h2 className="text-3xl font-bold tracking-tight md:text-4xl">
            {t('home.howItWorks.title')}
          </h2>
          <p className="mt-4 text-muted-foreground">
            {t('home.howItWorks.subtitle')}
          </p>
        </div>
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
          {steps.map((step, i) => (
            <motion.div
              key={step.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: i * 0.15 }}
              className="relative"
            >
              <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-gradient-primary text-white">
                <step.icon className="h-6 w-6" />
              </div>
              <div className="mb-2 text-sm font-bold text-primary">Step {i + 1}</div>
              <h3 className="mb-2 text-lg font-semibold">{step.title}</h3>
              <p className="text-sm text-muted-foreground">{step.description}</p>
              {i < steps.length - 1 && (
                <div className="absolute left-14 top-7 hidden h-px w-full bg-border lg:block" />
              )}
            </motion.div>
          ))}
        </div>
      </section>

      {/* CTA Section */}
      <section className="container mx-auto px-4 pb-20">
        <div className="relative overflow-hidden rounded-2xl bg-gradient-primary px-8 py-16 text-center">
          <div className="absolute inset-0 bg-grid opacity-10" />
          <div className="relative">
            <h2 className="text-3xl font-bold tracking-tight text-white md:text-4xl">
              {t('home.cta.title')}
            </h2>
            <p className="mx-auto mt-4 max-w-xl text-lg text-white/80">
              {t('home.cta.subtitle')}
            </p>
            <div className="mt-8 flex flex-col items-center justify-center gap-4 sm:flex-row">
              <Button size="lg" variant="secondary" className="h-12 px-8 text-base btn-hover" asChild>
                <Link href="/register">
                  {t('home.cta.getStarted')}
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
              <Button size="lg" variant="outline" className="h-12 border-white/30 px-8 text-base text-white hover:bg-white/10 hover:text-white btn-hover" asChild>
                <Link href="/templates">
                  {t('home.cta.browseTemplates')}
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
