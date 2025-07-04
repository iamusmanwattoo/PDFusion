
'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { ThemeToggle } from '@/components/theme-toggle';

export const Header = () => {
    return (
        <header className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between p-4 px-8 bg-background/80 backdrop-blur-sm border-b">
            <Link href="/" className="text-2xl font-bold text-foreground">
                PDFusion
            </Link>
            <div className="flex items-center gap-4">
                <Button variant="ghost" asChild>
                    <Link href="/merger">Merger</Link>
                </Button>
                <Button variant="ghost" asChild>
                    <Link href="/pricing">Pricing</Link>
                </Button>
                <ThemeToggle />
            </div>
        </header>
    );
};
