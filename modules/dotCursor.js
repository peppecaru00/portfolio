export function setupCustomCursor() {
    // Create cursor element
    const cursor = document.createElement('div');
    cursor.className = 'cursor-dot';
    document.body.appendChild(cursor);

    // Add icon element inside cursor with offset
    const icon = document.createElement('div');
    icon.className = 'cursor-icon';
    icon.innerHTML = `<img src="./Cursors/focus.svg" alt="expand" width="36" height="24">`; // You can use any icon

    const closeIcon = document.createElement('img');
    closeIcon.src = "./Cursors/arrow-back.svg"; // Use your close icon SVG
    closeIcon.width = 24;
    closeIcon.height = 24;
    closeIcon.alt = "close";
    closeIcon.className = "close-icon";
    closeIcon.style.display = "none"; // Hide by default
    icon.appendChild(closeIcon);

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
    });

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

        // Add hover effects for stills
        document.addEventListener('mouseover', (e) => {
            if (e.target.classList.contains('overlay')) {
                cursor.classList.add('show-icon');
                cursor.style.width = '1.5em';
                cursor.style.height = '1.5em';
            }
        });
    
        document.addEventListener('mouseout', (e) => {
            if (e.target.classList.contains('ovrelay')) {
                cursor.classList.remove('show-icon');
                cursor.style.width = '1em';
                cursor.style.height = '1em';
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