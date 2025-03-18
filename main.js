import { mapImages, fetchImages, fetchPhotos, mapPhotos } from './modules/imageHandler.js';
import { setupImageFocus, setupScrollDetection } from './modules/uiEffects.js';
import { setupNavigation } from './modules/navigation.js';
import { setupPageTransitions } from './modules/transitions.js';
import {setupCustomCursor} from './modules/dotCursor.js';

// Initialize everything when DOM is ready - SINGLE event listener
document.addEventListener('DOMContentLoaded', () => {
    console.log("DOM Content Loaded");

    // Setup page transitions (this should be first)
    setTimeout(() => setupPageTransitions(), 100); 

    // Initialize UI effects
    setupScrollDetection();
    setupNavigation();
    setupCustomCursor();
    
    // Check if the stills container exists in the DOM
    const stillsContainer = document.getElementById('stills-container');
    if (stillsContainer) {
        fetchImages().then(images => {
            mapImages(images);
            // Set up image focus AFTER mapping images
            setupImageFocus();
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