/**
 * Image Handler Module
 * Handles image loading, grouping, and display for both stills and photos.
 */

// Import imagesLoaded library for loading detection
import '../js/lib/imagesloaded.pkgd.min.js';
import { setupAdvancedImageFocus } from './advancedImageFocus.js';

// State tracking
const state = {
    overlayActive: false
};

/**
 * Shows loading animation for a container
 * @param {HTMLElement} container - The container to show loading for
 * @param {string} type - Type of content ('photos' or 'stills')
 */
function showLoadingAnimation(container, type) {
    const loadingDiv = document.createElement('div');
    loadingDiv.className = `${type}-loading`;
    loadingDiv.id = `${type}-loading`;
    
    const spinner = document.createElement('div');
    spinner.className = `${type}-loading-spinner`;
    
    const text = document.createElement('div');
    text.className = `${type}-loading-text`;
    text.textContent = `Loading ${type}...`;
    
    loadingDiv.appendChild(spinner);
    loadingDiv.appendChild(text);
    
    container.appendChild(loadingDiv);
}

/**
 * Removes loading animation from a container
 * @param {string} type - Type of content ('photos' or 'stills')
 */
function hideLoadingAnimation(type) {
    const loadingDiv = document.getElementById(`${type}-loading`);
    if (loadingDiv) {
        loadingDiv.remove();
    }
}

/**
 * Animates images with fade-in effect using Intersection Observer
 * @param {NodeList} imageContainers - List of image container elements
 */
function animateImages(imageContainers) {
    // Fallback for browsers without Intersection Observer support
    if (!window.IntersectionObserver) {
        console.log('IntersectionObserver not supported, using fallback animation');
        imageContainers.forEach((container, index) => {
            setTimeout(() => {
                container.classList.add('fade-in');
            }, index * 150);
        });
        return;
    }

    // Create intersection observer for fade-in animations
    const observerOptions = {
        threshold: 0.2, // Trigger when 20% of the element is visible
        rootMargin: '0px 0px -50px 0px' // Start animation when element is 50px from entering viewport
    };    const observer = new IntersectionObserver((entries) => {
        let visibleEntries = entries.filter(entry => entry.isIntersecting && !entry.target.classList.contains('fade-in'));
        
        visibleEntries.forEach((entry, index) => {
            // Add staggered delay for smooth sequential animation
            setTimeout(() => {
                if (entry.target && !entry.target.classList.contains('fade-in')) {
                    entry.target.classList.add('fade-in');
                    console.log('Animating image container:', entry.target);
                }
            }, index * 150); // Stagger time for smooth effect
            
            // Stop observing this element once animated
            observer.unobserve(entry.target);
        });
    }, observerOptions);

    // Observe all image containers
    imageContainers.forEach((container) => {
        // Reset animation state in case of re-rendering
        container.classList.remove('fade-in');
        observer.observe(container);
    });

    // Force check for initially visible elements after a short delay
    setTimeout(() => {
        imageContainers.forEach((container) => {
            const rect = container.getBoundingClientRect();
            const isVisible = rect.top < window.innerHeight && rect.bottom > 0;
            
            if (isVisible && !container.classList.contains('fade-in')) {
                container.classList.add('fade-in');
                observer.unobserve(container);
            }
        });
    }, 100);

    console.log(`Set up intersection observer for ${imageContainers.length} image containers`);

    // Store observer for cleanup if needed
    return observer;
}

/**
 * Groups images by their prefix (before the first dash)
 * @param {string[]} imageList - Array of image filenames
 * @returns {Object} Object with prefixes as keys and arrays of filenames as values
 */
export function groupImages(imageList) {
    // Guard clause for empty lists
    if (!imageList || !imageList.length) return {};

    return imageList.reduce((groups, image) => {
        const prefix = image.split('-')[0];
        if (!groups[prefix]) { // Ensure array is initialized
            groups[prefix] = [];
        }
        groups[prefix].push(image);
        return groups;
    }, {});
}


/**
 * Maps and displays stills images on the page
 * @param {string[]} imageList - Array of image filenames
 */
