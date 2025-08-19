/**
 * DESCALCO MEDIA - Firebase Analytics Reader for Backoffice
 * 
 * This script allows your backoffice to read analytics data
 * directly from Firebase, so you always have access to real visitor data!
 */

// Firebase configuration (same as your website)
const firebaseConfig = {
  apiKey: "AIzaSyCxvqZPyeG1yQVXiKGmgeA_Uz4g9aED4RU",
  authDomain: "descalco-media.firebaseapp.com",
  projectId: "descalco-media",
  storageBucket: "descalco-media.firebasestorage.app",
  messagingSenderId: "748115524769",
  appId: "1:748115524769:web:9d572ad134d8db909f04e0",
  measurementId: "G-2FWDGNT5P9"
};

class FirebaseAnalyticsReader {
    constructor() {
        this.db = null;
        this.isInitialized = false;
        this.cache = new Map();
        this.cacheTimeout = 5 * 60 * 1000; // 5 minutes
    }

    async initialize() {
        if (this.isInitialized) return;

        try {
            // Import Firebase modules
            const { initializeApp } = await import('https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js');
            const { getFirestore, collection, query, where, orderBy, limit, getDocs, onSnapshot } = await import('https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js');

            // Initialize Firebase
            const app = initializeApp(firebaseConfig);
            this.db = getFirestore(app);
            this.firestoreModules = { collection, query, where, orderBy, limit, getDocs, onSnapshot };
            
            this.isInitialized = true;
            console.log('🔥 Firebase Analytics Reader initialized');
        } catch (error) {
            console.error('Failed to initialize Firebase:', error);
            throw error;
        }
    }

    // Get analytics data from Firebase
    async getAnalyticsData(timeRange = 30) {
        await this.initialize();

        const cacheKey = `analytics_${timeRange}`;
        const cached = this.cache.get(cacheKey);
        
        if (cached && Date.now() - cached.timestamp < this.cacheTimeout) {
            return cached.data;
        }

        try {
            const { collection, query, where, orderBy, limit, getDocs } = this.firestoreModules;
            
            // Calculate date range
            const endDate = new Date();
            const startDate = new Date(endDate.getTime() - timeRange * 24 * 60 * 60 * 1000);

            // Query Firebase for analytics events
            const analyticsRef = collection(this.db, 'portfolio_analytics');
            const q = query(
                analyticsRef,
                where('timestamp', '>=', startDate),
                where('timestamp', '<=', endDate),
                orderBy('timestamp', 'desc'),
                limit(10000) // Reasonable limit
            );

            const querySnapshot = await getDocs(q);
            const events = [];

            querySnapshot.forEach((doc) => {
                const data = doc.data();
                events.push({
                    id: doc.id,
                    ...data,
                    timestamp: data.timestamp?.toDate?.() || new Date(data.timestamp)
                });
            });

            console.log(`📊 Loaded ${events.length} analytics events from Firebase`);

            // Process the data
            const processedData = this.processAnalyticsEvents(events);
            
            // Cache the result
            this.cache.set(cacheKey, {
                data: processedData,
                timestamp: Date.now()
            });

            return processedData;
        } catch (error) {
            console.error('Error fetching analytics from Firebase:', error);
            return this.getEmptyAnalytics();
        }
    }

    // Process raw Firebase events into analytics format
    processAnalyticsEvents(events) {
        const now = new Date();
        const last7Days = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);

        // Filter events
        const recentEvents = events;
        const weeklyEvents = events.filter(event => new Date(event.timestamp) > last7Days);

        // Calculate basic metrics
        const pageViews = recentEvents.filter(e => e.action === 'page_view');
        const projectClickEvents = recentEvents.filter(e => e.action === 'project_click');
        const weeklyPageViews = weeklyEvents.filter(e => e.action === 'page_view');
        const weeklyProjectClicks = weeklyEvents.filter(e => e.action === 'project_click');

        // Project statistics
        const projectStats = {};
        const projectViewCounts = {};
        const projectClickCounts = {};

        // Count views and clicks per project
        pageViews.forEach(event => {
            const projectId = event.projectId || 'unknown';
            projectViewCounts[projectId] = (projectViewCounts[projectId] || 0) + 1;
        });

        projectClickEvents.forEach(event => {
            const projectId = event.projectId || 'unknown';
            projectClickCounts[projectId] = (projectClickCounts[projectId] || 0) + 1;
        });

        // Create project stats
        const allProjects = new Set([...Object.keys(projectViewCounts), ...Object.keys(projectClickCounts)]);
        allProjects.forEach(projectId => {
            const weeklyViews = weeklyEvents.filter(e => e.action === 'page_view' && e.projectId === projectId).length;
            const weeklyClicks = weeklyEvents.filter(e => e.action === 'project_click' && e.projectId === projectId).length;

            projectStats[projectId] = {
                title: this.getProjectTitle(projectId),
                totalViews: projectViewCounts[projectId] || 0,
                totalClicks: projectClickCounts[projectId] || 0,
                weeklyViews: weeklyViews,
                weeklyClicks: weeklyClicks,
                category: this.getProjectCategory(projectId),
                year: this.getProjectYear(projectId)
            };
        });

        // Top projects
        const topProjects = Object.values(projectStats)
            .sort((a, b) => (b.totalViews + b.totalClicks) - (a.totalViews + a.totalClicks))
            .slice(0, 10);

