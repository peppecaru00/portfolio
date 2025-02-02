const fs = require('fs');
const path = require('path');

const imagesDir = path.join(__dirname, 'Media/Stills');
const outputFilePath = path.join(__dirname, 'imageList.json');

fs.readdir(imagesDir, (err, files) => {
    if (err) {
        console.error('Unable to scan directory:', err);
        return;
    }
    const imageFiles = files.filter(file => /\.(jpg|jpeg|png|gif)$/.test(file));
    fs.writeFileSync(outputFilePath, JSON.stringify(imageFiles, null, 2));
    console.log('Image list generated:', outputFilePath);
});