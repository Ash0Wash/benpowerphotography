import Link from 'next/link';
import ProtectedImage from '../../components/ProtectedImage';

export const metadata = { title: 'Portraits | Work | Ben Power Photography' };

export const portraits = [
  { name: 'Kawai', slug: 'kawai', cover: '/images/portraits/kawai/cover.webp' },
  { name: 'Brooke', slug: 'brooke', cover: '/images/portraits/brooke/cover.jpg' },
  { name: 'Kendi', slug: 'kendi', cover: '/images/portraits/kendi/cover.jpg' },
  { name: 'Slowtide', slug: 'slowtide', cover: '/images/portraits/slowtide/cover.jpg' },
  { name: 'Newbury Park Prom 2024', slug: 'prom', cover: '/images/portraits/prom/cover.jpg' },
  { name: 'Animals', slug: 'animals', cover: '/images/portraits/animals/cover.jpg' },
];

export default function Portraits() {
  return (
    <div className="container">
      <div className="section-header">
        <div className="breadcrumb">
          <Link href="/work">Work</Link> <span className="breadcrumb-separator">/</span> <span>Portraits</span>
        </div>
        <h1>Portraits</h1>
      </div>
      <div className="sub-gallery-grid">
        {portraits.map((p) => (
          <Link href={`/work/portraits/${p.slug}`} className="sub-gallery-card" key={p.slug}>
            <div className="sub-gallery-card-image" style={{ position: 'relative' }}>
               <ProtectedImage src={p.cover} alt={p.name} fill />
            </div>
            <div className="sub-gallery-card-info">
              <h3 className="sub-gallery-card-title">{p.name}</h3>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
