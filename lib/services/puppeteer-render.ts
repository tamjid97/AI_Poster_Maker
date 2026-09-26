import fs from 'fs';
import path from 'path';

export async function renderPosterToImage(
  htmlContent: string,
  posterId: string
): Promise<{ buffer: Buffer; localUrl?: string }> {
  let browser: any = null;
  try {
    const puppeteer = await import('puppeteer');
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
    const fullHtml = htmlContent;

    await page.setContent(fullHtml, { waitUntil: ['domcontentloaded', 'networkidle0'] });

    // Ensure fonts are loaded
    await page.evaluate(async () => {
      if (document.fonts) {
        await document.fonts.ready;
      }
    });

    // Wait for all images to be fully loaded
    await page.evaluate(async () => {
      const images = Array.from(document.querySelectorAll('img'));
      const imagePromises = images.map(img => {
        if (img.complete) return Promise.resolve();
        return new Promise((resolve, reject) => {
          img.addEventListener('load', resolve);
          img.addEventListener('error', resolve); // Continue even if image fails
          setTimeout(resolve, 5000); // Timeout after 5 seconds
        });
      });
      await Promise.all(imagePromises);
    });

    // Wait for SVG images to load
    await page.evaluate(async () => {
      const svgImages = Array.from(document.querySelectorAll('image'));
      const svgImagePromises = svgImages.map(img => {
        return new Promise((resolve) => {
          // SVG image elements don't have a 'complete' property like HTML img elements
          // So we just wait for load/error events with a timeout
          img.addEventListener('load', resolve);
          img.addEventListener('error', resolve);
          setTimeout(resolve, 3000); // Timeout after 3 seconds for SVG images
        });
      });
      await Promise.all(svgImagePromises);
    });

    // Extended stabilization delay for production environment
    await new Promise((resolve) => setTimeout(resolve, 1000));

    // Capture screenshot at 1200x1600
    const screenshotBuffer = await page.screenshot({
      type: 'png',
      clip: { x: 0, y: 0, width: 1200, height: 1600 },
      omitBackground: false,
    });

    const buffer = Buffer.from(screenshotBuffer);

    // Save local copy in public/generated-posters
    const publicDir = path.join(process.cwd(), 'public', 'generated-posters');
    if (!fs.existsSync(publicDir)) {
      fs.mkdirSync(publicDir, { recursive: true });
    }

    const fileName = `poster-${posterId}.png`;
    const filePath = path.join(publicDir, fileName);
    fs.writeFileSync(filePath, buffer);

    return {
      buffer,
      localUrl: `/generated-posters/${fileName}`,
    };
  } catch (error) {
    console.error('Puppeteer poster render error:', error);
    throw error;
  } finally {
    if (browser) {
      await browser.close().catch(() => {});
    }
  }
}
