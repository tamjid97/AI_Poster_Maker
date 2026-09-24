import { supabase } from '@/lib/supabase-client';
import type { ApiResponse, Template, Poster, LayoutSuggestion } from '@/types';

async function apiCall<T>(
  path: string,
  options: RequestInit = {}
): Promise<ApiResponse<T>> {
  const { data: sessionData } = await supabase.auth.getSession();
  const token = sessionData.session?.access_token;

  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...((options.headers as Record<string, string>) || {}),
  };

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const response = await fetch(path, { ...options, headers });

  const json = await response.json();
  return json as ApiResponse<T>;
}

export async function fetchTemplates(params?: { search?: string; occasion?: string }) {
  const searchParams = new URLSearchParams();
  if (params?.search) searchParams.set('search', params.search);
  if (params?.occasion) searchParams.set('occasion', params.occasion);
  const query = searchParams.toString();
  return apiCall<{ templates: Template[] }>(`/api/templates${query ? `?${query}` : ''}`);
}

export async function fetchTemplate(id: string) {
  return apiCall<{ template: Template }>(`/api/templates/${id}`);
}

export async function createPoster(data: {
  templateId?: string;
  name: string;
  designation?: string;
  party?: string;
  organization?: string;
  unionOrThana?: string;
  district?: string;
  occasion: string;
  headline: string;
  photoUrls: string[];
}) {
  return apiCall<{ poster: Poster; html: string; layout: LayoutSuggestion }>('/api/posters', {
    method: 'POST',
    body: JSON.stringify(data),
  });
}

export async function fetchPosters(page: number = 1, limit: number = 10) {
  return apiCall<{ posters: Poster[]; total: number; page: number; totalPages: number }>(
    `/api/posters?page=${page}&limit=${limit}`
  );
}

export async function fetchPoster(id: string) {
  return apiCall<{ poster: Poster; html?: string; layout?: LayoutSuggestion }>(`/api/posters/${id}`);
}

export async function deletePoster(id: string) {
  return apiCall<null>(`/api/posters/${id}`, { method: 'DELETE' });
}

export async function regeneratePoster(id: string) {
  return apiCall<{ poster: Poster; html: string; layout: LayoutSuggestion }>(
    `/api/posters/${id}/regenerate`,
    { method: 'POST' }
  );
}

export async function uploadImages(files: File[]) {
  const { data: sessionData } = await supabase.auth.getSession();
  const token = sessionData.session?.access_token;

  const formData = new FormData();
  files.forEach((file) => formData.append('images', file));

  const response = await fetch('/api/uploads/images', {
    method: 'POST',
    headers: token ? { Authorization: `Bearer ${token}` } : {},
    body: formData,
  });

  return response.json() as Promise<ApiResponse<{ urls: string[] }>>;
}
