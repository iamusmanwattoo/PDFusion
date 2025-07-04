'use client';

import { useState, useRef } from 'react';
import type { PdfPreflightCheckOutput } from '@/ai/flows/pdf-preflight-check';
import { pdfPreflightCheck } from '@/ai/flows/pdf-preflight-check';
import { useToast } from "@/hooks/use-toast";
import { PdfUploader } from '@/components/pdf-uploader';
import { FileList } from '@/components/file-list';
import { MergeButton } from '@/components/merge-button';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { ArrowRight, Zap, ShieldCheck } from 'lucide-react';
import { Header } from '@/components/header';
import { Footer } from '@/components/footer';

export type FileWithStatus = {
  file: File;
  id: string;
  status: 'checking' | 'viable' | 'error';
  preflight?: PdfPreflightCheckOutput;
};

const fileToDataUri = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
};

const MAX_FILES = 10;
const MAX_FILE_SIZE_BYTES = 25 * 1024 * 1024; // 25MB

export default function Home() {
  const [files, setFiles] = useState<FileWithStatus[]>([]);
  const [isMerging, setIsMerging] = useState(false);
  const { toast } = useToast();
  const mergerRef = useRef<HTMLDivElement>(null);

  const handleScrollToMerger = () => {
    mergerRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleFilesSelected = async (selectedFiles: File[]) => {
    if (files.length + selectedFiles.length > MAX_FILES) {
      toast({
        variant: 'destructive',
        title: `❌ Max file limit reached (${MAX_FILES} PDFs).`,
        description: `You can add ${MAX_FILES - files.length} more file(s).`,
      });
      return;
    }

    const validSizeFiles: File[] = [];
    selectedFiles.forEach(file => {
      if (file.size > MAX_FILE_SIZE_BYTES) {
        toast({
          variant: 'destructive',
          title: `❌ File too large: ${file.name}`,
          description: 'Max size is 25MB.',
        });
      } else {
        validSizeFiles.push(file);
      }
    });

    if (validSizeFiles.length === 0) {
      return;
    }
    
    const newFilesWithStatus: FileWithStatus[] = validSizeFiles
      .filter(file => file.type === 'application/pdf')
      .filter(file => !files.some(existing => existing.id === `${file.name}-${file.lastModified}`))
      .map(file => ({
        file,
        id: `${file.name}-${file.lastModified}`,
        status: 'checking',
      }));

    if (newFilesWithStatus.length === 0 && validSizeFiles.length > 0) {
      toast({
        variant: 'destructive',
        title: 'Duplicate or Invalid Files',
        description: 'Some files were duplicates or not PDFs and were not added.',
      });
      return;
    }
    
    setFiles(prev => [...prev, ...newFilesWithStatus]);

    for (const newFile of newFilesWithStatus) {
      try {
        const pdfDataUri = await fileToDataUri(newFile.file);
        const result = await pdfPreflightCheck({
          pdfDataUri,
          filename: newFile.file.name,
        });
        
        setFiles(prev => prev.map(f => f.id === newFile.id ? {
          ...f,
          status: result.isViable ? 'viable' : 'error',
          preflight: result,
        } : f));

      } catch (error) {
        console.error('Preflight check failed:', error);
        setFiles(prev => prev.map(f => f.id === newFile.id ? {
          ...f,
          status: 'error',
          preflight: {
            isViable: false,
            issue: 'File processing error',
            suggestion: 'Could not read or process the file. Please try a different file.'
          }
        } : f));
        toast({
          variant: "destructive",
          title: "Error checking file",
          description: `Could not process ${newFile.file.name}.`,
        });
      }
    }
  };

  const handleRemoveFile = (idToRemove: string) => {
    setFiles(prev => prev.filter(f => f.id !== idToRemove));
  };
  
  const handleMerge = async () => {
    const viableFiles = files.filter(f => f.status === 'viable');
    if (viableFiles.length < 2) {
      toast({
        variant: 'destructive',
        title: 'Not enough files',
        description: 'You need at least two viable PDF files to merge.',
      });
      return;
    }
    
    setIsMerging(true);

    const formData = new FormData();
    viableFiles.forEach(fileWithStatus => {
      formData.append('files', fileWithStatus.file);
    });

    try {
      const response = await fetch('/api/merge-pdfs', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to merge PDFs');
      }

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'merged.pdf';
      document.body.appendChild(a);
      a.click();
      a.remove();
      window.URL.revokeObjectURL(url);
      
      toast({
        title: "Merge Successful!",
        description: "Your merged PDF has been downloaded.",
      });

      setFiles([]);

    } catch (error: any) {
      toast({
        variant: 'destructive',
        title: 'Merge Failed',
        description: error.message || 'An unexpected error occurred.',
      });
    } finally {
      setIsMerging(false);
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-background">
      <Header />
      <main className="flex-grow pt-16">
        <section className="pt-20 pb-20 text-center">
            <div className="container mx-auto px-4">
                <h1 className="text-5xl md:text-6xl font-extrabold text-foreground">
                    PDFusion
                </h1>
                <p className="mt-4 text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto">
                    Merge your PDFs instantly and securely.
                </p>
                <div className="mt-8 flex justify-center gap-4">
                    <Button size="lg" onClick={handleScrollToMerger}>
                        Try for Free
                        <ArrowRight className="ml-2 h-5 w-5" />
                    </Button>
                    <Button size="lg" variant="outline" asChild>
                        <Link href="/pricing">View Pricing</Link>
                    </Button>
                </div>
            </div>
        </section>
        
        <section id="merger" ref={mergerRef} className="py-16 sm:py-24 bg-muted/20">
            <div className="w-full max-w-3xl mx-auto px-4">
                 <div className="space-y-6">
                    <PdfUploader onFilesSelected={handleFilesSelected} />
                    {files.length > 0 && (
                        <>
                        <FileList files={files} onRemoveFile={handleRemoveFile} />
                        <MergeButton files={files} onMerge={handleMerge} isMerging={isMerging} />
                        </>
                    )}
                </div>
            </div>
        </section>

        <section className="py-20">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl font-bold text-center mb-12">Why PDFusion?</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 text-center">
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
                <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-primary mb-4"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>
                <h3 className="text-xl font-semibold mb-2">No Sign Up Required</h3>
                <p className="text-muted-foreground">Merge files instantly without creating an account.</p>
              </div>
              <div className="flex flex-col items-center p-6">
                 <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-primary mb-4"><rect width="14" height="20" x="5" y="2" rx="2" ry="2"/><path d="M12 18h.01"/></svg>
                <h3 className="text-xl font-semibold mb-2">Cross-Device</h3>
                <p className="text-muted-foreground">Works on your desktop, tablet, and phone.</p>
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
