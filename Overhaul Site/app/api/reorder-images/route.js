import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

export async function POST(request) {
  try {
    if (process.env.NODE_ENV !== 'development') {
      return NextResponse.json({ error: 'Only allowed in development mode' }, { status: 403 });
    }

    const { imageOrder } = await request.json();

    if (!imageOrder || !Array.isArray(imageOrder)) {
      return NextResponse.json({ error: 'Invalid order data provided' }, { status: 400 });
    }

    const orderListPath = path.join(process.cwd(), 'app', 'press', 'image-order.json');
    fs.writeFileSync(orderListPath, JSON.stringify(imageOrder, null, 2));

    return NextResponse.json({ success: true, message: 'Image order updated successfully' });
  } catch (error) {
    console.error('Error updating image order:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
