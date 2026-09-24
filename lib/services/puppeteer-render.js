"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.renderPosterToImage = void 0;
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
async function renderPosterToImage(htmlContent, posterId) {
    let browser = null;
    try {
        const puppeteer = await Promise.resolve().then(() => __importStar(require('puppeteer')));
        browser = await puppeteer.default.launch({
            headless: true,
            args: [
                '--no-sandbox',
                '--disable-setuid-sandbox',
                '--disable-dev-shm-usage',
                '--disable-gpu',
                '--font-render-hinting=none',
                '--hide-scrollbars',
            ],
        });
        const page = await browser.newPage();
        await page.setViewport({
            width: 1200,
            height: 1600,
            deviceScaleFactor: 1,
        });
        // Set full HTML content
        const fullHtml = `
      <!DOCTYPE html>
      <html lang="bn">
        <head>
          <meta charset="UTF-8">
          <link rel="preconnect" href="https://fonts.googleapis.com">
          <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
          <link href="https://fonts.googleapis.com/css2?family=Noto+Sans+Bengali:wght@400;500;600;700;800&family=Inter:wght@400;500;600;700;800&display=swap" rel="stylesheet">
          <style>
            * { margin: 0; padding: 0; box-sizing: border-box; }
            body { background: #000; width: 1200px; height: 1600px; overflow: hidden; font-family: 'Noto Sans Bengali', sans-serif; }
          </style>
        </head>
        <body>
          ${htmlContent}
        </body>
      </html>
    `;
        await page.setContent(fullHtml, { waitUntil: ['domcontentloaded', 'networkidle0'] });
        // Ensure fonts are loaded
        await page.evaluate(async () => {
            if (document.fonts) {
                await document.fonts.ready;
            }
        });
        // Brief stabilization delay
        await new Promise((resolve) => setTimeout(resolve, 600));
        // Capture screenshot at 1200x1600
        const screenshotBuffer = await page.screenshot({
            type: 'png',
            clip: { x: 0, y: 0, width: 1200, height: 1600 },
            omitBackground: false,
        });
        const buffer = Buffer.from(screenshotBuffer);
        // Save local copy in public/generated-posters
        const publicDir = path_1.default.join(process.cwd(), 'public', 'generated-posters');
        if (!fs_1.default.existsSync(publicDir)) {
            fs_1.default.mkdirSync(publicDir, { recursive: true });
        }
        const fileName = `poster-${posterId}.png`;
        const filePath = path_1.default.join(publicDir, fileName);
        fs_1.default.writeFileSync(filePath, buffer);
        return {
            buffer,
            localUrl: `/generated-posters/${fileName}`,
        };
    }
    catch (error) {
        console.error('Puppeteer poster render error:', error);
        throw error;
    }
    finally {
        if (browser) {
            await browser.close().catch(() => { });
        }
    }
}
exports.renderPosterToImage = renderPosterToImage;
