import fs from 'fs';
import path from 'path';
import Link from 'next/link';
import GalleryClient from '../../../components/GalleryClient';
import sharp from 'sharp';

export async function generateStaticParams() {
  const dirPath = path.join(process.cwd(), 'public', 'images', 'concerts');
  try {
    const folders = fs.readdirSync(dirPath, { withFileTypes: true })
      .filter(dirent => dirent.isDirectory())
      .map(dirent => dirent.name);
    return folders.map((slug) => ({ slug }));
  } catch (e) {
    return [];
  }
}

export async function generateMetadata({ params }) {
  const { slug } = await params;
  const title = slug.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
  return {
    title: `${title} | Concerts | Ben Power Photography`,
  };
}

export default async function ConcertGallery({ params }) {
  const { slug } = await params;
  
  const title = slug.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');

  const dirPath = path.join(process.cwd(), 'public', 'images', 'concerts', slug);
  let imagesData = [];
  try {
    const files = fs.readdirSync(dirPath);
    let imageFiles = files
      .filter(file => file.match(/\.(jpg|jpeg|png|webp|avif)$/i) && file !== 'cover.jpg' && file !== 'cover.webp');

    // Read custom image order if it exists
    const orderFilePath = path.join(dirPath, 'image-order.json');
    let imageOrder = [];
    if (fs.existsSync(orderFilePath)) {
      try {
        imageOrder = JSON.parse(fs.readFileSync(orderFilePath, 'utf8'));
      } catch (err) {
        console.error('Error reading image-order.json in', dirPath, err);
      }
    }

    if (imageOrder && imageOrder.length > 0) {
      const orderBaseNames = imageOrder.map(item => path.basename(item));
      imageFiles.sort((a, b) => {
        const indexA = orderBaseNames.indexOf(path.basename(a));
        const indexB = orderBaseNames.indexOf(path.basename(b));
        if (indexA !== -1 && indexB !== -1) return indexA - indexB;
        if (indexA !== -1) return -1;
        if (indexB !== -1) return 1;
        return new Intl.Collator(undefined, { numeric: true, sensitivity: 'base' }).compare(a, b);
      });
    } else {
      imageFiles.sort(new Intl.Collator(undefined, { numeric: true, sensitivity: 'base' }).compare);
    }
      
    imagesData = await Promise.all(imageFiles.map(async (file) => {
      const filePath = path.join(dirPath, file);
      const metadata = await sharp(filePath).metadata();
      return {
        src: file,
        width: metadata.width || 800,
        height: metadata.height || 1200
      };
    }));
  } catch (e) {
    console.error('Directory not found or sharp error:', dirPath);
  }

  return (
    <div className="container">
      <div className="section-header">
        <div className="breadcrumb">
          <Link href="/work">Work</Link> <span className="breadcrumb-separator">/</span> 
          <Link href="/work/concerts">Concerts</Link> <span className="breadcrumb-separator">/</span> 
          <span>{title}</span>
        </div>
        <h1>{title}</h1>
      </div>
      <GalleryClient images={imagesData} folderPath={`/images/concerts/${slug}`} title={title} />
    </div>
  );
}
