// Page transition effects module

/**
 * Sets up page transition effects
 */
export function setupPageTransitions() {

    // Add necessary CSS classes for transitions
    addTransitionStyles();
    
    // Initialize transition container
    createTransitionContainer();
    
    // Add transition event handlers
    setupTransitionHandlers();
}

/**
 * Injects transition styles into document head
 */
function addTransitionStyles() {
    const styleEl = document.createElement('style');
    styleEl.textContent = `
        .page-transition {
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            z-index: 9999;
            pointer-events: none;
            visibility: hidden;
        }
        
        .page-transition.active {
            visibility: visible;
            pointer-events: all;
        }
        
        /* Fade transition */
        .transition-fade .page-content {
            transition: opacity 0.5s ease-in-out;
        }
        
        .transition-fade.transition-out .page-content {
            opacity: 0;
        }
        
        .transition-fade.transition-in .page-content {
            opacity: 1;
        }
        
        /* Slide transition */
        .transition-slide-container {
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            pointer-events: none;
            z-index: 9998;
            visibility: hidden;
        }
        
        .transition-slide-container.active {
            visibility: visible;
        }
        
        .transition-slide {
            position: absolute;
            width: 100%;
            height: 100%;
            background: var(--background-color);
            transform: translateY(100%);
            transition: transform 0.6s cubic-bezier(0.77, 0, 0.175, 1);
        }
        
        .transition-slide.active {
            transform: translateY(0);
        }
        
        /* Circle transition */
        .transition-circle-container {
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            pointer-events: none;
            z-index: 9997;
            display: flex;
            justify-content: center;
            align-items: center;
            visibility: hidden;
        }
        
        .transition-circle-container.active {
            visibility: visible;
        }
        
        .transition-circle {
            width: 0;
            height: 0;
            border-radius: 50%;
            background: var(--background-color);
            opacity: 0.9;
            transition: all 0.6s cubic-bezier(0.77, 0, 0.175, 1);
            transform: scale(0);
        }
        
        .transition-circle.active {
            transform: scale(1);
            width: 250%;
            height: 250%;
        }
    `;
    document.head.appendChild(styleEl);
}

/**
 * Creates transition container elements
 */
function createTransitionContainer() {
    // Slide transition container
    const slideContainer = document.createElement('div');
    slideContainer.className = 'transition-slide-container';
    
    const slideEl = document.createElement('div');
    slideEl.className = 'transition-slide';
    slideContainer.appendChild(slideEl);
    
    // Circle transition container
    const circleContainer = document.createElement('div');
    circleContainer.className = 'transition-circle-container';
    
    const circleEl = document.createElement('div');
    circleEl.className = 'transition-circle';
    circleContainer.appendChild(circleEl);
    
    // Add to DOM
    document.body.appendChild(slideContainer);
    document.body.appendChild(circleContainer);
    
    // Wrap content for fade transitions more safely
    const main = document.querySelector('main');
    if (main) {
        const pageContentDiv = document.createElement('div');
        pageContentDiv.className = 'page-content';

        // Move all children of main into the new pageContentDiv
        while (main.firstChild) {
            pageContentDiv.appendChild(main.firstChild);
        }

        // Append the new wrapper to main
        main.appendChild(pageContentDiv);
        main.classList.add('transition-fade');
    }
}

/**
 * Sets up event handlers for page transitions
 */
function setupTransitionHandlers() {
    // Wait for Alpine.js to be ready
    document.addEventListener('alpine:init', () => {
        // Set up page change watcher once Alpine is ready
        setupPageChangeWatcher();
    });
    
    // Fallback if Alpine is already initialized
    setTimeout(() => {
        if (window.Alpine && !window.navigationScrollHandler) {
            setupPageChangeWatcher();
        }
    }, 1000);
}

/**
 * Sets up Alpine.js page change watching with scroll position management
 */
function setupPageChangeWatcher() {
    // Try to access Alpine's reactive data
    try {
        // Method 1: Try to get Alpine store
        if (window.Alpine && window.Alpine.store) {
            const navigationStore = window.Alpine.store('navigation');
            if (navigationStore) {
                // Watch for currentPage changes in the store
                Alpine.effect(() => {
                    const currentPage = navigationStore.currentPage;
                    handlePageChange(currentPage);
                });
                window.navigationScrollHandler = true;
                console.log('Alpine store watcher set up successfully');
                return;
            }
        }
        
        // Method 2: Try to find Alpine component on the document
        const alpineElement = document.querySelector('[x-data]');
        if (alpineElement && alpineElement._x_dataStack) {
            const alpineData = alpineElement._x_dataStack[0];
            if (alpineData && alpineData.currentPage !== undefined) {
                // Set up a mutation observer to watch for page changes
                let lastPage = alpineData.currentPage;
                const observer = new MutationObserver(() => {
                    if (alpineData.currentPage !== lastPage) {
                        lastPage = alpineData.currentPage;
                        handlePageChange(lastPage);
                    }
                });
                
                observer.observe(document.body, {
                    attributes: true,
                    childList: true,
                    subtree: true
                });
                
                window.navigationScrollHandler = true;
                console.log('Alpine mutation observer set up successfully');
                return;
            }
        }
        
        // Method 3: Fallback using manual detection
        console.log('Using fallback page change detection');
        setupFallbackPageDetection();
        
    } catch (error) {
        console.error('Error setting up Alpine watcher:', error);
        setupFallbackPageDetection();
    }
}

/**
 * Fallback method for detecting page changes
 */
function setupFallbackPageDetection() {
    let lastPage = getCurrentPageFromDOM();
    
    // Check for page changes periodically
    setInterval(() => {
        const currentPage = getCurrentPageFromDOM();
        if (currentPage !== lastPage) {
            lastPage = currentPage;
            handlePageChange(currentPage);
        }
    }, 500);
    
    window.navigationScrollHandler = true;
}

/**
 * Gets current page from DOM indicators
 */
function getCurrentPageFromDOM() {
    // Check body classes
    if (document.body.classList.contains('page-stills')) return 'stills';
    if (document.body.classList.contains('page-me')) return 'me';
    
    // Check active navigation
    const activeNav = document.querySelector('.nav-button.active, .nav-button[aria-current="page"]');
    if (activeNav) {
        const text = activeNav.textContent.toLowerCase();
        if (text.includes('still')) return 'stills';
        if (text.includes('me') || text.includes('about')) return 'me';
    }
    
    // Check URL or other indicators
    const path = window.location.pathname.toLowerCase();
    if (path.includes('stills')) return 'stills';
    if (path.includes('me') || path.includes('about')) return 'me';
    
    return 'photos'; // default
}

/**
 * Handle page change with scroll position management
 */
function handlePageChange(newPage) {
    console.log('Page changed to:', newPage);
    
    // Save current scroll position before switching
    if (typeof saveCurrentScrollPosition === 'function') {
        saveCurrentScrollPosition();
    }
    
    // Add transition class
    document.body.classList.add('transitioning');
    
    // Small delay to let page content update, then restore scroll
    setTimeout(() => {
        if (typeof restoreScrollPosition === 'function') {
            restoreScrollPosition(newPage);
        }
        
        // Remove transition class
        setTimeout(() => {
            document.body.classList.remove('transitioning');
        }, 100);
    }, 50);
}