        // Daily statistics for the last 7 days
        const dailyStats = [];
        for (let i = 6; i >= 0; i--) {
            const date = new Date(now.getTime() - i * 24 * 60 * 60 * 1000);
            const dayStart = new Date(date.getFullYear(), date.getMonth(), date.getDate());
            const dayEnd = new Date(dayStart.getTime() + 24 * 60 * 60 * 1000);

            const dayEvents = events.filter(event => {
                const eventDate = new Date(event.timestamp);
                return eventDate >= dayStart && eventDate < dayEnd;
            });

            dailyStats.push({
                date: dayStart.toISOString().split('T')[0],
                views: dayEvents.filter(e => e.action === 'page_view').length,
                clicks: dayEvents.filter(e => e.action === 'project_click').length
            });
        }

        // Device and browser stats
        const deviceStats = this.calculateDeviceStats(recentEvents);
        const browserStats = this.calculateBrowserStats(recentEvents);
        const locationStats = this.calculateLocationStats(recentEvents);

        return {
            overview: {
                totalViews: pageViews.length,
                totalClicks: projectClickEvents.length,
                weeklyViews: weeklyPageViews.length,
                weeklyClicks: weeklyProjectClicks.length,
                totalEvents: recentEvents.length,
                uniqueSessions: new Set(recentEvents.map(e => e.sessionId)).size
            },
            projectStats,
            topProjects,
            dailyStats,
            deviceStats,
            browserStats,
            locationStats,
            recentEvents: recentEvents.slice(0, 50), // Last 50 events
            lastUpdated: new Date().toISOString()
        };
    }

    // Helper methods
    getProjectTitle(projectId) {
        const titles = {
            'guisado-3d-short-movie': 'GUISADO - 3D Short Movie',
            'sof-week-motion-design': 'SOF WEEK: Motion Design',
            'desistir-conceptual-book': 'DESISTIR - Conceptual Book',
            'ambivalencia-city-future': 'AMBIVALÊNCIA - City of the Future',
            'let-it-happen-experimental': 'LET IT HAPPEN - Experimental Animation',
            'portfolio-overview': 'Portfolio Overview',
            'homepage': 'Homepage'
        };
        return titles[projectId] || projectId.replace(/-/g, ' ').toUpperCase();
    }

    getProjectCategory(projectId) {
        const categories = {
            'guisado-3d-short-movie': '3D Animation',
            'sof-week-motion-design': 'Motion Design',
            'desistir-conceptual-book': 'Graphic Design',
            'ambivalencia-city-future': '2D Animation',
            'let-it-happen-experimental': 'Experimental',
            'portfolio-overview': 'Portfolio',
            'homepage': 'Website'
        };
        return categories[projectId] || 'Other';
    }

    getProjectYear(projectId) {
        const years = {
            'guisado-3d-short-movie': 2025,
            'sof-week-motion-design': 2025,
            'desistir-conceptual-book': 2024,
            'ambivalencia-city-future': 2023,
            'let-it-happen-experimental': 2022,
            'portfolio-overview': 2025,
            'homepage': 2025
        };
        return years[projectId] || 2025;
    }

    calculateDeviceStats(events) {
        const devices = { mobile: 0, desktop: 0, tablet: 0 };
        const userAgents = events.map(e => e.visitorInfo?.userAgent).filter(Boolean);
        
        userAgents.forEach(ua => {
            if (/Mobile|Android|iPhone|iPad/.test(ua)) {
                if (/iPad/.test(ua)) devices.tablet++;
                else devices.mobile++;
            } else {
                devices.desktop++;
            }
        });

        return devices;
    }

    calculateBrowserStats(events) {
        const browsers = {};
        const userAgents = events.map(e => e.visitorInfo?.userAgent).filter(Boolean);
        
        userAgents.forEach(ua => {
            let browser = 'Other';
            if (ua.includes('Chrome')) browser = 'Chrome';
            else if (ua.includes('Firefox')) browser = 'Firefox';
            else if (ua.includes('Safari')) browser = 'Safari';
            else if (ua.includes('Edge')) browser = 'Edge';
            
            browsers[browser] = (browsers[browser] || 0) + 1;
        });

        return browsers;
    }

    calculateLocationStats(events) {
        const locations = {};
        const timezones = events.map(e => e.visitorInfo?.timezone).filter(Boolean);
        
        timezones.forEach(tz => {
            // Simple timezone to region mapping
            let region = 'Other';
            if (tz.includes('Europe')) region = 'Europe';
            else if (tz.includes('America')) region = 'Americas';
            else if (tz.includes('Asia')) region = 'Asia';
            else if (tz.includes('Africa')) region = 'Africa';
            
            locations[region] = (locations[region] || 0) + 1;
        });

        return locations;
    }

    getEmptyAnalytics() {
        return {
            overview: {
                totalViews: 0,
                totalClicks: 0,
                weeklyViews: 0,
                weeklyClicks: 0,
                totalEvents: 0,
                uniqueSessions: 0
            },
            projectStats: {},
            topProjects: [],
            dailyStats: [],
            deviceStats: { mobile: 0, desktop: 0, tablet: 0 },
            browserStats: {},
            locationStats: {},
            recentEvents: [],
            lastUpdated: new Date().toISOString()
        };
    }

    // Real-time updates
    async setupRealTimeUpdates(callback) {
        await this.initialize();
        
        try {
            const { collection, query, orderBy, limit, onSnapshot } = this.firestoreModules;
            
            const analyticsRef = collection(this.db, 'portfolio_analytics');
            const q = query(
                analyticsRef,
                orderBy('timestamp', 'desc'),
                limit(100)
            );

            return onSnapshot(q, (snapshot) => {
                console.log('📊 Real-time analytics update received');
                this.cache.clear(); // Clear cache on updates
                callback();
            });
        } catch (error) {
            console.error('Error setting up real-time updates:', error);
        }
    }
}

// Export for use in backoffice
window.FirebaseAnalyticsReader = FirebaseAnalyticsReader;
