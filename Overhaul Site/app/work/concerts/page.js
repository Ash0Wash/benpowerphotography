import Link from 'next/link';
import ProtectedImage from '../../components/ProtectedImage';

export const metadata = { title: 'Concerts | Work | Ben Power Photography' };

const concerts = [
  { name: 'Bibi @ Sogang', slug: 'bibi-sogang', cover: '/images/concerts/bibi-sogang/cover.webp', imgStyle: { objectPosition: 'top' } },
  { name: 'Yena @ Sogang', slug: 'yena-sogang', cover: '/images/concerts/yena-sogang/cover.webp', imgStyle: { objectPosition: 'center 40%' } },
  { name: 'Maggie Lindemann & Ayleen Valentine', slug: 'maggie-lindemann', cover: '/images/concerts/maggie-lindemann/cover.webp' },
  { name: 'Snow Strippers @ SOMA', slug: 'snowstrippers', cover: '/images/concerts/snowstrippers/cover.jpg' },
  { name: 'PartyOf2 @ The Echo', slug: 'party', cover: '/images/concerts/party/cover.jpg' },
  { name: 'Ari Abdul & Ella Boh @ Soma', slug: 'ari', cover: '/images/concerts/ari/cover.jpg' },
  { name: 'Bladee & Ripsquadd @ Soma', slug: 'bladee', cover: '/images/concerts/bladee/cover.jpg' },
  { name: 'Malcolm Todd @ USD', slug: 'malcolm', cover: '/images/concerts/malcolm/cover.jpg' },
  { name: 'Cage the Elephant @ Ohana', slug: 'cte', cover: '/images/concerts/cte/cover.jpg' },
  { name: 'Wet Leg @ Ohana', slug: 'wetleg', cover: '/images/concerts/wetleg/cover.jpg' },
  { name: 'Skating Polly @ Ohana', slug: 'skatingp', cover: '/images/concerts/skatingp/cover.jpg' },
  { name: 'Hinds @ Ohana', slug: 'hinds', cover: '/images/concerts/hinds/cover.jpg' },
  { name: 'X Ambassadors @ HOB', slug: 'xambassadors', cover: '/images/concerts/xambassadors/cover.jpg' },
  { name: 'Panchiko @ SOMA', slug: 'panchiko', cover: '/images/concerts/panchiko/cover.jpg' },
  { name: 'aron! EP Release', slug: 'aron', cover: '/images/concerts/aron/cover.jpg' },
  { name: 'Turnover @ SOMA', slug: 'turnover', cover: '/images/concerts/turnover/cover.jpg' },
  { name: 'Underscores & Gabby Start', slug: 'underscores', cover: '/images/concerts/underscores/cover.jpg' },
  { name: 'Hope Tala & Alici', slug: 'hopetala', cover: '/images/concerts/hopetala/cover.jpg' },
  { name: 'Slowtide Backyard Show', slug: 'slowtide-backyard', cover: '/images/concerts/slowtide-backyard/cover.jpg' },
  { name: 'TPB Ole Music Fest', slug: 'tpb', cover: '/images/concerts/tpb/cover.jpg' },
  { name: 'Slowtide Big Blue Bash', slug: 'slowtide-bbb', cover: '/images/concerts/slowtide-bbb/cover.jpg' },
];

export default function Concerts() {
  return (
    <div className="container">
      <div className="section-header">
        <div className="breadcrumb">
          <Link href="/work">Work</Link> <span className="breadcrumb-separator">/</span> <span>Concerts</span>
        </div>
        <h1>Concerts</h1>
      </div>
      <div className="sub-gallery-grid">
        {concerts.map((c) => (
          <Link href={`/work/concerts/${c.slug}`} className="sub-gallery-card" key={c.slug}>
            <div className="sub-gallery-card-image" style={{ position: 'relative' }}>
               <ProtectedImage src={c.cover} alt={c.name} fill imgStyle={c.imgStyle} />
            </div>
            <div className="sub-gallery-card-info">
              <h3 className="sub-gallery-card-title">{c.name}</h3>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
