export function setupNavigation() {
    const buttons = document.querySelectorAll('[data-page]');
    
    buttons.forEach(button => {
        button.addEventListener('click', (e) => {
            e.preventDefault();
            const path = button.dataset.page;
            history.pushState({}, '', path);
            loadContent(path);
        });
    });

    // Handle browser back/forward
    window.addEventListener('popstate', () => {
        loadContent(window.location.pathname);
    });
}

function loadContent(path) {
    // Add your content loading logic here
    const content = document.getElementById('content');
    // Update content based on path
    
    // This is a placeholder for your actual implementation
    console.log(`Loading content for path: ${path}`);
}