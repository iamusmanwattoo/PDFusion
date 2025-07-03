'use client';

import { useState } from 'react';
import type { PdfPreflightCheckOutput } from '@/ai/flows/pdf-preflight-check';
import { pdfPreflightCheck } from '@/ai/flows/pdf-preflight-check';
import { useToast } from "@/hooks/use-toast";
import { PdfUploader } from '@/components/pdf-uploader';
import { FileList } from '@/components/file-list';
import { MergeButton } from '@/components/merge-button';

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

export default function Home() {
  const [files, setFiles] = useState<FileWithStatus[]>([]);
  const { toast } = useToast();

  const handleFilesSelected = async (selectedFiles: File[]) => {
    const newFilesWithStatus: FileWithStatus[] = selectedFiles
      .filter(file => file.type === 'application/pdf')
      .filter(file => !files.some(existing => existing.id === `${file.name}-${file.lastModified}`))
      .map(file => ({
        file,
        id: `${file.name}-${file.lastModified}`,
        status: 'checking',
      }));

    if (newFilesWithStatus.length === 0 && selectedFiles.length > 0) {
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
  
  const handleMerge = () => {
    // Actual merge logic is not required for this task.
    toast({
      title: "Merge Initiated!",
      description: "Your files would be merged now. (This is a demo)",
    });
    // Optional: clear files after "merging"
    // setFiles([]);
  };

  return (
    <main className="flex min-h-screen w-full flex-col items-center justify-center bg-background p-4 sm:p-8">
      <div className="w-full max-w-3xl mx-auto">
        <header className="text-center mb-8">
          <h1 className="text-4xl sm:text-5xl font-bold text-foreground mb-2 font-headline">
            PDFusion
          </h1>
          <p className="text-lg text-muted-foreground">
            Merge Your PDFs Instantly
          </p>
        </header>

        <div className="space-y-6">
          <PdfUploader onFilesSelected={handleFilesSelected} />
          {files.length > 0 && (
            <>
              <FileList files={files} onRemoveFile={handleRemoveFile} />
              <MergeButton files={files} onMerge={handleMerge} />
            </>
          )}
        </div>
      </div>
    </main>
  );
}
