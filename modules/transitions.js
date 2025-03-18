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
    
   
    // Add transition end handler to main element
    const main = document.querySelector('main');
    if (main) {
        main.addEventListener('transitionend', () => {
            if (!transitionActive) return;
            
            transitionActive = false;
            document.body.classList.remove('transitioning');
            console.log('Transition completed');
            
        });
    }
}

