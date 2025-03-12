import { mapImages, fetchImages, fetchPhotos, mapPhotos } from './modules/imageHandler.js';
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

document.addEventListener('DOMContentLoaded', () => {

    // Check if the stills container exists in the DOM
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
    
    // Add any other initialization code here
});
