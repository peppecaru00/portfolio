/**
 * Advanced Image Focus Module
 * Provides enhanced image viewing capabilities with:
 * - Smooth zoom transitions
 * - Keyboard navigation through images
 * - Pan functionality with mouse and touch
 * - Scroll wheel zoom
 * - Responsive design that respects screen dimensions
 */

// State management
const imageGalleryState = {
    isActive: false,
    currentImageIndex: 0,
    imageList: [],
    currentType: 'still', // 'still' or 'photo'
    scale: 1,
    translateX: 0,
    translateY: 0,
    isDragging: false,
    lastPanPoint: { x: 0, y: 0 },
    maxScale: 3,
    minScale: 1,
    animationFrameId: null,
    lastPanTime: 0,
    panThrottleDelay: 16 // ~60fps
};

/**
 * Creates or gets the advanced overlay for image viewing
 */
function createAdvancedOverlay() {
    let overlay = document.getElementById('advanced-image-overlay');
    
    if (!overlay) {
        overlay = document.createElement('div');
        overlay.id = 'advanced-image-overlay';
        overlay.className = 'advanced-overlay';
        
        const container = document.createElement('div');
        container.className = 'advanced-image-container';
        
        const imageWrapper = document.createElement('div');
        imageWrapper.className = 'advanced-image-wrapper';
        
        const image = document.createElement('img');
        image.className = 'advanced-image';
        image.id = 'advanced-current-image';
          // Control buttons
        const closeButton = document.createElement('button');
        closeButton.className = 'advanced-close-btn';
        closeButton.innerHTML = `
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <line x1="18" y1="6" x2="6" y2="18"></line>
                <line x1="6" y1="6" x2="18" y2="18"></line>
            </svg>
        `;
        closeButton.setAttribute('aria-label', 'Close image viewer');
        
        const prevButton = document.createElement('button');
        prevButton.className = 'advanced-nav-btn advanced-prev-btn';
        prevButton.innerHTML = `
            <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <polyline points="15,18 9,12 15,6"></polyline>
            </svg>
        `;
        prevButton.setAttribute('aria-label', 'Previous image');
        
        const nextButton = document.createElement('button');
        nextButton.className = 'advanced-nav-btn advanced-next-btn';
        nextButton.innerHTML = `
            <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <polyline points="9,18 15,12 9,6"></polyline>
            </svg>
        `;
        nextButton.setAttribute('aria-label', 'Next image');
        
        const zoomControls = document.createElement('div');
        zoomControls.className = 'advanced-zoom-controls';
          const zoomInBtn = document.createElement('button');
        zoomInBtn.className = 'advanced-zoom-btn';
        zoomInBtn.innerHTML = `
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <circle cx="11" cy="11" r="8"></circle>
                <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
                <line x1="11" y1="8" x2="11" y2="14"></line>
                <line x1="8" y1="11" x2="14" y2="11"></line>
            </svg>
        `;
        zoomInBtn.setAttribute('aria-label', 'Zoom in');
          const zoomOutBtn = document.createElement('button');
        zoomOutBtn.className = 'advanced-zoom-btn';
        zoomOutBtn.innerHTML = `
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <circle cx="11" cy="11" r="8"></circle>
                <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
                <line x1="8" y1="11" x2="14" y2="11"></line>
            </svg>
        `;
        zoomOutBtn.setAttribute('aria-label', 'Zoom out');
        
        // Counter display
        const counter = document.createElement('div');
        counter.className = 'advanced-counter';
        counter.id = 'advanced-counter';
          // Assemble the overlay
        zoomControls.appendChild(zoomInBtn);
        zoomControls.appendChild(zoomOutBtn);
        
        imageWrapper.appendChild(image);
        container.appendChild(imageWrapper);
        container.appendChild(closeButton);
        container.appendChild(prevButton);
        container.appendChild(nextButton);
        container.appendChild(zoomControls);
        container.appendChild(counter);
        
        overlay.appendChild(container);
        document.body.appendChild(overlay);
        
        // Add event listeners
        setupOverlayEventListeners(overlay, container, image, imageWrapper);
    }
    
    return overlay;
}

