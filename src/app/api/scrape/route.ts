import { NextResponse } from 'next/server';
import chromium from 'chrome-aws-lambda';
import puppeteer from 'puppeteer-core';

export async function POST(request: Request) {
  try {
    const { url } = await request.json();

    if (!url) {
      return NextResponse.json(
        { error: 'URL is required' },
        { status: 400 }
      );
    }

    // Launch browser
    const browser = await puppeteer.launch({
      args: chromium.args,
      defaultViewport: chromium.defaultViewport,
      executablePath: await chromium.executablePath,
      headless: chromium.headless,
    });

    try {
      const page = await browser.newPage();
      await page.goto(url, { waitUntil: 'networkidle0' });

      // Extract all links
      const links = await page.evaluate(() => {
        const anchors = Array.from(document.getElementsByTagName('a'));
        return anchors.map(anchor => ({
          href: anchor.href,
          text: anchor.textContent?.trim() || '',
          title: anchor.title || ''
        })).filter(link => link.href && link.href.startsWith('http'));
      });

      await browser.close();

      return NextResponse.json({
        success: true,
        url,
        links,
        totalLinks: links.length
      });

    } catch (error) {
      await browser.close();
      throw error;
    }

  } catch (error) {
    console.error('Scraping error:', error);
    return NextResponse.json(
      { error: 'Failed to scrape the URL' },
      { status: 500 }
    );
  }
} 