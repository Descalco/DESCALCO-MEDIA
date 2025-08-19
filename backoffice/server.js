const express = require('express');
const multer = require('multer');
const cors = require('cors');
const bcrypt = require('bcryptjs');
const session = require('express-session');
const fs = require('fs-extra');
const path = require('path');
const { v4: uuidv4 } = require('uuid');

// Load environment variables
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors({
  origin: [
    'http://localhost:3000',
    'http://127.0.0.1:3000',
    'https://*.netlify.app',
    'https://*.netlify.com',
    /https:\/\/.*\.netlify\.app$/,
    /https:\/\/.*\.netlify\.com$/
  ],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static('admin'));
app.use('/uploads', express.static('uploads'));

// Session configuration
app.use(session({
  secret: process.env.SESSION_SECRET || 'descalco-portfolio-secret-key',
  resave: false,
  saveUninitialized: false,
  cookie: { secure: false, maxAge: 24 * 60 * 60 * 1000 } // 24 hours
}));

// File upload configuration
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const projectSlug = req.body.projectSlug || req.body.title ? generateSlug(req.body.title) : 'temp';
    const uploadPath = path.join(__dirname, 'uploads', projectSlug);
    fs.ensureDirSync(uploadPath);
    cb(null, uploadPath);
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    const sanitizedName = file.originalname.toLowerCase().replace(/[^a-z0-9.]/g, '-');
    cb(null, file.fieldname + '-' + uniqueSuffix + '-' + sanitizedName);
  }
});

const upload = multer({ 
  storage: storage,
  limits: {
    fileSize: 100 * 1024 * 1024 // 100MB limit
  },
  fileFilter: (req, file, cb) => {
    const allowedTypes = /jpeg|jpg|png|gif|mp4|mov|avi|webm|pdf/;
    const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = allowedTypes.test(file.mimetype);
    
    // Additional check for dangerous file types
    const dangerousExtensions = /exe|bat|cmd|scr|pif|com|js|vbs|jar|app|deb|rpm/i;
    if (dangerousExtensions.test(file.originalname)) {
      return cb(new Error('Dangerous file type not allowed!'));
    }
    
    if (mimetype && extname) {
      return cb(null, true);
    } else {
      cb(new Error('Only images, videos, and PDFs are allowed!'));
    }
  }
});

// Authentication middleware
const requireAuth = (req, res, next) => {
  if (req.session.authenticated) {
    next();
  } else {
    res.status(401).json({ error: 'Authentication required' });
  }
};

// Utility functions
const getProjectsData = () => {
  const dataPath = path.join(__dirname, 'data', 'projects.json');
  try {
    if (fs.existsSync(dataPath)) {
      return JSON.parse(fs.readFileSync(dataPath, 'utf8'));
    }
  } catch (error) {
    console.error('Error reading projects data:', error);
  }
  return { projects: [] };
};

const saveProjectsData = (data) => {
  const dataPath = path.join(__dirname, 'data', 'projects.json');
  fs.ensureDirSync(path.dirname(dataPath));
  fs.writeFileSync(dataPath, JSON.stringify(data, null, 2));
};

const generateSlug = (title) => {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');
};

// Routes

// Root redirect to login
app.get('/', (req, res) => {
  if (req.session.authenticated) {
    res.redirect('/dashboard.html');
  } else {
    res.redirect('/login.html');
  }
});

// Admin routes - serve static files with auth check
app.get('/dashboard.html', requireAuth, (req, res) => {
  res.sendFile(path.join(__dirname, 'admin', 'dashboard.html'));
});

app.get('/add-project.html', requireAuth, (req, res) => {
  res.sendFile(path.join(__dirname, 'admin', 'add-project.html'));
});

app.get('/analytics.html', requireAuth, (req, res) => {
  res.sendFile(path.join(__dirname, 'admin', 'analytics.html'));
});

app.get('/media-manager.html', requireAuth, (req, res) => {
  res.sendFile(path.join(__dirname, 'admin', 'media-manager.html'));
});

// Login page (no auth required)
app.get('/login.html', (req, res) => {
  if (req.session.authenticated) {
    res.redirect('/dashboard.html');
  } else {
    res.sendFile(path.join(__dirname, 'admin', 'login.html'));
  }
});

// Login endpoint
app.post('/api/login', async (req, res) => {
  const { password } = req.body;
  
  // Use environment variable for admin password
  const adminPassword = process.env.ADMIN_PASSWORD || 'descalco2025!';
  
  if (password === adminPassword) {
    req.session.authenticated = true;
    res.json({ success: true });
  } else {
    res.status(401).json({ error: 'Invalid password' });
  }
});

// Logout endpoint
app.post('/api/logout', (req, res) => {
  req.session.destroy();
  res.json({ success: true });
});

