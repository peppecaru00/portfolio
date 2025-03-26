export function setupCustomCursor() {
    // Create cursor element
    const cursor = document.createElement('div');
    cursor.className = 'cursor-dot';
    document.body.appendChild(cursor);

    // Add icon element inside cursor with offset
    const icon = document.createElement('div');
    icon.className = 'cursor-icon';
    icon.innerHTML = `<img src="./Cursors/focus.svg" alt="expand" width="36" height="24">`; // You can use any icon

    // Create close icon
    const closeIcon = document.createElement('div');
    closeIcon.className = "close-icon";
    closeIcon.innerHTML = `<img src="./Cursors/back-arrow.svg" alt="close" width="32" height="15">`;
    closeIcon.style.display = "none"; // Hide by default
   
    cursor.appendChild(closeIcon);
    cursor.appendChild(icon);


    // Variables for drag effect
    let mouseX = 0;
    let mouseY = 0;
    let cursorX = 0;
    let cursorY = 0;
    const dragFactor = 0.5; // Adjust for more/less drag (lower = more drag)

    // Track mouse movement
    window.addEventListener('mousemove', (e) => {
        // Store the actual mouse position
        mouseX = e.clientX;
        mouseY = e.clientY;

                // Check what's under the cursor right now
        checkElementsUnderCursor(e.clientX, e.clientY);
   
    });

    // Function to check elements under cursor at any position
    function checkElementsUnderCursor(x, y) {
        // Get element directly under cursor position
        const elementUnderCursor = document.elementFromPoint(x, y);
        
        if (!elementUnderCursor) return;
        
        // Check if we're over an overlay or its children
        const isOverOverlay = elementUnderCursor.closest('.overlay') !== null;

         // Check if we're over the zoom button
        const isOverZoomButton = elementUnderCursor.closest('.zoom-button') !== null;
    
        if (isOverZoomButton) {
            // Use normal cursor for zoom button despite being in overlay
            icon.style.display = 'block';
            closeIcon.style.display = 'none';
            cursor.classList.remove('close-icon');
            cursor.classList.remove('show-icon');
            cursor.style.width = '1.5em'; 
            cursor.style.height = '1.5em';}
            
        else if (isOverOverlay) {
            // Show close icon for overlay
            icon.style.display = 'none';
            closeIcon.style.display = 'block';
            cursor.classList.add('close-icon');
            cursor.classList.remove('show-icon');
            cursor.style.width = '1.5em';
            cursor.style.height = '1.5em';
        } else {
            // Handle other elements
            closeIcon.style.display = 'none';
            
            if (elementUnderCursor.classList.contains('styled-photo') || 
                elementUnderCursor.classList.contains('styled-still')) {
                // Show expand icon for images
                icon.style.display = 'block';
                cursor.classList.add('show-icon');
                cursor.style.width = '1.5em';
                cursor.style.height = '1.5em';
            } else {
                // Default cursor for other elements
                icon.style.display = 'block';
                cursor.classList.remove('show-icon');
                cursor.classList.remove('close-icon');
                
                // Check if it's a clickable element
                const isClickable = elementUnderCursor.matches('a, button, .nav-button, [role="button"]');
                cursor.style.width = isClickable ? '1.5em' : '1em';
                cursor.style.height = isClickable ? '1.5em' : '1em';
            }
        }
    }
    

    // Animation loop for smooth drag effect
    function animateCursor() {
        // Calculate drag with easing
        cursorX += (mouseX - cursorX) * dragFactor;
        cursorY += (mouseY - cursorY) * dragFactor;

        // Apply position
        cursor.style.left = `${cursorX}px`;
        cursor.style.top = `${cursorY}px`;

        requestAnimationFrame(animateCursor);
    }

    // Start animation loop
    animateCursor();

    // Set up observer to detect when overlay is added
    const observer = new MutationObserver((mutations) => {
        mutations.forEach(mutation => {
            if (mutation.type === 'childList' && 
                (mutation.addedNodes.length > 0 || mutation.removedNodes.length > 0)) {
                // Something changed in the DOM - check what's under cursor now
                checkElementsUnderCursor(mouseX, mouseY);
            }
        });
    });

    observer.observe(document.body, { childList: true, subtree: true });


    // Optional: Scale effect on clickable elements
    document.querySelectorAll('a, button, .nav-button, .styled-photo, .styled-still ,  [role="button"]').forEach(item => {
        item.addEventListener('mouseenter', () => {
            cursor.style.width = '1.5em';
            cursor.style.height = '1.5em';
        });
        item.addEventListener('mouseleave', () => {
            cursor.style.width = '1em';
            cursor.style.height = '1em';
        });
    });

    // Add hover effects for photos
    document.addEventListener('mouseover', (e) => {
        if (e.target.classList.contains('styled-photo')) {
            cursor.classList.add('show-icon');
            cursor.style.width = '1.5em';
            cursor.style.height = '1.5em';
        }
    });

    document.addEventListener('mouseout', (e) => {
        if (e.target.classList.contains('styled-photo')) {
            cursor.classList.remove('show-icon');
            cursor.style.width = '1em';
            cursor.style.height = '1em';
        }
    });

    // Add hover effects for stills
    document.addEventListener('mouseover', (e) => {
        if (e.target.classList.contains('styled-still')) {
            cursor.classList.add('show-icon');
            cursor.style.width = '1.5em';
            cursor.style.height = '1.5em';
        }
    });

    document.addEventListener('mouseout', (e) => {
        if (e.target.classList.contains('styled-still')) {
            cursor.classList.remove('show-icon');
            cursor.style.width = '1em';
            cursor.style.height = '1em';
        }
    });

    
    document.addEventListener('mouseover', (e) => {
        if (e.target.classList.contains('overlay') || e.target.closest('.overlay')) {
            icon.style.display = 'none';
            closeIcon.style.display = 'block';
            cursor.classList.add('close-icon');
            cursor.classList.remove('show-icon');
            cursor.style.width = '1.5em';
            cursor.style.height = '1.5em';
        }
    });

    document.addEventListener('mouseout', (e) => {
        if (e.target.classList.contains('overlay') || e.target.closest('.overlay')) {
            icon.style.display = 'block';
            closeIcon.style.display = 'none';
            cursor.classList.remove('close-icon');
        }
    });



    // Hide cursor when mouse leaves window
    document.addEventListener('mouseleave', () => {
        cursor.style.opacity = '0';
    });

    document.addEventListener('mouseenter', () => {
        cursor.style.opacity = '1';
    });

}