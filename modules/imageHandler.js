export function groupImages(imageList) {
    return imageList.reduce((groups, image) => {
        const prefix = image.split('-')[0];
        if (!groups[prefix]) groups[prefix] = [];
        groups[prefix].push(image);
        return groups;
    }, {});
}

export function mapImages(imageList) {
    const container = document.getElementById('stills-container');
    const folderPath = 'Media/Stills/';
    const groups = groupImages(imageList);
    
    // Clear any existing content in the container (except the welcome message)
    const welcomeMessage = container.querySelector('p');
    container.innerHTML = '';
    if (welcomeMessage) {
        container.appendChild(welcomeMessage);
    }

    // Import the videoLinks dynamically
    import('./videoLinks.js')
        .then(module => {
            const videoLinks = module.getVideoLinks();
            renderImageGroups(groups, container, folderPath, videoLinks);
        })
        .catch(error => {
            console.error('Error loading video links:', error);
            // Render without video links if module fails to load
            renderImageGroups(groups, container, folderPath, {});
        });
}

function renderImageGroups(groups, container, folderPath, videoLinks) {
    Object.entries(groups).forEach(([groupName, images]) => {
        const groupContainer = document.createElement('div');
        groupContainer.classList.add('group-container');
        
        const titleContainer = document.createElement('div');
        titleContainer.classList.add('title-container');
        
        const title = document.createElement('h2');
        title.textContent = groupName;
        title.classList.add('group-title');
        titleContainer.appendChild(title);
        
        // Add video link if available for this group
        if (videoLinks[groupName]) {
            const videoLink = document.createElement('a');
            videoLink.href = videoLinks[groupName];
            videoLink.target = '_blank';
            videoLink.rel = 'noopener';
            videoLink.classList.add('video-link');
            videoLink.innerHTML = 'Watch Video <span>↗</span>';
            titleContainer.appendChild(videoLink);
        }
        
        groupContainer.appendChild(titleContainer);
        
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
        
        groupContainer.appendChild(carousel);
        container.appendChild(groupContainer);
    });
}

export function fetchImages() {
    return fetch('imageList.json')
        .then(response => response.json())
        .catch(error => {
            console.error('Error loading images:', error);
            return [];
        });
}