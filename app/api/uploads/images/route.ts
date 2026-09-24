import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase-client';
import { uploadImageToCloudinary, isCloudinaryConfigured } from '@/lib/services/cloudinary-service';
import { ACCEPTED_IMAGE_TYPES, MAX_FILE_SIZE, MAX_PHOTOS } from '@/types';
import type { ApiResponse } from '@/types';

export async function POST(request: NextRequest) {
  try {
    // For testing, bypass authentication
    const authHeader = request.headers.get('authorization');
    if (!authHeader) {
      console.warn('[UPLOAD] No auth header, allowing anonymous upload for testing');
    } else {
      const token = authHeader.replace('Bearer ', '');
      try {
        const { data: authData, error: authError } = await supabase.auth.getUser(token);
        if (authError || !authData.user) {
          console.warn('[UPLOAD] Invalid token, allowing anonymous upload for testing');
        }
      } catch (err) {
        console.warn('[UPLOAD] Auth check failed, allowing anonymous upload for testing:', err);
      }
    }

    const formData = await request.formData();
    const files = formData.getAll('images');

    if (files.length === 0) {
      return NextResponse.json<ApiResponse>(
        { success: false, message: 'No images provided', errors: ['At least one image is required'] },
        { status: 400 }
      );
    }

    if (files.length > MAX_PHOTOS) {
      return NextResponse.json<ApiResponse>(
        { success: false, message: `Maximum ${MAX_PHOTOS} images allowed`, errors: [`You can upload at most ${MAX_PHOTOS} images`] },
        { status: 400 }
      );
    }

    const uploadedUrls: string[] = [];

    for (const file of files) {
      if (!(file instanceof File)) {
        continue;
      }

      if (!ACCEPTED_IMAGE_TYPES.includes(file.type)) {
        return NextResponse.json<ApiResponse>(
          { success: false, message: 'Invalid file type', errors: [`File "${file.name}" is not a valid image type. Accepted: JPEG, PNG, WebP`] },
          { status: 400 }
        );
      }

      if (file.size > MAX_FILE_SIZE) {
        return NextResponse.json<ApiResponse>(
          { success: false, message: 'File too large', errors: [`File "${file.name}" exceeds the 5MB limit`] },
          { status: 400 }
        );
      }

      if (isCloudinaryConfigured()) {
        const buffer = Buffer.from(await file.arrayBuffer());
        const fileName = `poster-${Date.now()}-${Math.random().toString(36).substring(7)}`;
        const result = await uploadImageToCloudinary(buffer, fileName, 'posters/uploads');
        uploadedUrls.push(result.secure_url);
      } else {
        // Fallback: convert to base64 data URL for local use
        const buffer = Buffer.from(await file.arrayBuffer());
        const base64 = buffer.toString('base64');
        const dataUrl = `data:${file.type};base64,${base64}`;
        uploadedUrls.push(dataUrl);
      }
    }

    return NextResponse.json<ApiResponse<{ urls: string[] }>>(
      {
        success: true,
        message: 'Images uploaded successfully',
        data: { urls: uploadedUrls },
      },
      { status: 200 }
    );
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Upload failed';
    console.error('Upload error:', message);
    return NextResponse.json<ApiResponse>(
      { success: false, message: 'Image upload failed', errors: [message] },
      { status: 500 }
    );
  }
}
