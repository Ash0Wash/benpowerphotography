import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

const SITE_URL = 'https://benpowerphotography.com';

function escapeXml(unsafe) {
  return String(unsafe).replace(/[<>&'"]/g, (c) => {
    switch (c) {
      case '<': return '&lt;';
      case '>': return '&gt;';
      case '&': return '&amp;';
      case '\'': return '&apos;';
      case '"': return '&quot;';
      default: return c;
    }
  });
}

function getContentType(ext) {
  switch (ext.toLowerCase()) {
    case '.jpg':
    case '.jpeg':
      return 'image/jpeg';
    case '.png':
      return 'image/png';
    case '.webp':
      return 'image/webp';
    default:
      return 'image/jpeg';
  }
}

export async function GET() {
  try {
    const configPath = path.join(process.cwd(), 'app', 'api', 'pinterest-feed', 'config.json');
    let config = { enabled: true };
    if (fs.existsSync(configPath)) {
      try {
        config = JSON.parse(fs.readFileSync(configPath, 'utf8'));
      } catch (e) {}
    }

    if (!config.enabled) {
      return new NextResponse('Pinterest feed is currently disabled via switch.', {
        status: 404,
        headers: { 'Content-Type': 'text/plain' }
      });
    }

    const publicDir = path.join(process.cwd(), 'public');
    const concertsDir = path.join(publicDir, 'images', 'concerts');
    const portraitsDir = path.join(publicDir, 'images', 'portraits');

    const feedItems = [];

    // Helper to process directory
    const processCategory = (baseDir, categoryName, categorySlug) => {
      if (!fs.existsSync(baseDir)) return;
      const folders = fs.readdirSync(baseDir, { withFileTypes: true })
        .filter(d => d.isDirectory())
        .map(d => d.name);

      for (const slug of folders) {
        const folderPath = path.join(baseDir, slug);
        const files = fs.readdirSync(folderPath);
        let imageFiles = files.filter(f => f.match(/\.(jpg|jpeg|png|webp|avif)$/i) && f !== 'cover.jpg' && f !== 'cover.webp');

        // Check image-order.json if available
        const orderPath = path.join(folderPath, 'image-order.json');
        if (fs.existsSync(orderPath)) {
          try {
            const order = JSON.parse(fs.readFileSync(orderPath, 'utf8')).map(p => path.basename(p));
            imageFiles.sort((a, b) => {
              const ia = order.indexOf(a);
              const ib = order.indexOf(b);
              if (ia !== -1 && ib !== -1) return ia - ib;
              if (ia !== -1) return -1;
              if (ib !== -1) return 1;
              return 0;
            });
          } catch (e) {}
        }

        const artistTitle = slug
          .split('-')
          .map(w => w.charAt(0).toUpperCase() + w.slice(1))
          .join(' ');

        const galleryUrl = `${SITE_URL}/work/${categorySlug}/${slug}`;

        // Take top 8 photos per album for the feed
        const selectedImages = imageFiles.slice(0, 8);

        for (let i = 0; i < selectedImages.length; i++) {
          const file = selectedImages[i];
          const ext = path.extname(file);
          const rawImagePath = `/images/${categorySlug}/${slug}/${file}`;
          const imageUrl = `${SITE_URL}/api/pinterest-image?path=${encodeURIComponent(rawImagePath)}`;
          const title = `${artistTitle} Live Photography #${i + 1} | Ben Power (@benpowerphoto)`;
          const description = `Live concert and event photography of ${artistTitle} by Los Angeles music photographer Ben Power (@benpowerphoto). Explore the full high-res photo gallery and press archive at ${galleryUrl}.`;

          feedItems.push({
            title,
            link: galleryUrl,
            imageUrl,
            contentType: 'image/jpeg',
            description,
            guid: `${SITE_URL}${rawImagePath}`,
            pubDate: new Date().toUTCString()
          });
        }
      }
    };

    processCategory(concertsDir, 'Concerts', 'concerts');
    processCategory(portraitsDir, 'Portraits', 'portraits');

    const xml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" 
     xmlns:media="http://search.yahoo.com/mrss/" 
     xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>Ben Power Photography</title>
    <link>${SITE_URL}</link>
    <description>Concert, music, and portrait photography by Los Angeles photographer Ben Power.</description>
    <language>en-us</language>
    <atom:link href="${SITE_URL}/api/pinterest-feed" rel="self" type="application/rss+xml" />
${feedItems.map(item => `    <item>
      <title>${escapeXml(item.title)}</title>
      <link>${escapeXml(item.link)}</link>
      <description>${escapeXml(item.description)}</description>
      <guid isPermaLink="true">${escapeXml(item.guid)}</guid>
      <pubDate>${item.pubDate}</pubDate>
      <enclosure url="${escapeXml(item.imageUrl)}" type="${item.contentType}" length="0" />
      <media:content url="${escapeXml(item.imageUrl)}" medium="image" type="${item.contentType}">
        <media:title>${escapeXml(item.title)}</media:title>
        <media:description>${escapeXml(item.description)}</media:description>
      </media:content>
    </item>`).join('\n')}
  </channel>
</rss>`;

    return new NextResponse(xml, {
      status: 200,
      headers: {
        'Content-Type': 'application/xml; charset=utf-8',
        'Cache-Control': 's-maxage=3600, stale-while-revalidate=86400'
      }
    });
  } catch (error) {
    console.error('Error generating Pinterest RSS feed:', error);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
}

// POST endpoint to toggle the on/off switch
export async function POST(request) {
  try {
    const { enabled } = await request.json();
    const configPath = path.join(process.cwd(), 'app', 'api', 'pinterest-feed', 'config.json');
    const newConfig = { enabled: Boolean(enabled) };
    fs.writeFileSync(configPath, JSON.stringify(newConfig, null, 2));

    return NextResponse.json({
      success: true,
      message: `Pinterest feed is now ${newConfig.enabled ? 'ENABLED' : 'DISABLED'}`,
      config: newConfig
    });
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
