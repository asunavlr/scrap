# 📦 Amazon Product Scraper

A web application to scrape product listings from Amazon search results. This project uses a powerful backend with Puppeteer and a stealth plugin to bypass bot detection and CAPTCHAs, and a clean frontend built with Vite to display the results.

**Disclaimer:** This tool is for educational purposes only. Web scraping may be against the terms of service of some websites. Please use this project responsibly.

---

## Technology Stack

* **Backend**:
    * [Bun](https://bun.sh/) (Runtime)
    * [Express](https://expressjs.com/) (Web Server)
    * [Puppeteer](https://pptr.dev/) (Headless Browser Control)
    * `puppeteer-extra` & `puppeteer-extra-plugin-stealth` (To avoid bot detection)
* **Frontend**:
    * [Vite](https://vitejs.dev/) (Build Tool)
    * HTML5
    * CSS3
    * Vanilla TypeScript

---

## Prerequisites

Before you begin, ensure you have [Bun](https://bun.sh/docs/installation) installed on your machine.

---

## Setup & Installation

You need to install dependencies for both the `backend` and `frontend` directories.

1.  **Clone the repository** or create the project structure.

2.  **Install Backend Dependencies:**
    Open a terminal, navigate to the `backend` folder, and run:
    ```bash
    cd backend
    bun install
    ```

3.  **Install Frontend Dependencies:**
    Open another terminal, navigate to the `frontend` folder, and run:
    ```bash
    cd ../frontend
    bun install
    ```

---

## How to Run the Application

The backend server and the frontend development server must be running at the same time in two separate terminals.

**1. Start the Backend Server**

In your first terminal (inside the `backend` folder):
```bash
bun run index.ts
