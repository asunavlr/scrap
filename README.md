📦 Amazon Product ScraperA web application to scrape product listings from Amazon search results. This project uses a powerful backend with Puppeteer and a stealth plugin to bypass bot detection and CAPTCHAs, and a clean frontend built with Vite to display the results.Disclaimer: This tool is for educational purposes only. Web scraping may be against the terms of service of some websites. Please use this project responsibly.Technology StackBackend:Bun (Runtime)Express (Web Server)Puppeteer (Headless Browser Control)puppeteer-extra & puppeteer-extra-plugin-stealth (To avoid bot detection)Frontend:Vite (Build Tool)HTML5CSS3Vanilla TypeScriptPrerequisitesBefore you begin, ensure you have Bun installed on your machine.Setup & InstallationYou need to install dependencies for both the backend and frontend directories.Clone the repository or create the project structure.Install Backend Dependencies:Open a terminal, navigate to the backend folder, and run:cd backend
bun install
Install Frontend Dependencies:Open another terminal, navigate to the frontend folder, and run:cd ../frontend
bun install
How to Run the ApplicationThe backend server and the frontend development server must be running at the same time in two separate terminals.1. Start the Backend ServerIn your first terminal (inside the backend folder):bun run index.ts
The server will start and listen on http://localhost:3000.2. Start the Frontend ServerIn your second terminal (inside the frontend folder):bun run dev
The frontend will be accessible at http://localhost:5173 (or another port if 5173 is in use).3. Use the ScraperOpen your web browser and navigate to the frontend URL (e.g., http://localhost:5173). Enter a keyword and click the "Scrape Products" button to see the results.⚠️ Important: Troubleshooting & MaintenanceWeb scraping is a constant cat-and-mouse game. Amazon frequently changes its website's HTML structure, which will break the scraper.If the scraper returns 0 products or fails with a timeout error, it means the CSS selectors are outdated.You will need to find the new selectors yourself.How to Find New SelectorsEnable Debug Mode: In backend/index.ts, change the Puppeteer launch options:browser = await puppeteer.launch({
    headless: false,  // See the browser
    devtools: true,   // Open the DevTools
    // ...
});
Run the Backend: This will open a visible browser window with the DevTools panel.Test in Console: In the DevTools "Console" tab, test new selectors until you find the correct ones. For example:// Test this in the browser console, not your code editor
document.querySelectorAll('h2.a-size-medium.a-color-base')
Update the Code: Once you find the working selectors, stop the server, paste them into the addScriptTag block in backend/index.ts, set headless: true again, and restart the server.API EndpointGET /api/scrapeInitiates the scraping process for a given keyword.Query Parameter: keyword (string, required) - The search term for Amazon.Success Response (200 OK): Returns a JSON array of product objects.[
  {
    "title": "Razer Viper V2 Pro (White Edition) Gaming Mouse...",
    "rating": "4.5 out of 5 stars",
    "reviews": "4,407",
    "imageUrl": "https://m.media-amazon.com/...",
    "productUrl": "https://www.amazon.com/..."
  }
]
Error Response (400/500): Returns a JSON object with an error message.{
  "error": "Error message details."
}
