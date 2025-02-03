function groupImages(imageList) {
    return imageList.reduce((groups, image) => {
        const prefix = image.split('-')[0];
        if (!groups[prefix]) groups[prefix] = [];
        groups[prefix].push(image);
        return groups;
    }, {});
}

function mapImages(imageList) {
    const container = document.getElementById('media-container');
    const folderPath = 'Media/Stills/';
    const groups = groupImages(imageList);

    Object.entries(groups).forEach(([groupName, images]) => {
        const groupContainer = document.createElement('div');
        groupContainer.classList.add('group-container');
        
        const title = document.createElement('h2');
        title.textContent = groupName;
        title.classList.add('group-title');
        
        const carousel = document.createElement('div');
        carousel.classList.add('group-images');
        
        images.forEach(imageName => {
            const imgDiv = document.createElement('div');
            imgDiv.classList.add('image-container');
            
            const img = document.createElement('img');
            img.src = folderPath + imageName;
            img.classList.add('styled-still');
            
            imgDiv.appendChild(img);
            carousel.appendChild(imgDiv);
        });
        
        groupContainer.appendChild(title);
        groupContainer.appendChild(carousel);
        container.appendChild(groupContainer);
    });
}

document.addEventListener('DOMContentLoaded', () => {
    console.log("DOM Content Loaded"); // Debug log

    // Fetch images and map them
    fetch('imageList.json')
        .then(response => response.json())
        .then(images => {
            console.log('Images loaded:', images); // Debug log
            mapImages(images);
        })
        .catch(error => console.error('Error loading images:', error));

    let lastScrollTop = 0;
    const navbar = document.querySelector('.header-container');
    console.log('Navbar element:', navbar); // Debug log
    let isManualScroll = false;

    window.addEventListener('scroll', () => {
        console.log('Scroll detected'); // Debug log
        isManualScroll = true;
    });
});

//image-focus
document.addEventListener('DOMContentLoaded', () => {
    document.addEventListener('click', (e) => {
        // Only handle clicks on non-expanded images
        if (e.target && 
            e.target.classList.contains('styled-still') && 
            !e.target.classList.contains('expanded-image')) {

            const overlay = document.createElement('div');
            overlay.classList.add('overlay');
            
            const expandedImg = e.target.cloneNode(true);
            expandedImg.classList.add('expanded-image');
            
            overlay.appendChild(expandedImg);
            document.body.appendChild(overlay);
            
            requestAnimationFrame(() => {
                overlay.classList.add('active');
                expandedImg.classList.add('active');
            });

            // Close on overlay click
            overlay.addEventListener('click', (evt) => {
                if (evt.target === overlay) {
                    overlay.classList.remove('active');
                    expandedImg.classList.remove('active');
                    setTimeout(() => overlay.remove(), 300);
                }
            });
        }
    });
});

//navigation
document.addEventListener('DOMContentLoaded', () => {
    const buttons = document.querySelectorAll('[data-page]');
    
    buttons.forEach(button => {
        button.addEventListener('click', (e) => {
            e.preventDefault();
            const path = button.dataset.page;
            history.pushState({}, '', path);
            loadContent(path);
        });
    });

    function loadContent(path) {
        // Add your content loading logic here
        const content = document.getElementById('content');
        // Update content based on path
    }

    // Handle browser back/forward
    window.addEventListener('popstate', () => {
        loadContent(window.location.pathname);
    });
});
