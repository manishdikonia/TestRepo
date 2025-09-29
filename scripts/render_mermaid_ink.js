const fs = require('fs');
const https = require('https');
const zlib = require('zlib');
const path = require('path');

const inputPath = path.resolve('/workspace/er/diagram.mmd');
const pngOut = path.resolve('/workspace/er/diagram.png');

function base64url(buf) {
  return buf.toString('base64').replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/g, '');
}

function fetch(url, outputFile) {
  return new Promise((resolve, reject) => {
    const file = fs.createWriteStream(outputFile);
    https.get(url, (res) => {
      if (res.statusCode !== 200) {
        reject(new Error(`HTTP ${res.statusCode}`));
        res.resume();
        return;
      }
      res.pipe(file);
      file.on('finish', () => file.close(resolve));
    }).on('error', (err) => {
      reject(err);
    });
  });
}

(async () => {
  const mermaid = fs.readFileSync(inputPath, 'utf8');
  const deflated = zlib.deflateRawSync(Buffer.from(mermaid, 'utf8'));
  const b64u = base64url(deflated);
  const url = `https://mermaid.ink/img/pako:${b64u}`;
  await fetch(url, pngOut);
  const stat = fs.statSync(pngOut);
  console.log(`PNG written: ${pngOut} (${stat.size} bytes)`);
})();