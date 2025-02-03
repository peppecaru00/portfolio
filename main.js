function groupImages(imageList) {
    return imageList.reduce((groups, image) => {
        const prefix = image.split('-')[0];
        if (!groups[prefix]) groups[prefix] = [];
        groups[prefix].push(image);
        return groups;
    }, {});
}

function mapImages(imageList) {
    const container = document.getElementById('stills-container');
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
document.addEventListener('click', (e) => {
    if (e.target && e.target.classList.contains('styled-still')) {
        const images = Array.from(document.querySelectorAll('.styled-still'));
        const currentIndex = images.indexOf(e.target);
        let currentImageIndex = currentIndex;

        const scrollPosition = window.scrollY;
        const scrollBarWidth = window.innerWidth - document.documentElement.clientWidth;

        // Lock scroll without jump
        document.body.style.position = 'fixed';
        document.body.style.top = `-${scrollPosition}px`;
        document.body.style.width = '100%';
        document.body.style.paddingRight = `${scrollBarWidth}px`;

        const overlay = document.createElement('div');
        overlay.classList.add('overlay');

        const expandedImgContainer = document.createElement('div');
        expandedImgContainer.classList.add('expanded-image-container');

        const expandedImg = e.target.cloneNode(true);
        expandedImg.classList.add('expanded-image');

        const prevButton = document.createElement('button');
        prevButton.classList.add('nav-button', 'prev');
        prevButton.innerHTML = '&larr;';
        prevButton.addEventListener('click', () => {
            currentImageIndex = (currentImageIndex - 1 + images.length) % images.length;
            expandedImg.src = images[currentImageIndex].src;
        });

        const nextButton = document.createElement('button');
        nextButton.classList.add('nav-button', 'next');
        nextButton.innerHTML = '&rarr;';
        nextButton.addEventListener('click', () => {
            currentImageIndex = (currentImageIndex + 1) % images.length;
            expandedImg.src = images[currentImageIndex].src;
        });

        expandedImgContainer.appendChild(expandedImg);
        overlay.appendChild(expandedImgContainer);
        overlay.appendChild(prevButton);
        overlay.appendChild(nextButton);
        document.body.appendChild(overlay);

        requestAnimationFrame(() => {
            overlay.classList.add('active');
            expandedImgContainer.classList.add('active');
        });

        overlay.addEventListener('click', (event) => {
            if (event.target === overlay) {
                // Restore scroll position smoothly
                document.body.style.position = '';
                document.body.style.top = '';
                document.body.style.paddingRight = '';
                document.body.style.width = '';
                window.scrollTo(0, scrollPosition);

                overlay.classList.remove('active');
                expandedImgContainer.classList.remove('active');
                setTimeout(() => overlay.remove(), 300);
            }
        });
    }
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
