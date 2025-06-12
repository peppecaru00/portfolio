const fs = require('fs');
const path = require('path');

// Generate stills list
const stillsDir = path.join(__dirname, 'Media/Stills');
const stillsOutputPath = path.join(__dirname, 'imageList.json');

// Generate photos list
const photosDir = path.join(__dirname, 'Media/Photos');
const photosOutputPath = path.join(__dirname, 'photoList.json');

// Generate designs list
const designsDir = path.join(__dirname, 'Media/Designs');
const designsOutputPath = path.join(__dirname, 'designList.json');

// Create the Photos directory if it doesn't exist
if (!fs.existsSync(photosDir)) {
    fs.mkdirSync(photosDir, { recursive: true });
    console.log('Created Photos directory:', photosDir);
}

// Create the Designs directory if it doesn't exist
if (!fs.existsSync(designsDir)) {
    fs.mkdirSync(designsDir, { recursive: true });
    console.log('Created Designs directory:', designsDir);
}

// Function to generate a list of image files from a directory
function generateImageList(directory, outputPath, type) {
    fs.readdir(directory, (err, files) => {
        if (err) {
            console.error(`Unable to scan ${type} directory:`, err);
            return;
        }
        const imageFiles = files.filter(file => /\.(jpg|jpeg|png|webp)$/.test(file));
        fs.writeFileSync(outputPath, JSON.stringify(imageFiles, null, 2));
        console.log(`Generated ${type} list with ${imageFiles.length} images:`, outputPath);
    });
}

// Generate both lists
generateImageList(stillsDir, stillsOutputPath, 'stills');
generateImageList(photosDir, photosOutputPath, 'photos');
generateImageList(designsDir, designsOutputPath, 'designs');

console.log('Image lists generation process complete.');