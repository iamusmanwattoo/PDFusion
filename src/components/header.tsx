'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { ThemeToggle } from '@/components/theme-toggle';
import { cn } from '@/lib/utils';

export const Header = () => {
    const pathname = usePathname();

    return (
        <header className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between p-4 px-8 bg-background/80 backdrop-blur-sm border-b">
            <Link href="/" className="text-2xl font-bold text-foreground">
                PDFusion
            </Link>
            <nav className="hidden md:flex items-center gap-6">
                <Link
                    href="/pricing"
                    className={cn(
                        "text-sm font-medium hover:text-foreground",
                        pathname === '/pricing' ? 'text-foreground' : 'text-muted-foreground'
                    )}
                >
                    Pricing
                </Link>
            </nav>
            <div className="flex items-center gap-4">
                <Button asChild>
                    <Link href="/#merger">Get Started</Link>
                </Button>
                <ThemeToggle />
            </div>
        </header>
    );
};