/**
 * Sets up all event listeners for the advanced overlay
 */
function setupOverlayEventListeners(overlay, container, image, imageWrapper) {
    // Close button
    overlay.querySelector('.advanced-close-btn').addEventListener('click', closeAdvancedViewer);
    
    // Navigation buttons
    overlay.querySelector('.advanced-prev-btn').addEventListener('click', showPreviousImage);
    overlay.querySelector('.advanced-next-btn').addEventListener('click', showNextImage);    // Zoom controls
    overlay.querySelector('.advanced-zoom-controls').addEventListener('click', (e) => {
        const button = e.target.closest('.advanced-zoom-btn');
        if (!button) return;
        
        const zoomBtns = overlay.querySelectorAll('.advanced-zoom-btn');
        const buttonIndex = Array.from(zoomBtns).indexOf(button);
        
        if (buttonIndex === 0) zoomIn();        // First button: zoom in
        else if (buttonIndex === 1) zoomOut(); // Second button: zoom out
    });
    
    // Keyboard navigation
    document.addEventListener('keydown', handleKeyPress);
    
    // Mouse wheel zoom
    imageWrapper.addEventListener('wheel', handleWheelZoom, { passive: false });
    
    // Pan functionality (mouse)
    imageWrapper.addEventListener('mousedown', startPan);
    document.addEventListener('mousemove', handlePan);
    document.addEventListener('mouseup', endPan);
    
    // Pan functionality (touch)
    imageWrapper.addEventListener('touchstart', handleTouchStart, { passive: false });
    imageWrapper.addEventListener('touchmove', handleTouchMove, { passive: false });
    imageWrapper.addEventListener('touchend', handleTouchEnd);
    
    // Background click to close
    overlay.addEventListener('click', (e) => {
        if (e.target === overlay) {
            closeAdvancedViewer();
        }
    });
    
    // Double click to zoom
    imageWrapper.addEventListener('dblclick', handleDoubleClick);
}

/**
 * Opens the advanced image viewer
 * @param {HTMLImageElement} imgElement - The clicked image element
 */
export function openAdvancedViewer(imgElement) {
    // Get all images of the same type from the current page
    const isStill = imgElement.classList.contains('styled-still');
    const isPhoto = imgElement.classList.contains('styled-photo');
    
    if (!isStill && !isPhoto) return;
    
    imageGalleryState.currentType = isStill ? 'still' : 'photo';
    
    // Get all images of the same type
    const selector = isStill ? '.styled-still' : '.styled-photo';
    const allImages = Array.from(document.querySelectorAll(selector));
    
    imageGalleryState.imageList = allImages;
    imageGalleryState.currentImageIndex = allImages.indexOf(imgElement);
    imageGalleryState.isActive = true;
    
    // Create and show overlay
    const overlay = createAdvancedOverlay();
    loadCurrentImage();
    showOverlay();
    
    // Disable body scroll
    document.body.classList.add('no-scroll');
    document.documentElement.classList.add('no-scroll');
}

/**
 * Shows the overlay with animation
 */
function showOverlay() {
    const overlay = document.getElementById('advanced-image-overlay');
    overlay.style.display = 'flex';
    requestAnimationFrame(() => {
        overlay.classList.add('active');
    });
}

/**
 * Loads the current image into the viewer
 */
function loadCurrentImage() {
    const overlay = document.getElementById('advanced-image-overlay');
    const image = overlay.querySelector('.advanced-image');
    const counter = overlay.querySelector('.advanced-counter');
    
    const currentImg = imageGalleryState.imageList[imageGalleryState.currentImageIndex];
    
    if (currentImg) {
        // Clear cached elements when loading new image
        imageGalleryState.cachedElements = null;
        
        image.src = currentImg.src;
        image.alt = currentImg.alt || 'Gallery image';
        
        // Update counter
        counter.textContent = `${imageGalleryState.currentImageIndex + 1} / ${imageGalleryState.imageList.length}`;
        
        // Reset zoom and pan
        resetZoom();
        
        // Update navigation button visibility
        updateNavigationButtons();
    }
}

