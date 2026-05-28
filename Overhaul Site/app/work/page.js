import Link from 'next/link';
import ProtectedImage from '../components/ProtectedImage';

export const metadata = {
  title: 'Work | Ben Power Photography',
  description: 'Browse concert photography, portraits, street photography, and automotive photography by Ben Power.',
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
