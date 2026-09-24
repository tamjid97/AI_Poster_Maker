'use client';

import { useState, useEffect, useCallback, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { motion, AnimatePresence } from 'framer-motion';
import {
  User,
  Building2,
  Image as ImageIcon,
  Loader2,
  Upload,
  X,
  ArrowLeft,
  ArrowRight,
  CheckCircle2,
  Wand2,
} from 'lucide-react';
import { Navbar } from '@/components/navbar';
import { Footer } from '@/components/footer';
import { AuthGuard } from '@/hooks/use-require-auth';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';
import { fetchTemplates, createPoster, uploadImages } from '@/lib/api';
import type { Template } from '@/types';
import { OCCASION_OPTIONS, OCCASION_LABELS, MAX_PHOTOS, MAX_FILE_SIZE, ACCEPTED_IMAGE_TYPES } from '@/types';

const posterSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  designation: z.string().optional(),
  party: z.string().optional(),
  organization: z.string().optional(),
  unionOrThana: z.string().optional(),
  district: z.string().optional(),
  occasion: z.string().min(1, 'Please select an occasion'),
  headline: z.string().min(2, 'Headline must be at least 2 characters'),
});

type PosterFormValues = z.infer<typeof posterSchema>;

const STEPS = [
  { number: 1, title: 'Personal Info', icon: User, description: 'Your name and designation' },
  { number: 2, title: 'Organization', icon: Building2, description: 'Party and location details' },
  { number: 3, title: 'Poster Details', icon: Wand2, description: 'Occasion and headline' },
  { number: 4, title: 'Photos & Template', icon: ImageIcon, description: 'Upload photos and choose template' },
];

function CreatePosterContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [step, setStep] = useState(1);
  const [templates, setTemplates] = useState<Template[]>([]);
  const [selectedTemplate, setSelectedTemplate] = useState<string>('');
  const [photos, setPhotos] = useState<File[]>([]);
  const [photoPreviews, setPhotoPreviews] = useState<string[]>([]);
  const [uploading, setUploading] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    setValue: setFormValue,
    watch,
    trigger,
    formState: { errors },
  } = useForm<PosterFormValues>({
    resolver: zodResolver(posterSchema),
    mode: 'onChange',
  });

  useEffect(() => {
    const loadTemplates = async () => {
      const result = await fetchTemplates();
      if (result.success && result.data) {
        setTemplates(result.data.templates);
        const templateId = searchParams.get('template');
        if (templateId) {
          setSelectedTemplate(templateId);
          const matched = result.data.templates.find((tpl) => tpl.id === templateId);
          if (matched && matched.occasion_type) {
            setFormValue('occasion', matched.occasion_type);
          }
        }
      }
    };
    loadTemplates();
  }, [searchParams, setFormValue]);

  const handlePhotoSelect = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    const validFiles: File[] = [];

    for (const file of files) {
      if (!ACCEPTED_IMAGE_TYPES.includes(file.type)) {
        toast.error(`"${file.name}" is not a valid image type (JPEG, PNG, WebP only)`);
        continue;
      }
      if (file.size > MAX_FILE_SIZE) {
        toast.error(`"${file.name}" exceeds the 5MB size limit`);
        continue;
      }
      validFiles.push(file);
    }

    const totalPhotos = photos.length + validFiles.length;
    if (totalPhotos > MAX_PHOTOS) {
      toast.error(`You can upload at most ${MAX_PHOTOS} photos`);
      return;
    }

    setPhotos((prev) => [...prev, ...validFiles]);

    validFiles.forEach((file) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        setPhotoPreviews((prev) => [...prev, e.target?.result as string]);
      };
      reader.readAsDataURL(file);
    });
  }, [photos]);

  const removePhoto = (index: number) => {
    setPhotos((prev) => prev.filter((_, i) => i !== index));
    setPhotoPreviews((prev) => prev.filter((_, i) => i !== index));
  };

  const validateStep = async (currentStep: number): Promise<boolean> => {
    const fieldsByStep: Record<number, (keyof PosterFormValues)[]> = {
      1: ['name'],
      2: [],
      3: ['occasion', 'headline'],
      4: [],
    };
    const fields = fieldsByStep[currentStep] || [];
    if (fields.length === 0) return true;
    return await trigger(fields);
  };

  const nextStep = async () => {
    const valid = await validateStep(step);
    if (valid && step < 4) {
      setStep(step + 1);
    }
  };

  const prevStep = () => {
    if (step > 1) setStep(step - 1);
  };

  const onSubmit = async (data: PosterFormValues) => {
    // If not on final step, advance to next step instead of submitting
    if (step < 4) {
      await nextStep();
      return;
    }

    // REQUIRE template selection
    if (!selectedTemplate) {
      toast.error('Please select a template from the template library (অনুগ্রহ করুন একটি টেমপ্লেট)');
      return;
    }

    // Require at least 1 photo
    if (photos.length === 0) {
      toast.error('Please upload at least 1 photo for your poster (আপনার পোস্টারের জন্য অন্তত ১টি ছবি আপলোড করুন)');
      return;
    }

    setSubmitting(true);

    let photoUrls: string[] = [];
    if (photos.length > 0) {
      setUploading(true);
      const uploadResult = await uploadImages(photos);
      setUploading(false);

      if (uploadResult.success && uploadResult.data) {
        photoUrls = uploadResult.data.urls;
      } else {
        toast.error(uploadResult.message || 'Failed to upload images');
        setSubmitting(false);
        return;
      }
    }

    console.log('[FORM SUBMIT] Creating poster with templateId:', selectedTemplate);
    console.log('[FORM SUBMIT] Photo URLs:', photoUrls);
    console.log('[FORM SUBMIT] User data:', { name: data.name, headline: data.headline, designation: data.designation });

    const result = await createPoster({
      templateId: selectedTemplate,
      name: data.name,
      designation: data.designation || undefined,
      party: data.party || undefined,
      organization: data.organization || undefined,
      unionOrThana: data.unionOrThana || undefined,
      district: data.district || undefined,
      occasion: data.occasion,
      headline: data.headline,
      photoUrls,
    });

    setSubmitting(false);

    if (result.success && result.data) {
      toast.success('Poster created successfully!');
      router.push(`/posters/${result.data.poster.id}`);
    } else {
      const errorMsg = result.errors && result.errors.length > 0
        ? result.errors.join(', ')
        : result.message || 'Failed to create poster';
      toast.error(errorMsg);
    }
  };

  const progress = (step / 4) * 100;

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="container mx-auto max-w-3xl px-4 py-8">
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          <div className="mb-8 text-center">
            <h1 className="text-3xl font-bold tracking-tight">Create a Poster</h1>
            <p className="mt-2 text-muted-foreground">
              Fill in the details below and let AI generate your poster.
            </p>
          </div>

          {/* Progress Bar */}
          <div className="mb-8">
            <Progress value={progress} className="mb-4 h-2" />
            <div className="flex justify-between">
              {STEPS.map((s) => (
                <div
                  key={s.number}
                  className={`flex flex-col items-center ${step >= s.number ? 'text-primary' : 'text-muted-foreground'}`}
                >
                  <div
                    className={`mb-1 flex h-10 w-10 items-center justify-center rounded-full border-2 transition-colors ${
                      step >= s.number
                        ? 'border-primary bg-primary/10'
                        : 'border-border bg-background'
                    }`}
                  >
                    {step > s.number ? (
                      <CheckCircle2 className="h-5 w-5 text-primary" />
                    ) : (
                      <s.icon className="h-5 w-5" />
                    )}
                  </div>
                  <span className="hidden text-xs font-medium sm:block">{s.title}</span>
                </div>
              ))}
            </div>
          </div>

          <form
            onSubmit={handleSubmit(onSubmit)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && e.target instanceof HTMLInputElement) {
                e.preventDefault();
                if (step < 4) {
                  nextStep();
                }
              }
            }}
          >
            <Card>
              <CardHeader>
                <CardTitle>{STEPS[step - 1].title}</CardTitle>
                <CardDescription>{STEPS[step - 1].description}</CardDescription>
              </CardHeader>
              <CardContent>
                <AnimatePresence mode="wait">
                  <motion.div
                    key={step}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    transition={{ duration: 0.2 }}
                  >
                    {step === 1 && (
                      <div className="space-y-4">
                        <div className="space-y-2">
                          <Label htmlFor="name">Full Name *</Label>
                          <Input
                            id="name"
                            placeholder="Enter your full name (Bangla or English)"
                            {...register('name')}
                          />
                          {errors.name && <p className="text-sm text-destructive">{errors.name.message}</p>}
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="designation">Designation</Label>
                          <Input
                            id="designation"
                            placeholder="e.g. President, General Secretary"
                            {...register('designation')}
                          />
                        </div>
                      </div>
                    )}

                    {step === 2 && (
                      <div className="space-y-4">
                        <div className="space-y-2">
                          <Label htmlFor="party">Political Party</Label>
                          <Input
                            id="party"
                            placeholder="e.g. Awami League, BNP"
                            {...register('party')}
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="organization">Organization</Label>
                          <Input
                            id="organization"
                            placeholder="e.g. Youth Wing, Women's Wing"
                            {...register('organization')}
                          />
                        </div>
                        <div className="grid gap-4 sm:grid-cols-2">
                          <div className="space-y-2">
                            <Label htmlFor="unionOrThana">Union/Thana</Label>
                            <Input
                              id="unionOrThana"
                              placeholder="e.g. Dhanmondi"
                              {...register('unionOrThana')}
                            />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="district">District</Label>
                            <Input
                              id="district"
                              placeholder="e.g. Dhaka"
                              {...register('district')}
                            />
                          </div>
                        </div>
                      </div>
                    )}

                    {step === 3 && (
                      <div className="space-y-4">
                        <div className="space-y-2">
                          <Label htmlFor="occasion">Occasion Type *</Label>
                          <Select onValueChange={(v) => setFormValue('occasion', v)}>
                            <SelectTrigger>
                              <SelectValue placeholder="Select occasion type" />
                            </SelectTrigger>
                            <SelectContent>
                              {OCCASION_OPTIONS.map((opt) => (
                                <SelectItem key={opt.value} value={opt.value}>
                                  {opt.label}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          {errors.occasion && <p className="text-sm text-destructive">{errors.occasion.message}</p>}
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="headline">Headline *</Label>
                          <Textarea
                            id="headline"
                            placeholder="Enter your poster headline (Bangla or English)"
                            rows={3}
                            {...register('headline')}
                          />
                          {errors.headline && <p className="text-sm text-destructive">{errors.headline.message}</p>}
                          <p className="text-xs text-muted-foreground">
                            The headline is the main text displayed prominently on your poster.
                          </p>
                        </div>
                      </div>
                    )}

                    {step === 4 && (
                      <div className="space-y-6">
                        <div className="space-y-2">
                          <Label>Photos (up to {MAX_PHOTOS})</Label>
                          <div className="grid grid-cols-3 gap-3">
                            {photoPreviews.map((preview, i) => (
                              <div key={i} className="group relative aspect-square overflow-hidden rounded-lg border-2 border-border">
                                <img src={preview} alt={`Preview ${i + 1}`} className="h-full w-full object-cover" />
                                <button
                                  type="button"
                                  onClick={() => removePhoto(i)}
                                  className="absolute right-1 top-1 rounded-full bg-destructive p-1 text-destructive-foreground opacity-0 transition-opacity group-hover:opacity-100"
                                >
                                  <X className="h-3 w-3" />
                                </button>
                              </div>
                            ))}
                            {photos.length < MAX_PHOTOS && (
                              <label className="flex aspect-square cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-dashed border-border transition-colors hover:border-primary hover:bg-primary/5">
                                <Upload className="mb-2 h-6 w-6 text-muted-foreground" />
                                <span className="text-xs text-muted-foreground">Upload</span>
                                <input
                                  type="file"
                                  accept={ACCEPTED_IMAGE_TYPES.join(',')}
                                  multiple
                                  className="hidden"
                                  onChange={handlePhotoSelect}
                                />
                              </label>
                            )}
                          </div>
                          <p className="text-xs text-muted-foreground">
                            Accepted: JPEG, PNG, WebP. Max size: 5MB per image.
                          </p>
                        </div>

                        <div className="space-y-2">
                          <Label>Template (Optional)</Label>
                          <div className="grid grid-cols-3 gap-3">
                            {templates.map((template) => (
                              <button
                                key={template.id}
                                type="button"
                                onClick={() => setSelectedTemplate(selectedTemplate === template.id ? '' : template.id)}
                                className={`overflow-hidden rounded-lg border-2 text-left transition-colors ${
                                  selectedTemplate === template.id
                                    ? 'border-primary ring-2 ring-primary/20'
                                    : 'border-border hover:border-primary/50'
                                }`}
                              >
                                <div className="aspect-[3/4] overflow-hidden bg-muted">
                                  {template.thumbnail_url && (
                                    <img src={template.thumbnail_url} alt={template.title} className="h-full w-full object-cover" />
                                  )}
                                </div>
                                <div className="p-2">
                                  <p className="truncate text-xs font-medium">{template.title}</p>
                                  <Badge variant="outline" className="mt-1 text-[10px]">
                                    {OCCASION_LABELS[template.occasion_type] || template.occasion_type}
                                  </Badge>
                                </div>
                              </button>
                            ))}
                          </div>
                          {templates.length === 0 && (
                            <p className="text-sm text-muted-foreground">No templates available.</p>
                          )}
                        </div>
                      </div>
                    )}
                  </motion.div>
                </AnimatePresence>
              </CardContent>
            </Card>

            {/* Navigation Buttons */}
            <div className="mt-6 flex items-center justify-between">
              <Button
                type="button"
                variant="outline"
                onClick={prevStep}
                disabled={step === 1}
              >
                <ArrowLeft className="mr-2 h-4 w-4" />
                Previous
              </Button>

              {step < 4 ? (
                <Button type="button" onClick={nextStep}>
                  Next
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              ) : (
                <Button type="submit" disabled={submitting || uploading}>
                  {submitting || uploading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      {uploading ? 'Uploading images...' : 'Generating poster...'}
                    </>
                  ) : (
                    <>
                      <Wand2 className="mr-2 h-4 w-4" />
                      Generate Poster
                    </>
                  )}
                </Button>
              )}
            </div>
          </form>
        </motion.div>
      </div>
      <Footer />
    </div>
  );
}

export default function CreatePosterPage() {
  return (
    <AuthGuard>
      <Suspense fallback={<div className="flex min-h-screen items-center justify-center"><Loader2 className="h-8 w-8 animate-spin text-primary" /></div>}>
        <CreatePosterContent />
      </Suspense>
    </AuthGuard>
  );
}
