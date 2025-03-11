export function getVideoLinks() {
    return {
        'Compleanno': 'https://drive.google.com/file/d/1YErUWvU_Ev-KPrhrkwbdj-9FEEWD8L-Q/view?usp=drive_link',
        'Merda': 'https://drive.google.com/file/d/1-8psPLcbPTdT6BdM6yFaUdXwxccn7JMT/view?usp=drive_link',
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