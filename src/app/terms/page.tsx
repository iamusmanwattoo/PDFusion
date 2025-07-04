
export default function TermsOfServicePage() {
  return (
    <div className="flex flex-col min-h-screen bg-background pt-16">
      <main className="flex-grow pt-16 container mx-auto px-4">
        <article className="prose dark:prose-invert max-w-4xl mx-auto">
          <h1>Terms of Service</h1>
          <p>Last updated: {new Date().toLocaleDateString()}</p>
          <p>This is a placeholder for your Terms of Service. Replace this text with your actual terms.</p>
          <p>By accessing the website at PDFusion, you are agreeing to be bound by these terms of service, all applicable laws and regulations, and agree that you are responsible for compliance with any applicable local laws.</p>
          <h2>1. Use License</h2>
          <p>Permission is granted to temporarily download one copy of the materials (information or software) on PDFusion's website for personal, non-commercial transitory viewing only. This is the grant of a license, not a transfer of title.</p>
          <h2>2. Disclaimer</h2>
          <p>The materials on PDFusion's website are provided on an 'as is' basis. PDFusion makes no warranties, expressed or implied, and hereby disclaims and negates all other warranties including, without limitation, implied warranties or conditions of merchantability, fitness for a particular purpose, or non-infringement of intellectual property or other violation of rights.</p>
          <h2>3. Limitations</h2>
          <p>In no event shall PDFusion or its suppliers be liable for any damages (including, without limitation, damages for loss of data or profit, or due to business interruption) arising out of the use or inability to use the materials on PDFusion's website.</p>
        </article>
      </main>
    </div>
  );
}