/**
 * Updates navigation button visibility
 */
function updateNavigationButtons() {
    const overlay = document.getElementById('advanced-image-overlay');
    const prevBtn = overlay.querySelector('.advanced-prev-btn');
    const nextBtn = overlay.querySelector('.advanced-next-btn');
    
    prevBtn.style.opacity = imageGalleryState.currentImageIndex > 0 ? '1' : '0.3';
    nextBtn.style.opacity = imageGalleryState.currentImageIndex < imageGalleryState.imageList.length - 1 ? '1' : '0.3';
    
    prevBtn.disabled = imageGalleryState.currentImageIndex === 0;
    nextBtn.disabled = imageGalleryState.currentImageIndex === imageGalleryState.imageList.length - 1;
}

/**
 * Shows the previous image
 */
function showPreviousImage() {
    if (imageGalleryState.currentImageIndex > 0) {
        imageGalleryState.currentImageIndex--;
        loadCurrentImage();
    }
}

/**
 * Shows the next image
 */
function showNextImage() {
    if (imageGalleryState.currentImageIndex < imageGalleryState.imageList.length - 1) {
        imageGalleryState.currentImageIndex++;
        loadCurrentImage();
    }
}

/**
 * Handles keyboard navigation
 */
function handleKeyPress(e) {
    if (!imageGalleryState.isActive) return;
    
    switch (e.key) {
        case 'Escape':
            closeAdvancedViewer();
            break;
        case 'ArrowLeft':
            e.preventDefault();
            showPreviousImage();
            break;
        case 'ArrowRight':
            e.preventDefault();
            showNextImage();
            break;
        case '+':
        case '=':
            e.preventDefault();
            zoomIn();
            break;
        case '-':
            e.preventDefault();
            zoomOut();
            break;
        case '0':
            e.preventDefault();
            resetZoom();
            break;
    }
}

/**
 * Handles mouse wheel zoom
 */
function handleWheelZoom(e) {
    e.preventDefault();
    
    const delta = e.deltaY > 0 ? -0.1 : 0.1;
    const newScale = Math.max(imageGalleryState.minScale, Math.min(imageGalleryState.maxScale, imageGalleryState.scale + delta));
    
    if (newScale !== imageGalleryState.scale) {
        imageGalleryState.scale = newScale;
        
        // Auto-center when zooming out
        if (delta < 0) {
            autoCenter();
        }
        
        constrainPan();
        updateImageTransform();
    }
}

/**
 * Zoom in
 */
function zoomIn() {
    if (imageGalleryState.scale < imageGalleryState.maxScale) {
        imageGalleryState.scale = Math.min(imageGalleryState.maxScale, imageGalleryState.scale + 0.2);
        autoCenter();
        constrainPan();
        updateImageTransform();
    }
}

/**
 * Zoom out
 */
function zoomOut() {
    if (imageGalleryState.scale > imageGalleryState.minScale) {
        imageGalleryState.scale = Math.max(imageGalleryState.minScale, imageGalleryState.scale - 0.2);
        
        // Auto-center the image when it fits within the viewport
        autoCenter();
        constrainPan();
        updateImageTransform();
    }
}

/**
 * Auto-center the image when it fits within the viewport
 */
function autoCenter() {
    // Cache DOM elements if not cached
    if (!imageGalleryState.cachedElements) {
        const overlay = document.getElementById('advanced-image-overlay');
        imageGalleryState.cachedElements = {
            image: overlay?.querySelector('.advanced-image'),
            wrapper: overlay?.querySelector('.advanced-image-wrapper')
        };
    }
    
    const { image, wrapper } = imageGalleryState.cachedElements;
    if (!image || !wrapper) return;
    
    // Use natural dimensions to avoid expensive getBoundingClientRect calls
    const imageNaturalWidth = image.naturalWidth || image.offsetWidth;
    const imageNaturalHeight = image.naturalHeight || image.offsetHeight;
    const wrapperWidth = wrapper.offsetWidth;
    const wrapperHeight = wrapper.offsetHeight;
    
    // Calculate scaled dimensions
    const scaledWidth = imageNaturalWidth * imageGalleryState.scale;
    const scaledHeight = imageNaturalHeight * imageGalleryState.scale;
    
    // If the image fits within the viewport, center it
    if (scaledWidth <= wrapperWidth) {
        imageGalleryState.translateX = 0;
    }
    if (scaledHeight <= wrapperHeight) {
        imageGalleryState.translateY = 0;
    }
}