export function mapImages(imageList) {
    const container = document.getElementById('stills-container');
    if (!container) {
        console.error('Stills container not found');
        return;
    }

    // Show loading animation
    showLoadingAnimation(container, 'stills');

    const folderPath = 'Media/Stills/';
    const groups = groupImages(imageList);    // Preserve welcome message if exists
    const welcomeMessage = container.querySelector('p');
    const loadingElement = container.querySelector('.stills-loading');
    
    // Clear container and add intro text
    container.innerHTML = `
        <div class="page-intro">
            <h1>Check those videos 🎬</h1>
            <h4>Juicy colors 🤑</h4>
        </div>
    `;
    
    // Re-add loading if it existed
    if (loadingElement) {
        container.appendChild(loadingElement);
    }

    // Create overlay for expanded stills if it doesn't exist
    ensureOverlayExists();    // Import video links dynamically
    import('./videoLinks.js')
        .then(module => {
            const orderedVideoLinks = module.getVideoLinksWithOrder();
            // Remove loading indicator
            hideLoadingAnimation('stills');
            
            return renderImageGroupsOrdered(groups, container, folderPath, orderedVideoLinks, 'still');
        }).then(() => {
            // Animate images after they're rendered
            const imageContainers = container.querySelectorAll('.image-container');
            animateImages(imageContainers);
            
            // Preload images to avoid empty displays
            preloadImages(imageList, folderPath);
              // Setup advanced image focus for stills
            setupAdvancedImageFocus();
        })        .catch(error => {
            console.error('Error loading video links:', error);
            hideLoadingAnimation('stills');
            
            return renderImageGroupsOrdered(groups, container, folderPath, [], 'still');
        })
        .then(() => {
            // Animate images even on error
            const imageContainers = container.querySelectorAll('.image-container');
            animateImages(imageContainers);
              // Setup advanced image focus for stills (fallback)
            setupAdvancedImageFocus();
        });
}

/**
 * Preloads images to avoid empty displays when switching pages quickly
 * @param {string[]} imageList - Array of image filenames
 * @param {string} folderPath - Path to the images folder
 */
function preloadImages(imageList, folderPath) {
    if (!imageList || !imageList.length) return;

    imageList.forEach(imageName => {
        const img = new Image();
        img.src = folderPath + imageName;
    });
}



/**
 * Maps and displays photos on the page
 * @param {string[]} photoList - Array of photo filenames
 */
export function mapPhotos(photoList) {
    const container = document.getElementById('photos-container');
    if (!container) {
        console.error('Photos container not found');
        return;
    }

    // Show loading animation
    showLoadingAnimation(container, 'photos');

    const folderPath = 'Media/Photos/';
    const groups = groupImages(photoList);    // Preserve welcome message if exists
    const welcomeMessage = container.querySelector('p');
    const loadingElement = container.querySelector('.photos-loading');
    
    // Clear container and add intro text
    container.innerHTML = `
        <div class="page-intro">
            <h1>Some of my favourite pictures 📸</h1>
        </div>
    `;
    
    // Re-add loading if it existed
    if (loadingElement) {
        container.appendChild(loadingElement);
    }

    // Import photo order dynamically
    import('./photoOrder.js')
        .then(module => {
            const orderedPhotos = module.getPhotosWithOrder();
            // Remove loading indicator
            hideLoadingAnimation('photos');
            
            return renderImageGroupsOrdered(groups, container, folderPath, orderedPhotos, 'photo');
        })
        .then(() => {
            // Animate images after they're rendered
            const imageContainers = container.querySelectorAll('.image-container');
            animateImages(imageContainers);
            // Setup advanced image focus for photos
            setupAdvancedImageFocus();
        })
        .catch(error => {
            console.error('Error loading photo order:', error);
            hideLoadingAnimation('photos');
            
            return renderImageGroups(groups, container, folderPath, {}, 'photo');
        })
        .then(() => {
            // Setup advanced image focus for photos (fallback)
            setupAdvancedImageFocus();
        });
}

export function mapDesigns(designList) {
    const container = document.getElementById('designs-container');
    
    if (!container) {
        console.error('Designs container not found');
        return;
    }

    // Show loading animation
    showLoadingAnimation(container, 'designs');

    const folderPath = 'Media/Designs/';
    const groups = groupImages(designList);

    // Preserve welcome message if exists
    const welcomeMessage = container.querySelector('p');
    const loadingElement = container.querySelector('.designs-loading');
    
    // Clear container and add intro text
    container.innerHTML = `
        <div class="page-intro">
            <h1>Some cool Designs 📸</h1>
        </div>
    `;
      // Re-add loading if it existed
    if (loadingElement) {
        container.appendChild(loadingElement);
    }

    // Create overlay for expanded designs if it doesn't exist
    ensureOverlayExists();

    renderImageGroups(groups, container, folderPath, {}, 'design')
        .then(() => {
            // Hide loading and animate images
            hideLoadingAnimation('designs');
            const imageContainers = container.querySelectorAll('.image-container');
            animateImages(imageContainers);
            // Setup advanced image focus for designs
            setupAdvancedImageFocus();
        });
}