// Legacy routes for backward compatibility
app.get('/dashboard', requireAuth, (req, res) => {
  res.redirect('/dashboard.html');
});

app.get('/add-project', requireAuth, (req, res) => {
  res.redirect('/add-project.html');
});

app.get('/edit-project', requireAuth, (req, res) => {
  res.redirect('/add-project.html');
});

app.get('/analytics', requireAuth, (req, res) => {
  res.redirect('/analytics.html');
});

app.get('/media-manager', requireAuth, (req, res) => {
  res.redirect('/media-manager.html');
});

// ===== PROJECT API ROUTES =====
// These routes handle the dynamic portfolio system

// Get all projects (PUBLIC ROUTE - no auth required for portfolio display)
app.get('/api/projects', (req, res) => {
  try {
    const data = getProjectsData();
    
    // Transform projects for the portfolio format
    const portfolioProjects = data.projects.map(project => ({
      id: project.id,
      title: project.title,
      year: project.year,
      category: project.category,
      description: project.description,
      tags: project.tags || [],
      projectType: project.projectType,
      externalLink: project.externalLink,
      featured: project.featured,
      coverMedia: project.coverMedia ? `/backoffice${project.coverMedia.path}` : null,
      mediaType: project.coverMedia ? project.coverMedia.type : 'image',
      isStatic: false,
      createdAt: project.createdAt,
      updatedAt: project.updatedAt
    }));
    
    // Sort projects: featured first, then by year (newest first)
    portfolioProjects.sort((a, b) => {
      if (a.featured && !b.featured) return -1;
      if (!a.featured && b.featured) return 1;
      return b.year - a.year;
    });
    
    res.json(portfolioProjects);
  } catch (error) {
    console.error('Error fetching projects for portfolio:', error);
    res.status(500).json({ error: 'Failed to fetch projects' });
  }
});

// Get single project (PUBLIC ROUTE)
app.get('/api/projects/:id', (req, res) => {
  try {
    const data = getProjectsData();
    const project = data.projects.find(p => p.id === req.params.id);
    
    if (!project) {
      return res.status(404).json({ error: 'Project not found' });
    }
    
    // Transform for portfolio format
    const portfolioProject = {
      id: project.id,
      title: project.title,
      year: project.year,
      category: project.category,
      description: project.description,
      tags: project.tags || [],
      projectType: project.projectType,
      externalLink: project.externalLink,
      featured: project.featured,
      coverMedia: project.coverMedia ? `/backoffice${project.coverMedia.path}` : null,
      mediaType: project.coverMedia ? project.coverMedia.type : 'image',
      gallery: project.gallery,
      isStatic: false
    };
    
    res.json(portfolioProject);
  } catch (error) {
    console.error('Error fetching project:', error);
    res.status(500).json({ error: 'Failed to fetch project' });
  }
});

// Serve project cover media (PUBLIC ROUTE)
app.get('/api/projects/:id/cover', (req, res) => {
  try {
    const data = getProjectsData();
    const project = data.projects.find(p => p.id === req.params.id);
    
    if (!project || !project.coverMedia) {
      return res.status(404).json({ error: 'Cover media not found' });
    }
    
    const filePath = path.join(__dirname, project.coverMedia.path.replace(/^\/backoffice/, ''));
    
    if (fs.existsSync(filePath)) {
      res.sendFile(filePath);
    } else {
      res.status(404).json({ error: 'Media file not found' });
    }
  } catch (error) {
    console.error('Error serving cover media:', error);
    res.status(500).json({ error: 'Failed to serve media' });
  }
});

// Admin-only project management routes
app.get('/api/admin/projects', requireAuth, (req, res) => {
  const data = getProjectsData();
  res.json(data.projects);
});

