/**
 * Sets up click handlers for expanding images
 * @param {string} [selector='.styled-still, .styled-photo'] - CSS selector for images that can be expanded
 */
export function setupImageFocus(selector = '.styled-still, .styled-photo') {
    // Remove any existing event listener first
    document.removeEventListener('click', handleImageClick);
    
    // Add a single event listener
    document.addEventListener('click', handleImageClick);
    
    function handleImageClick(e) {
        if (e.target && (e.target.classList.contains('styled-still') || e.target.classList.contains('styled-photo'))) {
            // Check if an overlay is already open
            if (!document.querySelector('.overlay.active')) {
                openImageOverlay(e.target);
            }
        }
    }
}
function openImageOverlay(imageElement) {

    // Check if an overlay already exists and remove it
    const existingOverlay = document.querySelector('.overlay');
    if (existingOverlay) {
        existingOverlay.remove();
    }
    
    const scrollY = window.scrollY;
    document.documentElement.style.setProperty('--scroll-position', `-${scrollY}px`);
    document.body.classList.add('overlay-open');

    //add zoom button
    const zoomButton = document.createElement('button');
    zoomButton.classList.add('zoom-button');
    zoomButton.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line><line x1="11" y1="8" x2="11" y2="14"></line><line x1="8" y1="11" x2="14" y2="11"></line></svg>';
    zoomButton.setAttribute('aria-label', 'Zoom image');

    // Add zoom button functionality
    let isZoomed = false;
    zoomButton.addEventListener('click', (e) => {
        e.stopPropagation();
        isZoomed = !isZoomed;
        
        if (isZoomed) {
            expandedImgContainer.classList.add('zoomed');
            expandedImg.classList.add('zoomed');
            zoomButton.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line><line x1="8" y1="11" x2="14" y2="11"></line></svg>';
        } else {
            expandedImgContainer.classList.remove('zoomed');
            expandedImg.classList.remove('zoomed');
            zoomButton.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line><line x1="11" y1="8" x2="11" y2="14"></line><line x1="8" y1="11" x2="14" y2="11"></line></svg>';
        }
    });
      
    const overlay = document.createElement('div');
    overlay.classList.add('overlay');

    const expandedImgContainer = document.createElement('div');
    expandedImgContainer.classList.add('expanded-image-container');

    const expandedImg = imageElement.cloneNode(true);
    expandedImg.classList.add('expanded-image');

    expandedImgContainer.appendChild(expandedImg);
    overlay.appendChild(expandedImgContainer);
    document.body.appendChild(overlay);
    expandedImgContainer.appendChild(zoomButton);

    requestAnimationFrame(() => {
        overlay.classList.add('active');
        expandedImgContainer.classList.add('active');
    });

    overlay.addEventListener('click', (event) => {
        if (event.target === overlay) {
            closeImageOverlay(overlay, expandedImgContainer, scrollY);
        }
    });

    overlay.addEventListener('click', (event) => {
        if (event.target === overlay) {
            closeImageOverlay(overlay, expandedImgContainer, scrollY);
        }
    });
}

function closeImageOverlay(overlay, expandedImgContainer, scrollY) {
    // Immediately remove active classes to trigger transitions
    overlay.classList.remove('active');
    expandedImgContainer.classList.remove('active');
    
    // Remove body classes
    document.body.classList.remove('overlay-open');
    document.body.style.position = '';
    document.body.style.top = '';
    window.scrollTo(0, scrollY);

    // Wait for transitions to complete before removing elements
    setTimeout(() => {
        // Make sure the overlay still exists before trying to remove it
        if (document.body.contains(overlay)) {
            overlay.remove();
        }
    }, 300); // Match your CSS transition duration
}



export function setupScrollDetection() {
    let lastScrollTop = 0;
    const navbar = document.querySelector('.header-container');
    let isManualScroll = false;

    window.addEventListener('scroll', () => {
        isManualScroll = true;
        
        // Add your scroll logic here if needed
        // For example: navbar hide/show on scroll
    });
}