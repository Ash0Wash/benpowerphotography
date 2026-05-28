import fsPromises from 'fs/promises';
import { createWriteStream } from 'fs';
import path from 'path';
import https from 'https';

const BASE_DIR = 'c:/Users/theda/Documents/antigravity/cool-hertz/public/images';

const imagesToDownload = [
  // Concerts
  { path: 'concerts/bibi-sogang/-09.webp', dest: 'concerts/bibi-sogang/cover.webp' },
  { path: 'concerts/yena-sogang/-02.webp', dest: 'concerts/yena-sogang/cover.webp' },
  { path: 'concerts/maggie-lindemann-ayleen-valentine-music-box/-21.webp', dest: 'concerts/maggie-lindemann/cover.webp' },
  { path: 'concerts/snowstrippers/- (27).jpg', dest: 'concerts/snowstrippers/cover.jpg' },
  { path: 'concerts/party/- (8).jpg', dest: 'concerts/party/cover.jpg' },
  { path: 'concerts/ari/- (5).jpg', dest: 'concerts/ari/cover.jpg' },
  { path: 'concerts/bladee/- (9).jpg', dest: 'concerts/bladee/cover.jpg' },
  { path: 'concerts/malcolm/- (5).jpg', dest: 'concerts/malcolm/cover.jpg' },
  { path: 'concerts/cte/-.jpg', dest: 'concerts/cte/cover.jpg' },
  { path: 'concerts/wetleg/- (1).jpg', dest: 'concerts/wetleg/cover.jpg' },
  { path: 'concerts/skatingp/- (2).jpg', dest: 'concerts/skatingp/cover.jpg' },
  { path: 'concerts/hinds/- (10).jpg', dest: 'concerts/hinds/cover.jpg' },
  { path: 'concerts/xambassadors/-03.jpg', dest: 'concerts/xambassadors/cover.jpg' },
  { path: 'concerts/panchiko/-04.jpg', dest: 'concerts/panchiko/cover.jpg' },
  { path: 'concerts/panchiko/-01.jpg', dest: 'concerts/cover.jpg' },
  { path: 'concerts/aron/-15.jpg', dest: 'concerts/aron/cover.jpg' },
  { path: 'concerts/turnover/-10.jpg', dest: 'concerts/turnover/cover.jpg' },
  { path: 'concerts/underscores/h-04.jpg', dest: 'concerts/underscores/cover.jpg' },
  { path: 'concerts/hopetala/h-12.jpg', dest: 'concerts/hopetala/cover.jpg' },
  { path: 'concerts/slowtidexfauxfur/m-20.jpg', dest: 'concerts/slowtide-backyard/cover.jpg' },
  { path: 'concerts/tpb/m-25.jpg', dest: 'concerts/tpb/cover.jpg' },
  { path: 'concerts/slowtide/b3-12.jpg', dest: 'concerts/slowtide-bbb/cover.jpg' },
  
  // Portraits
  { path: 'portraits/kawai/-01.webp', dest: 'portraits/kawai/cover.webp' },
  { path: 'portraits/brooke/-42.jpg', dest: 'portraits/brooke/cover.jpg' },
  { path: 'portraits/brooke/-42.jpg', dest: 'portraits/cover.jpg' },
  { path: 'portraits/kendi/thu.jpg', dest: 'portraits/kendi/cover.jpg' },
  { path: 'portraits/slowtide/(1).jpg', dest: 'portraits/slowtide/cover.jpg' },
  { path: 'portraits/prom/(2).jpg', dest: 'portraits/prom/cover.jpg' },
  { path: 'portraits/animals/(17).jpg', dest: 'portraits/animals/cover.jpg' },
  
  // Misc
  { path: 'misc/-47.jpg', dest: 'misc/about-barn.jpg' },
  { path: 'misc/-59.jpg', dest: 'misc/about-streetlight.jpg' },
  { path: 'misc/womp.jpg', dest: 'misc/contact-field.jpg' }
];

// Add Street Photography
for (let i = 1; i <= 9; i++) {
  const num = String(i).padStart(2, '0');
  imagesToDownload.push({ path: `street photography/-${num}.jpg`, dest: `street-photography/${num}.jpg` });
}
imagesToDownload.push({ path: `street photography/-43.jpg`, dest: `street-photography/cover.jpg` });

// Add Cars
for (let i = 1; i <= 12; i++) {
  imagesToDownload.push({ path: `cars/${i}.jpg`, dest: `cars/${i}.jpg` });
}
imagesToDownload.push({ path: `cars/2.jpg`, dest: `cars/cover.jpg` });

async function downloadImage(image) {
  const destPath = path.join(BASE_DIR, image.dest);
  await fsPromises.mkdir(path.dirname(destPath), { recursive: true });
  
  const url = `https://www.benpowerphotography.com/images/${encodeURI(image.path).replace(/\\/g, '/')}`;
  
  return new Promise((resolve, reject) => {
    https.get(url, (res) => {
      if (res.statusCode === 301 || res.statusCode === 302 || res.statusCode === 308) {
        https.get(res.headers.location, (redirRes) => {
          if (redirRes.statusCode !== 200) {
            reject(new Error(`Redirect failed to get '${res.headers.location}' (${redirRes.statusCode})`));
            return;
          }
          const writeStream = redirRes.pipe(createWriteStream(destPath));
          writeStream.on('finish', () => resolve());
          writeStream.on('error', reject);
        }).on('error', reject);
        return;
      }

      if (res.statusCode !== 200) {
        reject(new Error(`Failed to get '${url}' (${res.statusCode})`));
        return;
      }
      
      const writeStream = res.pipe(createWriteStream(destPath));
      writeStream.on('finish', () => resolve());
      writeStream.on('error', reject);
    }).on('error', reject);
  });
}

async function main() {
  console.log(`Downloading ${imagesToDownload.length} images...`);
  const batchSize = 10;
  for (let i = 0; i < imagesToDownload.length; i += batchSize) {
    const batch = imagesToDownload.slice(i, i + batchSize);
    await Promise.all(batch.map(img => 
      downloadImage(img)
        .then(() => console.log(`Downloaded ${img.dest}`))
        .catch(e => console.error(`Error downloading ${img.dest}: ${e.message}`))
    ));
  }
  console.log('Done downloading images.');
}

main();
