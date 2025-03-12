export function getVideoLinks() {
    return {
        'Compleanno': 'https://youtu.be/DfPS_DdDqho',
        'Merda': 'https://youtu.be/Bd2u4AvVJ7U',
        'Turenheimer': 'https://youtu.be/xZri1Ajktg4',
        // Add more groups and links as needed
    };
}

// Alternatively, fetch from external JSON
export function fetchVideoLinks() {
    return fetch('videoLinks.json')
        .then(response => response.json())
        .catch(error => {
            console.error('Error loading video links:', error);
            // Return hardcoded fallbacks if fetch fails
            return getVideoLinks();
        });
}