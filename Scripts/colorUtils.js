// Random Pastel Color Generator with Proper Contrast Ratios
class ColorUtils {
    constructor() {
        this.lightPastelColors = [
            // More vibrant pastels with better contrast on light backgrounds
            { h: 200, s: 80, l: 75, name: 'sky-blue' },
            { h: 300, s: 70, l: 75, name: 'lavender' },
            { h: 340, s: 75, l: 75, name: 'soft-pink' },
            { h: 120, s: 65, l: 75, name: 'mint-green' },
            { h: 30, s: 80, l: 75, name: 'peach' },
            { h: 270, s: 70, l: 75, name: 'light-purple' },
            { h: 180, s: 75, l: 75, name: 'aqua' },
            { h: 60, s: 70, l: 75, name: 'lemon' },
            { h: 150, s: 65, l: 75, name: 'sage' },
            { h: 350, s: 70, l: 75, name: 'rose' },
            { h: 210, s: 75, l: 75, name: 'powder-blue' },
            { h: 45, s: 75, l: 75, name: 'cream' },
        ];

        this.darkPastelColors = [
            // Muted pastels for dark theme with better visibility
            { h: 200, s: 45, l: 70, name: 'muted-blue' },
            { h: 300, s: 40, l: 70, name: 'muted-lavender' },
            { h: 340, s: 45, l: 70, name: 'muted-pink' },
            { h: 120, s: 35, l: 70, name: 'muted-green' },
            { h: 30, s: 50, l: 70, name: 'muted-peach' },
            { h: 270, s: 40, l: 70, name: 'muted-purple' },
            { h: 180, s: 45, l: 70, name: 'muted-aqua' },
            { h: 60, s: 40, l: 70, name: 'muted-yellow' },
            { h: 150, s: 35, l: 70, name: 'muted-sage' },
            { h: 350, s: 40, l: 70, name: 'muted-rose' },
            { h: 210, s: 45, l: 70, name: 'muted-sky' },
            { h: 45, s: 45, l: 70, name: 'muted-cream' },
        ];
    }

    // Convert HSL to RGB
    hslToRgb(h, s, l) {
        s /= 100;
        l /= 100;

        const c = (1 - Math.abs(2 * l - 1)) * s;
        const x = c * (1 - Math.abs((h / 60) % 2 - 1));
        const m = l - c / 2;
        let r = 0, g = 0, b = 0;

        if (0 <= h && h < 60) {
            r = c; g = x; b = 0;
        } else if (60 <= h && h < 120) {
            r = x; g = c; b = 0;
        } else if (120 <= h && h < 180) {
            r = 0; g = c; b = x;
        } else if (180 <= h && h < 240) {
            r = 0; g = x; b = c;
        } else if (240 <= h && h < 300) {
            r = x; g = 0; b = c;
        } else if (300 <= h && h < 360) {
            r = c; g = 0; b = x;
        }

        r = Math.round((r + m) * 255);
        g = Math.round((g + m) * 255);
        b = Math.round((b + m) * 255);

        return { r, g, b };
    }

