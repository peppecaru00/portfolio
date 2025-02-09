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

function fetchVideoList() {
    return fetch('videoList.json')
        .then(response => response.json())
        .then(videoList => {
            mapVideos(videoList);
        })
        .catch(error => console.error('Error fetching video list:', error));
}

function initVideoPage() {
    fetchVideoList();
}

function mapVideos(videoList) {
    const container = document.getElementById('video-content');
    if (!container) {
        console.error('Video content container not found');
        return;
    }
    const folderPath = 'Media/Videos/';

    videoList.forEach(videoName => {
        const videoWrapper = document.createElement('div');
        videoWrapper.classList.add('video-player');

        const videoEl = document.createElement('video');
        videoEl.classList.add('plyr');
        videoEl.setAttribute('playsinline', '');
        videoEl.setAttribute('controls', '');

        const sourceEl = document.createElement('source');
        sourceEl.src = folderPath + videoName;
        sourceEl.type = 'video/mp4';

        videoEl.appendChild(sourceEl);
        videoWrapper.appendChild(videoEl);
        container.appendChild(videoWrapper);
    });

    // Initialize Plyr for all video elements
    Plyr.setup('.plyr', { /* Plyr options */ });
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
        if (e.target && e.target.classList.contains('styled-still')) {
            const scrollY = window.scrollY;
            document.documentElement.style.setProperty('--scroll-position', `-${scrollY}px`);
            document.body.classList.add('overlay-open');
            
            const overlay = document.createElement('div');
            overlay.classList.add('overlay');

            const expandedImgContainer = document.createElement('div');
            expandedImgContainer.classList.add('expanded-image-container');

            const expandedImg = e.target.cloneNode(true);
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
                    document.body.classList.remove('overlay-open');
                    document.body.style.position = '';
                    document.body.style.top = '';
                    window.scrollTo(0, scrollY);

                    overlay.classList.remove('active');
                    expandedImgContainer.classList.remove('active');
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

document.addEventListener('DOMContentLoaded', () => {
   
    // Initialize Plyr when video page is shown
    document.querySelector('[x-show="currentPage === \'videos\'"]')
        .addEventListener('x-show', () => {
            const player = new Plyr('#player', {
                controls: [
                    'play-large',
                    'play',
                    'progress',
                    'current-time',
                    'mute',
                    'volume',
                    'fullscreen'
                ],
                hideControls: true,
                keyboard: { focused: true, global: true }
            });
    });
});
