// backend/index.ts - FINAL VERSION
import express from 'express';
import type { Request, Response } from 'express';
import puppeteer from 'puppeteer-extra';
import StealthPlugin from 'puppeteer-extra-plugin-stealth';

// Apply the stealth plugin to make Puppeteer appear more human
puppeteer.use(StealthPlugin());

const app = express();
const PORT = 3000;

app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
    next();
});

interface Product {
    title: string;
    rating: string;
    reviews: string;
    imageUrl: string;
    productUrl: string;
}

app.get('/api/scrape', async (req: Request, res: Response) => {
    const { keyword } = req.query;
    if (!keyword || typeof keyword !== 'string') return res.status(400).json({ error: 'Keyword is required.' });

    console.log(`Scraping with Puppeteer-Stealth for keyword: ${keyword}`);
    let browser = null;

    try {
        browser = await puppeteer.launch({
            headless: true, // Set to true for normal, fast operation
            args: ['--no-sandbox', '--disable-setuid-sandbox'],
        });
        
        const page = await browser.newPage();
        await page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/108.0.0.0 Safari/537.36');
        
        const amazonUrl = `https://www.amazon.com/s?k=${encodeURIComponent(keyword)}`;
        await page.goto(amazonUrl, { waitUntil: 'networkidle2' });

        await page.waitForSelector('div[data-component-type="s-search-result"]', { timeout: 15000 });

        await page.addScriptTag({
            content: `
                const productElements = document.querySelectorAll('div[data-component-type="s-search-result"]');
                const scrapedProducts = [];
                productElements.forEach(element => {
                    // --- Using the selectors you found ---

                    // Title selector from your screenshot
                    const titleElement = element.querySelector('h2.a-size-medium.a-spacing-none.a-color-base.a-text-normal');
                    const title = titleElement?.textContent?.trim() ?? '';
                    if (!title) return; // Skip if no title

                    // Selector for the rating text (e.g., "4.5 out of 5 stars")
                    const ratingElement = element.querySelector('span.a-icon-alt');
                    const rating = ratingElement?.textContent?.trim() ?? 'No rating';
                    
                    // Reviews selector from your screenshot
                    const reviewsElement = element.querySelector('span.a-size-base.s-underline-text');
                    const reviews = reviewsElement?.textContent?.trim() ?? 'No reviews';

                    // Image selector confirmed earlier
                    const imageElement = element.querySelector('img.s-image');
                    const imageUrl = imageElement?.getAttribute('src') ?? '';
                    
                    // Link selector for the main product link
                    const linkElement = element.querySelector('a.a-link-normal.s-no-outline');
                    const productUrlPath = linkElement?.getAttribute('href') ?? '';
                    const productUrl = productUrlPath ? 'https://www.amazon.com' + productUrlPath : '';

                    if (title && imageUrl && productUrl) {
                        scrapedProducts.push({ title, rating, reviews, imageUrl, productUrl });
                    }
                });
                window.__SCRAPED_DATA__ = scrapedProducts;
            `,
        });

        await page.waitForFunction('window.__SCRAPED_DATA__');
        const products = await page.evaluate(() => (window as any).__SCRAPED_DATA__);
        
        if (products.length === 0) {
            console.warn("⚠️ Scraper finished but found 0 products. A selector might still need a small adjustment.");
        }
        
        console.log(`✅ Successfully scraped ${products.length} products.`);
        res.json(products);

    } catch (error) {
        console.error("❌ An error occurred during Puppeteer scraping:", error);
        res.status(500).json({ error: 'Failed to scrape the website.' });
    } finally {
        if (browser) {
            await browser.close();
        }
    }
});

app.listen(PORT, () => {
    console.log(`✅ Backend server with Puppeteer is listening on http://localhost:${PORT}`);
});