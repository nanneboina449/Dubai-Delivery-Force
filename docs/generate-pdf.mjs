import { mdToPdf } from 'md-to-pdf';
import { join } from 'path';

const inputFile = join(process.cwd(), 'UrbanFleet_App_Specification.md');

async function generatePdf() {
  try {
    const pdf = await mdToPdf(
      { path: inputFile },
      {
        launch_options: {
          executablePath: '/nix/store/zi4f80l169xlmivz8vja8wlphq74qqk0-chromium-125.0.6422.141/bin/chromium',
          args: ['--no-sandbox', '--disable-setuid-sandbox']
        },
        pdf_options: {
          format: 'A4',
          margin: { top: '20mm', right: '20mm', bottom: '20mm', left: '20mm' }
        },
        stylesheet: 'https://cdnjs.cloudflare.com/ajax/libs/github-markdown-css/5.2.0/github-markdown.min.css'
      }
    );

    if (pdf) {
      const fs = await import('fs');
      fs.writeFileSync('UrbanFleet_App_Specification.pdf', pdf.content);
      console.log('PDF generated successfully!');
    }
  } catch (error) {
    console.error('Error generating PDF:', error);
  }
}

generatePdf();
