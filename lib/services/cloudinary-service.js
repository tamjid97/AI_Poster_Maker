"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.isCloudinaryConfigured = exports.deleteImageFromCloudinary = exports.uploadImageToCloudinary = void 0;
const cloudinary_1 = require("cloudinary");
const cloudName = process.env.CLOUDINARY_CLOUD_NAME || '';
const apiKey = process.env.CLOUDINARY_API_KEY || '';
const apiSecret = process.env.CLOUDINARY_API_SECRET || '';
let configured = false;
if (cloudName && apiKey && apiSecret) {
    cloudinary_1.v2.config({
        cloud_name: cloudName,
        api_key: apiKey,
        api_secret: apiSecret,
        secure: true,
    });
    configured = true;
}
async function uploadImageToCloudinary(fileBuffer, fileName, folder = 'posters') {
    if (!configured) {
        throw new Error('Cloudinary is not configured. Set CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY, and CLOUDINARY_API_SECRET.');
    }
    return new Promise((resolve, reject) => {
        cloudinary_1.v2.uploader
            .upload_stream({
            folder,
            resource_type: 'image',
            public_id: fileName,
            overwrite: true,
            transformation: [{ quality: 'auto:good' }],
        }, (error, result) => {
            if (error) {
                reject(new Error(`Cloudinary upload failed: ${error.message}`));
            }
            else if (result) {
                resolve({
                    secure_url: result.secure_url,
                    public_id: result.public_id,
                });
            }
            else {
                reject(new Error('Cloudinary upload returned no result'));
            }
        })
            .end(fileBuffer);
    });
}
exports.uploadImageToCloudinary = uploadImageToCloudinary;
async function deleteImageFromCloudinary(publicId) {
    if (!configured)
        return;
    try {
        await cloudinary_1.v2.uploader.destroy(publicId);
    }
    catch (error) {
        console.error('Cloudinary delete error:', error);
    }
}
exports.deleteImageFromCloudinary = deleteImageFromCloudinary;
function isCloudinaryConfigured() {
    return configured;
}
exports.isCloudinaryConfigured = isCloudinaryConfigured;
