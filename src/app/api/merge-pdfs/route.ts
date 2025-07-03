import { NextRequest, NextResponse } from 'next/server';
import { PDFDocument } from 'pdf-lib';

const MAX_FILE_SIZE = 25 * 1024 * 1024; // 25MB
const MAX_FILES = 10;

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const files = formData.getAll('files') as File[];

    if (!files || files.length === 0) {
      return NextResponse.json({ error: 'No files were uploaded.' }, { status: 400 });
    }

    if (files.length > MAX_FILES) {
      return NextResponse.json({ error: `You can upload a maximum of ${MAX_FILES} files.` }, { status: 400 });
    }

    const mergedPdf = await PDFDocument.create();

    for (const file of files) {
      if (file.type !== 'application/pdf') {
        return NextResponse.json({ error: `File '${file.name}' is not a PDF.` }, { status: 400 });
      }

      if (file.size > MAX_FILE_SIZE) {
        return NextResponse.json({ error: `File '${file.name}' exceeds the 25MB size limit.` }, { status: 400 });
      }

      try {
        const pdfBytes = await file.arrayBuffer();
        const pdfDoc = await PDFDocument.load(pdfBytes);
        const copiedPages = await mergedPdf.copyPages(pdfDoc, pdfDoc.getPageIndices());
        copiedPages.forEach((page) => mergedPdf.addPage(page));
      } catch (e) {
        console.error(`Error processing file ${file.name}:`, e);
        return NextResponse.json({ error: `Could not process file '${file.name}'. It might be corrupted or password-protected.` }, { status: 400 });
      }
    }

    const mergedPdfBytes = await mergedPdf.save();

    return new NextResponse(mergedPdfBytes, {
      status: 200,
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': 'attachment; filename="merged.pdf"',
      },
    });

  } catch (error: any) {
    console.error('Merge API Error:', error);
    if (error instanceof TypeError && error.message.includes('Could not parse content as FormData')) {
        return NextResponse.json({ error: 'Invalid request format. Expected multipart/form-data.' }, { status: 400 });
    }
    return NextResponse.json({ error: 'An unexpected error occurred while processing your request.' }, { status: 500 });
  }
}
