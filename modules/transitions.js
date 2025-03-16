// Page transition effects module

/**
 * Sets up page transition effects
 */
export function setupPageTransitions() {
    // Only setup if Alpine.js is available
    if (!window.Alpine) {
        console.warn('Alpine.js not available for page transitions');
        return;
    }
    
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
    
    // Wrap content for fade transitions
    const main = document.querySelector('main');
    if (main) {
        const currentHTML = main.innerHTML;
        main.innerHTML = `<div class="page-content">${currentHTML}</div>`;
        main.classList.add('transition-fade');
    }
}

/**
 * Sets up event handlers for page transitions
 */
function setupTransitionHandlers() {
    // Get Alpine instance
    const app = document.querySelector('html').__x;
    if (!app) return;
    
    // Store current page
    let currentPage = app.$data.currentPage;
    
    // Keep track of active transition
    let transitionActive = false;
    
    // Random transition style generator
    const getRandomTransition = () => {
        const transitions = ['fade', 'slide', 'circle'];
        return transitions[Math.floor(Math.random() * transitions.length)];
    };
    
    // Watch for page changes
    app.$watch('currentPage', (newPage) => {
        if (newPage === currentPage || transitionActive) return;
        
        transitionActive = true;
        const transitionType = getRandomTransition();
        
        console.log(`Transitioning to ${newPage} using ${transitionType} transition`);
        
        // Perform the transition
        switch (transitionType) {
            case 'fade':
                performFadeTransition(newPage);
                break;
            case 'slide':
                performSlideTransition(newPage);
                break;
            case 'circle':
                performCircleTransition(newPage);
                break;
            default:
                performFadeTransition(newPage);
        }
        
        // Update current page
        currentPage = newPage;
    });
    
    // Add transition end handler to main element
    const main = document.querySelector('main');
    if (main) {
        main.addEventListener('transitionend', () => {
            if (!transitionActive) return;
            
            transitionActive = false;
            document.body.classList.remove('transitioning');
            console.log('Transition completed');
            
            // Restore scroll position for the new page
            if (currentPage && typeof scrollPositions[currentPage] === 'number') {
                console.log(`Restoring scroll position for ${currentPage}: ${scrollPositions[currentPage]}`);
                window.scrollTo(0, scrollPositions[currentPage]);
            }
        });
    }
}

/**
 * Performs a fade transition between pages
 */
function performFadeTransition(newPage) {
    document.body.classList.add('transitioning');
    const main = document.querySelector('main');
    
    // Fade out
    main.classList.add('transition-out');
    
    // Wait for fade out
    setTimeout(() => {
        // Switch page (Alpine handles this)
        main.classList.remove('transition-out');
        main.classList.add('transition-in');
        
        // Wait for next frame to start fade in
        requestAnimationFrame(() => {
            requestAnimationFrame(() => {
                main.classList.remove('transition-in');
            });
        });
    }, 500);
}

/**
 * Performs a slide transition between pages
 */
function performSlideTransition(newPage) {
    document.body.classList.add('transitioning');
    
    const slideContainer = document.querySelector('.transition-slide-container');
    const slideEl = document.querySelector('.transition-slide');
    
    // Slide in
    slideContainer.classList.add('active');
    slideEl.classList.add('active');
    
    // Wait for slide to complete
    setTimeout(() => {
        // Hide slide
        slideEl.classList.remove('active');
        
        // Wait for slide to exit
        setTimeout(() => {
            slideContainer.classList.remove('active');
        }, 600);
    }, 800);
}

/**
 * Performs a circle transition between pages
 */
function performCircleTransition(newPage) {
    document.body.classList.add('transitioning');
    
    const circleContainer = document.querySelector('.transition-circle-container');
    const circleEl = document.querySelector('.transition-circle');
    
    // Update circle color based on theme
    const theme = document.querySelector('html').__x.$data.theme;
    circleEl.style.background = theme === 'dark' ? '#111' : '#f5f5f5';
    
    // Circle in
    circleContainer.classList.add('active');
    circleEl.classList.add('active');
    
    // Wait for circle to expand
    setTimeout(() => {
        // Hide circle
        circleEl.classList.remove('active');
        
        // Wait for circle to shrink
        setTimeout(() => {
            circleContainer.classList.remove('active');
        }, 600);
    }, 800);
}