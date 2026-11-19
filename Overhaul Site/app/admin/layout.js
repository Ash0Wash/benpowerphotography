import { headers } from 'next/headers';
import { redirect } from 'next/navigation';

export const metadata = {
  title: 'Hero Refresher Admin | Ben Power Photography',
  robots: {
    index: false,
    follow: false,
  },
};

export default async function AdminLayout({ children }) {
  const headersList = await headers();
  const host = headersList.get('host') || '';
  const isLocal =
    host.startsWith('localhost') ||
    host.startsWith('127.0.0.1') ||
    host.startsWith('[::1]');

  if (!isLocal) {
    redirect('/');
  }

  return children;
}
