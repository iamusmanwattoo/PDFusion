import Link from 'next/link';
import { Button } from '@/components/ui/button';

const Header = () => (
    <header className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between p-4 px-8 bg-background/80 backdrop-blur-sm border-b">
      <Link href="/" className="text-2xl font-bold text-foreground">
        PDFusion
      </Link>
      <nav className="hidden md:flex items-center gap-6">
        <Link href="/pricing" className="text-sm font-medium text-muted-foreground hover:text-foreground">
          Pricing
        </Link>
      </nav>
      <Button asChild>
        <Link href="/#merger">Get Started</Link>
      </Button>
    </header>
);
  
const Footer = () => (
  <footer className="w-full py-8 mt-16 border-t bg-background">
    <div className="container mx-auto flex flex-col md:flex-row justify-between items-center text-center md:text-left">
      <p className="text-sm text-muted-foreground">&copy; {new Date().getFullYear()} PDFusion. All rights reserved.</p>
      <div className="flex gap-4 mt-4 md:mt-0">
        <Link href="/privacy" className="text-sm text-foreground hover:text-muted-foreground">
          Privacy Policy
        </Link>
        <Link href="/terms" className="text-sm text-muted-foreground hover:text-foreground">
          Terms of Service
        </Link>
      </div>
    </div>
  </footer>
);

export default function PrivacyPolicyPage() {
  return (
    <div className="flex flex-col min-h-screen bg-background">
      <Header />
      <main className="flex-grow pt-32 container mx-auto px-4">
        <article className="prose dark:prose-invert max-w-4xl mx-auto">
          <h1>Privacy Policy</h1>
          <p>Last updated: {new Date().toLocaleDateString()}</p>
          <p>This is a placeholder for your Privacy Policy. Replace this text with your actual policy.</p>
          <p>Your privacy is important to us. It is PDFusion's policy to respect your privacy regarding any information we may collect from you across our website, and other sites we own and operate.</p>
          <h2>Information We Collect</h2>
          <p>We only ask for personal information when we truly need it to provide a service to you. We collect it by fair and lawful means, with your knowledge and consent. We also let you know why we’re collecting it and how it will be used.</p>
          <h2>Security</h2>
          <p>Since this is a demo application, we want to be clear: all PDF processing happens locally in your browser. Your files are not uploaded to our servers for the merging process. We do not store your files.</p>
          <h2>Contact Us</h2>
          <p>If you have any questions about how we handle user data and personal information, feel free to contact us.</p>
        </article>
      </main>
      <Footer />
    </div>
  );
}
