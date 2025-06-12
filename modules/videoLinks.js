export function getVideoLinks() {
    return {
        'Compleanno': 'https://youtu.be/DfPS_DdDqho',
        'Merda': 'https://youtu.be/Bd2u4AvVJ7U',
        'Turenheimer': 'https://youtu.be/xZri1Ajktg4',
        'FragileBTS': 'https://youtu.be/GRZqdg5-h2U',
        'PrimoMaggio': 'https://youtu.be/cvP7Oz6uYh4',
        'VFXShootingDay': 'https://youtu.be/98MAwX6GGG8',
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