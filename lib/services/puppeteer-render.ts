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