/**
 * Creates or ensures the overlay for expanded stills exists
 */
function ensureOverlayExists() {
    // Use a single overlay ID 'image-overlay' for ALL images
    if (document.getElementById('image-overlay')) return;

    const overlay = document.createElement('div');
    overlay.id = 'image-overlay';
    overlay.className = 'overlay';

    const expandedContainer = document.createElement('div');
    expandedContainer.className = 'expanded-image-container';

    const expandedImg = document.createElement('img');
    expandedImg.className = 'expanded-image';
    expandedImg.id = 'expanded-image';
    expandedImg.alt = 'Expanded view';

    // Add caption element
    const caption = document.createElement('div');
    caption.className = 'expanded-image-caption';
    caption.id = 'expanded-image-caption';

    expandedContainer.appendChild(expandedImg);
    expandedContainer.appendChild(caption);
    overlay.appendChild(expandedContainer);

    // Single event listener for closing with background click
    overlay.addEventListener('click', (e) => {
        if (e.target === overlay) {
            closeExpandedImage();
        }
    });

    // Keyboard support
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && state.overlayActive) {
            closeExpandedImage();
        }
    });

    document.body.appendChild(overlay);
    console.log('Universal image overlay created');
}

/**
 * Renders grouped images to the container
 * @param {Object} groups - Object of grouped images
 * @param {HTMLElement} container - Container element
 * @param {string} folderPath - Path to images folder
 * @param {Object} videoLinks - Object mapping groups to video links
 * @param {string} type - Type of content ('still' or 'photo')
 * @returns {Promise} Promise that resolves when images are rendered
 */
function renderImageGroups(groups, container, folderPath, videoLinks, type = 'still') {
    return new Promise((resolve) => {
        // Check for empty groups
        if (!groups || Object.keys(groups).length === 0) {
            const emptyMessage = document.createElement('p');
            emptyMessage.className = 'empty-message';
            emptyMessage.textContent = `No ${type}s found.`;
            container.appendChild(emptyMessage);
            resolve();
            return;
        }

        // Create document fragment for better performance
        const fragment = document.createDocumentFragment();
        const allImages = [];

        Object.entries(groups).forEach(([groupName, images]) => {
            const groupContainer = document.createElement('div');
            groupContainer.classList.add('group-container');

            const titleContainer = document.createElement('div');
            titleContainer.classList.add('title-container');

            const title = document.createElement('h2');
            title.textContent = groupName;
            title.classList.add('group-title');
            titleContainer.appendChild(title);            // Add video link if available (stills only)
            if (type === 'still' && videoLinks && videoLinks[groupName]) {
                const videoLink = document.createElement('a');
                videoLink.href = videoLinks[groupName];
                videoLink.target = '_blank';
                videoLink.rel = 'noopener';
                videoLink.classList.add('video-link');
                videoLink.innerHTML = `
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                        <polygon points="5,3 19,12 5,21"></polygon>
                    </svg>
                    <span>Watch</span>
                `;
                videoLink.setAttribute('aria-label', 'Watch video');
                titleContainer.appendChild(videoLink);
            }

            groupContainer.appendChild(titleContainer);

            const imageGrid = document.createElement('div');
            imageGrid.classList.add('group-images');

            // Process images
            images.forEach(imageName => {
                const imageDiv = document.createElement('div');
                imageDiv.classList.add('image-container');

                const img = document.createElement('img');
                img.src = folderPath + imageName;
                img.alt = formatImageName(imageName);
                img.loading = 'lazy'; // Lazy load images

                // Collect all images for loading detection
                allImages.push(img);                if (type === 'still') {
                    img.classList.add('styled-still');
                    // Click handler will be added by advanced image focus system
                } else {
                    img.classList.add('styled-photo');
                    imageDiv.classList.add('photo-item');
                    // Click handler will be added by advanced image focus system
                }

                imageDiv.appendChild(img);
                imageGrid.appendChild(imageDiv);
            });

            groupContainer.appendChild(imageGrid);
            fragment.appendChild(groupContainer);
        });

        // Append all elements at once for better performance
        container.appendChild(fragment);

        // Use imagesLoaded to detect when all images have loaded
        if (typeof imagesLoaded !== 'undefined' && allImages.length > 0) {
            imagesLoaded(allImages, () => {
                resolve();
            });
        } else {
            // Fallback if imagesLoaded is not available
            setTimeout(() => {
                resolve();
            }, 100);
        }
    });
}

