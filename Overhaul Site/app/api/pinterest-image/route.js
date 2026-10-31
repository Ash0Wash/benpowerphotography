import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';
import sharp from 'sharp';

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const relPath = searchParams.get('path');

    if (!relPath || typeof relPath !== 'string') {
      return new NextResponse('Missing path parameter', { status: 400 });
    }

    // Sanitize path to prevent directory traversal
    const normalized = path.normalize(relPath).replace(/^(\.\.(\/|\\|$))+/, '');
    const cleanPath = normalized.replace(/^\/+/, '').replace(/^\\+/, '');

    const publicRoot = path.join(process.cwd(), 'public');
    const fullPath = path.join(publicRoot, cleanPath);

    if (!fullPath.startsWith(publicRoot) || !fs.existsSync(fullPath)) {
      return new NextResponse('Image not found', { status: 404 });
    }

    const imageBuffer = fs.readFileSync(fullPath);
    const metadata = await sharp(imageBuffer).metadata();
    const width = metadata.width || 1200;
    const height = metadata.height || 1800;

    // Size watermark relative to image dimensions
    const fontSize = Math.max(18, Math.round(width * 0.024));
    const svgW = Math.round(fontSize * 13);
    const svgH = Math.round(fontSize * 2.2);

    const watermarkSvg = Buffer.from(`
      <svg width="${svgW}" height="${svgH}">
        <style>
          .wm { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; font-size: ${fontSize}px; font-weight: 600; letter-spacing: 1.5px; fill: rgba(255, 255, 255, 0.70); }
          .sh { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; font-size: ${fontSize}px; font-weight: 600; letter-spacing: 1.5px; fill: rgba(0, 0, 0, 0.45); }
        </style>
        <text x="${Math.round(fontSize * 0.06)}" y="${Math.round(fontSize * 1.25)}" class="sh">@benpowerphoto</text>
        <text x="0" y="${Math.round(fontSize * 1.2)}" class="wm">@benpowerphoto</text>
      </svg>
    `);

    const paddingX = Math.round(width * 0.025);
    const paddingY = Math.round(height * 0.025);

    const watermarkedBuffer = await sharp(imageBuffer)
      .rotate()
      .composite([
        {
          input: watermarkSvg,
          top: Math.max(0, height - svgH - paddingY),
          left: Math.max(0, width - svgW - paddingX)
        }
      ])
      .withMetadata({
        exif: {
          IFD0: {
            Artist: 'Ben Power',
            Copyright: 'Copyright (c) Ben Power Photography (benpowerphotography.com)',
            ImageDescription: 'Photography by Ben Power (@benpowerphoto) - benpowerphotography.com',
            Software: 'Ben Power Photography'
          }
        }
      })
      .jpeg({ quality: 90, mozjpeg: true })
      .toBuffer();

    return new NextResponse(watermarkedBuffer, {
      status: 200,
      headers: {
        'Content-Type': 'image/jpeg',
        'Cache-Control': 'public, max-age=31536000, immutable'
      }
    });
  } catch (error) {
    console.error('Error serving watermarked Pinterest image:', error);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
}
