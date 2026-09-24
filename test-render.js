// Test script to generate poster HTML without full app
const { generatePosterHTML } = require('./lib/services/poster-render-service.ts');

const testPoster = {
  id: 'test-123',
  template_id: 'tpl-political-campaign',
  name: 'TEMPLATE_TEST_98765',
  designation: 'TEST DESIGNATION',
  party: 'TEST PARTY',
  organization: 'TEST ORGANIZATION',
  union_or_thana: 'TEST THANA',
  district: 'TEST DISTRICT',
  occasion: 'political_campaign',
  headline: 'TEMPLATE_TEST_98765 - আসন্ন নির্বাচনে সকলের সমর্থন কামনা',
  photo_urls: [
    'https://via.placeholder.com/520x520?text=MAIN+PHOTO',
    'https://via.placeholder.com/130x130?text=Leader1',
    'https://via.placeholder.com/130x130?text=Leader2',
    'https://via.placeholder.com/130x130?text=Leader3'
  ],
  layout_suggestion: null,
  status: 'COMPLETED',
  regenerate_count: 0,
  created_at: new Date().toISOString()
};

try {
  const html = generatePosterHTML(testPoster);
  console.log('Generated HTML length:', html.length);
  
  // Save to file
  const fs = require('fs');
  fs.writeFileSync('./test-output.html', html);
  console.log('Saved to test-output.html');
} catch (error) {
  console.error('Error:', error);
}