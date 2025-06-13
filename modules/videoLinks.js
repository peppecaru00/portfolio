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

export function getVideoLinksWithOrder() {
    return [
        { name: 'Compleanno', url: 'https://youtu.be/DfPS_DdDqho', order: 5 },
        { name: 'VFXShootingDay', url: 'https://youtu.be/98MAwX6GGG8', order: 1 },
        { name: 'Turenheimer', url: 'https://youtu.be/xZri1Ajktg4', order: 6 },
        { name: 'FragileBTS', url: 'https://youtu.be/GRZqdg5-h2U', order: 4 },
        { name: 'PrimoMaggio', url: 'https://youtu.be/cvP7Oz6uYh4', order: 2 },
        { name: 'Merda', url: 'https://youtu.be/Bd2u4AvVJ7U', order: 3 },
    ];
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