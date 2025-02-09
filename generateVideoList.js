const fs = require('fs');
const path = require('path');

const videosDir = path.join(__dirname, 'Media/Videos');
const outputFilePath = path.join(__dirname, 'videoList.json');

fs.readdir(videosDir, (err, files) => {
    if (err) {
        console.error('Unable to scan directory:', err);
        return;
    }
    const videoFiles = files.filter(file => /\.(mp4|webm|ogg)$/.test(file));
    fs.writeFileSync(outputFilePath, JSON.stringify(videoFiles, null, 2));
    console.log('Video list generated:', outputFilePath);
});