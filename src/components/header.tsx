'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { ThemeToggle } from '@/components/theme-toggle';
import { useToast } from "@/hooks/use-toast";
import { Loader2 } from 'lucide-react';
import { useState } from 'react';

type HeaderProps = {
    isAuthenticated: boolean;
};

export const Header = ({ isAuthenticated }: { isAuthenticated: boolean }) => {
    const router = useRouter();
    const { toast } = useToast();
    const [isLoggingOut, setIsLoggingOut] = useState(false);

    const handleLogout = async () => {
        setIsLoggingOut(true);
        try {
            await fetch('/api/logout', { method: 'POST' });
            toast({ title: "Logged Out", description: "You have been successfully logged out." });
            router.push('/');
            router.refresh();
        } catch (error) {
            toast({ variant: 'destructive', title: "Logout Failed", description: "Could not log out. Please try again." });
        } finally {
            setIsLoggingOut(false);
        }
    };
    
    return (
        <header className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between p-4 px-8 bg-background/80 backdrop-blur-sm border-b">
            <Link href="/" className="text-2xl font-bold text-foreground">
                PDFusion
            </Link>
            <div className="flex items-center gap-4">
                {isAuthenticated ? (
                    <>
                        <Button variant="ghost" asChild>
                           <Link href="/merger">Merger</Link>
                        </Button>
                        <Button onClick={handleLogout} disabled={isLoggingOut}>
                            {isLoggingOut && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                            Logout
                        </Button>
                    </>
                ) : (
                    <>
                        <Button variant="ghost" asChild>
                            <Link href="/login">Login</Link>
                        </Button>
                        <Button asChild>
                            <Link href="/register">Sign Up</Link>
                        </Button>
                    </>
                )}
                <ThemeToggle />
            </div>
        </header>
    );
};
