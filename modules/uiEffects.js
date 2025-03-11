export function setupImageFocus() {
    document.addEventListener('click', (e) => {
        if (e.target && e.target.classList.contains('styled-still')) {
            openImageOverlay(e.target);
        }
    });
}

function openImageOverlay(imageElement) {
    const scrollY = window.scrollY;
    document.documentElement.style.setProperty('--scroll-position', `-${scrollY}px`);
    document.body.classList.add('overlay-open');
    
    const overlay = document.createElement('div');
    overlay.classList.add('overlay');

    const expandedImgContainer = document.createElement('div');
    expandedImgContainer.classList.add('expanded-image-container');

    const expandedImg = imageElement.cloneNode(true);
    expandedImg.classList.add('expanded-image');

    expandedImgContainer.appendChild(expandedImg);
    overlay.appendChild(expandedImgContainer);
    document.body.appendChild(overlay);

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