/**
 * Renders grouped images to the container with custom ordering for videos
 * @param {Object} groups - Object of grouped images
 * @param {HTMLElement} container - Container element
 * @param {string} folderPath - Path to images folder
 * @param {Array} orderedVideoLinks - Array of video objects with order
 * @param {string} type - Type of content ('still' or 'photo')
 * @returns {Promise} Promise that resolves when images are rendered
 */
function renderImageGroupsOrdered(groups, container, folderPath, orderedItems, type = 'still') {
    return new Promise((resolve) => {
        // Check for empty groups
        if (!groups || Object.keys(groups).length === 0) {
            const emptyMessage = document.createElement('p');
            emptyMessage.className = 'empty-message';
            emptyMessage.textContent = `No ${type}s found.`;
            container.appendChild(emptyMessage);
            resolve();
            return;
        }

        // Create document fragment for better performance
        const fragment = document.createDocumentFragment();
        const allImages = [];

        // Use custom order if provided
        if (orderedItems && orderedItems.length > 0) {
            // First, render groups in the specified order
            orderedItems
                .sort((a, b) => a.order - b.order) // Sort by order field
                .forEach(item => {
                    const groupName = item.name;
                    const images = groups[groupName];
                    
                    if (images && images.length > 0) {
                        // For videos (stills), use the URL; for photos, no URL
                        const url = type === 'still' ? item.url : null;
                        const groupContainer = createGroupContainer(groupName, images, folderPath, url, type, allImages);
                        fragment.appendChild(groupContainer);
                    }
                });

            // Then, render any remaining groups that don't have order specified (at the end)
            Object.entries(groups).forEach(([groupName, images]) => {
                const hasOrder = orderedItems.some(item => item.name === groupName);
                if (!hasOrder) {
                    const groupContainer = createGroupContainer(groupName, images, folderPath, null, type, allImages);
                    fragment.appendChild(groupContainer);
                }
            });
        } else {
            // When no ordered items, use the original order
            Object.entries(groups).forEach(([groupName, images]) => {
                const groupContainer = createGroupContainer(groupName, images, folderPath, null, type, allImages);
                fragment.appendChild(groupContainer);
            });
        }

        // Append all elements at once for better performance
        container.appendChild(fragment);

        // Use imagesLoaded to detect when all images have loaded
        if (typeof imagesLoaded !== 'undefined' && allImages.length > 0) {
            imagesLoaded(allImages, () => {
                resolve();
            });
        } else {
            // Fallback if imagesLoaded is not available
            setTimeout(() => {
                resolve();
            }, 100);
        }
    });
}

/**
 * Creates a group container for images
 * @param {string} groupName - Name of the group
 * @param {Array} images - Array of image filenames
 * @param {string} folderPath - Path to images folder
 * @param {string|null} videoUrl - URL of the video (if any)
 * @param {string} type - Type of content ('still' or 'photo')
 * @param {Array} allImages - Array to collect all image elements
 * @returns {HTMLElement} Group container element
 */
function createGroupContainer(groupName, images, folderPath, videoUrl, type, allImages) {
    const groupContainer = document.createElement('div');
    groupContainer.classList.add('group-container');

    const titleContainer = document.createElement('div');
    titleContainer.classList.add('title-container');

    const title = document.createElement('h2');
    title.textContent = groupName;
    title.classList.add('group-title');
    titleContainer.appendChild(title);

    // Add video link if available (stills only)
    if (type === 'still' && videoUrl) {
        const videoLink = document.createElement('a');
        videoLink.href = videoUrl;
        videoLink.target = '_blank';
        videoLink.rel = 'noopener';
        videoLink.classList.add('video-link');
        videoLink.innerHTML = `
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <polygon points="5,3 19,12 5,21"></polygon>
            </svg>
            <span>Watch</span>
        `;
        videoLink.setAttribute('aria-label', 'Watch video');
        titleContainer.appendChild(videoLink);
    }

    groupContainer.appendChild(titleContainer);

    const imageGrid = document.createElement('div');
    imageGrid.classList.add('group-images');

    // Process images
    images.forEach(imageName => {
        const imageDiv = document.createElement('div');
        imageDiv.classList.add('image-container');

        const img = document.createElement('img');
        img.src = folderPath + imageName;
        img.alt = formatImageName(imageName);
        img.loading = 'lazy'; // Lazy load images

        // Collect all images for loading detection
        allImages.push(img);

        if (type === 'still') {
            img.classList.add('styled-still');
            // Click handler will be added by advanced image focus system
        } else {
            img.classList.add('styled-photo');
            imageDiv.classList.add('photo-item');
            // Click handler will be added by advanced image focus system
        }

        imageDiv.appendChild(img);
        imageGrid.appendChild(imageDiv);
    });

    groupContainer.appendChild(imageGrid);
    return groupContainer;
}

