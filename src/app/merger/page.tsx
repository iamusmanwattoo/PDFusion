'use client';

import { useState } from 'react';
import type { PdfPreflightCheckOutput } from '@/ai/flows/pdf-preflight-check';
import { pdfPreflightCheck } from '@/ai/flows/pdf-preflight-check';
import { useToast } from "@/hooks/use-toast";
import { PdfUploader } from '@/components/pdf-uploader';
import { FileList } from '@/components/file-list';
import { MergeButton } from '@/components/merge-button';
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

export default function MergerPage() {
  const [files, setFiles] = useState<FileWithStatus[]>([]);
  const [isMerging, setIsMerging] = useState(false);
  const { toast } = useToast();

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
        <section id="merger" className="py-16 sm:py-24">
            <div className="w-full max-w-3xl mx-auto px-4">
                 <div className="space-y-6">
                    <h1 className="text-4xl md:text-5xl font-extrabold text-foreground text-center mb-2">Merge PDFs</h1>
                    <p className="text-center text-muted-foreground mb-8">
                        Upload your files, reorder them if needed, and merge them into a single PDF.
                    </p>
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
      </main>
      <Footer />
    </div>
  );
}
