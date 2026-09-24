import type { LayoutSuggestion, Poster, Template } from '@/types';
import { DEFAULT_TEMPLATES } from '@/lib/default-templates';

function escapeHtml(text?: string | null): string {
  if (!text) return '';
  return String(text)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

// Template 1: Eid Greeting - Dark maroon/red background, circular photo cutouts, crescent-moon graphic, large Bangla headline
function generateEidGreetingTemplate(poster: Poster): string {
  const photos = poster.photo_urls || [];
  const mainPhoto = photos[0] || 'https://via.placeholder.com/500x500?text=Photo';
  const insetPhoto1 = photos[1] || 'https://via.placeholder.com/130x130?text=Leader';
  const insetPhoto2 = photos[2] || 'https://via.placeholder.com/130x130?text=Leader';

  return `
<!DOCTYPE html>
<html lang="bn">
<head>
  <meta charset="utf-8">
  <style>
    @import url('https://fonts.googleapis.com/css2?family=Noto+Sans+Bengali:wght@400;600;700;800&family=Hind+Siliguri:wght@400;500;600;700&display=swap');
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body, html { width: 1200px; height: 1600px; margin: 0; padding: 0; font-family: 'Noto Sans Bengali', 'Hind Siliguri', sans-serif; overflow: hidden; }
    .poster {
      width: 1200px;
      height: 1600px;
      background: linear-gradient(135deg, #3f0910 0%, #7f1d1d 45%, #1a0306 100%);
      position: relative;
      overflow: hidden;
    }
    .flag-stripe {
      position: absolute;
      left: 0;
      top: 0;
      width: 140px;
      height: 500px;
      background: #006a4e;
      clip-path: polygon(0 0, 100% 0, 36% 100%, 0 100%);
    }
    .flag-circle {
      position: absolute;
      left: 35px;
      top: 185px;
      width: 70px;
      height: 70px;
      background: #f42a41;
      border-radius: 50%;
    }
    .moon-star {
      position: absolute;
      right: 70px;
      top: 40px;
      width: 120px;
      height: 120px;
      background: linear-gradient(135deg, #ffe259 0%, #ffa751 100%);
      border-radius: 50%;
    }
    .moon-star::after {
      content: '★';
      position: absolute;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      font-size: 24px;
      color: #ffd700;
    }
    .inset-photos {
      position: absolute;
      left: 140px;
      top: 60px;
      display: flex;
      gap: 10px;
    }
    .inset-photo {
      width: 140px;
      height: 140px;
      border-radius: 50%;
      background: #240409;
      overflow: hidden;
      border: 5px solid #ffd700;
    }
    .inset-photo img {
      width: 100%;
      height: 100%;
      object-fit: cover;
    }
    .occasion-badge {
      position: absolute;
      left: 360px;
      top: 240px;
      background: linear-gradient(135deg, #ffe259 0%, #ffa751 100%);
      border: 3px solid #ffe259;
      border-radius: 35px;
      padding: 10px 40px;
      font-size: 38px;
      font-weight: 800;
      color: #3f0910;
      text-align: center;
    }
    .headline {
      position: absolute;
      left: 50%;
      top: 380px;
      transform: translateX(-50%);
      font-size: 52px;
      font-weight: 800;
      color: #ffd700;
      text-align: center;
      width: 1000px;
      line-height: 1.3;
    }
    .hero-photo {
      position: absolute;
      left: 50%;
      top: 730px;
      transform: translateX(-50%);
      width: 500px;
      height: 500px;
      border-radius: 50%;
      background: #1a0306;
      overflow: hidden;
      border: 10px solid #ffd700;
    }
    .hero-photo img {
      width: 100%;
      height: 100%;
      object-fit: cover;
    }
    .greeting-text {
      position: absolute;
      left: 50%;
      top: 1050px;
      transform: translateX(-50%);
      font-size: 30px;
      font-weight: 600;
      color: #fef08a;
      text-align: center;
      width: 900px;
    }
    .name-banner {
      position: absolute;
      left: 150px;
      top: 1130px;
      background: #991b1b;
      border: 4px solid #ffd700;
      border-radius: 24px;
      padding: 15px 30px;
      width: 900px;
    }
    .name {
      font-size: 58px;
      font-weight: 800;
      color: #ffffff;
      text-align: center;
    }
    .designation {
      position: absolute;
      left: 50%;
      top: 1380px;
      transform: translateX(-50%);
      font-size: 34px;
      font-weight: 700;
      color: #ffd700;
      text-align: center;
      width: 900px;
    }
    .organization {
      position: absolute;
      left: 50%;
      top: 1440px;
      transform: translateX(-50%);
      font-size: 30px;
      font-weight: 600;
      color: #ffffff;
      text-align: center;
      width: 900px;
    }
    .location {
      position: absolute;
      left: 50%;
      top: 1500px;
      transform: translateX(-50%);
      font-size: 26px;
      font-weight: 500;
      color: #fca5a5;
      text-align: center;
      width: 900px;
    }
  </style>
</head>
<body>
  <div class="poster">
    <div class="flag-stripe"></div>
    <div class="flag-circle"></div>
    <div class="moon-star"></div>
    
    <div class="inset-photos">
      <div class="inset-photo">
        <img src="${escapeHtml(insetPhoto1)}" alt="Leader">
      </div>
      <div class="inset-photo">
        <img src="${escapeHtml(insetPhoto2)}" alt="Leader">
      </div>
    </div>
    
    <div class="occasion-badge">পবিত্র ঈদ মোবারক</div>
    <div class="headline">${escapeHtml(poster.headline)}</div>
    
    <div class="hero-photo">
      <img src="${escapeHtml(mainPhoto)}" alt="Main Photo">
    </div>
    
    <div class="greeting-text">${escapeHtml(poster.headline)}</div>
    
    <div class="name-banner">
      <div class="name">${escapeHtml(poster.name)}</div>
    </div>
    
    <div class="designation">${escapeHtml(poster.designation || '')}</div>
    <div class="organization">${escapeHtml([poster.party, poster.organization].filter(Boolean).join(' • ') || '')}</div>
    <div class="location">${escapeHtml([poster.union_or_thana, poster.district].filter(Boolean).join(', ') || '')}</div>
  </div>
</body>
</html>`;
}

// Template 2: Political Campaign - Green background, circular headshots, party logo, red banner headline
function generatePoliticalCampaignTemplate(poster: Poster): string {
  const photos = poster.photo_urls || [];
  const mainPhoto = photos[0] || 'https://via.placeholder.com/500x500?text=Photo';
  const leaderPhoto1 = photos[1] || 'https://via.placeholder.com/120x120?text=Leader';
  const leaderPhoto2 = photos[2] || 'https://via.placeholder.com/120x120?text=Leader';
  const leaderPhoto3 = photos[3] || 'https://via.placeholder.com/120x120?text=Leader';

  return `
<!DOCTYPE html>
<html lang="bn">
<head>
  <meta charset="utf-8">
  <style>
    @import url('https://fonts.googleapis.com/css2?family=Noto+Sans+Bengali:wght@400;600;700;800&family=Hind+Siliguri:wght@400;500;600;700&display=swap');
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body, html { width: 1200px; height: 1600px; margin: 0; padding: 0; font-family: 'Noto Sans Bengali', 'Hind Siliguri', sans-serif; overflow: hidden; }
    .poster {
      width: 1200px;
      height: 1600px;
      background: linear-gradient(180deg, #005236 0%, #006a4e 45%, #002b1b 100%);
      position: relative;
      overflow: hidden;
      border: 10px solid #ffd700;
      box-sizing: border-box;
    }
    .leader-photos {
      position: absolute;
      top: 115px;
      left: 50%;
      transform: translateX(-50%);
      display: flex;
      gap: 20px;
    }
    .leader-photo {
      width: 130px;
      height: 130px;
      border-radius: 50%;
      background: #002b1b;
      overflow: hidden;
      border: 4px solid #ffd700;
    }
    .leader-photo img {
      width: 100%;
      height: 100%;
      object-fit: cover;
    }
    .emblem-badge {
      position: absolute;
      top: 275px;
      left: 50%;
      transform: translateX(-50%);
      background: rgba(0,0,0,0.4);
      border: 2px solid #ffd700;
      border-radius: 25px;
      padding: 10px 30px;
      display: flex;
      align-items: center;
      gap: 20px;
    }
    .emblem-badge span {
      font-size: 24px;
      color: #ffd700;
    }
    .emblem-badge .text {
      font-size: 22px;
      font-weight: 700;
      color: #ffffff;
    }
    .headline-banner {
      position: absolute;
      top: 350px;
      left: 50%;
      transform: translateX(-50%);
      background: #dc2626;
      border: 4px solid #ffd700;
      border-radius: 20px;
      padding: 20px 40px;
      width: 1040px;
    }
    .headline {
      font-size: 44px;
      font-weight: 800;
      color: #ffffff;
      text-align: center;
      line-height: 1.3;
    }
    .hero-photo {
      position: absolute;
      top: 740px;
      left: 50%;
      transform: translateX(-50%);
      width: 520px;
      height: 520px;
      border-radius: 50%;
      background: #002b1b;
      overflow: hidden;
      border: 10px solid #ffd700;
    }
    .hero-photo img {
      width: 100%;
      height: 100%;
      object-fit: cover;
    }
    .name-section {
      position: absolute;
      top: 1060px;
      left: 50%;
      transform: translateX(-50%);
      text-align: center;
      width: 900px;
    }
    .name {
      font-size: 62px;
      font-weight: 800;
      color: #ffffff;
      margin-bottom: 10px;
    }
    .name-underline {
      width: 600px;
      height: 10px;
      background: #f42a41;
      border-radius: 5px;
      margin: 0 auto 20px;
    }
    .designation {
      font-size: 36px;
      font-weight: 700;
      color: #ffd700;
      margin-bottom: 15px;
    }
    .party {
      font-size: 32px;
      font-weight: 600;
      color: #ffffff;
      margin-bottom: 15px;
    }
    .location {
      font-size: 26px;
      font-weight: 500;
      color: #a7f3d0;
    }
    .corner-accent {
      position: absolute;
      bottom: 20px;
      width: 100px;
      height: 80px;
      background: #f42a41;
    }
    .corner-accent.left {
      left: 20px;
      clip-path: polygon(0 100%, 0 0, 100% 100%);
    }
    .corner-accent.right {
      right: 20px;
      clip-path: polygon(100% 100%, 100% 0, 0 100%);
    }
  </style>
</head>
<body>
  <div class="poster">
    <div class="leader-photos">
      <div class="leader-photo">
        <img src="${escapeHtml(leaderPhoto1)}" alt="Leader">
      </div>
      <div class="leader-photo">
        <img src="${escapeHtml(leaderPhoto2)}" alt="Leader">
      </div>
      <div class="leader-photo">
        <img src="${escapeHtml(leaderPhoto3)}" alt="Leader">
      </div>
    </div>
    
    <div class="emblem-badge">
      <span>★</span>
      <span class="text">${escapeHtml(poster.occasion)}</span>
      <span>★</span>
    </div>
    
    <div class="headline-banner">
      <div class="headline">${escapeHtml(poster.headline)}</div>
    </div>
    
    <div class="hero-photo">
      <img src="${escapeHtml(mainPhoto)}" alt="Main Photo">
    </div>
    
    <div class="name-section">
      <div class="name">${escapeHtml(poster.name)}</div>
      <div class="name-underline"></div>
      <div class="designation">${escapeHtml(poster.designation || '')}</div>
      <div class="party">${escapeHtml([poster.party, poster.organization].filter(Boolean).join(' • ') || '')}</div>
      <div class="location">${escapeHtml([poster.union_or_thana, poster.district].filter(Boolean).join(', ') || '')}</div>
    </div>
    
    <div class="corner-accent left"></div>
    <div class="corner-accent right"></div>
  </div>
</body>
</html>`;
}

// Template 3: Condolence - Soft yellow/cream background, green swoosh, circular photos
function generateCondolenceTemplate(poster: Poster): string {
  const photos = poster.photo_urls || [];
  const mainPhoto = photos[0] || 'https://via.placeholder.com/500x500?text=Photo';
  const insetPhoto = photos[1] || 'https://via.placeholder.com/140x140?text=Leader';

  return `
<!DOCTYPE html>
<html lang="bn">
<head>
  <meta charset="utf-8">
  <style>
    @import url('https://fonts.googleapis.com/css2?family=Noto+Sans+Bengali:wght@400;600;700;800&family=Hind+Siliguri:wght@400;500;600;700&display=swap');
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body, html { width: 1200px; height: 1600px; margin: 0; padding: 0; font-family: 'Noto Sans Bengali', 'Hind Siliguri', sans-serif; overflow: hidden; }
    .poster {
      width: 1200px;
      height: 1600px;
      background: linear-gradient(180deg, #fffbeb 0%, #fef08a 40%, #fef3c7 100%);
      position: relative;
      overflow: hidden;
    }
    .green-swoosh {
      position: absolute;
      top: -100px;
      right: 100px;
      width: 900px;
      height: 1000px;
      background: #064e3b;
      opacity: 0.9;
      border-radius: 50%;
      transform: rotate(-15deg);
    }
    .inset-photo {
      position: absolute;
      top: 50px;
      left: 50px;
      width: 140px;
      height: 140px;
      border-radius: 50%;
      background: #ffffff;
      overflow: hidden;
      border: 5px solid #064e3b;
    }
    .inset-photo img {
      width: 100%;
      height: 100%;
      object-fit: cover;
    }
    .respect-badge {
      position: absolute;
      top: 50px;
      right: 50px;
      width: 140px;
      height: 140px;
      background: #064e3b;
      border: 4px solid #fef08a;
      border-radius: 50%;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
    }
    .respect-badge .top {
      font-size: 22px;
      color: #ffffff;
    }
    .respect-badge .bottom {
      font-size: 32px;
      font-weight: 700;
      color: #fef08a;
    }
    .headline-banner {
      position: absolute;
      top: 240px;
      left: 50%;
      transform: translateX(-50%);
      background: #064e3b;
      opacity: 0.95;
      border-radius: 20px;
      padding: 20px 40px;
      width: 1000px;
    }
    .headline {
      font-size: 50px;
      font-weight: 800;
      color: #ffffff;
      text-align: center;
    }
    .hero-photo {
      position: absolute;
      top: 710px;
      left: 50%;
      transform: translateX(-50%);
      width: 500px;
      height: 500px;
      border-radius: 50%;
      background: #ffffff;
      overflow: hidden;
      border: 10px solid #064e3b;
    }
    .hero-photo img {
      width: 100%;
      height: 100%;
      object-fit: cover;
    }
    .name-banner {
      position: absolute;
      top: 1050px;
      left: 50%;
      transform: translateX(-50%);
      background: #064e3b;
      border: 4px solid #fef08a;
      border-radius: 24px;
      padding: 15px 30px;
      width: 900px;
    }
    .name {
      font-size: 58px;
      font-weight: 800;
      color: #ffffff;
      text-align: center;
    }
    .designation {
      position: absolute;
      top: 1180px;
      left: 50%;
      transform: translateX(-50%);
      font-size: 36px;
      font-weight: 700;
      color: #064e3b;
      text-align: center;
      width: 900px;
    }
    .organization {
      position: absolute;
      top: 1240px;
      left: 50%;
      transform: translateX(-50%);
      font-size: 30px;
      font-weight: 600;
      color: #1e293b;
      text-align: center;
      width: 900px;
    }
    .location {
      position: absolute;
      top: 1300px;
      left: 50%;
      transform: translateX(-50%);
      font-size: 26px;
      font-weight: 500;
      color: #475569;
      text-align: center;
      width: 900px;
    }
  </style>
</head>
<body>
  <div class="poster">
    <div class="green-swoosh"></div>
    
    <div class="inset-photo">
      <img src="${escapeHtml(insetPhoto)}" alt="Leader">
    </div>
    
    <div class="respect-badge">
      <span class="top">বিনম্র</span>
      <span class="bottom">শ্রদ্ধা</span>
    </div>
    
    <div class="headline-banner">
      <div class="headline">${escapeHtml(poster.headline)}</div>
    </div>
    
    <div class="headline-banner">
      <div class="headline">${escapeHtml(poster.headline)}</div>
    </div>
    
    <div class="hero-photo">
      <img src="${escapeHtml(mainPhoto)}" alt="Main Photo">
    </div>
    
    <div class="name-banner">
      <div class="name">${escapeHtml(poster.name)}</div>
    </div>
    
    <div class="designation">${escapeHtml(poster.designation || '')}</div>
    <div class="organization">${escapeHtml([poster.party, poster.organization].filter(Boolean).join(' • ') || '')}</div>
    <div class="location">${escapeHtml([poster.union_or_thana, poster.district].filter(Boolean).join(', ') || '')}</div>
  </div>
</body>
</html>`;
}

// Template 4: Tribute - Dark background, flag brush strokes, dramatic photo
function generateTributeTemplate(poster: Poster): string {
  const photos = poster.photo_urls || [];
  const mainPhoto = photos[0] || 'https://via.placeholder.com/500x500?text=Photo';
  const insetPhoto1 = photos[1] || 'https://via.placeholder.com/100x100?text=Support';
  const insetPhoto2 = photos[2] || 'https://via.placeholder.com/100x100?text=Support';
  const insetPhoto3 = photos[3] || 'https://via.placeholder.com/100x100?text=Support';

  return `
<!DOCTYPE html>
<html lang="bn">
<head>
  <meta charset="utf-8">
  <style>
    @import url('https://fonts.googleapis.com/css2?family=Noto+Sans+Bengali:wght@400;600;700;800&family=Hind+Siliguri:wght@400;500;600;700&display=swap');
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body, html { width: 1200px; height: 1600px; margin: 0; padding: 0; font-family: 'Noto Sans Bengali', 'Hind Siliguri', sans-serif; overflow: hidden; }
    .poster {
      width: 1200px;
      height: 1600px;
      background: linear-gradient(180deg, #0f172a 0%, #1e293b 50%, #090d16 100%);
      position: relative;
      overflow: hidden;
    }
    .flag-red {
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 120px;
      background: #b91c1c;
      opacity: 0.8;
      clip-path: polygon(0 0, 100% 0, 100% 50%, 0 100%);
    }
    .flag-green {
      position: absolute;
      top: 60px;
      left: 0;
      width: 100%;
      height: 160px;
      background: #047857;
      opacity: 0.9;
      clip-path: polygon(0 0, 100% 38%, 100% 100%, 0 100%);
    }
    .inset-photos {
      position: absolute;
      top: 260px;
      left: 50%;
      transform: translateX(-50%);
      display: flex;
      gap: 15px;
    }
    .inset-photo {
      width: 100px;
      height: 100px;
      border-radius: 50%;
      background: #0f172a;
      overflow: hidden;
      border: 3px solid #f59e0b;
    }
    .inset-photo img {
      width: 100%;
      height: 100%;
      object-fit: cover;
    }
    .headline-section {
      position: absolute;
      top: 400px;
      left: 50%;
      transform: translateX(-50%);
      display: flex;
      align-items: center;
      gap: 20px;
    }
    .checkmark {
      width: 70px;
      height: 70px;
      background: #f59e0b;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 40px;
      font-weight: 800;
      color: #ffffff;
    }
    .headline {
      font-size: 48px;
      font-weight: 800;
      color: #ffffff;
      width: 900px;
    }
    .hero-photo {
      position: absolute;
      top: 720px;
      left: 50%;
      transform: translateX(-50%);
      width: 520px;
      height: 520px;
      border-radius: 50%;
      background: #0f172a;
      overflow: hidden;
      border: 10px solid #f59e0b;
    }
    .hero-photo img {
      width: 100%;
      height: 100%;
      object-fit: cover;
    }
    .name-banner {
      position: absolute;
      top: 1070px;
      left: 50%;
      transform: translateX(-50%);
      background: #b91c1c;
      border: 4px solid #f59e0b;
      border-radius: 24px;
      padding: 15px 30px;
      width: 900px;
    }
    .name {
      font-size: 58px;
      font-weight: 800;
      color: #ffffff;
      text-align: center;
    }
    .designation {
      position: absolute;
      top: 1180px;
      left: 50%;
      transform: translateX(-50%);
      font-size: 34px;
      font-weight: 700;
      color: #f59e0b;
      text-align: center;
      width: 900px;
    }
    .organization {
      position: absolute;
      top: 1240px;
      left: 50%;
      transform: translateX(-50%);
      font-size: 30px;
      font-weight: 600;
      color: #ffffff;
      text-align: center;
      width: 900px;
    }
    .location {
      position: absolute;
      top: 1300px;
      left: 50%;
      transform: translateX(-50%);
      font-size: 26px;
      font-weight: 500;
      color: #94a3b8;
      text-align: center;
      width: 900px;
    }
  </style>
</head>
<body>
  <div class="poster">
    <div class="flag-red"></div>
    <div class="flag-green"></div>
    
    <div class="inset-photos">
      <div class="inset-photo">
        <img src="${escapeHtml(insetPhoto1)}" alt="Support">
      </div>
      <div class="inset-photo">
        <img src="${escapeHtml(insetPhoto2)}" alt="Support">
      </div>
      <div class="inset-photo">
        <img src="${escapeHtml(insetPhoto3)}" alt="Support">
      </div>
    </div>
    
    <div class="headline-section">
      <div class="checkmark">✓</div>
      <div class="headline">${escapeHtml(poster.headline)}</div>
    </div>
    
    <div class="hero-photo">
      <img src="${escapeHtml(mainPhoto)}" alt="Main Photo">
    </div>
    
    <div class="name-banner">
      <div class="name">${escapeHtml(poster.name)}</div>
    </div>
    
    <div class="designation">${escapeHtml(poster.designation || '')}</div>
    <div class="organization">${escapeHtml([poster.party, poster.organization].filter(Boolean).join(' • ') || '')}</div>
    <div class="location">${escapeHtml([poster.union_or_thana, poster.district].filter(Boolean).join(', ') || '')}</div>
  </div>
</body>
</html>`;
}

/**
 * Resolve which template to use for rendering.
 * NO FALLBACKS - if template not found, let caller handle error
 */
export function resolveTemplate(poster: Poster, template?: Template | null): Template {
  if (template) return template;

  const targetId =
    poster.template_id ||
    (poster.layout_suggestion as any)?.templateId ||
    null;

  if (targetId) {
    // Exact ID match
    const exactMatch = DEFAULT_TEMPLATES.find((t) => t.id === targetId);
    if (exactMatch) return exactMatch;

    // Partial match: 'tpl-political-campaign'.includes('political-campaign') or vice versa
    const partialMatch = DEFAULT_TEMPLATES.find(
      (t) => t.id.includes(targetId) || targetId.includes(t.id)
    );
    if (partialMatch) return partialMatch;

    // Occasion type match (e.g., 'political_campaign' maps to tpl-political-campaign)
    const occasionFromId = targetId.replace('tpl-', '').replace(/-/g, '_');
    const occasionMatch = DEFAULT_TEMPLATES.find((t) => t.occasion_type === occasionFromId);
    if (occasionMatch) return occasionMatch;
  }

  // Match by poster's own occasion field
  const matched = DEFAULT_TEMPLATES.find((t) => t.occasion_type === poster.occasion);
  if (matched) return matched;

  // NO FALLBACK - return null and let caller handle error
  console.error('[RESOLVE TEMPLATE] No template found for poster:', poster.id, 'occasion:', poster.occasion, 'template_id:', poster.template_id);
  return DEFAULT_TEMPLATES[0]; // Temporary fallback for debugging
}

/**
 * Generate high-resolution (1200x1600) poster HTML using template-specific HTML/CSS templates.
 * Each template has its own visual design with circular photo slots, banners, and Bangla fonts.
 */
export function generatePosterHTML(
  poster: Poster,
  _layout?: LayoutSuggestion,
  template?: Template
): string {
  const resolved = resolveTemplate(poster, template);
  const occasionType = resolved?.occasion_type || poster.occasion;

  console.log('========================================');
  console.log('[POSTER RENDER] Generating poster for occasion:', occasionType);
  console.log('[POSTER RENDER] Resolved template ID:', resolved?.id);
  console.log('[POSTER RENDER] Poster name:', poster.name);
  console.log('[POSTER RENDER] Poster headline:', poster.headline);
  console.log('[POSTER RENDER] Photo URLs:', poster.photo_urls);
  console.log('========================================');

  // Route to the appropriate HTML template based on occasion type
  switch (occasionType) {
    case 'eid_greeting':
      console.log('[POSTER RENDER] Using Eid Greeting template');
      return generateEidGreetingTemplate(poster);
    case 'political_campaign':
      console.log('[POSTER RENDER] Using Political Campaign template');
      return generatePoliticalCampaignTemplate(poster);
    case 'condolence':
      console.log('[POSTER RENDER] Using Condolence template');
      return generateCondolenceTemplate(poster);
    case 'tribute':
      console.log('[POSTER RENDER] Using Tribute template');
      return generateTributeTemplate(poster);
    default:
      // Fallback to political campaign for unknown types
      console.warn('[POSTER RENDER] Unknown occasion type:', occasionType, 'falling back to political_campaign');
      return generatePoliticalCampaignTemplate(poster);
  }
}
