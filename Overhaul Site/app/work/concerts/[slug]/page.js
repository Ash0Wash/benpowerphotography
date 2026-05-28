import fs from 'fs';
import path from 'path';
import Link from 'next/link';
import GalleryClient from '../../../components/GalleryClient';

export async function generateStaticParams() {
  const concerts = [
    'bibi-sogang', 'yena-sogang', 'maggie-lindemann', 'snowstrippers',
    'party', 'ari', 'bladee', 'malcolm', 'cte', 'wetleg', 'skatingp',
    'hinds', 'xambassadors', 'panchiko', 'aron', 'turnover', 'underscores',
    'hopetala', 'slowtide-backyard', 'tpb', 'slowtide-bbb'
  ];
  return concerts.map((slug) => ({ slug }));
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
  let images = [];
  try {
    const files = fs.readdirSync(dirPath);
    images = files
      .filter(file => file.match(/\.(jpg|jpeg|png|webp|avif)$/i) && file !== 'cover.jpg' && file !== 'cover.webp')
      .sort(new Intl.Collator(undefined, {numeric: true, sensitivity: 'base'}).compare);
  } catch (e) {
    console.error('Directory not found:', dirPath);
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
      
      <GalleryClient images={images} folderPath={`/images/concerts/${slug}`} title={title} />
    </div>
  );
}
