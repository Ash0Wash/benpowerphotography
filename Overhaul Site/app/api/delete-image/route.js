import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

export async function POST(request) {
  try {
    if (process.env.NODE_ENV !== 'development') {
      return NextResponse.json({ error: 'Only allowed in development mode' }, { status: 403 });
    }

    const { imagePath } = await request.json();

    if (!imagePath) {
      return NextResponse.json({ error: 'No image path provided' }, { status: 400 });
    }

    const hiddenListPath = path.join(process.cwd(), 'app', 'press', 'hidden-images.json');
    let hiddenImages = [];
    
    if (fs.existsSync(hiddenListPath)) {
      const fileContent = fs.readFileSync(hiddenListPath, 'utf8');
      hiddenImages = JSON.parse(fileContent);
    }
    
    if (!hiddenImages.includes(imagePath)) {
      hiddenImages.push(imagePath);
      fs.writeFileSync(hiddenListPath, JSON.stringify(hiddenImages, null, 2));
    }

    return NextResponse.json({ success: true, message: 'Image removed from press grid' });
  } catch (error) {
    console.error('Error hiding image:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
