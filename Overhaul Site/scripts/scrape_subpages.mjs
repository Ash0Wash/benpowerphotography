import fsPromises from 'fs/promises';
import { createWriteStream } from 'fs';
import path from 'path';
import https from 'https';

const BASE_DIR = 'c:/Users/theda/Documents/antigravity/cool-hertz/public/images';

const concertSlugs = {
  'bibi-sogang': 'bibig', 'yena-sogang': 'yg', 'maggie-lindemann': 'mna', 'snowstrippers': 'snowstrippers',
  'party': 'party', 'ari': 'ari', 'bladee': 'bladee', 'malcolm': 'malcolm', 'cte': 'cte', 'wetleg': 'wetleg',
  'skatingp': 'skatingp', 'hinds': 'hinds', 'xambassadors': 'xambassadors', 'panchiko': 'panchiko',
  'aron': 'aron', 'turnover': 'turnover', 'underscores': 'underscores', 'hopetala': 'hopetala',
  'slowtide-backyard': 'slowtidebs', 'tpb': 'tpbole', 'slowtide-bbb': 'slowtidebbb'
};

const portraitSlugs = ['kawai', 'brooke', 'kendi', 'slowtide', 'prom', 'animals'];

async function fetchHtml(url) {
  return new Promise((resolve, reject) => {
    https.get(url, (res) => {
      if (res.statusCode >= 300 && res.statusCode < 400 && res.headers.location) {
        return fetchHtml(res.headers.location).then(resolve).catch(reject);
      }
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => resolve(data));
      res.on('error', reject);
    }).on('error', reject);
  });
}

async function downloadImage(urlPath, destRelative) {
  const destPath = path.join(BASE_DIR, destRelative);
  await fsPromises.mkdir(path.dirname(destPath), { recursive: true });
  
  try {
    await fsPromises.access(destPath);
    return; // Already exists
  } catch(e) {}
  
  // Directly hit the original image URL
  const url = `https://www.benpowerphotography.com${encodeURI(urlPath).replace(/%2520/g, '%20')}`;
  
  return new Promise((resolve, reject) => {
    https.get(url, (res) => {
      if (res.statusCode >= 300 && res.statusCode < 400 && res.headers.location) {
        https.get(res.headers.location, (redirRes) => {
          if (redirRes.statusCode !== 200) return reject(new Error(`Redirect failed (${redirRes.statusCode})`));
          const writeStream = redirRes.pipe(createWriteStream(destPath));
          writeStream.on('finish', resolve);
          writeStream.on('error', reject);
        }).on('error', reject);
        return;
      }
      if (res.statusCode !== 200) return reject(new Error(`Failed ${res.statusCode}`));
      const writeStream = res.pipe(createWriteStream(destPath));
      writeStream.on('finish', resolve);
      writeStream.on('error', reject);
    }).on('error', reject);
  });
}

async function processCategory(category, slugsMap) {
  for (const [localSlug, liveSlug] of Object.entries(slugsMap)) {
    const url = `https://www.benpowerphotography.com/work/${category}/${liveSlug}`;
    console.log(`Fetching ${url}`);
    const html = await fetchHtml(url);
    
    const regex = /url=%2Fimages%2F(concerts|portraits)%2F([^&]+)&/g;
    const matches = [...html.matchAll(regex)];
    
    // Remove duplicates
    const uniquePaths = [...new Set(matches.map(m => `/images/${m[1]}/${m[2]}`))];
    
    for (const imgPath of uniquePaths) {
      const decodedPath = decodeURIComponent(imgPath);
      // Clean up encoded spaces
      const cleanedPath = decodedPath.replace(/\+/g, ' ');
      const destRelative = cleanedPath.replace('/images/', '');
      
      try {
        await downloadImage(cleanedPath, destRelative);
        console.log(` Downloaded ${destRelative}`);
      } catch (err) {
        console.error(` Failed ${destRelative}: ${err.message}`);
      }
    }
  }
}

async function main() {
  await processCategory('concerts', concertSlugs);
  const portraitMap = {};
  portraitSlugs.forEach(s => portraitMap[s] = s);
  await processCategory('portraits', portraitMap);
  console.log('Done downloading subpages.');
}
main();
