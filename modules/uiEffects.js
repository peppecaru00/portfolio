/**
 * Sets up click handlers for expanding images
 * @param {string} [selector='.styled-still, .styled-photo'] - CSS selector for images that can be expanded
 */
export function setupImageFocus(selector = '.styled-still, .styled-photo') {
    document.addEventListener('click', (e) => {
        if (e.target && (e.target.classList.contains('styled-still') || e.target.classList.contains('styled-photo'))) {
            openImageOverlay(e.target);
        }
    });
}
function openImageOverlay(imageElement) {
    const scrollY = window.scrollY;
    document.documentElement.style.setProperty('--scroll-position', `-${scrollY}px`);
    document.body.classList.add('overlay-open');

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
            expandedImg.classList.add('zoomed');
            zoomButton.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line><line x1="8" y1="11" x2="14" y2="11"></line></svg>';
        } else {
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
}

function closeImageOverlay(overlay, expandedImgContainer, scrollY) {
    document.body.classList.remove('overlay-open');
    document.body.style.position = '';
    document.body.style.top = '';
    window.scrollTo(0, scrollY);

    overlay.classList.remove('active');
    expandedImgContainer.classList.remove('active');
    setTimeout(() => overlay.remove(), 300);
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