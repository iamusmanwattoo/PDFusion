import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Check } from 'lucide-react';
import { Header } from '@/components/header';
import { Footer } from '@/components/footer';
  
export default function PricingPage() {
  return (
    <div className="flex flex-col min-h-screen bg-background">
      <Header />
      <main className="flex-grow pt-32">
        <section className="text-center">
          <div className="container mx-auto px-4">
            <h1 className="text-5xl font-extrabold text-foreground">
              Simple, Transparent Pricing
            </h1>
            <p className="mt-4 text-lg text-muted-foreground max-w-2xl mx-auto">
              Choose the plan that's right for you.
            </p>
          </div>
        </section>

        <section className="py-16">
          <div className="container mx-auto px-4 grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl">
            <Card className="flex flex-col">
              <CardHeader>
                <CardTitle>Free</CardTitle>
                <CardDescription>Perfect for occasional use. Get started right away.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4 flex-grow">
                <div className="text-4xl font-bold">$0<span className="text-lg font-normal text-muted-foreground">/month</span></div>
                <ul className="space-y-2 text-sm text-left">
                  <li className="flex items-center"><Check className="h-4 w-4 mr-2 text-primary flex-shrink-0" /> Up to 10 files per merge</li>
                  <li className="flex items-center"><Check className="h-4 w-4 mr-2 text-primary flex-shrink-0" /> Up to 25MB per file</li>
                  <li className="flex items-center"><Check className="h-4 w-4 mr-2 text-primary flex-shrink-0" /> No file history</li>
                  <li className="flex items-center"><Check className="h-4 w-4 mr-2 text-primary flex-shrink-0" /> Community support</li>
                </ul>
              </CardContent>
              <CardFooter>
                <Button className="w-full" asChild>
                    <Link href="/#merger">Start Free</Link>
                </Button>
              </CardFooter>
            </Card>

            <Card className="border-primary shadow-lg flex flex-col">
              <CardHeader>
                <CardTitle>Pro</CardTitle>
                <CardDescription>For heavy users who need more power and features.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4 flex-grow">
                <div className="text-4xl font-bold">$5<span className="text-lg font-normal text-muted-foreground">/month</span></div>
                <ul className="space-y-2 text-sm text-left">
                  <li className="flex items-center"><Check className="h-4 w-4 mr-2 text-primary flex-shrink-0" /> Up to 50 files per merge</li>
                  <li className="flex items-center"><Check className="h-4 w-4 mr-2 text-primary flex-shrink-0" /> Up to 100MB per file</li>
                  <li className="flex items-center"><Check className="h-4 w-4 mr-2 text-primary flex-shrink-0" /> Merge history</li>
                  <li className="flex items-center"><Check className="h-4 w-4 mr-2 text-primary flex-shrink-0" /> Fast merging queue</li>
                  <li className="flex items-center"><Check className="h-4 w-4 mr-2 text-primary flex-shrink-0" /> Priority support</li>
                </ul>
              </CardContent>
              <CardFooter>
                <Button className="w-full">Upgrade to Pro</Button>
              </CardFooter>
            </Card>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
