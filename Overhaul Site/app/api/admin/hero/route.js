import { NextResponse } from 'next/server';
import { headers } from 'next/headers';
import fs from 'fs';
import path from 'path';

const configPath = path.join(process.cwd(), 'data', 'hero-config.json');

async function isLocalhost() {
  const headersList = await headers();
  const host = headersList.get('host') || '';
  return (
    host.startsWith('localhost') ||
    host.startsWith('127.0.0.1') ||
    host.startsWith('[::1]')
  );
}

export async function GET() {
  if (!(await isLocalhost())) {
    return NextResponse.json({ error: 'Unauthorized: Localhost only' }, { status: 403 });
  }

  try {
    if (!fs.existsSync(configPath)) {
      return NextResponse.json({ error: 'Config file not found' }, { status: 404 });
    }
    const data = JSON.parse(fs.readFileSync(configPath, 'utf8'));
    return NextResponse.json(data);
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(request) {
  if (!(await isLocalhost())) {
    return NextResponse.json({ error: 'Unauthorized: Localhost only' }, { status: 403 });
  }

  try {
    const body = await request.json();
    if (!Array.isArray(body)) {
      return NextResponse.json({ error: 'Payload must be an array of images' }, { status: 400 });
    }

    const dataDir = path.dirname(configPath);
    if (!fs.existsSync(dataDir)) {
      fs.mkdirSync(dataDir, { recursive: true });
    }

    fs.writeFileSync(configPath, JSON.stringify(body, null, 2), 'utf8');
    return NextResponse.json({ success: true, count: body.length });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
