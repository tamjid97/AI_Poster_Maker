import fs from 'fs';
import path from 'path';
import { generatePosterHTML } from '../lib/services/poster-render-service';
import { renderPosterToImage } from '../lib/services/puppeteer-render';
import type { Poster } from '../types';

async function main() {
  const artifactDir = 'C:\\Users\\ASUS\\.gemini\\antigravity-ide\\brain\\e868ac46-3b33-47de-a056-fde80058fa33';
  if (!fs.existsSync(artifactDir)) {
    fs.mkdirSync(artifactDir, { recursive: true });
  }

  const samplePhoto = 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?fit=crop&w=600&h=600';
  const leaderPhoto = 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?fit=crop&w=300&h=300';

  const testCases: { name: string; occasion: string; poster: Partial<Poster> }[] = [
    {
      name: 'eid-greeting',
      occasion: 'eid_greeting',
      poster: {
        id: 'test-eid-1',
        occasion: 'eid_greeting',
        headline: 'পবিত্র ঈদ মোবারক — অনাবিল আনন্দ ও শান্তির শুভেচ্ছা',
        name: 'ইঞ্জিনিয়ার কামরুল হাসান',
        designation: 'যুগ্ম সাধারণ সম্পাদক ও বিশিষ্ট সমাজসেবক',
        party: 'বাংলাদেশ যুব ও ছাত্র ঐক্য ফোরাম',
        organization: 'গুলশান শাখা',
        union_or_thana: 'গুলশান থানা',
        district: 'ঢাকা',
        photo_urls: [samplePhoto, leaderPhoto, leaderPhoto],
      },
    },
    {
      name: 'political-campaign',
      occasion: 'political_campaign',
      poster: {
        id: 'test-campaign-1',
        occasion: 'political_campaign',
        headline: 'আসন্ন জাতীয় সংসদ নির্বাচনে সকলের দোয়া ও ভোট প্রার্থী',
        name: 'মাহমুদুর রহমান চৌধুরী',
        designation: 'এমপি পদপ্রার্থী (ঢাকা-১০ আসন)',
        party: 'বাংলাদেশ প্রগতিশীল ফ্রন্ট',
        organization: 'কেন্দ্রীয় পরিষদ',
        union_or_thana: 'ধানমন্ডি',
        district: 'ঢাকা',
        photo_urls: [samplePhoto, leaderPhoto, leaderPhoto, leaderPhoto],
      },
    },
    {
      name: 'condolence',
      occasion: 'condolence',
      poster: {
        id: 'test-condolence-1',
        occasion: 'condolence',
        headline: 'বিনম্র শ্রদ্ধা ও গভীর শোক বার্তা',
        name: 'মরহুম আলহাজ্ব শামসুল হক',
        designation: 'সাবেক চেয়ারম্যান ও বিশিষ্ট সমাজসেবক',
        party: 'উত্তরা সমাজকল্যাণ পরিষদ',
        organization: 'উপদেষ্টা কমিটি',
        union_or_thana: 'উত্তরা',
        district: 'ঢাকা',
        photo_urls: [samplePhoto, leaderPhoto, leaderPhoto],
      },
    },
    {
      name: 'tribute',
      occasion: 'tribute',
      poster: {
        id: 'test-tribute-1',
        occasion: 'tribute',
        headline: 'বীর শহীদদের প্রতি বিনম্র শ্রদ্ধাঞ্জলি',
        name: 'বীর মুক্তিযোদ্ধা রফিকুল ইসলাম',
        designation: 'সভাপতি, বাংলাদেশ মুক্তিযোদ্ধা সন্তান কমান্ড',
        party: 'মুক্তিযোদ্ধা সংসদ',
        organization: 'ঢাকা মহানগর',
        union_or_thana: 'মিরপুর',
        district: 'ঢাকা',
        photo_urls: [samplePhoto],
      },
    },
  ];

  console.log('Generating test poster renderings...');

  for (const tc of testCases) {
    const html = await generatePosterHTML(tc.poster as Poster);
    const { buffer } = await renderPosterToImage(html, tc.name);
    const outPath = path.join(artifactDir, `test-poster-${tc.name}.png`);
    fs.writeFileSync(outPath, buffer);
    console.log(`Saved: ${outPath}`);
  }

  console.log('All 4 posters successfully rendered to PNG!');
}

main().catch((err) => {
  console.error('Test render failed:', err);
  process.exit(1);
});
