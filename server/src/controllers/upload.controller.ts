import { Response } from 'express';
import { AuthRequest } from '../middleware/auth';
import { uploadImageToCloudinary, isCloudinaryConfigured } from '../../../lib/services/cloudinary-service';
import { ACCEPTED_IMAGE_TYPES, MAX_FILE_SIZE, MAX_PHOTOS } from '../../../types';

export async function uploadImages(req: AuthRequest, res: Response) {
  try {
    if (!req.user) {
      return res.status(401).json({ success: false, message: 'Authentication required' });
    }

    const files = req.files as Express.Multer.File[];

    if (!files || files.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'No images provided',
        errors: ['At least one image is required'],
      });
    }

    if (files.length > MAX_PHOTOS) {
      return res.status(400).json({
        success: false,
        message: `Maximum ${MAX_PHOTOS} images allowed`,
        errors: [`You can upload at most ${MAX_PHOTOS} images`],
      });
    }

    const uploadedUrls: string[] = [];

    for (const file of files) {
      if (!ACCEPTED_IMAGE_TYPES.includes(file.mimetype)) {
        return res.status(400).json({
          success: false,
          message: 'Invalid file type',
          errors: [`File "${file.originalname}" is not a valid image (JPEG, PNG, WebP only)`],
        });
      }

      if (file.size > MAX_FILE_SIZE) {
        return res.status(400).json({
          success: false,
          message: 'File too large',
          errors: [`File "${file.originalname}" exceeds 5MB limit`],
        });
      }

      if (isCloudinaryConfigured()) {
        const fileName = `poster-upload-${Date.now()}-${Math.random().toString(36).substring(7)}`;
        const result = await uploadImageToCloudinary(file.buffer, fileName, 'posters/uploads');
        uploadedUrls.push(result.secure_url);
      } else {
        // Fallback to Base64 data URL
        const base64 = file.buffer.toString('base64');
        const dataUrl = `data:${file.mimetype};base64,${base64}`;
        uploadedUrls.push(dataUrl);
      }
    }

    return res.status(200).json({
      success: true,
      message: 'Images uploaded successfully',
      data: { urls: uploadedUrls },
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Image upload failed';
    return res.status(500).json({ success: false, message: 'Image upload failed', errors: [message] });
  }
}
