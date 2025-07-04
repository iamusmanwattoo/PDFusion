'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';

export const Footer = () => {
    const pathname = usePathname();

    return (
      <footer className="w-full py-8 border-t bg-background">
        <div className="container mx-auto flex flex-col md:flex-row justify-between items-center text-center md:text-left">
          <p className="text-sm text-muted-foreground">&copy; {new Date().getFullYear()} PDFusion. All rights reserved.</p>
          <div className="flex gap-4 mt-4 md:mt-0">
            <Link
              href="/privacy"
              className={cn(
                "text-sm hover:text-foreground",
                pathname === '/privacy' ? 'text-foreground' : 'text-muted-foreground'
              )}
            >
              Privacy Policy
            </Link>
            <Link
              href="/terms"
              className={cn(
                "text-sm hover:text-foreground",
                pathname === '/terms' ? 'text-foreground' : 'text-muted-foreground'
              )}
            >
              Terms of Service
            </Link>
          </div>
        </div>
      </footer>
    );
};
