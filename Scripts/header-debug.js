// Debug script to monitor header behavior
(function() {
    console.log('Header debug script loaded');
    
    // Monitor header element
    const header = document.querySelector('.header-container');
    if (header) {
        console.log('Header found:', header);
        
        // Monitor style changes
        const observer = new MutationObserver(function(mutations) {
            mutations.forEach(function(mutation) {
                if (mutation.type === 'attributes' && mutation.attributeName === 'style') {
                    console.log('Header style changed:', header.style.cssText);
                }
            });
        });
        
        observer.observe(header, { 
            attributes: true, 
            attributeFilter: ['style', 'class'] 
        });
        
        // Monitor computed styles on scroll
        let lastScrollY = window.scrollY;
        window.addEventListener('scroll', function() {
            const currentScrollY = window.scrollY;
            const computedStyle = window.getComputedStyle(header);
            
            if (Math.abs(currentScrollY - lastScrollY) > 10) { // Only log significant scroll changes
                console.log('Scroll position:', currentScrollY);
                console.log('Header position:', computedStyle.position);
                console.log('Header top:', computedStyle.top);
                console.log('Header transform:', computedStyle.transform);
                console.log('Header opacity:', computedStyle.opacity);
                console.log('Header visibility:', computedStyle.visibility);
                console.log('---');
                lastScrollY = currentScrollY;
            }
        });
        
        // Log initial state
        setTimeout(() => {
            const computedStyle = window.getComputedStyle(header);
            console.log('Initial header state:');
            console.log('Position:', computedStyle.position);
            console.log('Top:', computedStyle.top);
            console.log('Transform:', computedStyle.transform);
            console.log('Opacity:', computedStyle.opacity);
            console.log('Visibility:', computedStyle.visibility);
        }, 1000);
    } else {
        console.error('Header not found!');
    }
})();
