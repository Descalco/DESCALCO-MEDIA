const express = require('express');
const multer = require('multer');
const cors = require('cors');
const bcrypt = require('bcryptjs');
const session = require('express-session');
const fs = require('fs-extra');
const path = require('path');
const { v4: uuidv4 } = require('uuid');

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
  secret: 'descalco-portfolio-secret-key',
  resave: false,
  saveUninitialized: false,
  cookie: { secure: false, maxAge: 24 * 60 * 60 * 1000 } // 24 hours
}));

// File upload configuration
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const projectSlug = req.body.projectSlug || 'temp';
    const uploadPath = path.join(__dirname, 'uploads', projectSlug);
    fs.ensureDirSync(uploadPath);
    cb(null, uploadPath);
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
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
  
  // Simple password check (in production, use proper authentication)
  const adminPassword = 'descalco2025!'; // Change this to a secure password
  
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

// Get all projects
app.get('/api/projects', requireAuth, (req, res) => {
  const data = getProjectsData();
  res.json(data.projects);
});

// Get single project
app.get('/api/projects/:id', requireAuth, (req, res) => {
  const data = getProjectsData();
  const project = data.projects.find(p => p.id === req.params.id);
  if (project) {
    res.json(project);
  } else {
    res.status(404).json({ error: 'Project not found' });
  }
});

// Create new project
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
      tags: tags ? tags.split(',').map(tag => tag.trim()) : [],
      externalLink: projectType === 'simple' ? externalLink : null,
      featured: featured === 'true',
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

    // Update portfolio HTML if it's a simple project
    if (projectType === 'simple') {
      updatePortfolioHTML();
    }

    res.json({ success: true, project });
  } catch (error) {
    console.error('Error creating project:', error);
    res.status(500).json({ error: 'Failed to create project' });
  }
});

// Update project
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
      tags: req.body.tags ? req.body.tags.split(',').map(tag => tag.trim()) : existingProject.tags,
      externalLink: req.body.externalLink || existingProject.externalLink,
      featured: req.body.featured === 'true',
      updatedAt: new Date().toISOString()
    };

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

    // Update portfolio HTML
    updatePortfolioHTML();

    res.json({ success: true, project: updatedProject });
  } catch (error) {
    console.error('Error updating project:', error);
    res.status(500).json({ error: 'Failed to update project' });
  }
});

// Delete project
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
    }

    // Remove from data
    data.projects.splice(projectIndex, 1);
    saveProjectsData(data);

    // Update portfolio HTML
    updatePortfolioHTML();

    res.json({ success: true });
  } catch (error) {
    console.error('Error deleting project:', error);
    res.status(500).json({ error: 'Failed to delete project' });
  }
});

// Function to update the main portfolio HTML
const updatePortfolioHTML = () => {
  try {
    const data = getProjectsData();
    const portfolioPath = path.join(__dirname, '..', 'other-projects.html');
    
    if (!fs.existsSync(portfolioPath)) {
      console.error('Portfolio HTML file not found');
      return;
    }

    let html = fs.readFileSync(portfolioPath, 'utf8');
    
    // Generate HTML for new projects
    const newProjectsHTML = data.projects
      .filter(project => project.projectType === 'simple')
      .map(project => generateProjectHTML(project))
      .join('\n\n');

    // Find the insertion point (after the template)
    const templateEnd = html.indexOf('</template>');
    if (templateEnd !== -1) {
      const insertionPoint = html.indexOf('\n', templateEnd) + 1;
      
      // Find the end of existing projects (before closing portfolio-grid div)
      const gridEnd = html.indexOf('</div>', html.indexOf('<div class="portfolio-grid">'));
      
      // Replace the content between template and grid end
      const beforeTemplate = html.substring(0, insertionPoint);
      const afterGrid = html.substring(gridEnd);
      
      html = beforeTemplate + '\n' + newProjectsHTML + '\n    ' + afterGrid;
      
      fs.writeFileSync(portfolioPath, html);
      console.log('Portfolio HTML updated successfully');
    }
  } catch (error) {
    console.error('Error updating portfolio HTML:', error);
  }
};

// Generate HTML for a project
const generateProjectHTML = (project) => {
  const mediaElement = project.coverMedia 
    ? project.coverMedia.type === 'video'
      ? `<video class="project-media" autoplay loop muted playsinline>
          <source src="backoffice${project.coverMedia.path}" type="video/mp4" />
        </video>`
      : `<img src="backoffice${project.coverMedia.path}" alt="${project.title}" class="project-media" />`
    : `<div class="project-media" style="background: #333; display: flex; align-items: center; justify-content: center; color: #666;">No Media</div>`;

  const tagsHTML = project.tags.map(tag => `<span class="project-tag">${tag}</span>`).join('\n            ');

  return `      <!-- ${project.title} - Generated by Backoffice -->
      <div class="project-item">
        ${mediaElement}
        <div class="project-meta">
          <h3>${project.title}</h3>
          <div class="project-year">${project.year}</div>
        </div>
        <div class="project-overlay">
          <div class="project-title">${project.title}</div>
          <div class="project-description">
            ${project.description}
          </div>
          <div class="project-tags">
            ${tagsHTML}
          </div>
          <a href="${project.externalLink}" target="_blank" class="project-link">View Project</a>
        </div>
      </div>`;
};

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
});
