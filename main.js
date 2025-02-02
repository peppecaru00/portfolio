function groupImages(imageList) {
    return imageList.reduce((groups, image) => {
        const prefix = image.split('-')[0];
        if (!groups[prefix]) groups[prefix] = [];
        groups[prefix].push(image);
        return groups;
    }, {});
}

document.addEventListener('DOMContentLoaded', () => {
    const carousels = document.querySelectorAll('.carousel');

    carousels.forEach(carousel => {
        let isDragging = false;
        let startX;
        let scrollLeft;

        carousel.addEventListener('mousedown', (e) => {
            isDragging = true;
            carousel.classList.add('active');
            startX = e.pageX - carousel.offsetLeft;
            scrollLeft = carousel.scrollLeft;
        });

        carousel.addEventListener('mousemove', (e) => {
            if (!isDragging) return;
            e.preventDefault();
            const x = e.pageX - carousel.offsetLeft;
            const walk = (x - startX) * 2;
            carousel.scrollLeft = scrollLeft - walk;
        });

        carousel.addEventListener('mouseup', () => {
            isDragging = false;
            carousel.classList.remove('active');
        });

        carousel.addEventListener('mouseleave', () => {
            isDragging = false;
            carousel.classList.remove('active');
        });
    });
});



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
        carousel.classList.add('carousel');
        
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

    setInterval(() => {
        if (isManualScroll) {
            const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
            if (scrollTop > lastScrollTop) {
                navbar.classList.add('hidden');
                console.log('Hiding navbar'); // Debug log
            } else {
                navbar.classList.remove('hidden');
                console.log('Showing navbar'); // Debug log
            }
            lastScrollTop = scrollTop <= 0 ? 0 : scrollTop;
            isManualScroll = false;
        }
    }, 100);

    // Disable right-click on images
    document.querySelectorAll('.styled-still').forEach(img => {
        img.addEventListener('contextmenu', (e) => {
            e.preventDefault();
            console.log('Right-click prevented'); // Debug log
        });
    });

    console.log("main.js initialization complete"); // Debug log
});


