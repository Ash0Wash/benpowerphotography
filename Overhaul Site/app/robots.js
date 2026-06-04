// Next.js dynamic robots.txt — tells Google to crawl everything
// This generates /robots.txt automatically at your domain

export default function robots() {
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: ['/admin/', '/api/'],
      },
    ],
    sitemap: 'https://www.benpowerphotography.com/sitemap.xml',
    host: 'https://www.benpowerphotography.com',
  };
}
