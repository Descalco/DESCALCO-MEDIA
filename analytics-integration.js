/**
 * DESCALCO MEDIA - Portfolio Analytics Integration
 * 
 * This script enables your live Netlify website to send analytics data
 * to your local backoffice system for comprehensive tracking.
 * 
 * SETUP INSTRUCTIONS:
 * 1. Add this script to your live portfolio HTML files
 * 2. Update the BACKOFFICE_URL to your public URL (if using ngrok/tunneling)
 * 3. Deploy to Netlify
 */

(function() {
    'use strict';
    
    // Configuration
    const CONFIG = {
        // Change this to your public backoffice URL when using ngrok or similar
        BACKOFFICE_URL: 'http://localhost:3001', // Update this for production
        ENABLE_TRACKING: true,
        DEBUG: false
    };
    
    // Utility functions
    const log = (...args) => CONFIG.DEBUG && console.log('[Analytics]', ...args);
    const error = (...args) => console.error('[Analytics Error]', ...args);
    
    // Get project ID from current page
    function getProjectId() {
        const path = window.location.pathname;
        const filename = path.split('/').pop().replace('.html', '');
        
        // Map HTML files to project IDs (you can customize this)
        const projectMap = {
            'GUISADO': 'guisado-3d-short-movie',
            'SOF-WEEK': 'sof-week-motion-design',
            'DESISTIR': 'desistir-conceptual-book',
            'CidadeDoFuturo': 'ambivalencia-city-future',
            'LetItHappen': 'let-it-happen-experimental',
            'other-projects': 'portfolio-overview'
        };
        
        return projectMap[filename] || filename || 'unknown';
    }
    
    // Send analytics event to backoffice
    async function trackEvent(action, additionalData = {}) {
        if (!CONFIG.ENABLE_TRACKING) return;
        
        const eventData = {
            projectId: getProjectId(),
            action: action, // 'view', 'click', 'hover'
            userAgent: navigator.userAgent,
            timestamp: new Date().toISOString(),
            url: window.location.href,
            referrer: document.referrer,
            ...additionalData
        };
        
        log('Tracking event:', eventData);
        
        try {
            const response = await fetch(`${CONFIG.BACKOFFICE_URL}/api/analytics/track`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(eventData),
                mode: 'cors' // Enable CORS for cross-origin requests
            });
            
            if (response.ok) {
                log('Event tracked successfully');
            } else {
                error('Failed to track event:', response.status);
            }
        } catch (err) {
            error('Network error tracking event:', err.message);
        }
    }
    
    // Track page view
    function trackPageView() {
        trackEvent('view', {
            title: document.title,
            viewport: {
                width: window.innerWidth,
                height: window.innerHeight
            }
        });
    }
    
    // Track project interactions
    function setupProjectTracking() {
        // Track clicks on project links
        document.addEventListener('click', (event) => {
            const projectLink = event.target.closest('.project-link');
            if (projectLink) {
                trackEvent('click', {
                    linkText: projectLink.textContent.trim(),
                    linkUrl: projectLink.href,
                    projectElement: event.target.closest('.project-item') ? 'project-card' : 'other'
                });
            }
            
            // Track clicks on case study links
            const caseStudyLink = event.target.closest('a[href$=".html"]');
            if (caseStudyLink && caseStudyLink.href.includes('.html')) {
                trackEvent('case-study-click', {
                    linkText: caseStudyLink.textContent.trim(),
                    linkUrl: caseStudyLink.href
                });
            }
        });
        
        // Track hover interactions on project cards (desktop only)
        if (!('ontouchstart' in window)) {
            const projectItems = document.querySelectorAll('.project-item');
            projectItems.forEach(item => {
                let hoverTimeout;
                
                item.addEventListener('mouseenter', () => {
                    hoverTimeout = setTimeout(() => {
                        const title = item.querySelector('.project-title, h3')?.textContent?.trim();
                        trackEvent('hover', {
                            projectTitle: title,
                            hoverDuration: 'long' // 500ms+
                        });
                    }, 500);
                });
                
                item.addEventListener('mouseleave', () => {
                    clearTimeout(hoverTimeout);
                });
            });
        }
        
        // Track mobile touch interactions
        if ('ontouchstart' in window) {
            document.addEventListener('touchstart', (event) => {
                const projectItem = event.target.closest('.project-item');
                if (projectItem) {
                    const title = projectItem.querySelector('.project-title, h3')?.textContent?.trim();
                    trackEvent('touch', {
                        projectTitle: title,
                        device: 'mobile'
                    });
                }
            });
        }
    }
    
    // Track scroll depth
    function setupScrollTracking() {
        let maxScroll = 0;
        let scrollTimeout;
        
        window.addEventListener('scroll', () => {
            clearTimeout(scrollTimeout);
            scrollTimeout = setTimeout(() => {
                const scrollPercent = Math.round(
                    (window.scrollY / (document.documentElement.scrollHeight - window.innerHeight)) * 100
                );
                
                if (scrollPercent > maxScroll) {
                    maxScroll = scrollPercent;
                    
                    // Track significant scroll milestones
                    if ([25, 50, 75, 90].includes(scrollPercent)) {
                        trackEvent('scroll', {
                            scrollPercent: scrollPercent,
                            milestone: `${scrollPercent}%`
                        });
                    }
                }
            }, 100);
        });
    }
    
    // Track time spent on page
    function setupTimeTracking() {
        const startTime = Date.now();
        let isActive = true;
        
        // Track when user becomes inactive
        ['blur', 'visibilitychange'].forEach(event => {
            document.addEventListener(event, () => {
                isActive = document.visibilityState === 'visible';
            });
        });
        
        // Send time tracking data before page unload
        window.addEventListener('beforeunload', () => {
            if (isActive) {
                const timeSpent = Math.round((Date.now() - startTime) / 1000);
                trackEvent('time-spent', {
                    timeSpent: timeSpent,
                    timeCategory: timeSpent < 10 ? 'bounce' : 
                                 timeSpent < 30 ? 'quick' : 
                                 timeSpent < 120 ? 'engaged' : 'deep'
                });
            }
        });
    }
    
    // Initialize analytics when DOM is ready
    function init() {
        log('Initializing portfolio analytics...');
        
        // Track initial page view
        trackPageView();
        
        // Setup various tracking mechanisms
        setupProjectTracking();
        setupScrollTracking();
        setupTimeTracking();
        
        log('Analytics initialized successfully');
    }
    
    // Start when DOM is ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
    
    // Expose tracking function globally for manual tracking
    window.descalcoAnalytics = {
        track: trackEvent,
        config: CONFIG
    };
    
})();
