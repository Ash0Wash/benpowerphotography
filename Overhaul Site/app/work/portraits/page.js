import Link from 'next/link';
import ProtectedImage from '../../components/ProtectedImage';

export const metadata = { 
  title: 'LA & San Diego Portrait & Event Photographer | Ben Power',
  description: 'Creative and stylized portrait photography sessions and event coverage in Los Angeles and San Diego by Ben Power.'
};

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
        <h1>Portraits & Events</h1>
        <p style={{ maxWidth: '800px', margin: '1rem auto 2rem', color: 'var(--text-secondary, #666)', lineHeight: '1.6' }}>
          Whether you need a stylized editorial shoot, artist press photos, or dynamic event coverage, my portrait and event photography is designed to stand out. Based in San Diego and heavily active in Los Angeles, I collaborate with clients to create unique, aesthetic-driven imagery. My sessions are tailored to showcase your authentic personality and brand, perfect for musicians needing fresh promo material or individuals looking for high-quality, creative captures.
        </p>
      </div>
      <div className="sub-gallery-grid">
        {portraits.map((p) => (
          <Link href={`/work/portraits/${p.slug}`} className="sub-gallery-card" key={p.slug}>
            <div className="sub-gallery-card-image" style={{ position: 'relative' }}>
               <ProtectedImage src={p.cover} alt={`LA Portrait Photographer - ${p.name}`} fill />
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
