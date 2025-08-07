import './style.css';

// DOM element references
const keywordInput = document.getElementById('keyword-input') as HTMLInputElement;
const scrapeButton = document.getElementById('scrape-button') as HTMLButtonElement;
const statusMessage = document.getElementById('status-message') as HTMLDivElement;
const resultsContainer = document.getElementById('results-container') as HTMLDivElement;

// Backend API URL
const API_URL = 'http://localhost:3000/api/scrape';

// Event listener for the scrape button
scrapeButton.addEventListener('click', async () => {
    const keyword = keywordInput.value.trim();

    // 1. Validate input
    if (!keyword) {
        statusMessage.textContent = 'Please enter a keyword.';
        statusMessage.style.color = '#ff6b6b';
        return;
    }

    // 2. Update UI to show loading state
    statusMessage.textContent = `Scraping Amazon for "${keyword}"... ⏳`;
    statusMessage.style.color = '#a0a0a0';
    scrapeButton.disabled = true;
    resultsContainer.innerHTML = ''; // Clear previous results

    try {
        // 3. Make the API call to the backend
        const response = await fetch(`${API_URL}?keyword=${encodeURIComponent(keyword)}`);

        // Check for HTTP errors
        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.error || `HTTP error! Status: ${response.status}`);
        }

        const products = await response.json();

        // 4. Update UI with results or "not found" message
        statusMessage.textContent = ''; // Clear status message
        if (products.length === 0) {
            statusMessage.textContent = 'No products found for this keyword.';
            statusMessage.style.color = '#ffcc00';
        } else {
            displayProducts(products);
        }

    } catch (error) {
        // 5. Handle errors gracefully
        console.error('Fetch error:', error);
        statusMessage.textContent = `Error: ${error instanceof Error ? error.message : 'An unknown error occurred.'}`;
        statusMessage.style.color = '#ff6b6b';
    } finally {
        // 6. Re-enable the button
        scrapeButton.disabled = false;
    }
});

// Function to display products on the page
function displayProducts(products: any[]) {
    products.forEach(product => {
        const card = document.createElement('div');
        card.className = 'product-card';

        // Use a placeholder if image is missing
        const image = product.imageUrl ? `<img src="${product.imageUrl}" alt="${product.title}">` : '<div class="img-placeholder">No Image</div>';

        card.innerHTML = `
            ${image}
            <h3>${product.title}</h3>
            <div class="rating-info">
                <p class="star">⭐</p>
                <p>${product.rating}</p>
            </div>
            <p>Reviews: ${product.reviews}</p>
        `;
        resultsContainer.appendChild(card);
    });
}