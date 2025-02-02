const express = require('express');
const fs = require('fs');
const path = require('path');

const app = express();
const imagesDir = path.join(__dirname, 'Media/Stills');

app.use('/Media/Stills', express.static(imagesDir));

function mapImages(imageList) {
    const container = document.getElementById('media-container');
    const folderPath = 'Media/Stills/';
    let i = 0;
    while (i < imageList.length) {
        const imgDiv = document.createElement('div');
        const img = document.createElement('img');
        img.src = folderPath + imageList[i];
        imgDiv.appendChild(img);
        container.appendChild(imgDiv);
        i++;
    }
}