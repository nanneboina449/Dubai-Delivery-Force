import puppeteer from 'puppeteer';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

async function generatePDF() {
  console.log('Launching browser...');
  
  const browser = await puppeteer.launch({
    headless: 'new',
    executablePath: '/nix/store/zi4f80l169xlmivz8vja8wlphq74qqk0-chromium-125.0.6422.141/bin/chromium',
    args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-gpu']
  });
  
  const page = await browser.newPage();
  
  await page.setViewport({ width: 1440, height: 900 });
  
  console.log('Loading webpage...');
  await page.goto('http://localhost:5000', {
    waitUntil: 'networkidle2',
    timeout: 60000
  });
  
  await new Promise(resolve => setTimeout(resolve, 3000));
  
  const outputPath = path.join(path.dirname(__dirname), 'urbanfleet-website.pdf');
  
  console.log('Generating PDF...');
  await page.pdf({
    path: outputPath,
    format: 'A4',
    printBackground: true,
    margin: {
      top: '20px',
      right: '20px',
      bottom: '20px',
      left: '20px'
    }
  });
  
  console.log(`PDF saved to: ${outputPath}`);
  
  await browser.close();
}

generatePDF().catch(console.error);