// Create new project (ADMIN ONLY)
app.post('/api/projects', requireAuth, upload.fields([
  { name: 'coverMedia', maxCount: 1 },
  { name: 'galleryImages', maxCount: 20 },
  { name: 'galleryVideos', maxCount: 10 }
]), (req, res) => {
  try {
    const {
      title,
      year,
      category,
      projectType,
      description,
      tags,
      externalLink,
      featured
    } = req.body;

    // Validation
    if (!title || !year || !category || !projectType || !description) {
      return res.status(400).json({ 
        error: 'Missing required fields: title, year, category, projectType, description' 
      });
    }

    const projectId = uuidv4();
    const slug = generateSlug(title);
    
    // Process uploaded files
    const files = req.files || {};
    const coverMedia = files.coverMedia ? files.coverMedia[0] : null;
    const galleryImages = files.galleryImages || [];
    const galleryVideos = files.galleryVideos || [];

    const project = {
      id: projectId,
      slug,
      title,
      year: parseInt(year),
      category,
      projectType,
      description,
      tags: tags ? tags.split(',').map(tag => tag.trim()).filter(t => t) : [],
      externalLink: projectType === 'simple' ? externalLink : null,
      featured: featured === 'true' || featured === 'on' || featured === true,
      coverMedia: coverMedia ? {
        type: coverMedia.mimetype.startsWith('video') ? 'video' : 'image',
        filename: coverMedia.filename,
        path: `/uploads/${slug}/${coverMedia.filename}`
      } : null,
      gallery: {
        images: galleryImages.map(img => ({
          filename: img.filename,
          path: `/uploads/${slug}/${img.filename}`
        })),
        videos: galleryVideos.map(vid => ({
          filename: vid.filename,
          path: `/uploads/${slug}/${vid.filename}`
        }))
      },
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    // Save project data
    const data = getProjectsData();
    data.projects.push(project);
    saveProjectsData(data);

    console.log(`✅ New project created: "${project.title}" (ID: ${project.id})`);

    res.status(201).json({ 
      success: true, 
      message: 'Project created successfully',
      project 
    });
    
  } catch (error) {
    console.error('Error creating project:', error);
    res.status(500).json({ error: 'Failed to create project: ' + error.message });
  }
});

// Update project (ADMIN ONLY)
app.put('/api/projects/:id', requireAuth, upload.fields([
  { name: 'coverMedia', maxCount: 1 },
  { name: 'galleryImages', maxCount: 20 },
  { name: 'galleryVideos', maxCount: 10 }
]), (req, res) => {
  try {
    const data = getProjectsData();
    const projectIndex = data.projects.findIndex(p => p.id === req.params.id);
    
    if (projectIndex === -1) {
      return res.status(404).json({ error: 'Project not found' });
    }

    const existingProject = data.projects[projectIndex];
    const files = req.files || {};

    // Update project data
    const updatedProject = {
      ...existingProject,
      title: req.body.title || existingProject.title,
      year: req.body.year ? parseInt(req.body.year) : existingProject.year,
      category: req.body.category || existingProject.category,
      projectType: req.body.projectType || existingProject.projectType,
      description: req.body.description || existingProject.description,
      tags: req.body.tags ? req.body.tags.split(',').map(tag => tag.trim()).filter(t => t) : existingProject.tags,
      externalLink: req.body.externalLink || existingProject.externalLink,
      featured: req.body.featured === 'true' || req.body.featured === 'on' || req.body.featured === true,
      updatedAt: new Date().toISOString()
    };

    // Update slug if title changed
    if (req.body.title && req.body.title !== existingProject.title) {
      updatedProject.slug = generateSlug(req.body.title);
    }

    // Update cover media if new file uploaded
    if (files.coverMedia && files.coverMedia[0]) {
      const coverMedia = files.coverMedia[0];
      updatedProject.coverMedia = {
        type: coverMedia.mimetype.startsWith('video') ? 'video' : 'image',
        filename: coverMedia.filename,
        path: `/uploads/${updatedProject.slug}/${coverMedia.filename}`
      };
    }

    // Update gallery if new files uploaded
    if (files.galleryImages && files.galleryImages.length > 0) {
      updatedProject.gallery.images = files.galleryImages.map(img => ({
        filename: img.filename,
        path: `/uploads/${updatedProject.slug}/${img.filename}`
      }));
    }

    if (files.galleryVideos && files.galleryVideos.length > 0) {
      updatedProject.gallery.videos = files.galleryVideos.map(vid => ({
        filename: vid.filename,
        path: `/uploads/${updatedProject.slug}/${vid.filename}`
      }));
    }

    data.projects[projectIndex] = updatedProject;
    saveProjectsData(data);

    console.log(`✅ Project updated: "${updatedProject.title}" (ID: ${updatedProject.id})`);

    res.json({ 
      success: true, 
      message: 'Project updated successfully',
      project: updatedProject 
    });
    
  } catch (error) {
    console.error('Error updating project:', error);
    res.status(500).json({ error: 'Failed to update project: ' + error.message });
  }
});

// Delete project (ADMIN ONLY)
app.delete('/api/projects/:id', requireAuth, (req, res) => {
  try {
    const data = getProjectsData();
    const projectIndex = data.projects.findIndex(p => p.id === req.params.id);
    
    if (projectIndex === -1) {
      return res.status(404).json({ error: 'Project not found' });
    }

    const project = data.projects[projectIndex];
    
    // Remove project files
    const projectPath = path.join(__dirname, 'uploads', project.slug);
    if (fs.existsSync(projectPath)) {
      fs.removeSync(projectPath);
      console.log(`🗑️ Removed project files: ${projectPath}`);
    }

    // Remove from data
    data.projects.splice(projectIndex, 1);
    saveProjectsData(data);

    console.log(`❌ Project deleted: "${project.title}" (ID: ${project.id})`);

    res.json({ 
      success: true,
      message: 'Project deleted successfully' 
    });
    
  } catch (error) {
    console.error('Error deleting project:', error);
    res.status(500).json({ error: 'Failed to delete project: ' + error.message });
  }
});

// ===== ANALYTICS ROUTES =====

// Public Analytics Endpoints (no auth required)
app.post('/api/analytics/track', (req, res) => {
  try {
    const { projectId, action, userAgent, timestamp } = req.body;
    
    // Get analytics data
    const analyticsPath = path.join(__dirname, 'data', 'analytics.json');
    let analyticsData = { events: [] };
    
    if (fs.existsSync(analyticsPath)) {
      analyticsData = JSON.parse(fs.readFileSync(analyticsPath, 'utf8'));
    }
    
    // Add new event
    const event = {
      id: uuidv4(),
      projectId,
      action, // 'view', 'click', 'hover'
      userAgent,
      timestamp: timestamp || new Date().toISOString(),
      ip: req.ip || req.connection.remoteAddress
    };
    
    analyticsData.events.push(event);
    
    // Keep only last 10000 events to prevent file from growing too large
    if (analyticsData.events.length > 10000) {
      analyticsData.events = analyticsData.events.slice(-10000);
    }
    
    // Save analytics data
    fs.ensureDirSync(path.dirname(analyticsPath));
    fs.writeFileSync(analyticsPath, JSON.stringify(analyticsData, null, 2));
    
    res.json({ success: true });
  } catch (error) {
    console.error('Error tracking analytics:', error);
    res.status(500).json({ error: 'Failed to track event' });
  }
});

// Get analytics data (auth required)
app.get('/api/analytics', requireAuth, (req, res) => {
  try {
    const analyticsPath = path.join(__dirname, 'data', 'analytics.json');
    let analyticsData = { events: [] };
    
    if (fs.existsSync(analyticsPath)) {
      analyticsData = JSON.parse(fs.readFileSync(analyticsPath, 'utf8'));
    }
    
    // Process analytics data
    const projectsData = getProjectsData();
    const analytics = processAnalyticsData(analyticsData.events, projectsData.projects);
    
    res.json(analytics);
  } catch (error) {
    console.error('Error getting analytics:', error);
    res.status(500).json({ error: 'Failed to get analytics' });
  }
});

// Process analytics data
const processAnalyticsData = (events, projects) => {
  const now = new Date();
  const last30Days = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
  const last7Days = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
  
  // Filter recent events
  const recentEvents = events.filter(event => new Date(event.timestamp) > last30Days);
  const weeklyEvents = events.filter(event => new Date(event.timestamp) > last7Days);
  
  // Project statistics
  const projectStats = {};
  projects.forEach(project => {
    const projectEvents = recentEvents.filter(event => event.projectId === project.id);
    const weeklyProjectEvents = weeklyEvents.filter(event => event.projectId === project.id);
    
    projectStats[project.id] = {
      title: project.title,
      totalViews: projectEvents.filter(e => e.action === 'view').length,
      totalClicks: projectEvents.filter(e => e.action === 'click').length,
      weeklyViews: weeklyProjectEvents.filter(e => e.action === 'view').length,
      weeklyClicks: weeklyProjectEvents.filter(e => e.action === 'click').length,
      category: project.category,
      year: project.year
    };
  });
  
  // Overall statistics
  const totalViews = recentEvents.filter(e => e.action === 'view').length;
  const totalClicks = recentEvents.filter(e => e.action === 'click').length;
  const weeklyViews = weeklyEvents.filter(e => e.action === 'view').length;
  const weeklyClicks = weeklyEvents.filter(e => e.action === 'click').length;
  
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
      views: dayEvents.filter(e => e.action === 'view').length,
      clicks: dayEvents.filter(e => e.action === 'click').length
    });
  }
  
  return {
    overview: {
      totalViews,
      totalClicks,
      weeklyViews,
      weeklyClicks,
      totalEvents: recentEvents.length
    },
    projectStats,
    topProjects,
    dailyStats
  };
};

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Backoffice server running on http://localhost:${PORT}`);
  console.log(`📁 Admin panel: http://localhost:${PORT}/dashboard`);
  console.log(`🔑 Default password: descalco2025!`);
  console.log(`📊 Analytics tracking enabled`);
  console.log(`🌐 CORS enabled for Netlify integration`);
  console.log(`🎨 Dynamic Portfolio API available at /api/projects`);
  
  // Ensure required directories exist
  fs.ensureDirSync(path.join(__dirname, 'data'));
  fs.ensureDirSync(path.join(__dirname, 'uploads'));
  
  console.log(`📂 Data directory: ${path.join(__dirname, 'data')}`);
  console.log(`📂 Uploads directory: ${path.join(__dirname, 'uploads')}`);
});