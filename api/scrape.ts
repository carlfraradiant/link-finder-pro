import { VercelRequest, VercelResponse } from '@vercel/node';
import chromium from 'chrome-aws-lambda';
import puppeteer from 'puppeteer-core';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') {
    res.status(405).json({ error: 'Method not allowed' });
    return;
  }

  const { url } = req.body;

  if (!url) {
    res.status(400).json({ error: 'URL is required' });
    return;
  }

  let browser = null;
  try {
    browser = await puppeteer.launch({
      args: chromium.args,
      defaultViewport: chromium.defaultViewport,
      executablePath: await chromium.executablePath,
      headless: chromium.headless,
    });

    const page = await browser.newPage();
    await page.goto(url, { waitUntil: 'networkidle0' });

    const links = await page.evaluate(() => {
      const anchors = Array.from(document.getElementsByTagName('a'));
      return anchors.map(anchor => ({
        href: anchor.href,
        text: anchor.textContent?.trim() || '',
        title: anchor.title || ''
      })).filter(link => link.href && link.href.startsWith('http'));
    });

    await browser.close();

    res.status(200).json({
      success: true,
      url,
      links,
      totalLinks: links.length
    });
  } catch (error) {
    if (browser) await browser.close();
    res.status(500).json({ error: 'Failed to scrape the URL' });
  }
} 