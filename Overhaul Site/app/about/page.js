import ProtectedImage from '../components/ProtectedImage';

export const metadata = {
  title: 'About | Ben Power Photography',
  description: 'Ben Power is a San Diego and LA photographer specializing in concerts, portraits, street photography, and cars.',
};

export default function About() {
  return (
    <div className="container">
      <div className="section-header">
        <h1>About</h1>
      </div>
      <div className="about-section">
        <div className="about-image-wrapper" style={{ position: 'relative', height: '600px' }}>
          <ProtectedImage
            src="/images/misc/about-barn.jpg"
            alt="Abandoned barn"
            fill
          />
        </div>
        <div className="about-text">
          <p className="about-bio">Ben Power is a San Diego and LA photographer. His work primarily consists of concerts, portraiture, street photography, and cars.</p>
          <p className="about-detail">His work has been featured in multiple art shows in Los Angeles, San Diego, and Ventura.</p>
        </div>
      </div>

      <div className="about-section" style={{ flexDirection: 'row-reverse' }}>
        <div className="about-image-wrapper" style={{ position: 'relative', height: '600px' }}>
          <ProtectedImage
            src="/images/misc/about-streetlight.jpg"
            alt="Streetlight"
            fill
          />
        </div>
        <div className="about-text">
          <p className="about-bio" style={{ marginBottom: '1.5rem' }}>For over five years, Ben has been capturing the energy and emotion of live music, the beauty of portraiture, and the spontaneity of street photography.</p>
        </div>
      </div>
    </div>
  );
}
