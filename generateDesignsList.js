const fs = require('fs');
const path = require('path');

const designsFolder = path.join(__dirname, 'Media/Designs');
const outputFilePath = path.join(__dirname, 'designsList.json');

fs.readdir(designsFolder, (err, files) => {
    if (err) {
        console.error('Error reading designs folder:', err);
        return;
    }

    const designFiles = files.filter(file => /\.(jpg|jpeg|png|gif|webp)$/i.test(file));

    fs.writeFile(outputFilePath, JSON.stringify(designFiles, null, 2), err => {
        if (err) {
            console.error('Error writing designsList.json:', err);
            return;
        }

        console.log('designsList.json has been generated successfully.');
    });
});