/**
 * Reset zoom and pan
 */
function resetZoom() {
    imageGalleryState.scale = 1;
    imageGalleryState.translateX = 0;
    imageGalleryState.translateY = 0;
    imageGalleryState.cachedElements = null; // Clear cache
    updateImageTransform();
}

/**
 * Handle double click to zoom
 */
function handleDoubleClick(e) {
    e.preventDefault();
    
    if (imageGalleryState.scale === 1) {
        imageGalleryState.scale = 2;
    } else {
        resetZoom();
    }
    
    updateImageTransform();
}

/**
 * Start panning (mouse)
 */
function startPan(e) {
    if (imageGalleryState.scale > 1) {
        imageGalleryState.isDragging = true;
        imageGalleryState.lastPanPoint = { x: e.clientX, y: e.clientY };
        e.preventDefault();
    }
}

/**
 * Handle panning (mouse)
 */
function handlePan(e) {
    if (!imageGalleryState.isDragging || imageGalleryState.scale <= 1) return;
    
    const now = performance.now();
    if (now - imageGalleryState.lastPanTime < imageGalleryState.panThrottleDelay) return;
    
    const deltaX = e.clientX - imageGalleryState.lastPanPoint.x;
    const deltaY = e.clientY - imageGalleryState.lastPanPoint.y;
    
    imageGalleryState.translateX += deltaX;
    imageGalleryState.translateY += deltaY;
    
    // Constrain panning to image bounds
    constrainPan();
    
    imageGalleryState.lastPanPoint = { x: e.clientX, y: e.clientY };
    imageGalleryState.lastPanTime = now;
    updateImageTransform();
}

/**
 * End panning (mouse)
 */
function endPan() {
    imageGalleryState.isDragging = false;
}

/**
 * Handle touch start
 */
function handleTouchStart(e) {
    if (e.touches.length === 1 && imageGalleryState.scale > 1) {
        imageGalleryState.isDragging = true;
        imageGalleryState.lastPanPoint = { x: e.touches[0].clientX, y: e.touches[0].clientY };
        e.preventDefault();
    }
}

/**
 * Handle touch move
 */
function handleTouchMove(e) {
    if (!imageGalleryState.isDragging || e.touches.length !== 1 || imageGalleryState.scale <= 1) return;
    
    const now = performance.now();
    if (now - imageGalleryState.lastPanTime < imageGalleryState.panThrottleDelay) return;
    
    const deltaX = e.touches[0].clientX - imageGalleryState.lastPanPoint.x;
    const deltaY = e.touches[0].clientY - imageGalleryState.lastPanPoint.y;
    
    imageGalleryState.translateX += deltaX;
    imageGalleryState.translateY += deltaY;
    
    constrainPan();
    
    imageGalleryState.lastPanPoint = { x: e.touches[0].clientX, y: e.touches[0].clientY };
    imageGalleryState.lastPanTime = now;
    updateImageTransform();
    e.preventDefault();
}

/**
 * Handle touch end
 */
function handleTouchEnd() {
    imageGalleryState.isDragging = false;
}

/**
 * Constrain panning to image bounds
 */
