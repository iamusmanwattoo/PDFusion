
export default function PrivacyPolicyPage() {
  return (
    <div className="flex flex-col flex-grow bg-background">
      <main className="flex-grow container mx-auto px-4">
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
    </div>
  );
}
