/**
 * Converts a Google Drive sharing link to a direct image URL
 * @param {string} driveUrl - Google Drive sharing URL
 * @returns {string} Direct image URL
 */
function getDriveDirectUrl(driveUrl) {
    // Extract the file ID from the sharing URL
    const fileId = driveUrl.match(/[-\w]{25,}/);
    if (!fileId) return driveUrl;
    
    // Return the direct download URL format
    return `https://drive.google.com/uc?export=view&id=${fileId[0]}`;
  }