function constrainPan() {
    // Cache DOM elements if not cached
    if (!imageGalleryState.cachedElements) {
        const overlay = document.getElementById('advanced-image-overlay');
        imageGalleryState.cachedElements = {
            image: overlay?.querySelector('.advanced-image'),
            wrapper: overlay?.querySelector('.advanced-image-wrapper')
        };
    }
    
    const { image, wrapper } = imageGalleryState.cachedElements;
    if (!image || !wrapper) return;
    
    // Use natural dimensions to avoid expensive getBoundingClientRect calls
    const imageNaturalWidth = image.naturalWidth || image.offsetWidth;
    const imageNaturalHeight = image.naturalHeight || image.offsetHeight;
    const wrapperWidth = wrapper.offsetWidth;
    const wrapperHeight = wrapper.offsetHeight;
    
    // Calculate scaled dimensions
    const scaledWidth = imageNaturalWidth * imageGalleryState.scale;
    const scaledHeight = imageNaturalHeight * imageGalleryState.scale;
    
    // Calculate max allowed translation
    const maxX = Math.max(0, (scaledWidth - wrapperWidth) / 2);
    const maxY = Math.max(0, (scaledHeight - wrapperHeight) / 2);
    
    // Constrain translation
    imageGalleryState.translateX = Math.max(-maxX, Math.min(maxX, imageGalleryState.translateX));
    imageGalleryState.translateY = Math.max(-maxY, Math.min(maxY, imageGalleryState.translateY));
}

/**
 * Update image transform
 */
function updateImageTransform() {
    if (imageGalleryState.animationFrameId) {
        cancelAnimationFrame(imageGalleryState.animationFrameId);
    }
    
    imageGalleryState.animationFrameId = requestAnimationFrame(() => {
        const overlay = document.getElementById('advanced-image-overlay');
        const image = overlay?.querySelector('.advanced-image');
        
        if (image) {
            const transformX = imageGalleryState.translateX / imageGalleryState.scale;
            const transformY = imageGalleryState.translateY / imageGalleryState.scale;
            image.style.transform = `scale(${imageGalleryState.scale}) translate(${transformX}px, ${transformY}px)`;
        }
    });
}

/**
 * Close the advanced viewer
 */
function closeAdvancedViewer() {
    const overlay = document.getElementById('advanced-image-overlay');
    
    if (overlay) {
        overlay.classList.remove('active');
        
        setTimeout(() => {
            overlay.style.display = 'none';
            resetZoom();
        }, 300);
    }
    
    // Re-enable body scroll
    document.body.classList.remove('no-scroll');
    document.documentElement.classList.remove('no-scroll');
    
    // Clean up animation frames
    if (imageGalleryState.animationFrameId) {
        cancelAnimationFrame(imageGalleryState.animationFrameId);
        imageGalleryState.animationFrameId = null;
    }
    
    // Reset state
    imageGalleryState.isActive = false;
    imageGalleryState.currentImageIndex = 0;
    imageGalleryState.imageList = [];
    imageGalleryState.cachedElements = null;
    imageGalleryState.isDragging = false;
}

/**
 * Setup hover effects for images to show zoom icon
 */
export function setupImageHoverEffects() {
    // Create hover zoom icons for all images
    const images = document.querySelectorAll('.styled-still, .styled-photo');
    
    images.forEach(img => {
        // Check if hover overlay already exists to avoid duplicates
        const container = img.closest('.image-container');
        if (container && !container.querySelector('.image-hover-overlay')) {
            // Create zoom icon overlay
            const hoverOverlay = document.createElement('div');
            hoverOverlay.className = 'image-hover-overlay';
            
            const zoomIcon = document.createElement('div');
            zoomIcon.className = 'image-zoom-icon';
            zoomIcon.innerHTML = '🔍';
            
            hoverOverlay.appendChild(zoomIcon);
            
            // Find the image container and add the overlay
            container.style.position = 'relative';
            container.appendChild(hoverOverlay);
        }
    });
}

/**
 * Setup the advanced image focus system
 */
export function setupAdvancedImageFocus() {
    // Remove existing event listeners
    document.removeEventListener('click', handleAdvancedImageClick);
    
    // Add new event listener
    document.addEventListener('click', handleAdvancedImageClick);
    
    // Setup hover effects
    setupImageHoverEffects();
}

/**
 * Handle image clicks for advanced viewer
 */
function handleAdvancedImageClick(e) {
    if (e.target && (e.target.classList.contains('styled-still') || e.target.classList.contains('styled-photo'))) {
        if (!document.querySelector('.advanced-overlay.active')) {
            e.preventDefault();
            openAdvancedViewer(e.target);
        }
    }
}
