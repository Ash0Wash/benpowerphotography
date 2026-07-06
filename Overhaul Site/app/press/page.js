import fs from 'fs';
import path from 'path';
import PressClient from './PressClient';
import sharp from 'sharp';

export const metadata = {
  title: 'Press & Media | Ben Power Photography',
  description: 'Concert and portrait imagery for press and media usage.',
};

async function getAllImages(dirPath, basePath, imagePaths = []) {
  if (!fs.existsSync(dirPath)) return imagePaths;
  
  const files = fs.readdirSync(dirPath);
  
  for (const file of files) {
    const fullPath = path.join(dirPath, file);
    const stat = fs.statSync(fullPath);
    
    if (stat.isDirectory()) {
      await getAllImages(fullPath, basePath, imagePaths);
    } else {
      const ext = path.extname(file).toLowerCase();
      if (['.jpg', '.jpeg', '.png', '.webp', '.gif', '.avif'].includes(ext)) {
        // Convert to web path relative to public dir
        const relativePath = path.relative(basePath, fullPath).replace(/\\/g, '/');
        const src = `/${relativePath}`;
        
        try {
          const metadata = await sharp(fullPath).metadata();
          imagePaths.push({
            src,
            width: metadata.width || 800,
            height: metadata.height || 1200
          });
        } catch (e) {
          console.error('Error reading metadata for:', fullPath);
          imagePaths.push({ src, width: 800, height: 1200 });
        }
      }
    }
  }
  
  return imagePaths;
}

export default async function PressPage() {
  const publicDir = path.join(process.cwd(), 'public');
  const concertsDir = path.join(publicDir, 'images', 'concerts');
  const portraitsDir = path.join(publicDir, 'images', 'portraits');
  
  let hiddenImages = [];
  try {
    const hiddenListPath = path.join(process.cwd(), 'app', 'press', 'hidden-images.json');
    if (fs.existsSync(hiddenListPath)) {
      hiddenImages = JSON.parse(fs.readFileSync(hiddenListPath, 'utf8'));
    }
  } catch (err) {
    console.error('Error reading hidden-images.json:', err);
  }

  let imageOrder = [];
  try {
    const orderListPath = path.join(process.cwd(), 'app', 'press', 'image-order.json');
    if (fs.existsSync(orderListPath)) {
      imageOrder = JSON.parse(fs.readFileSync(orderListPath, 'utf8'));
    }
  } catch (err) {
    console.error('Error reading image-order.json:', err);
  }

  const concertImages = await getAllImages(concertsDir, publicDir);
  const portraitImages = await getAllImages(portraitsDir, publicDir);
  
  // Combine and filter out hidden images
  let allImages = [...concertImages, ...portraitImages].filter(img => !hiddenImages.includes(img.src));
  
  // Sort based on image-order.json
  allImages.sort((a, b) => {
    const indexA = imageOrder.indexOf(a.src);
    const indexB = imageOrder.indexOf(b.src);
    
    // If both are in the order list, sort by their index
    if (indexA !== -1 && indexB !== -1) return indexA - indexB;
    // If only A is in the list, A comes first
    if (indexA !== -1) return -1;
    // If only B is in the list, B comes first
    if (indexB !== -1) return 1;
    // If neither are in the list, keep original order (or fallback to src alphabetical)
    return a.src.localeCompare(b.src);
  });
  
  return <PressClient initialImages={allImages} />;
}
