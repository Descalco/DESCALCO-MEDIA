const express = require('express');
const multer = require('multer');
const cors = require('cors');
const bcrypt = require('bcryptjs');
const session = require('express-session');
const fs = require('fs-extra');
const path = require('path');
const { v4: uuidv4 } = require('uuid');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const { body, validationResult } = require('express-validator');

// Load environment variables from the correct directory
require('dotenv').config({ path: path.join(__dirname, '.env') });

// Security: Check for required environment variables
if (!process.env.ADMIN_PASSWORD) {
  console.warn('⚠️  WARNING: ADMIN_PASSWORD not set in environment variables!');
  console.warn('⚠️  Please create a .env file with ADMIN_PASSWORD=your_secure_password');
}
if (!process.env.SESSION_SECRET) {
  console.warn('⚠️  WARNING: SESSION_SECRET not set in environment variables!');
}

// Rate limiters for security
const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5, // limit each IP to 5 login attempts per windowMs
  message: { error: 'Too many login attempts, please try again after 15 minutes' },
  standardHeaders: true,
  legacyHeaders: false,
});

const generalLimiter = rateLimit({
  windowMs: 1 * 60 * 1000, // 1 minute
  max: 100, // limit each IP to 100 requests per minute
  standardHeaders: true,
  legacyHeaders: false,
});

const analyticsLimiter = rateLimit({
  windowMs: 1 * 60 * 1000, // 1 minute
  max: 30, // limit analytics tracking
  standardHeaders: true,
  legacyHeaders: false,
});

const app = express();
const PORT = process.env.PORT || 3001;

// Security headers
app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      styleSrc: ["'self'", "'unsafe-inline'", "https://fonts.googleapis.com"],
      fontSrc: ["'self'", "https://fonts.gstatic.com"],
      scriptSrc: ["'self'", "'unsafe-inline'"],
      imgSrc: ["'self'", "data:", "blob:"],
      mediaSrc: ["'self'", "blob:"],
      connectSrc: ["'self'"],
    },
  },
  crossOriginEmbedderPolicy: false,
}));

