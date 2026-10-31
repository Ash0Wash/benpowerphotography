import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

export async function POST(request) {
  try {
    if (process.env.NODE_ENV !== 'development') {
      return NextResponse.json({ error: 'Only allowed in development mode' }, { status: 403 });
    }

    const { imageOrder, folderPath } = await request.json();

    if (!imageOrder || !Array.isArray(imageOrder)) {
      return NextResponse.json({ error: 'Invalid order data provided' }, { status: 400 });
    }

    let orderListPath;

    if (folderPath && typeof folderPath === 'string') {
      // Normalize and sanitize folder path to prevent directory traversal
      const normalized = path.normalize(folderPath).replace(/^(\.\.(\/|\\|$))+/, '');
      const cleanPath = normalized.replace(/^\/+/, '').replace(/^\\+/, '');

      const publicRoot = path.join(process.cwd(), 'public');
      const targetDir = path.join(publicRoot, cleanPath);

      if (!targetDir.startsWith(publicRoot)) {
        return NextResponse.json({ error: 'Invalid folder path' }, { status: 400 });
      }

      if (!fs.existsSync(targetDir)) {
        return NextResponse.json({ error: 'Target directory not found' }, { status: 404 });
      }

      orderListPath = path.join(targetDir, 'image-order.json');
    } else {
      // Default fallback for /press
      orderListPath = path.join(process.cwd(), 'app', 'press', 'image-order.json');
    }

    fs.writeFileSync(orderListPath, JSON.stringify(imageOrder, null, 2));

    return NextResponse.json({ success: true, message: 'Image order updated successfully' });
  } catch (error) {
    console.error('Error updating image order:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
