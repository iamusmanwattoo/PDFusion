import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { ArrowRight, Zap, ShieldCheck } from 'lucide-react';

export default function Home() {
  return (
    <div className="flex flex-col flex-grow bg-background">
        <section className="pt-20 pb-20 text-center">
            <div className="container mx-auto px-4">
                <h1 className="text-5xl md:text-6xl font-extrabold text-foreground">
                    PDFusion
                </h1>
                <p className="mt-4 text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto">
                    Merge your PDFs instantly and securely.
                </p>
                <div className="mt-8 flex justify-center gap-4">
                    <Button size="lg" asChild>
                        <Link href="/merger">
                          Try for Free
                          <ArrowRight className="ml-2 h-5 w-5" />
                        </Link>
                    </Button>
                    <Button size="lg" variant="outline" asChild>
                        <Link href="/pricing">View Pricing</Link>
                    </Button>
                </div>
            </div>
        </section>
        
        <section className="py-20 bg-muted/20">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl font-bold text-center mb-12">Why PDFusion?</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
              <div className="flex flex-col items-center p-6">
                <Zap className="h-10 w-10 text-primary mb-4" />
                <h3 className="text-xl font-semibold mb-2">Blazing Fast</h3>
                <p className="text-muted-foreground">Your files are merged in seconds, right in your browser.</p>
              </div>
              <div className="flex flex-col items-center p-6">
                <ShieldCheck className="h-10 w-10 text-primary mb-4" />
                <h3 className="text-xl font-semibold mb-2">Secure & Private</h3>
                <p className="text-muted-foreground">We never see your files. Everything is processed on your device.</p>
              </div>
              <div className="flex flex-col items-center p-6">
                 <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-primary mb-4"><rect width="14" height="20" x="5" y="2" rx="2" ry="2"/><path d="M12 18h.01"/></svg>
                <h3 className="text-xl font-semibold mb-2">Cross-Device</h3>
                <p className="text-muted-foreground">Works on your desktop, tablet, and phone.</p>
              </div>
            </div>
          </div>
        </section>
    </div>
  );
}
