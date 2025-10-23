// assi2/frontend/app/notfound.tsx
'use client';
import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="text-center">
      <h1 className="mb-3">404 - Page Not Found</h1>
      <p className="mb-4">Oops! The page you’re looking for doesn’t exist.</p>
      <Link href="/tabs" className="btn btn-primary">
        Go Back to Tabs
      </Link>
    </div>
  );
}