/**
 * Format image name for display/alt text
 * @param {string} imageName - Raw image filename
 * @returns {string} Formatted image name
 */
function formatImageName(imageName) {
    return imageName
        .split('.')[0]              // Remove extension
        .split('-').slice(1).join(' ') // Remove prefix, join with spaces
        .replace(/([A-Z])/g, ' $1') // Add spaces before capital letters
        .trim();                    // Trim extra spaces
}

/**
 * Expands a still image in the overlay
 * @param {string} src - Image source URL
 */
function expandImage(src) {
    const overlay = document.getElementById('image-overlay');
    if (!overlay) {
        console.error('Image overlay not found');
        return;
    }

    const expandedImg = document.getElementById('expanded-image');
    const expandedImgContainer = overlay.querySelector('.expanded-image-container');

    if (!expandedImg || !expandedImgContainer) {
        console.error('Expanded image elements not found');
        return;
    }

    // Set the image source
    expandedImg.src = src;
    expandedImg.alt = 'Expanded view';

    // Show the overlay
    overlay.style.display = 'flex';
    state.overlayActive = true;

    // Add active class for animation
    setTimeout(() => {
        expandedImgContainer.classList.add('active');
    }, 10);
}


/**
 * Closes an expanded still image
 */
export function closeExpandedImage() {
    if (!state.overlayActive) return; // Prevent closing if not active

    const overlay = document.getElementById('image-overlay');
    if (!overlay) return;

    const expandedImgContainer = overlay.querySelector('.expanded-image-container');

    // Hide image container first
    expandedImgContainer.classList.remove('active');

    // Hide overlay after animation
    setTimeout(() => {
        overlay.style.display = 'none';
        state.overlayActive = false;
    }, 300);
}

/**
 * Fetches the list of still images
 * @returns {Promise<string[]>} Promise resolving to array of image filenames
 */
export function fetchImages() {
    // Add loading state to the stills container if it exists
    const container = document.getElementById('stills-container');

    if (container) {
        const loadingElement = document.createElement('div');
        loadingElement.className = 'loading-spinner'; // This class will now be styled
        // loadingElement.textContent = 'Loading images...'; // Optionally remove or hide
        container.innerHTML = '';
        container.appendChild(loadingElement);
    }

    return fetch('imageList.json')
        .then(response => {
            if (!response.ok) {
                throw new Error(`Failed to fetch images: ${response.status} ${response.statusText}`);
            }
            return response.json();
        })
        .catch(error => {
            console.error('Error loading images:', error);

            // Show error message in the container
            if (container) {
                container.innerHTML = '';
                const errorMessage = document.createElement('div');
                errorMessage.className = 'error-message';
                errorMessage.textContent = 'Failed to load images. Please try again later.';
                container.appendChild(errorMessage);
            }

            return [];
        });
}

/**
 * Fetches the list of photos
 * @returns {Promise<string[]>} Promise resolving to array of photo filenames
 */
export function fetchPhotos() {
    return fetch('photoList.json')
        .then(response => {
            if (!response.ok) {
                throw new Error(`Failed to fetch photos: ${response.status} ${response.statusText}`);
            }
            return response.json();
        })
        .catch(error => {
            console.error('Error loading photos:', error);
            return [];
        });
}

/**
 * Fetches the list of designs
 * @returns {Promise<string[]>} Promise resolving to array of design filenames
 */
export function fetchDesigns() {
    return fetch('designList.json')
        .then(response => {
            if (!response.ok) {
                throw new Error(`Failed to fetch designs: ${response.status} ${response.statusText}`);
            }
            return response.json();
        })
        .catch(error => {
            console.error('Error loading designs:', error);
            return [];
        });
}