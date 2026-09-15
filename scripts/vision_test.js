'use strict';
// Quick live test: POST a local image to /webhook/image and print the reply.
// Usage on server: node scripts/vision_test.js /tmp/kb.jpg
const fs = require('fs');
const http = require('http');

const file = process.argv[2] || '/tmp/kb.jpg';
const b64 = fs.readFileSync(file).toString('base64');
const body = JSON.stringify({
  from: 'vistest',
  image: 'data:image/jpeg;base64,' + b64,
  mime: 'image/jpeg',
  hint: 'photo.jpg',
});

const req = http.request(
  { host: '127.0.0.1', port: 3000, path: '/webhook/image', method: 'POST', headers: { 'Content-Type': 'application/json', 'Content-Length': Buffer.byteLength(body) } },
  (res) => {
    let out = '';
    res.on('data', (d) => (out += d));
    res.on('end', () => {
      try {
        const j = JSON.parse(out);
        console.log('identified:', j.identified, '| category:', j.category || '-', '| provider:', j.visionProvider || '-');
        console.log('REPLY:\n' + (j.reply || out));
      } catch (e) {
        console.log('RAW:', out.slice(0, 500));
      }
    });
  }
);
req.on('error', (e) => console.log('ERR', e.message));
req.write(body);
req.end();
