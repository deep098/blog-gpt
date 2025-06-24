'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/button';

export default function Header() {
  return (
    <header className="w-full bg-white border-b shadow-sm">
      <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between">
        
        <Link href="/login">
          <Button variant="outline" className="w-full cursor-pointer hover:cursor-pointer">
            Home
          </Button>
        </Link>
      </div>
    </header>
  );
}