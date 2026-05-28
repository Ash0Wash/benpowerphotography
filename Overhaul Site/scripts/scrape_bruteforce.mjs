import fsPromises from 'fs/promises';
import { createWriteStream } from 'fs';
import path from 'path';
import https from 'https';

const BASE_DIR = 'c:/Users/theda/Documents/antigravity/cool-hertz/public/images';

const concertSlugs = ['bibi-sogang', 'yena-sogang', 'maggie-lindemann', 'snowstrippers', 'party', 'ari', 'bladee', 'malcolm', 'cte', 'wetleg', 'skatingp', 'hinds', 'xambassadors', 'panchiko', 'aron', 'turnover', 'underscores', 'hopetala', 'slowtide-backyard', 'tpb', 'slowtide-bbb'];
const portraitSlugs = ['kawai', 'brooke', 'kendi', 'slowtide', 'prom', 'animals'];
const maxImagesPerGallery = 15;

function generatePossibleFilenames(num) {
  const padded = String(num).padStart(2, '0');
  return [
    `-${padded}.jpg`,
    `-${padded}.webp`,
    `-${num}.jpg`,
    `-${num}.webp`,
    `- (${num}).jpg`,
    `- (${padded}).jpg`,
    `m-${num}.jpg`,
    `m-${padded}.jpg`,
    `h-${num}.jpg`,
    `h-${padded}.jpg`,
    `b3-${num}.jpg`,
    `b3-${padded}.jpg`,
    `${num}.jpg`,
    `${num}.webp`,
    `(${num}).jpg`
  ];
}

async function tryDownload(category, slug, filename) {
  const destRelative = `${category}/${slug}/${filename}`;
  const destPath = path.join(BASE_DIR, destRelative);
  
  try {
    await fsPromises.access(destPath);
    return true; // Already exists
  } catch(e) {}
  
  const originalPathMap = {
    'maggie-lindemann': 'maggie-lindemann-ayleen-valentine-music-box',
    'slowtide-backyard': 'slowtidexfauxfur',
    'slowtide-bbb': 'slowtide'
  };
  
  const serverSlug = originalPathMap[slug] || slug;
  const url = `https://www.benpowerphotography.com/images/${category}/${serverSlug}/${encodeURI(filename)}`;
  
  await fsPromises.mkdir(path.dirname(destPath), { recursive: true }).catch(() => {});
  
  return new Promise((resolve) => {
    https.get(url, (res) => {
      if (res.statusCode === 200) {
        const writeStream = res.pipe(createWriteStream(destPath));
        writeStream.on('finish', () => {
          console.log(`Downloaded ${destRelative}`);
          resolve(true);
        });
        writeStream.on('error', () => resolve(false));
      } else {
        res.resume();
        resolve(false);
      }
    }).on('error', () => resolve(false));
  });
}

async function processGallery(category, slug) {
  console.log(`Scraping ${category}/${slug}...`);
  for (let i = 1; i <= maxImagesPerGallery; i++) {
    const filenames = generatePossibleFilenames(i);
    const results = await Promise.all(filenames.map(f => tryDownload(category, slug, f)));
  }
}

async function main() {
  for (const slug of concertSlugs) {
    await processGallery('concerts', slug);
  }
  for (const slug of portraitSlugs) {
    await processGallery('portraits', slug);
  }
  console.log('Finished brute force scraper.');
}

main();
