import fs from 'fs';
import path from 'path';
import Link from 'next/link';
import GalleryClient from '../../../components/GalleryClient';
import sharp from 'sharp';

export async function generateStaticParams() {
  const dirPath = path.join(process.cwd(), 'public', 'images', 'portraits');
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
    title: `${title} | Portraits | Ben Power Photography`,
  };
}

export default async function PortraitGallery({ params }) {
  const { slug } = await params;
  
  const title = slug.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');

  const dirPath = path.join(process.cwd(), 'public', 'images', 'portraits', slug);
  let imagesData = [];
  try {
    const files = fs.readdirSync(dirPath);
    const imageFiles = files
      .filter(file => file.match(/\.(jpg|jpeg|png|webp|avif)$/i) && file !== 'cover.jpg' && file !== 'cover.webp')
      .sort(new Intl.Collator(undefined, {numeric: true, sensitivity: 'base'}).compare);
      
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
          <Link href="/work/portraits">Portraits</Link> <span className="breadcrumb-separator">/</span> 
          <span>{title}</span>
        </div>
        <h1>{title}</h1>
      </div>
      <GalleryClient images={imagesData} folderPath={`/images/portraits/${slug}`} title={title} />
    </div>
  );
}
