/**
 * Image Handler Module
 * Handles image loading, grouping, and display for both stills and photos.
 */

// State tracking
const state = {
  overlayActive: false,
  modalActive: false
};

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
        if (!groups[prefix]) groups[prefix] = [];
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
    
    const folderPath = 'Media/Stills/';
    const groups = groupImages(imageList);
    
    // Preserve welcome message if exists
    const welcomeMessage = container.querySelector('p');
    container.innerHTML = '';
    if (welcomeMessage) {
        container.appendChild(welcomeMessage);
    }

    // Create overlay for expanded stills if it doesn't exist
    ensureOverlayExists();

    // Import video links dynamically
    import('./videoLinks.js')
        .then(module => {
            const videoLinks = module.getVideoLinks();
            renderImageGroups(groups, container, folderPath, videoLinks);
        })
        .catch(error => {
            console.error('Error loading video links:', error);
            renderImageGroups(groups, container, folderPath, {});
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
    
    const folderPath = 'Media/Photos/';
    const groups = groupImages(photoList);
    
    // Preserve welcome message if exists
    const welcomeMessage = container.querySelector('p');
    container.innerHTML = '';
    if (welcomeMessage) {
        container.appendChild(welcomeMessage);
    }

    renderImageGroups(groups, container, folderPath, {}, 'photo');
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
    
    // Add close button
    const closeButton = document.createElement('button');
    closeButton.className = 'close-button';
    closeButton.innerHTML = '&times;';
    closeButton.setAttribute('aria-label', 'Close');
    
    const expandedImg = document.createElement('img');
    expandedImg.className = 'expanded-image';
    expandedImg.id = 'expanded-image';
    expandedImg.alt = 'Expanded view';
    
    // Add caption element
    const caption = document.createElement('div');
    caption.className = 'expanded-image-caption';
    caption.id = 'expanded-image-caption';
    
    expandedContainer.appendChild(expandedImg);
    expandedContainer.appendChild(closeButton);
    expandedContainer.appendChild(caption);
    overlay.appendChild(expandedContainer);
    
    // Single event listener for closing with button
    closeButton.addEventListener('click', closeExpandedImage);
    
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
 */
function renderImageGroups(groups, container, folderPath, videoLinks, type = 'still') {
    // Check for empty groups
    if (!groups || Object.keys(groups).length === 0) {
        const emptyMessage = document.createElement('p');
        emptyMessage.className = 'empty-message';
        emptyMessage.textContent = `No ${type}s found.`;
        container.appendChild(emptyMessage);
        return;
    }
    
    // Create document fragment for better performance
    const fragment = document.createDocumentFragment();
    
    Object.entries(groups).forEach(([groupName, images]) => {
        const groupContainer = document.createElement('div');
        groupContainer.classList.add('group-container');
        
        const titleContainer = document.createElement('div');
        titleContainer.classList.add('title-container');
        
        const title = document.createElement('h2');
        title.textContent = groupName;
        title.classList.add('group-title');
        titleContainer.appendChild(title);
        
        // Add video link if available (stills only)
        if (type === 'still' && videoLinks && videoLinks[groupName]) {
            const videoLink = document.createElement('a');
            videoLink.href = videoLinks[groupName];
            videoLink.target = '_blank';
            videoLink.rel = 'noopener';
            videoLink.classList.add('video-link');
            videoLink.innerHTML = 'Watch Video <span>↗</span>';
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
            
            if (type === 'still') {
                img.classList.add('styled-still');
                // Add click handler for stills
                img.addEventListener('click', () => {
                    expandImage(img.src);
                });
            } else {
                img.classList.add('styled-photo');
                imageDiv.classList.add('photo-item');
                // Add click handler for photos
                img.addEventListener('click', () => {
                    openPhotoModal(folderPath + imageName, imageName);
                });
            }
            
            imageDiv.appendChild(img);
            imageGrid.appendChild(imageDiv);
        });
        
        groupContainer.appendChild(imageGrid);
        fragment.appendChild(groupContainer);
    });
    
    // Append all elements at once for better performance
    container.appendChild(fragment);

    // Create modal for photos if needed
    if (type === 'photo' && !document.getElementById('photo-modal')) {
        createPhotoModal();
    }
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
export function expandImage(src) {
    if (state.overlayActive) return; // Prevent double activation
    
    const overlay = document.getElementById('image-overlay');
    if (!overlay) {
        console.error('Image overlay not found');
        return;
    }
    
    const expandedImgContainer = overlay.querySelector('.expanded-image-container');
    const expandedImg = document.getElementById('expanded-image');
    
    // Set image source
    expandedImg.src = src;
    
    // Show overlay with animation
    overlay.classList.add('active');
    state.overlayActive = true;
    
    // Store current scroll position and lock scrolling
    document.body.style.top = `-${window.scrollY}px`;
    document.body.classList.add('scroll-lock');
    
    // Show image container with slight delay for smooth animation
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
    
    // After animation completes, hide overlay and restore scrolling
    setTimeout(() => {
        overlay.classList.remove('active');
        
        // Restore scroll position
        const scrollY = document.body.style.top;
        document.body.style.top = '';
        document.body.classList.remove('scroll-lock');
        window.scrollTo(0, parseInt(scrollY || '0') * -1);
        
        state.overlayActive = false;
    }, 300); // Match your CSS transition duration
}

/**
 * Creates the photo modal if it doesn't exist
 */
function createPhotoModal() {
    if (document.getElementById('photo-modal')) return;
    
    const modalContainer = document.createElement('div');
    modalContainer.id = 'photo-modal';
    modalContainer.className = 'photo-modal';
    
    // Use template literal for cleaner HTML structure
    modalContainer.innerHTML = `
        <div class="photo-modal-content">
            <span class="close-button">&times;</span>
            <img id="modal-img" src="" alt="">
            <div id="modal-caption" class="photo-modal-caption"></div>
        </div>
    `;
    
    // Single event listener for closing
    modalContainer.addEventListener('click', (e) => {
        if (e.target === modalContainer || e.target.classList.contains('close-button')) {
            closePhotoModal();
        }
    });
    
    document.body.appendChild(modalContainer);
}

/**
 * Opens the photo modal with the specified image
 * @param {string} src - Image source URL
 * @param {string} caption - Image caption
 */
export function openPhotoModal(src, caption) {
    if (state.modalActive) return; // Prevent double activation
    
    const modal = document.getElementById('photo-modal');
    if (!modal) {
        console.error('Photo modal not found');
        return;
    }
    
    const modalImg = document.getElementById('modal-img');
    const captionText = document.getElementById('modal-caption');
    
    // Display modal with animation
    modal.style.display = 'flex';
    setTimeout(() => {
        modal.classList.add('active');
    }, 10);
    
    // Set content
    modalImg.src = src;
    captionText.textContent = formatImageName(caption);
    
    // Lock scrolling
    document.body.classList.add('modal-open');
    state.modalActive = true;
}

/**
 * Closes the photo modal
 */
export function closePhotoModal() {
    if (!state.modalActive) return; // Prevent closing if not active
    
    const modal = document.getElementById('photo-modal');
    if (!modal) return;
    
    // Hide with animation
    modal.classList.remove('active');
    setTimeout(() => {
        modal.style.display = 'none';
    }, 300);
    
    // Re-enable scrolling
    document.body.classList.remove('modal-open');
    state.modalActive = false;
}

/**
 * Fetches the list of still images
 * @returns {Promise<string[]>} Promise resolving to array of image filenames
 */
export function fetchImages() {
    return fetch('imageList.json')
        .then(response => {
            if (!response.ok) {
                throw new Error(`Failed to fetch images: ${response.status} ${response.statusText}`);
            }
            return response.json();
        })
        .catch(error => {
            console.error('Error loading images:', error);
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