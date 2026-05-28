import fs from 'fs';
import path from 'path';
import Link from 'next/link';
import GalleryClient from '../../components/GalleryClient';

export function generateMetadata() {
  return { title: 'Cars | Ben Power Photography' };
}

export default function Cars() {
  const dirPath = path.join(process.cwd(), 'public', 'images', 'cars');
  let images = [];
  try {
    const files = fs.readdirSync(dirPath);
    images = files
      .filter(file => file.match(/\.(jpg|jpeg|png|webp|avif)$/i) && file !== 'cover.jpg')
      .sort(new Intl.Collator(undefined, {numeric: true, sensitivity: 'base'}).compare);
  } catch (e) {
    console.error('Directory not found:', dirPath);
  }

  return (
    <div className="container">
      <div className="section-header">
        <div className="breadcrumb">
          <Link href="/work">Work</Link> <span className="breadcrumb-separator">/</span> <span>Cars</span>
        </div>
        <h1>Cars</h1>
      </div>
      <GalleryClient images={images} folderPath="/images/cars" title="Cars" />
    </div>
  );
}
