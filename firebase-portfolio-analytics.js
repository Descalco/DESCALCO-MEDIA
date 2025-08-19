/**
 * DESCALCO MEDIA - Firebase Portfolio Analytics
 * 
 * This script automatically saves all visitor data to Firebase,
 * so your backoffice can access it anytime, even when offline!
 * 
 * SETUP: Just add this script to your Netlify website
 */

// Import Firebase (using CDN for simplicity)
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
import { getFirestore, collection, addDoc, serverTimestamp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";
import { getAnalytics, logEvent } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-analytics.js";

// Your Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCxvqZPyeG1yQVXiKGmgeA_Uz4g9aED4RU",
  authDomain: "descalco-media.firebaseapp.com",
  projectId: "descalco-media",
  storageBucket: "descalco-media.firebasestorage.app",
  messagingSenderId: "748115524769",
  appId: "1:748115524769:web:9d572ad134d8db909f04e0",
  measurementId: "G-2FWDGNT5P9"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const analytics = getAnalytics(app);

(function() {
    'use strict';
    
    // Configuration
    const CONFIG = {
        ENABLE_TRACKING: true,
        DEBUG: false,
        COLLECTION_NAME: 'portfolio_analytics'
    };
    
    const log = (...args) => CONFIG.DEBUG && console.log('[Firebase Analytics]', ...args);
    const error = (...args) => console.error('[Firebase Analytics Error]', ...args);
    
    // Get project ID from current page
    function getProjectId() {
        const path = window.location.pathname;
        const filename = path.split('/').pop().replace('.html', '');
        
        const projectMap = {
            'GUISADO': 'guisado-3d-short-movie',
            'SOF-WEEK': 'sof-week-motion-design',
            'DESISTIR': 'desistir-conceptual-book',
            'CidadeDoFuturo': 'ambivalencia-city-future',
            'LetItHappen': 'let-it-happen-experimental',
            'other-projects': 'portfolio-overview',
            'index': 'homepage'
        };
        
        return projectMap[filename] || filename || 'unknown';
    }
    
    // Get visitor info
    function getVisitorInfo() {
        return {
            userAgent: navigator.userAgent,
            language: navigator.language,
            platform: navigator.platform,
            cookieEnabled: navigator.cookieEnabled,
            onLine: navigator.onLine,
            viewport: {
                width: window.innerWidth,
                height: window.innerHeight
            },
            screen: {
                width: screen.width,
                height: screen.height,
                colorDepth: screen.colorDepth
            },
            timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
            referrer: document.referrer || 'direct'
        };
    }
    
    // Save event to Firebase
    async function saveToFirebase(eventData) {
        if (!CONFIG.ENABLE_TRACKING) return;
        
        try {
            // Save to Firestore (your custom analytics)
            await addDoc(collection(db, CONFIG.COLLECTION_NAME), {
                ...eventData,
                timestamp: serverTimestamp(),
                sessionId: getSessionId(),
                visitorInfo: getVisitorInfo()
            });
            
            // Also log to Google Analytics (built-in)
            logEvent(analytics, eventData.action, {
                project_id: eventData.projectId,
                page_title: eventData.title || document.title,
                page_location: window.location.href
            });
            
            log('Event saved to Firebase:', eventData);
        } catch (err) {
            error('Failed to save to Firebase:', err);
        }
    }
    
    // Generate or get session ID
    function getSessionId() {
        let sessionId = sessionStorage.getItem('portfolio_session_id');
        if (!sessionId) {
            sessionId = 'session_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
            sessionStorage.setItem('portfolio_session_id', sessionId);
        }
        return sessionId;
    }
    
    // Track page view
    function trackPageView() {
        const eventData = {
            action: 'page_view',
            projectId: getProjectId(),
            title: document.title,
            url: window.location.href,
            path: window.location.pathname
        };
        
        saveToFirebase(eventData);
    }
    
    // Track project interactions
    function setupProjectTracking() {
        // Track clicks on project links
        document.addEventListener('click', (event) => {
            const projectLink = event.target.closest('.project-link');
            if (projectLink) {
                const projectItem = event.target.closest('.project-item');
                const projectTitle = projectItem?.querySelector('.project-title, h3')?.textContent?.trim();
                
                saveToFirebase({
                    action: 'project_click',
                    projectId: getProjectId(),
                    projectTitle: projectTitle,
                    linkText: projectLink.textContent.trim(),
                    linkUrl: projectLink.href,
                    elementType: 'project-link'
                });
            }
            
            // Track case study clicks
            const caseStudyLink = event.target.closest('a[href$=".html"]');
            if (caseStudyLink && caseStudyLink.href.includes('.html')) {
                saveToFirebase({
                    action: 'case_study_click',
                    projectId: getProjectId(),
                    linkText: caseStudyLink.textContent.trim(),
                    linkUrl: caseStudyLink.href,
                    elementType: 'case-study-link'
                });
            }
            
            // Track navigation clicks
            const navLink = event.target.closest('nav a, .back-link');
            if (navLink) {
                saveToFirebase({
                    action: 'navigation_click',
                    projectId: getProjectId(),
                    linkText: navLink.textContent.trim(),
                    linkUrl: navLink.href,
                    elementType: 'navigation'
                });
            }
        });
        
        // Track hover interactions (desktop only)
        if (!('ontouchstart' in window)) {
            const projectItems = document.querySelectorAll('.project-item');
            projectItems.forEach(item => {
                let hoverTimeout;
                let hoverStartTime;
                
                item.addEventListener('mouseenter', () => {
                    hoverStartTime = Date.now();
                    hoverTimeout = setTimeout(() => {
                        const title = item.querySelector('.project-title, h3')?.textContent?.trim();
                        saveToFirebase({
                            action: 'project_hover',
                            projectId: getProjectId(),
                            projectTitle: title,
                            hoverDuration: 'long',
                            elementType: 'project-card'
                        });
                    }, 1000); // Track hovers longer than 1 second
                });
                
                item.addEventListener('mouseleave', () => {
                    clearTimeout(hoverTimeout);
                    if (hoverStartTime) {
                        const hoverDuration = Date.now() - hoverStartTime;
                        if (hoverDuration > 500) { // Only track meaningful hovers
                            const title = item.querySelector('.project-title, h3')?.textContent?.trim();
                            saveToFirebase({
                                action: 'project_hover_end',
                                projectId: getProjectId(),
                                projectTitle: title,
                                hoverDuration: hoverDuration,
                                elementType: 'project-card'
                            });
                        }
                    }
                });
            });
        }
        
        // Track mobile touch interactions
        if ('ontouchstart' in window) {
            document.addEventListener('touchstart', (event) => {
                const projectItem = event.target.closest('.project-item');
                if (projectItem) {
                    const title = projectItem.querySelector('.project-title, h3')?.textContent?.trim();
                    saveToFirebase({
                        action: 'project_touch',
                        projectId: getProjectId(),
                        projectTitle: title,
                        device: 'mobile',
                        elementType: 'project-card'
                    });
                }
            });
        }
    }
    
    // Track scroll behavior
    function setupScrollTracking() {
        let maxScroll = 0;
        let scrollTimeout;
        const scrollMilestones = [25, 50, 75, 90, 100];
        const trackedMilestones = new Set();
        
        window.addEventListener('scroll', () => {
            clearTimeout(scrollTimeout);
            scrollTimeout = setTimeout(() => {
                const scrollPercent = Math.round(
                    (window.scrollY / (document.documentElement.scrollHeight - window.innerHeight)) * 100
                );
                
                if (scrollPercent > maxScroll) {
                    maxScroll = scrollPercent;
                    
                    // Track milestone achievements
                    scrollMilestones.forEach(milestone => {
                        if (scrollPercent >= milestone && !trackedMilestones.has(milestone)) {
                            trackedMilestones.add(milestone);
                            saveToFirebase({
                                action: 'scroll_milestone',
                                projectId: getProjectId(),
                                scrollPercent: milestone,
                                milestone: `${milestone}%`,
                                elementType: 'page'
                            });
                        }
                    });
                }
            }, 250);
        });
    }
    
    // Track time spent on page
    function setupTimeTracking() {
        const startTime = Date.now();
        let isActive = true;
        let totalActiveTime = 0;
        let lastActiveTime = startTime;
        
        // Track when user becomes inactive/active
        ['blur', 'visibilitychange'].forEach(event => {
            document.addEventListener(event, () => {
                const now = Date.now();
                if (isActive && document.visibilityState === 'hidden') {
                    totalActiveTime += now - lastActiveTime;
                    isActive = false;
                } else if (!isActive && document.visibilityState === 'visible') {
                    lastActiveTime = now;
                    isActive = true;
                }
            });
        });
        
        // Track time milestones
        const timeMilestones = [10, 30, 60, 120, 300]; // seconds
        const trackedTimes = new Set();
        
        setInterval(() => {
            if (isActive) {
                const currentActiveTime = totalActiveTime + (Date.now() - lastActiveTime);
                const activeSeconds = Math.floor(currentActiveTime / 1000);
                
                timeMilestones.forEach(milestone => {
                    if (activeSeconds >= milestone && !trackedTimes.has(milestone)) {
                        trackedTimes.add(milestone);
                        saveToFirebase({
                            action: 'time_milestone',
                            projectId: getProjectId(),
                            timeSpent: milestone,
                            milestone: `${milestone}s`,
                            elementType: 'page'
                        });
                    }
                });
            }
        }, 5000); // Check every 5 seconds
        
        // Send final time data before page unload
        window.addEventListener('beforeunload', () => {
            const now = Date.now();
            if (isActive) {
                totalActiveTime += now - lastActiveTime;
            }
            
            const totalSeconds = Math.floor(totalActiveTime / 1000);
            const category = totalSeconds < 10 ? 'bounce' : 
                           totalSeconds < 30 ? 'quick' : 
                           totalSeconds < 120 ? 'engaged' : 'deep';
            
            // Use sendBeacon for reliable data sending on page unload
            const eventData = {
                action: 'page_exit',
                projectId: getProjectId(),
                timeSpent: totalSeconds,
                timeCategory: category,
                elementType: 'page'
            };
            
            // Try to send final data
            try {
                navigator.sendBeacon('/api/analytics/beacon', JSON.stringify(eventData));
            } catch (e) {
                // Fallback: save to Firebase (may not complete)
                saveToFirebase(eventData);
            }
        });
    }
    
    // Initialize analytics when DOM is ready
    function init() {
        log('Initializing Firebase Portfolio Analytics...');
        
        // Track initial page view
        trackPageView();
        
        // Setup various tracking mechanisms
        setupProjectTracking();
        setupScrollTracking();
        setupTimeTracking();
        
        // Track page load performance
        window.addEventListener('load', () => {
            const loadTime = performance.timing.loadEventEnd - performance.timing.navigationStart;
            saveToFirebase({
                action: 'page_performance',
                projectId: getProjectId(),
                loadTime: loadTime,
                elementType: 'page'
            });
        });
        
        log('Firebase Analytics initialized successfully');
    }
    
    // Start when DOM is ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
    
    // Expose for manual tracking
    window.descalcoFirebaseAnalytics = {
        track: saveToFirebase,
        config: CONFIG,
        getSessionId: getSessionId
    };
    
})();
