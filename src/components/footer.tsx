'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import { Instagram, Youtube, Twitter } from 'lucide-react';

export const Footer = () => {
    const pathname = usePathname();

    return (
      <footer className="w-full py-8 border-t bg-background">
        <div className="container mx-auto flex flex-col md:flex-row justify-between items-center text-center md:text-left">
          <p className="text-sm text-muted-foreground mb-4 md:mb-0">&copy; {new Date().getFullYear()} PDFusion. All rights reserved.</p>
          <div className="flex items-center gap-6">
            <div className="flex gap-4">
                <Link href="https://instagram.com" target="_blank" rel="noopener noreferrer" aria-label="Instagram" className="text-muted-foreground hover:text-foreground">
                    <Instagram className="h-5 w-5" />
                </Link>
                <Link href="https://youtube.com" target="_blank" rel="noopener noreferrer" aria-label="YouTube" className="text-muted-foreground hover:text-foreground">
                    <Youtube className="h-5 w-5" />
                </Link>
                <Link href="https://twitter.com" target="_blank" rel="noopener noreferrer" aria-label="Twitter" className="text-muted-foreground hover:text-foreground">
                    <Twitter className="h-5 w-5" />
                </Link>
            </div>
            <div className="flex gap-4">
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
        </div>
      </footer>
    );
};