    // Calculate relative luminance
    getRelativeLuminance(r, g, b) {
        const sRGB = [r, g, b].map(c => {
            c = c / 255;
            return c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4);
        });
        return 0.2126 * sRGB[0] + 0.7152 * sRGB[1] + 0.0722 * sRGB[2];
    }

    // Calculate contrast ratio
    getContrastRatio(color1, color2) {
        const l1 = this.getRelativeLuminance(color1.r, color1.g, color1.b);
        const l2 = this.getRelativeLuminance(color2.r, color2.g, color2.b);
        const lighter = Math.max(l1, l2);
        const darker = Math.min(l1, l2);
        return (lighter + 0.05) / (darker + 0.05);
    }

    // Check if theme is dark
    isDarkTheme() {
        return document.documentElement.getAttribute('data-theme') === 'dark';
    }

    // Get random color from appropriate palette
    getRandomPastelColor() {
        const isDark = this.isDarkTheme();
        const palette = isDark ? this.darkPastelColors : this.lightPastelColors;
        return palette[Math.floor(Math.random() * palette.length)];
    }

    // Generate background color with opacity for cards
    generateCardBackground(opacity = 0.15) {
        const color = this.getRandomPastelColor();
        const rgb = this.hslToRgb(color.h, color.s, color.l);
        return `rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, ${opacity})`;
    }

    // Generate border color with higher opacity
    generateBorderColor(opacity = 0.3) {
        const color = this.getRandomPastelColor();
        const rgb = this.hslToRgb(color.h, color.s, color.l);
        return `rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, ${opacity})`;
    }

    // Generate a subtle shadow color
    generateShadowColor(opacity = 0.1) {
        const color = this.getRandomPastelColor();
        const rgb = this.hslToRgb(color.h, color.s, color.l);
        return `rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, ${opacity})`;
    }

    // Generate a gradient for text like the welcome title
    generateTitleGradient() {
        const isDarkTheme = this.isDarkTheme();
        const color1 = this.getRandomPastelColor();
        const color2 = this.getRandomPastelColor(); // This will be our glow color base
        const color3 = this.getRandomPastelColor();
        
        const rgb1 = this.hslToRgb(color1.h, color1.s, color1.l);
        const rgb2 = this.hslToRgb(color2.h, color2.s, color2.l); // Use this for glow
        const rgb3 = this.hslToRgb(color3.h, color3.s, color3.l);

        const textColor = getComputedStyle(document.documentElement).getPropertyValue('--text-color').trim();
        
        const gradientString = `linear-gradient(135deg, ${textColor}, rgba(${rgb1.r}, ${rgb1.g}, ${rgb1.b}, 1), rgba(${rgb2.r}, ${rgb2.g}, ${rgb2.b}, 1), rgba(${rgb3.r}, ${rgb3.g}, ${rgb3.b}, 1), ${textColor})`;
        const glowColorString = `rgba(${rgb2.r}, ${rgb2.g}, ${rgb2.b}, 1)`; // Glow color based on the middle pastel

        return { gradient: gradientString, glowColor: glowColorString };
    }

    // Apply random colors by setting CSS custom properties
    applyRandomColorsToCards() {
        // Apply random colors to cards
        const cards = document.querySelectorAll('.intro-section, .personal-details, .contact-info, .education-info, .nav-card, .home-container, .stills-container, .photos-container');
        const isDarkTheme = this.isDarkTheme();

        // Adjust opacity based on theme for better visibility
        const bgOpacity = isDarkTheme ? 0.12 : 0.18;
        const borderOpacity = isDarkTheme ? 0.25 : 0.30;
        const shadowColorOpacity = isDarkTheme ? 0.20 : 0.25;
        const hoverShadowOpacity = isDarkTheme ? 0.25 : 0.30;
        const iconBgOpacity = isDarkTheme ? 0.15 : 0.25;
        const sectionIconBgOpacity = isDarkTheme ? 0.20 : 0.30;

        cards.forEach(card => {
            // Generate a unique color set for each card
            const baseColor = this.getRandomPastelColor();
            const rgb = this.hslToRgb(baseColor.h, baseColor.s, baseColor.l);

            // Background with gradient
            const backgroundColor = `rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, ${bgOpacity})`;
            const gradientColor1 = `rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, ${bgOpacity * 0.8})`;
            const gradientColor2 = `rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, ${bgOpacity * 1.5})`;
            const backgroundGradient = `linear-gradient(135deg, ${backgroundColor} 0%, ${gradientColor1} 50%, ${gradientColor2} 100%)`;

            // Border and shadow colors
            const borderColor = `rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, ${borderOpacity})`;
            const shadowCssVariableColor = `rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, ${shadowColorOpacity})`;

            // Set CSS custom properties directly on the card element
            card.style.setProperty('--random-card-bg', backgroundGradient);
            card.style.setProperty('--random-card-border', borderColor);
            card.style.setProperty('--random-card-shadow', shadowCssVariableColor);

            // Special handling for nav-card hover effect
            if (card.classList.contains('nav-card')) {
                const hoverShadowCssVariable = `0 20px 60px rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, ${hoverShadowOpacity})`;
                card.style.setProperty('--hover-shadow', hoverShadowCssVariable);
            }            // Apply random colors to section icons inside the card
            const sectionIcons = card.querySelectorAll('.section-icon');
            sectionIcons.forEach(sectionIcon => {
                // Use the same color as the parent card for consistency
                const iconBackgroundGradient = `linear-gradient(135deg, 
                    rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, ${sectionIconBgOpacity * 0.8}), 
                    rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, ${sectionIconBgOpacity * 1.2}))`;
                
                const iconBeforeGradient = `linear-gradient(135deg, 
                    rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, ${sectionIconBgOpacity}), 
                    rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, ${sectionIconBgOpacity * 1.5}))`;
                
                // Use the same border color as the card for visual harmony
                const iconBorderColor = borderColor;

                sectionIcon.style.setProperty('--random-section-icon-bg', iconBackgroundGradient);
                sectionIcon.style.setProperty('--random-section-icon-before-bg', iconBeforeGradient);
                sectionIcon.style.borderColor = iconBorderColor;
                sectionIcon.style.background = iconBackgroundGradient;
            });

            // Apply random colors to icon wrappers inside the card
            const iconWrappers = card.querySelectorAll('.icon-wrapper');
            iconWrappers.forEach(iconWrapper => {
                // Use the same color as the parent card for consistency but with different opacity
                const iconBackgroundColor = `rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, ${iconBgOpacity})`;
                const iconHoverGradient = `linear-gradient(135deg, rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, ${iconBgOpacity * 1.2}), rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, ${iconBgOpacity * 1.8}))`;
                
                iconWrapper.style.setProperty('--random-icon-bg', iconBackgroundColor);
                iconWrapper.style.setProperty('--random-icon-hover-bg', iconHoverGradient);
                iconWrapper.style.background = iconBackgroundColor;
            });
        });
        
        // Apply random gradient to the welcome title
        const welcomeTitles = document.querySelectorAll('.welcome-title');
        welcomeTitles.forEach(title => {
            const titleStyling = this.generateTitleGradient(); // Gets { gradient, glowColor }
            title.style.setProperty('--title-gradient', titleStyling.gradient);
            title.style.setProperty('--title-glow-color', titleStyling.glowColor); // Set the glow color variable
            title.style.background = titleStyling.gradient;
            title.style.backgroundSize = '300% 100%';
            title.style.webkitBackgroundClip = 'text';
            title.style.webkitTextFillColor = 'transparent';
            title.style.backgroundClip = 'text';
        });

        // Find and colorize any standalone icon wrappers not contained in cards
        const standaloneIconWrappers = document.querySelectorAll('.icon-wrapper:not(.intro-section .icon-wrapper):not(.personal-details .icon-wrapper):not(.contact-info .icon-wrapper):not(.education-info .icon-wrapper):not(.nav-card .icon-wrapper)');
        
        standaloneIconWrappers.forEach(iconWrapper => {
            const baseColor = this.getRandomPastelColor();
            const rgb = this.hslToRgb(baseColor.h, baseColor.s, baseColor.l);
            
            const iconBackgroundColor = `rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, ${iconBgOpacity})`;
            const iconHoverGradient = `linear-gradient(135deg, rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, ${iconBgOpacity * 1.2}), rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, ${iconBgOpacity * 1.8}))`;
            
            iconWrapper.style.setProperty('--random-icon-bg', iconBackgroundColor);
            iconWrapper.style.setProperty('--random-icon-hover-bg', iconHoverGradient);
            iconWrapper.style.background = iconBackgroundColor;
        });        // Find and colorize any standalone section icons not contained in cards
        const standaloneSectionIcons = document.querySelectorAll('.section-icon:not(.intro-section .section-icon):not(.personal-details .section-icon):not(.contact-info .section-icon):not(.education-info .section-icon):not(.nav-card .section-icon)');
        
        standaloneSectionIcons.forEach(sectionIcon => {
            const baseColor = this.getRandomPastelColor();
            const rgb = this.hslToRgb(baseColor.h, baseColor.s, baseColor.l);
            
            const iconBackgroundGradient = `linear-gradient(135deg, 
                rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, ${sectionIconBgOpacity * 0.8}), 
                rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, ${sectionIconBgOpacity * 1.2}))`;
            
            const iconBeforeGradient = `linear-gradient(135deg, 
                rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, ${sectionIconBgOpacity}), 
                rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, ${sectionIconBgOpacity * 1.5}))`;
            
            // Add border with matching color for standalone icons
            const iconBorderColor = `rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, ${borderOpacity})`;
            
            sectionIcon.style.setProperty('--random-section-icon-bg', iconBackgroundGradient);
            sectionIcon.style.setProperty('--random-section-icon-before-bg', iconBeforeGradient);
            sectionIcon.style.background = iconBackgroundGradient;
            sectionIcon.style.borderColor = iconBorderColor;
        });

        // console.log(`Applied unique random colors to ${cards.length} cards and ${welcomeTitles.length} titles (${isDarkTheme ? 'dark' : 'light'} theme)`);
    }

    // Initialize colors on page load and theme change
    init() {
        // Apply colors immediately and again after short delays to ensure they're applied
        this.applyRandomColorsToCards();
        
        setTimeout(() => {
            this.applyRandomColorsToCards();
        }, 0); // After current execution stack
        
        setTimeout(() => {
            this.applyRandomColorsToCards();
        }, 100); // Fallback for slightly later rendering

        // Listen for theme changes
        const themeObserver = new MutationObserver((mutations) => {
            mutations.forEach((mutation) => {
                if (mutation.type === 'attributes' && mutation.attributeName === 'data-theme') {
                    // Apply immediately and after theme transition completes
                    this.applyRandomColorsToCards();
                    setTimeout(() => {
                        this.applyRandomColorsToCards();
                    }, 300); // Standard theme transition duration
                }
            });
        });

        themeObserver.observe(document.documentElement, {
            attributes: true,
            attributeFilter: ['data-theme']
        });
        
        // Watch for content changes (e.g., Alpine.js components being added)
        const contentObserver = new MutationObserver((mutations) => {
            let cardsPotentiallyAdded = false;
            mutations.forEach((mutation) => {
                if (mutation.type === 'childList' && mutation.addedNodes.length > 0) {
                    mutation.addedNodes.forEach(node => {
                        if (node.nodeType === Node.ELEMENT_NODE) {
                            // Check if the added node itself is a card or contains cards
                            // This is a heuristic; adjust selectors if card containers are more specific
                            if (node.matches('.intro-section, .personal-details, .contact-info, .education-info, .nav-card, .home-container, .stills-container, .photos-container') ||
                                node.querySelector('.intro-section, .personal-details, .contact-info, .education-info, .nav-card')) {
                                cardsPotentiallyAdded = true;
                            }
                        }
                    });
                }
            });
            if (cardsPotentiallyAdded) {
                this.applyRandomColorsToCards();
            }
        });
        
        contentObserver.observe(document.body, {
            childList: true,
            subtree: true
        });

        // Reapply colors on window focus
        window.addEventListener('focus', () => {
            this.applyRandomColorsToCards();
        });
        
        // Apply colors when page is fully loaded (including images, etc.)
        window.addEventListener('load', () => {
            this.applyRandomColorsToCards();
        });
    }
}

// Initialize the color system when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    const colorUtils = new ColorUtils();
    colorUtils.init();
});

// Also initialize if DOM is already loaded
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        const colorUtils = new ColorUtils();
        colorUtils.init();
    });
} else {
    const colorUtils = new ColorUtils();
    colorUtils.init();
}
