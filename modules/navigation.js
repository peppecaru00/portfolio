
// Store scroll positions for each page
const scrollPositions = {
    'home': 0,
    'photos': 0,
    'stills': 0,
    'me': 0
};

export function setupNavigation() {
    // Wait for Alpine.js to be ready and navigation buttons to be loaded
    setTimeout(() => {
        // Find navigation buttons by their classes and content
        const navButtons = document.querySelectorAll('.nav-button, .logo-button');
        
        console.log('Found navigation buttons:', navButtons.length);
        
        navButtons.forEach(button => {
            button.addEventListener('click', (e) => {
                const buttonText = button.textContent || 'logo';
                console.log('Navigation button clicked:', buttonText);
                
                // Save current scroll position before switching pages
                saveCurrentScrollPosition();
                
                // Small delay to let Alpine.js update first, then restore scroll for new page
                setTimeout(() => {
                    const newPage = determinePageFromButton(button);
                    console.log('Switching to page:', newPage);
                    restoreScrollPosition(newPage);
                }, 100);
            });
        });
        
        // Also save scroll position when user scrolls
        window.addEventListener('scroll', debounce(() => {
            saveCurrentScrollPosition();
        }, 100));
        
    }, 1000); // Wait for components to load
}

// Helper function to determine which page a button navigates to
function determinePageFromButton(button) {
    const buttonText = (button.textContent || '').toLowerCase().trim();
    const buttonClass = button.className || '';
    
    if (buttonClass.includes('logo-button') || buttonText.includes('logo')) {
        return 'home'; // Logo now goes to home page
    }
    
    if (buttonText.includes('home')) return 'home';
    if (buttonText.includes('photo')) return 'photos';
    if (buttonText.includes('still')) return 'stills';
    if (buttonText.includes('me') || buttonText.includes('about')) return 'me';
    
    // Default fallback
    return 'home';
}

// Save the current scroll position for the current page
function saveCurrentScrollPosition() {
    // Get current page from Alpine.js data on HTML element
    let currentPage = 'home'; // default to home now
    
    try {
        // Access Alpine.js data directly from the html element
        const htmlEl = document.querySelector('html');
        if (htmlEl && htmlEl.__x && htmlEl.__x.$data && htmlEl.__x.$data.currentPage) {
            currentPage = htmlEl.__x.$data.currentPage;
        } else {
            // Fallback: try to determine from visible page containers
            const homeContainer = document.getElementById('home-container');
            const photosContainer = document.getElementById('photos-container');
            const stillsContainer = document.getElementById('stills-container');
            const meContainer = document.getElementById('me-container');
            
            // Check which container is currently visible (has x-show="true")
            if (homeContainer && homeContainer.style.display !== 'none' && !homeContainer.hidden) {
                currentPage = 'home';
            } else if (stillsContainer && stillsContainer.style.display !== 'none' && !stillsContainer.hidden) {
                currentPage = 'stills';
            } else if (meContainer && meContainer.style.display !== 'none' && !meContainer.hidden) {
                currentPage = 'me';
            } else if (photosContainer && photosContainer.style.display !== 'none' && !photosContainer.hidden) {
                currentPage = 'photos';
            } else {
                currentPage = 'home'; // default to home
            }
        }
    } catch (error) {
        console.log('Could not access Alpine.js data, using fallback detection');
        currentPage = 'home';
    }
    
    scrollPositions[currentPage] = window.pageYOffset || document.documentElement.scrollTop;
    console.log(`Saved scroll position for ${currentPage}:`, scrollPositions[currentPage]);
}

// Restore scroll position for a specific page
function restoreScrollPosition(page) {
    const position = scrollPositions[page] || 0;
    console.log(`Restoring scroll position for ${page}:`, position);
    
    // Use requestAnimationFrame to ensure DOM is ready
    requestAnimationFrame(() => {
        window.scrollTo({
            top: position,
            behavior: 'auto' // Use 'auto' for instant scroll, 'smooth' for animated
        });
    });
}

// Debounce function to limit how often scroll events fire
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}