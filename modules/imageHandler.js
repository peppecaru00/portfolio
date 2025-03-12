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

export function mapPhotos(photoList) {
    const container = document.getElementById('photos-container');
    const folderPath = 'Media/Photos/';
    const groups = groupImages(photoList);
    
    // Clear any existing content in the container (except the welcome message)
    const welcomeMessage = container.querySelector('p');
    container.innerHTML = '';
    if (welcomeMessage) {
        container.appendChild(welcomeMessage);
    }

    renderImageGroups(groups, container, folderPath, {}, 'photo');
}

function renderImageGroups(groups, container, folderPath, videoLinks, type = 'still') {
    Object.entries(groups).forEach(([groupName, images]) => {
        const groupContainer = document.createElement('div');
        groupContainer.classList.add('group-container');
        
        const titleContainer = document.createElement('div');
        titleContainer.classList.add('title-container');
        
        const title = document.createElement('h2');
        title.textContent = groupName;
        title.classList.add('group-title');
        titleContainer.appendChild(title);
        
        // Add video link if available for this group (only for stills)
        if (type === 'still' && videoLinks[groupName]) {
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
            img.classList.add(type === 'still' ? 'styled-still' : 'styled-photo');
            
            // Add click handler for photos to show fullscreen
            if (type === 'photo') {
                img.addEventListener('click', () => {
                    openPhotoModal(folderPath + imageName, imageName);
                });
                imgDiv.classList.add('photo-item');
            }
            
            imgDiv.appendChild(img);
            carousel.appendChild(imgDiv);
        });
        
        groupContainer.appendChild(carousel);
        container.appendChild(groupContainer);
    });

    // Create modal container for photos if it doesn't exist yet
    if (type === 'photo' && !document.getElementById('photo-modal')) {
        createPhotoModal(container);
    }
}

function createPhotoModal(container) {
    const modalContainer = document.createElement('div');
    modalContainer.id = 'photo-modal';
    modalContainer.classList.add('photo-modal');
    modalContainer.style.display = 'none';
    
    modalContainer.innerHTML = `
        <div class="photo-modal-content">
            <span class="close-button">&times;</span>
            <img id="modal-img" src="" alt="">
            <div id="modal-caption" class="photo-modal-caption"></div>
        </div>
    `;
    
    // Add click handlers to close the modal
    modalContainer.addEventListener('click', (e) => {
        if (e.target === modalContainer || e.target.classList.contains('close-button')) {
            closePhotoModal();
        }
    });
    
    document.body.appendChild(modalContainer);
}

function openPhotoModal(src, caption) {
    const modal = document.getElementById('photo-modal');
    const modalImg = document.getElementById('modal-img');
    const captionText = document.getElementById('modal-caption');
    
    modal.style.display = 'flex';
    modalImg.src = src;
    captionText.textContent = caption.split('.')[0]; // Remove file extension
    document.body.classList.add('modal-open');
}

function closePhotoModal() {
    const modal = document.getElementById('photo-modal');
    modal.style.display = 'none';
    document.body.classList.remove('modal-open');
}

export function fetchImages() {
    return fetch('imageList.json')
        .then(response => response.json())
        .catch(error => {
            console.error('Error loading images:', error);
            return [];
        });
}

export function fetchPhotos() {
    return fetch('photoList.json')
        .then(response => response.json())
        .catch(error => {
            console.error('Error loading photos:', error);
            return [];
        });
}