// Apply general rate limiting
app.use(generalLimiter);

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
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Session configuration with security options
app.use(session({
  secret: process.env.SESSION_SECRET || require('crypto').randomBytes(32).toString('hex'),
  resave: false,
  saveUninitialized: false,
  cookie: {
    secure: process.env.NODE_ENV === 'production', // HTTPS only in production
    httpOnly: true, // Prevents XSS access to cookies
    sameSite: 'strict', // Prevents CSRF attacks
    maxAge: 24 * 60 * 60 * 1000 // 24 hours
  },
  name: 'sessionId' // Don't use default 'connect.sid'
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

// Login endpoint with rate limiting and input validation
app.post('/api/login', 
  loginLimiter,
  body('password').isString().isLength({ min: 1, max: 128 }).trim(),
  async (req, res) => {
    // Validate input
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ error: 'Invalid input' });
    }

    const { password } = req.body;
    
    // SECURITY: Require environment variable - no fallback password
    const adminPassword = process.env.ADMIN_PASSWORD;
    
    if (!adminPassword) {
      console.error('SECURITY ERROR: ADMIN_PASSWORD environment variable not set!');
      return res.status(500).json({ error: 'Server configuration error' });
    }
    
    // Use timing-safe comparison to prevent timing attacks
    const crypto = require('crypto');
    let passwordMatch = false;
    
    try {
      // Pad both passwords to the same length to prevent length-based timing attacks
      const maxLen = Math.max(password.length, adminPassword.length);
      const paddedInput = password.padEnd(maxLen, '\0');
      const paddedAdmin = adminPassword.padEnd(maxLen, '\0');
      
      passwordMatch = crypto.timingSafeEqual(
        Buffer.from(paddedInput, 'utf8'),
        Buffer.from(paddedAdmin, 'utf8')
      ) && password.length === adminPassword.length;
    } catch (error) {
      console.error('Password comparison error:', error.message);
      passwordMatch = false;
    }
    
    if (passwordMatch) {
      req.session.authenticated = true;
      res.json({ success: true });
    } else {
      // Add small delay to prevent timing attacks
      await new Promise(resolve => setTimeout(resolve, 100 + Math.random() * 100));
      res.status(401).json({ error: 'Invalid password' });
    }
  }
);

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
    const portfolioProjects = data.projects.map(project => {
      let coverMedia = null;
      let mediaType = 'image';

      if (project.coverMedia) {
        if (typeof project.coverMedia === 'string') {
          // Se era um upload local, troca para a pasta de assets
          if (project.coverMedia.startsWith('/uploads/')) {
            const fileName = project.coverMedia.split('/').pop();
            coverMedia = `assets/img/OUTROS/${fileName}`;
            mediaType = fileName.endsWith('.mp4') ? 'video' : 'image';
          } else {
            coverMedia = project.coverMedia;
            mediaType = coverMedia.endsWith('.mp4') ? 'video' : 'image';
          }
        } else if (typeof project.coverMedia === 'object') {
          // Novos uploads em formato objeto
          if (project.coverMedia.path.startsWith('/uploads/')) {
            const fileName = project.coverMedia.path.split('/').pop();
            coverMedia = `assets/img/OUTROS/${fileName}`;
          } else {
            coverMedia = project.coverMedia.path;
          }
          mediaType = project.coverMedia.type || 'image';
        }
      }

      return {
        id: project.id,
        title: project.title,
        year: project.year,
        category: project.category,
        description: project.description,
        tags: project.tags || [],
        projectType: project.projectType,
        externalLink: project.externalLink,
        featured: project.featured,
        coverMedia,
        mediaType,
        isStatic: false,
        createdAt: project.createdAt,
        updatedAt: project.updatedAt
      };
    });

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
    
    // Security: Prevent path traversal
    const uploadsDir = path.resolve(__dirname, 'uploads');
    const requestedPath = project.coverMedia.path.replace(/^\/backoffice/, '').replace(/^\/uploads/, '');
    const filePath = path.resolve(uploadsDir, requestedPath.replace(/^\//, ''));
    
    // Verify the resolved path is within uploads directory
    if (!filePath.startsWith(uploadsDir)) {
      console.warn('Path traversal attempt blocked:', requestedPath);
      return res.status(403).json({ error: 'Access denied' });
    }
    
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

// Input validation helper
const validateProjectInput = (body) => {
  const errors = [];
  const { title, year, category, projectType, description, externalLink } = body;
  
  // Required fields
  if (!title || typeof title !== 'string' || title.trim().length === 0) {
    errors.push('Title is required');
  } else if (title.length > 200) {
    errors.push('Title must be less than 200 characters');
  }
  
  if (!year || isNaN(parseInt(year)) || parseInt(year) < 1900 || parseInt(year) > 2100) {
    errors.push('Valid year is required (1900-2100)');
  }
  
  if (!category || typeof category !== 'string' || category.trim().length === 0) {
    errors.push('Category is required');
  } else if (category.length > 100) {
    errors.push('Category must be less than 100 characters');
  }
  
  if (!projectType || !['simple', 'case-study'].includes(projectType)) {
    errors.push('Project type must be "simple" or "case-study"');
  }
  
  if (!description || typeof description !== 'string' || description.trim().length === 0) {
    errors.push('Description is required');
  } else if (description.length > 5000) {
    errors.push('Description must be less than 5000 characters');
  }
  
  // Optional fields validation
  if (externalLink && typeof externalLink === 'string' && externalLink.trim().length > 0) {
    try {
      const url = new URL(externalLink);
      if (!['http:', 'https:'].includes(url.protocol)) {
        errors.push('External link must be a valid HTTP/HTTPS URL');
      }
    } catch {
      errors.push('External link must be a valid URL');
    }
  }
  
  return errors;
};

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

    // Input validation
    const validationErrors = validateProjectInput(req.body);
    if (validationErrors.length > 0) {
      return res.status(400).json({ 
        error: 'Validation failed',
        details: validationErrors
      });
    }

    const projectId = uuidv4();
    const slug = generateSlug(title);
    
    // Process uploaded files
    const files = req.files || {};
    const coverMedia = files.coverMedia ? files.coverMedia[0] : null;
    const galleryImages = files.galleryImages || [];
    const galleryVideos = files.galleryVideos || [];

    // Get existing data first
    const data = getProjectsData();

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
      visible: true, // Default to visible
      displayOrder: data.projects.length, // Set order to end of list
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

// Update project order (ADMIN ONLY) - MUST be before the /:id route
app.put('/api/projects/reorder', requireAuth, (req, res) => {
  try {
    const { projectIds } = req.body;
    
    if (!Array.isArray(projectIds)) {
      return res.status(400).json({ error: 'projectIds must be an array' });
    }

    const data = getProjectsData();
    
    // Update display order for each project
    projectIds.forEach((projectId, index) => {
      const projectIndex = data.projects.findIndex(p => p.id === projectId);
      if (projectIndex !== -1) {
        data.projects[projectIndex].displayOrder = index;
        data.projects[projectIndex].updatedAt = new Date().toISOString();
      } else {
        console.warn(`⚠️ Project not found for reordering: ${projectId}`);
      }
    });

    saveProjectsData(data);

    console.log(`✅ Project order updated for ${projectIds.length} projects`);

    res.json({ 
      success: true, 
      message: 'Project order updated successfully'
    });
    
  } catch (error) {
    console.error('Error updating project order:', error);
    res.status(500).json({ error: 'Failed to update project order: ' + error.message });
  }
});

// Toggle project visibility (ADMIN ONLY) - MUST be before the /:id route
app.put('/api/projects/:id/visibility', requireAuth, (req, res) => {
  try {
    const { visible } = req.body;
    const data = getProjectsData();
    const projectIndex = data.projects.findIndex(p => p.id === req.params.id);
    
    if (projectIndex === -1) {
      return res.status(404).json({ error: 'Project not found' });
    }

    data.projects[projectIndex].visible = visible;
    data.projects[projectIndex].updatedAt = new Date().toISOString();
    
    saveProjectsData(data);

    console.log(`✅ Project visibility updated: "${data.projects[projectIndex].title}" - ${visible ? 'Visible' : 'Hidden'}`);

    res.json({ 
      success: true, 
      message: `Project ${visible ? 'shown' : 'hidden'} successfully`,
      project: data.projects[projectIndex]
    });
    
  } catch (error) {
    console.error('Error updating project visibility:', error);
    res.status(500).json({ error: 'Failed to update project visibility: ' + error.message });
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
      visible: req.body.visible !== undefined ? req.body.visible === 'true' || req.body.visible === 'on' || req.body.visible === true : (existingProject.visible !== undefined ? existingProject.visible : true),
      displayOrder: req.body.displayOrder !== undefined ? parseInt(req.body.displayOrder) : existingProject.displayOrder,
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

// Public Analytics Endpoints (with rate limiting for abuse prevention)
app.post('/api/analytics/track', analyticsLimiter, (req, res) => {
  try {
    const { projectId, action, userAgent, timestamp } = req.body;
    
    // Input validation
    if (!projectId || typeof projectId !== 'string' || projectId.length > 100) {
      return res.status(400).json({ error: 'Invalid projectId' });
    }
    if (!action || !['view', 'click', 'hover'].includes(action)) {
      return res.status(400).json({ error: 'Invalid action' });
    }
    
    // Get analytics data
    const analyticsPath = path.join(__dirname, 'data', 'analytics.json');
    let analyticsData = { events: [] };
    
    if (fs.existsSync(analyticsPath)) {
      analyticsData = JSON.parse(fs.readFileSync(analyticsPath, 'utf8'));
    }
    
    // Add new event (anonymize IP for privacy - only store hash)
    const crypto = require('crypto');
    const anonymizedIp = crypto.createHash('sha256')
      .update((req.ip || req.connection.remoteAddress || '') + 'salt_descalco')
      .digest('hex')
      .substring(0, 16); // Only store partial hash
    
    const event = {
      id: uuidv4(),
      projectId: projectId.substring(0, 100), // Limit length
      action,
      userAgent: (userAgent || '').substring(0, 500), // Limit length
      timestamp: timestamp || new Date().toISOString(),
      ipHash: anonymizedIp // Store anonymized version instead of raw IP
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
  console.log(`� Security: Rate limiting enabled`);
  console.log(`🛡️  Security: Helmet headers enabled`);
  console.log(`📊 Analytics tracking enabled`);
  console.log(`🌐 CORS enabled for Netlify integration`);
  console.log(`🎨 Dynamic Portfolio API available at /api/projects`);
  
  // Security warnings
  if (!process.env.ADMIN_PASSWORD) {
    console.log('\n⚠️  SECURITY WARNING: Set ADMIN_PASSWORD in .env file!');
  }
  if (!process.env.SESSION_SECRET) {
    console.log('⚠️  SECURITY WARNING: Set SESSION_SECRET in .env file!');
  }
  
  // Ensure required directories exist
  fs.ensureDirSync(path.join(__dirname, 'data'));
  fs.ensureDirSync(path.join(__dirname, 'uploads'));
  
  console.log(`📂 Data directory: ${path.join(__dirname, 'data')}`);
  console.log(`📂 Uploads directory: ${path.join(__dirname, 'uploads')}`);
});