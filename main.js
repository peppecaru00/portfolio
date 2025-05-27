import { mapImages, fetchImages, fetchPhotos, mapPhotos } from './modules/imageHandler.js';
import { setupImageFocus, setupScrollDetection } from './modules/uiEffects.js';
import { setupNavigation } from './modules/navigation.js';
import { setupPageTransitions } from './modules/transitions.js';
import { setupCustomCursor } from './modules/dotCursor.js';
import { setupHomeAnimations, reinitializeHomeAnimations } from './modules/homeAnimations.js';

/**
 * Setup home animations with proper timing after content loads
 */
function setupHomeAnimationsWithObserver() {
    // Try immediate setup first
    setupHomeAnimations();
    
    // Also set up a MutationObserver to watch for home content being loaded
    const homeContainer = document.getElementById('home-container');
    if (homeContainer) {
        const observer = new MutationObserver((mutations) => {
            mutations.forEach((mutation) => {
                if (mutation.type === 'childList' && mutation.addedNodes.length > 0) {
                    // Check if home-content was added
                    mutation.addedNodes.forEach((node) => {
                        if (node.nodeType === Node.ELEMENT_NODE) {
                            const homeContent = node.querySelector ? node.querySelector('#home-content') : 
                                               (node.id === 'home-content' ? node : null);
                            if (homeContent) {
                                console.log('Home content detected, setting up animations...');
                                setTimeout(() => {
                                    setupHomeAnimations();
                                }, 100);
                                observer.disconnect(); // Stop observing once we've set up
                            }
                        }
                    });
                }
            });
        });
        
        observer.observe(homeContainer, {
            childList: true,
            subtree: true
        });
        
        // Cleanup observer after 10 seconds to prevent memory leaks
        setTimeout(() => {
            observer.disconnect();
        }, 10000);
    }
}

// Initialize everything when DOM is ready - SINGLE event listener
document.addEventListener('DOMContentLoaded', () => {
    console.log("DOM Content Loaded");

    // Disable automatic scroll restoration by the browser
    if ('scrollRestoration' in history) {
        history.scrollRestoration = 'manual';
    }    // Setup page transitions (this should be first)
    setTimeout(() => setupPageTransitions(), 100);     // Initialize UI effects
    // setupScrollDetection(); // Disabled to prevent header hide/show behavior
    setupNavigation();setupCustomCursor();
      
    // Setup home page animations - with better timing
    setupHomeAnimationsWithObserver();
      // Expose home animation functions globally for navigation
    window.reinitializeHomeAnimations = reinitializeHomeAnimations;
    window.setupHomeAnimations = setupHomeAnimations;    // Check if the stills container exists in the DOM
    const stillsContainer = document.getElementById('stills-container');
    if (stillsContainer) {
        fetchImages().then(images => {
            mapImages(images);
        });
    }
    
    // Check if the photos container exists in the DOM
    const photosContainer = document.getElementById('photos-container');
    if (photosContainer) {
        fetchPhotos().then(photos => {
            mapPhotos(photos);
        });
    }
});