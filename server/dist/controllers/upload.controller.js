"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.uploadImages = void 0;
const cloudinary_service_1 = require("../../../../../lib/services/cloudinary-service");
const types_1 = require("../../../../../types");
async function uploadImages(req, res) {
    try {
        if (!req.user) {
            return res.status(401).json({ success: false, message: 'Authentication required' });
        }
        const files = req.files;
        if (!files || files.length === 0) {
            return res.status(400).json({
                success: false,
                message: 'No images provided',
                errors: ['At least one image is required'],
            });
        }
        if (files.length > types_1.MAX_PHOTOS) {
            return res.status(400).json({
                success: false,
                message: `Maximum ${types_1.MAX_PHOTOS} images allowed`,
                errors: [`You can upload at most ${types_1.MAX_PHOTOS} images`],
            });
        }
        const uploadedUrls = [];
        for (const file of files) {
            if (!types_1.ACCEPTED_IMAGE_TYPES.includes(file.mimetype)) {
                return res.status(400).json({
                    success: false,
                    message: 'Invalid file type',
                    errors: [`File "${file.originalname}" is not a valid image (JPEG, PNG, WebP only)`],
                });
            }
            if (file.size > types_1.MAX_FILE_SIZE) {
                return res.status(400).json({
                    success: false,
                    message: 'File too large',
                    errors: [`File "${file.originalname}" exceeds 5MB limit`],
                });
            }
            if ((0, cloudinary_service_1.isCloudinaryConfigured)()) {
                const fileName = `poster-upload-${Date.now()}-${Math.random().toString(36).substring(7)}`;
                const result = await (0, cloudinary_service_1.uploadImageToCloudinary)(file.buffer, fileName, 'posters/uploads');
                uploadedUrls.push(result.secure_url);
            }
            else {
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
    }
    catch (error) {
        const message = error instanceof Error ? error.message : 'Image upload failed';
        return res.status(500).json({ success: false, message: 'Image upload failed', errors: [message] });
    }
}
exports.uploadImages = uploadImages;
