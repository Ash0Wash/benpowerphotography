import fs from 'fs';
import path from 'path';

export function getAllThumbnails() {
  const images = [];
  const baseDir = path.join(process.cwd(), 'public', 'images');
  
  ['concerts', 'portraits'].forEach(category => {
    const catDir = path.join(baseDir, category);
    if (!fs.existsSync(catDir)) return;
    
    let folders;
    try {
      folders = fs.readdirSync(catDir, { withFileTypes: true })
        .filter(dirent => dirent.isDirectory())
        .map(dirent => dirent.name);
    } catch (e) {
      return;
    }
      
    for (const folder of folders) {
      const folderPath = path.join(catDir, folder);
      let coverFile = null;
      
      if (fs.existsSync(path.join(folderPath, 'cover.webp'))) {
        coverFile = 'cover.webp';
      } else if (fs.existsSync(path.join(folderPath, 'cover.jpg'))) {
        coverFile = 'cover.jpg';
      } else if (fs.existsSync(path.join(folderPath, 'cover.png'))) {
        coverFile = 'cover.png';
      }
      
      if (coverFile) {
        images.push({
          src: `/images/${category}/${folder}/${coverFile}`,
          objectPosition: folder === 'bibi-sogang' ? 'top' : 'center'
        });
      }
    }
  });
  
  return images;
}
