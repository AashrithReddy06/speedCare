const https = require('https');

const apiKey = process.env.GEMINI_API_KEY || 'YOUR_API_KEY';
const url = `https://generativelanguage.googleapis.com/v1beta/models?key=${apiKey}`;

https.get(url, (res) => {
  let data = '';
  res.on('data', chunk => data += chunk);
  res.on('end', () => {
    try {
      const parsed = JSON.parse(data);
      if (parsed.models) {
        console.log("AVAILABLE MODELS:");
        parsed.models.forEach(m => {
          if (m.supportedGenerationMethods.includes('generateContent')) {
            console.log(`- ${m.name}`);
          }
        });
      } else {
        console.log("Response: ", JSON.stringify(parsed, null, 2));
      }
    } catch (e) {
      console.log("Error parsing JSON: " + e.message);
      console.log("Raw response: " + data);
    }
  });
}).on('error', (err) => {
  console.log("Request Error: " + err.message);
});
