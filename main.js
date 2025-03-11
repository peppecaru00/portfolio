import { mapImages, fetchImages } from './modules/imageHandler.js';
import { setupImageFocus, setupScrollDetection } from './modules/uiEffects.js';
import { setupNavigation } from './modules/navigation.js';

// Initialize everything when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    console.log("DOM Content Loaded");

    // Initialize images
    fetchImages()
        .then(images => {
            console.log('Images loaded:', images);
            mapImages(images);
        });
    
    // Initialize UI effects
    setupImageFocus();
    setupScrollDetection();
    
    // Initialize navigation
    setupNavigation();
});