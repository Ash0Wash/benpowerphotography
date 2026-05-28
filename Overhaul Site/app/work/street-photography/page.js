import fs from 'fs';
import path from 'path';
import Link from 'next/link';
import GalleryClient from '../../components/GalleryClient';

export function generateMetadata() {
  return { title: 'Street Photography | Ben Power Photography' };
}

export default function StreetPhotography() {
  const dirPath = path.join(process.cwd(), 'public', 'images', 'street-photography');
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
          <Link href="/work">Work</Link> <span className="breadcrumb-separator">/</span> <span>Street Photography</span>
        </div>
        <h1>Street Photography</h1>
      </div>
      <GalleryClient images={images} folderPath="/images/street-photography" title="Street Photography" />
    </div>
  );
}
