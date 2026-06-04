import Link from 'next/link';
import ProtectedImage from '../components/ProtectedImage';

export const metadata = {
  title: 'Portfolio | Ben Power Photography | LA & San Diego',
  description: 'Browse the diverse photography portfolio of Ben Power, featuring live concerts, stylized portraits, events, and street photography across Los Angeles and San Diego.',
};

const categories = [
  { name: 'Concerts', slug: 'concerts', cover: '/images/concerts/cover.jpg', count: '20+ Shows' },
  { name: 'Portraits', slug: 'portraits', cover: '/images/portraits/cover.jpg', count: '6 Sessions' },
  { name: 'Street Photography', slug: 'street-photography', cover: '/images/street-photography/cover.jpg', count: '30+ Photos' },
  { name: 'Cars', slug: 'cars', cover: '/images/cars/cover.jpg', count: '20 Photos' },
];

export default function Work() {
  return (
    <div className="container">
      <div className="section-header">
        <h1>Work</h1>
        <p style={{ maxWidth: '800px', margin: '1rem auto 2rem', color: 'var(--text-secondary, #666)', lineHeight: '1.6' }}>
          Dive into my diverse body of work spanning the vibrant music scenes and diverse environments of Los Angeles and San Diego. As a freelance photographer focused on the entertainment industry, I collaborate with musicians, publicists, and management teams to produce striking visual narratives. From the high-voltage atmosphere of live concerts and private events to meticulously styled portrait sessions, explore the galleries below to see how I bring creative visions to life.
        </p>
      </div>
      <div className="category-grid">
        {categories.map((cat) => (
          <Link href={`/work/${cat.slug}`} className="category-card" key={cat.slug}>
            <div className="category-card-image" style={{ width: '100%', height: '100%', position: 'relative' }}>
               <ProtectedImage src={cat.cover} alt={cat.name} fill />
            </div>
            <div className="category-card-overlay"></div>
            <div className="category-card-content">
              <h2 className="category-card-title">{cat.name}</h2>
              <div className="category-card-count">{cat.count}</div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
