/**
 * Home Page Animation Module
 * Handles Intersection Observer-based fade-in animations for home page elements
 */

/**
 * Sets up home page animations using Intersection Observer
 */
export function setupHomeAnimations() {
    console.log('Setting up home page animations...');
    
    // Check if we're on the home page
    const homeContainer = document.getElementById('home-content');
    if (!homeContainer) {
        console.log('Home container not found, skipping home animations');
        return;
    }

    // Wait a bit for content to be fully rendered
    setTimeout(() => {
        // Initialize animations when home page becomes visible
        const initializeWhenVisible = () => {
            const fadeElements = homeContainer.querySelectorAll('.fade-in-element');
            if (fadeElements.length > 0) {
                console.log(`Found ${fadeElements.length} fade-in elements on home page`);
                animateHomeElements(fadeElements);
            } else {
                console.log('No fade-in elements found, retrying in 500ms...');
                setTimeout(initializeWhenVisible, 500);
            }
        };

        // Check if home page is currently visible
        const homePageVisible = homeContainer.offsetParent !== null && 
                                !homeContainer.hidden && 
                                homeContainer.style.display !== 'none';

        if (homePageVisible) {
            // Initialize immediately if home page is visible
            initializeWhenVisible();
        } else {
            // Set up observer to initialize when home page becomes visible
            const pageObserver = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        initializeWhenVisible();
                        pageObserver.disconnect(); // Only run once
                    }
                });
            }, { threshold: 0.1 });

            pageObserver.observe(homeContainer);
        }
    }, 200); // Give time for Alpine.js to render content
}

/**
 * Animates home page elements with fade-in effect using Intersection Observer
 * @param {NodeList} elements - List of elements to animate
 */
function animateHomeElements(elements) {
    // Fallback for browsers without Intersection Observer support
    if (!window.IntersectionObserver) {
        console.log('IntersectionObserver not supported, using fallback animation for home page');
        elements.forEach((element, index) => {
            setTimeout(() => {
                element.classList.add('visible');
            }, index * 150);
        });
        return;
    }

    // Create intersection observer for home page animations
    const observerOptions = {
        threshold: 0.15, // Trigger when 15% of the element is visible
        rootMargin: '0px 0px -30px 0px' // Start animation when element is 30px from entering viewport
    };

    const observer = new IntersectionObserver((entries) => {
        let visibleEntries = entries.filter(entry => 
            entry.isIntersecting && !entry.target.classList.contains('visible')
        );
        
        visibleEntries.forEach((entry, index) => {
            // Add staggered delay for smooth sequential animation
            const delay = getStaggerDelay(entry.target, index);
            
            setTimeout(() => {
                if (entry.target && !entry.target.classList.contains('visible')) {
                    entry.target.classList.add('visible');
                    console.log('Animating home element:', entry.target.className);
                }
            }, delay);
            
            // Stop observing this element once animated
            observer.unobserve(entry.target);
        });
    }, observerOptions);

    // Reset animation state and observe all elements
    elements.forEach((element) => {
        element.classList.remove('visible');
        observer.observe(element);
    });

    // Force check for initially visible elements after a short delay
    setTimeout(() => {
        elements.forEach((element) => {
            const rect = element.getBoundingClientRect();
            const isVisible = rect.top < window.innerHeight && rect.bottom > 0;
            
            if (isVisible && !element.classList.contains('visible')) {
                element.classList.add('visible');
                observer.unobserve(element);
            }
        });
    }, 200);

    console.log(`Set up intersection observer for ${elements.length} home page elements`);
    return observer;
}

/**
 * Calculate stagger delay for elements based on their type and position
 * @param {Element} element - The element to animate
 * @param {number} index - Base index for fallback
 * @returns {number} Delay in milliseconds
 */
function getStaggerDelay(element, index) {
    // Welcome section - no delay (animate immediately)
    if (element.classList.contains('welcome-section')) {
        return 0;
    }
    
    // Video sections - slight delay after welcome
    if (element.classList.contains('looping-video-section')) {
        const videoIndex = Array.from(element.parentElement.children).indexOf(element);
        return 200 + (videoIndex * 150);
    }
    
    // Personal info grid elements - staggered based on grid position
    if (element.closest('.personal-info-grid')) {
        const gridElements = element.parentElement.querySelectorAll('.fade-in-element');
        const gridIndex = Array.from(gridElements).indexOf(element);
        return 400 + (gridIndex * 200);
    }
    
    // Education section and items
    if (element.classList.contains('education-section')) {
        return 800;
    }
    
    if (element.classList.contains('education-item')) {
        const eduElements = element.parentElement.querySelectorAll('.education-item');
        const eduIndex = Array.from(eduElements).indexOf(element);
        return 1000 + (eduIndex * 150);
    }
    
    // Navigation cards
    if (element.classList.contains('navigation-cards')) {
        return 1200;
    }
    
    if (element.classList.contains('nav-card')) {
        const cardElements = element.parentElement.querySelectorAll('.nav-card');
        const cardIndex = Array.from(cardElements).indexOf(element);
        return 1400 + (cardIndex * 100);
    }
    
    // Default stagger based on DOM order
    return index * 150;
}

/**
 * Re-initialize home animations (useful for page re-entry)
 */
export function reinitializeHomeAnimations() {
    console.log('Re-initializing home page animations...');
    
    const homeContainer = document.getElementById('home-content');
    if (!homeContainer) return;
    
    // Reset all animation states
    const fadeElements = homeContainer.querySelectorAll('.fade-in-element');
    fadeElements.forEach(element => {
        element.classList.remove('visible');
    });
    
    // Re-setup animations with a small delay
    setTimeout(() => {
        setupHomeAnimations();
    }, 100);
}
