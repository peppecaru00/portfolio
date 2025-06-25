// filepath: c:\Users\carus\Documents\Websites\portfolio\modules\videoLoader.js
/**
 * Video Loading Module
 * Handles video preloading with loading screen for homepage
 */

export let videosAlreadyLoaded = false;
export let initialPageLoad = true;

let loadingOverlay = null;
let videosToLoadCount = 0;
let videosLoadedCount = 0;
let allVideosHandled = false;

function createLoadingOverlay() {
    if (document.getElementById('loading-overlay')) {
        return; // Overlay already exists
    }

    loadingOverlay = document.createElement('div');
    loadingOverlay.id = 'loading-overlay';
    loadingOverlay.className = 'loading-overlay';

    const overlayContent = document.createElement('div');
    overlayContent.className = 'loading-content';
    overlayContent.innerHTML = `
        <div class="loading-ring"></div>
        <div class="loading-text">Getting ready 🐶</div>
        <div class="loading-progress">
            <div class="loading-progress-bar" id="loading-progress-bar"></div>
        </div>
        <div class="loading-percentage" id="loading-percentage">0%</div>
    `;

    loadingOverlay.appendChild(overlayContent);
    document.body.appendChild(loadingOverlay);
}

function updateLoadingProgress(progress) {
    const progressBar = document.getElementById('loading-progress-bar');
    const percentage = document.getElementById('loading-percentage');
    
    const numericProgress = Math.max(0, Math.min(100, parseFloat(progress)));

    if (progressBar) {
        progressBar.style.width = numericProgress + '%';
    }

    if (percentage) {
        percentage.textContent = Math.round(numericProgress) + '%';
    }
}

function hideLoadingOverlay() {
    if (loadingOverlay && !loadingOverlay.classList.contains('hidden')) {
        loadingOverlay.classList.add('hidden');
        setTimeout(() => {
            if (loadingOverlay && loadingOverlay.parentNode) {
                loadingOverlay.parentNode.removeChild(loadingOverlay);
                loadingOverlay = null;
            }
        }, 500);
    }
}

function hideLoadingOverlayAndCallback(callback) {
    if (allVideosHandled) return;
    allVideosHandled = true;

    videosAlreadyLoaded = true;

    hideLoadingOverlay();

    if (typeof callback === 'function') {
        callback();
    }
}

function waitForVideosToLoad(videos, callback) {
    if (videos.length === 0) {
        hideLoadingOverlayAndCallback(callback);
        return;
    }

    videosToLoadCount = videos.length;
    videosLoadedCount = 0;
    allVideosHandled = false;

    updateLoadingProgress(0);

    const videoLoadTimeout = 15000; // 15 seconds timeout
    const timeoutId = setTimeout(() => {
        console.warn('[videoLoader] Video loading timeout reached');
        hideLoadingOverlayAndCallback(callback);
    }, videoLoadTimeout);

    videos.forEach((video, index) => {
        const onVideoReady = () => {
            video.removeEventListener('loadeddata', onVideoReady);
            video.removeEventListener('canplay', onVideoReady);
            video.removeEventListener('error', onVideoError);
            
            videosLoadedCount++;
            const currentProgress = (videosLoadedCount / videosToLoadCount) * 100;
            updateLoadingProgress(currentProgress);

            if (videosLoadedCount === videosToLoadCount) {
                clearTimeout(timeoutId);
                hideLoadingOverlayAndCallback(callback);
            }
        };

        const onVideoError = (event) => {
            console.error(`[videoLoader] Error loading video ${index + 1}:`, event);
            video.removeEventListener('loadeddata', onVideoReady);
            video.removeEventListener('canplay', onVideoReady);
            video.removeEventListener('error', onVideoError);

            videosLoadedCount++;
            const currentProgress = (videosLoadedCount / videosToLoadCount) * 100;
            updateLoadingProgress(currentProgress);

            if (videosLoadedCount === videosToLoadCount) {
                clearTimeout(timeoutId);
                hideLoadingOverlayAndCallback(callback);
            }
        };

        if (video.readyState >= 2) { // HAVE_CURRENT_DATA or more
            Promise.resolve().then(onVideoReady);
        } else {
            video.addEventListener('loadeddata', onVideoReady);
            video.addEventListener('canplay', onVideoReady);
            video.addEventListener('error', onVideoError);
        }
    });
}

export function initializeVideoLoader(videoSelectors, animationCallback) {
    console.log(`[videoLoader] initializeVideoLoader called. videosAlreadyLoaded: ${videosAlreadyLoaded}, initialPageLoad: ${initialPageLoad}`);
    
    if (!videosAlreadyLoaded && initialPageLoad) {
        console.log('[videoLoader] First visit, showing loading screen');
        createLoadingOverlay();
        
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', () => {
                const videos = Array.from(document.querySelectorAll(videoSelectors.join(',')));
                waitForVideosToLoad(videos, animationCallback);
            });
        } else {
            const videos = Array.from(document.querySelectorAll(videoSelectors.join(',')));
            waitForVideosToLoad(videos, animationCallback);
        }
    } else {
        console.log('[videoLoader] Videos already loaded, skipping loading screen');
        if (typeof animationCallback === 'function') {
            animationCallback();
        }
    }
    
    initialPageLoad = false;
}

// Test function for debugging
export function testProgressUpdate(progress) {
    console.log(`[videoLoader] Testing progress update: ${progress}%`);
    updateLoadingProgress(progress);
}