# Link Finder Pro

A Next.js API that uses Puppeteer to scrape links from any given URL.

## Features

- Scrapes all links from a given URL
- Returns link text, href, and title attributes
- Headless browser implementation
- Ready to deploy on Vercel

## API Usage

Send a POST request to `/api/scrape` with the following JSON body:

```json
{
  "url": "https://example.com"
}
```

### Response Format

```json
{
  "success": true,
  "url": "https://example.com",
  "links": [
    {
      "href": "https://example.com/page1",
      "text": "Page 1",
      "title": "Link to Page 1"
    },
    // ... more links
  ],
  "totalLinks": 10
}
```

## Development

1. Install dependencies:
```bash
npm install
```

2. Run the development server:
```bash
npm run dev
```

3. The API will be available at `http://localhost:3000/api/scrape`

## Deployment

This project is configured for deployment on Vercel. Simply connect your GitHub repository to Vercel and it will automatically deploy.

## Environment Variables

No environment variables are required for basic functionality.

## Error Handling

The API returns appropriate error responses:
- 400: Missing URL
- 500: Scraping failed 