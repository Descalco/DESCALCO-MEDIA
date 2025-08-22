# DESCALCO MEDIA - Portfolio Website Documentation

## 🎯 Overview

This is a professional portfolio website for Pedro Costa (Descalco Media), a Motion Designer & Digital Artist. The website features a dynamic portfolio system with a custom backoffice for content management.

## 📁 Project Structure

```
DESCALCO-MEDIA/
├── README.md                   # 📖 This documentation file
├── index.html                  # 🏠 Main portfolio homepage
├── other-projects.html         # 📋 Dynamic portfolio gallery
├── mystory.html               # 👤 About/story page
├── showreel.html              # 🎬 Future showreel page
├── [Project].html             # 📄 Individual project case studies
├── package.json               # 📦 Node.js dependencies
├── generate-portfolio-data.js # ⚙️ Portfolio data generator
├── firebase-portfolio-analytics.js # 📊 Analytics integration
├── analytics-integration.js   # 📈 Additional analytics
├── scripts/                   # 🔧 Automation scripts
├── assets/                    # 🎨 Static resources
├── backoffice/               # 🏢 Admin management system
└── works/                    # 📁 Project files directory
```

## 🏗️ Architecture Overview

### Frontend Architecture
The website uses a **hybrid approach**:
- **Static HTML pages** for main navigation and individual project case studies
- **Dynamic JavaScript** for portfolio content loaded from backoffice data
- **Responsive CSS** with modular SASS architecture
- **Progressive enhancement** with fallbacks for older browsers

### Backend Architecture
- **Node.js/Express server** for backoffice administration
- **JSON file-based database** for project data storage
- **File upload system** for media management
- **Static file generation** for frontend integration

## 🎨 Frontend System

### Main Pages

#### 1. `index.html` - Homepage
**Purpose**: Main portfolio landing page with navigation
**Key Features**:
- Logo animation on load (`assets/video/OPENER.webm`)
- Single-page application feel with section navigation
- Responsive design with mobile notifications
- Contact form integration (Formspree)

**JavaScript Dependencies**:
- jQuery 2.2.4
- Hammer.js (touch gestures)
- `assets/js/functions.js` (main functionality)
- `firebase-portfolio-analytics.js` (tracking)

**CSS Architecture**:
- `assets/css/main.css` (compiled from SASS)
- Modular structure: base, layouts, modules
- Mobile-first responsive design

#### 2. `other-projects.html` - Portfolio Gallery
**Purpose**: Dynamic portfolio displaying all projects from backoffice
**Data Source**: `assets/js/portfolio-data.js` (generated from backoffice)
**Key Features**:
- Grid layout with hover effects
- Video/image media support
- Project filtering and sorting
- Mobile-optimized interactions

**How it works**:
1. Imports project data from `portfolio-data.js`
2. Dynamically creates project cards
3. Handles media (images/videos) based on file type
4. Links to individual project pages or external URLs

#### 3. Individual Project Pages
**Examples**: `GUISADO.html`, `SOF-WEEK.html`, etc.
**Purpose**: Detailed case studies for major projects
**Structure**:
- Project metadata (duration, role, software)
- Media galleries (images, videos, GIFs)
- Technical approach explanations
- Personal contributions and learnings

### CSS Architecture (`assets/css/`)

```
css/
├── main.css                   # Compiled output
├── main.sass                  # Main SASS file
├── portfolio-unified.css      # Portfolio-specific styles
├── base/                      # Foundation styles
│   ├── _normalize.scss        # CSS reset
│   ├── _fonts.scss           # Font definitions
│   ├── _vars.sass            # SASS variables
│   ├── _body-element.sass    # Base body styles
│   └── _selection-colors.sass # Text selection colors
├── layouts/                   # Layout systems
│   └── _grid.sass            # Grid system
└── modules/                   # Component styles
    ├── _header.sass          # Header/navigation
    ├── _intro.sass           # Homepage intro
    ├── _work.sass            # Work section
    ├── _about.sass           # About section
    ├── _contact.sass         # Contact section
    ├── _hire.sass            # Hire section
    └── [other modules]
```

### JavaScript Architecture (`assets/js/`)

#### Core Files:
- **`functions.js`**: Main website functionality
  - Section navigation
  - Touch/swipe gestures
  - Animation controls
  - Form handling

- **`portfolio-data.js`**: Generated project data
  - Exported from backoffice system
  - Contains all project information
  - Used by `other-projects.html`

- **`portfolio-dynamic.js`**: Dynamic portfolio logic
- **`mobile-portfolio.js`**: Mobile-specific enhancements

## 🏢 Backoffice System

### Purpose
Custom content management system for portfolio projects, allowing easy addition/editing of projects without touching code.

### Structure (`backoffice/`)

```
backoffice/
├── server.js                  # Express server
├── package.json              # Node.js dependencies
├── .env                      # Environment variables
├── admin/                    # Frontend admin interface
│   ├── login.html           # Admin login
│   ├── dashboard.html       # Main admin dashboard
│   ├── add-project.html     # Add new projects
│   ├── analytics.html       # Analytics viewer
│   └── media-manager.html   # File management
├── api/                     # API endpoints (if any)
├── data/                    # JSON database
│   ├── projects.json        # Project data
│   └── analytics.json       # Analytics data
└── uploads/                 # User-uploaded media
```

### How Backoffice Works

#### 1. Project Management
- **Add Projects**: Through `add-project.html` interface
- **Edit Projects**: Modify existing project data
- **Media Upload**: Upload images/videos for projects
- **Project Ordering**: Drag-and-drop reordering

#### 2. Data Flow
```
Admin Interface → projects.json → generate-portfolio-data.js → portfolio-data.js → Frontend
```

#### 3. Project Data Structure
```json
{
  "id": "unique-project-id",
  "title": "Project Title",
  "year": 2024,
  "category": "Motion Design",
  "description": "Project description",
  "tags": ["tag1", "tag2"],
  "featured": true,
  "projectType": "case-study",
  "htmlFile": "PROJECT.html",
  "coverMedia": {
    "path": "/uploads/project/cover.jpg",
    "type": "image"
  },
  "displayOrder": 1
}
```

### Server Configuration (`backoffice/server.js`)
- **Port**: 3001
- **Authentication**: Simple password-based
- **File Uploads**: Multer middleware
- **Static Files**: Serves admin interface and uploads
- **API Endpoints**: Project CRUD operations

## ⚙️ Automation Scripts (`scripts/`)

### 1. `update-portfolio.bat`
**Purpose**: Updates frontend with latest backoffice data
**Process**:
1. Runs `generate-portfolio-data.js`
2. Exports projects from `backoffice/data/projects.json`
3. Generates `assets/js/portfolio-data.js`
4. Makes projects available to frontend

### 2. `open-backoffice.bat`
**Purpose**: Complete backoffice launcher
**Process**:
1. Checks Node.js installation
2. Starts server in background
3. Opens browser to admin interface
4. Provides status monitoring

### 3. `start-backoffice.bat`
**Purpose**: Simple server starter
**Process**: Runs `npm start` in backoffice directory

### 4. `launch-backoffice.ps1`
**Purpose**: PowerShell version of launcher
**Features**: Enhanced error handling and status display

## 🔄 Development Workflow

### Adding New Projects

#### Method 1: Using Backoffice (Recommended)
1. Run `scripts\open-backoffice.bat`
2. Login to admin interface
3. Add project through web interface
4. Run `scripts\update-portfolio.bat`
5. Update Github
6. Project appears on website


#### Method 2: Manual (Advanced)
1. Edit `backoffice/data/projects.json`
2. Add project data following schema
3. Run `scripts\update-portfolio.bat`
4. Optionally create dedicated HTML case study

### Creating Project Case Studies
1. Create new HTML file (e.g., `NEW-PROJECT.html`)
2. Use existing case studies as templates
3. Follow structure: metadata → media → description → technical details
4. Link from backoffice by setting `projectType: "case-study"`

### Updating Styles
1. Edit SASS files in `assets/css/`
2. Compile SASS to CSS (if using build process)
3. Or edit `main.css` directly for quick changes

### Adding New Pages
1. Create HTML file in root directory
2. Link from navigation in `index.html`
3. Follow existing CSS class patterns
4. Include analytics script if needed

## 📊 Analytics & Tracking

### Firebase Integration
- **File**: `firebase-portfolio-analytics.js`
- **Purpose**: Track page views, user interactions
- **Data**: Stored in Firebase Analytics
- **Backoffice**: View analytics in admin dashboard

### Additional Analytics
- **File**: `analytics-integration.js`
- **Purpose**: Additional tracking capabilities
- **Integration**: Works alongside Firebase

## 🎨 Assets Management

### Images (`assets/img/`)
**Organization**:
- Root level: General website images
- Project folders: `GUISADO/`, `DESISTIR/`, etc.
- Naming: Descriptive, project-prefixed

### Videos (`assets/video/`)
- **OPENER.webm/mp4**: Homepage logo animation
- Multiple formats for browser compatibility

### Documents (`assets/docs/`)
- **CV files**: Downloadable resume/portfolio PDFs
- **Project docs**: Additional project documentation

## 🔧 Technical Details

### Dependencies

#### Frontend
- **jQuery 2.2.4**: DOM manipulation, AJAX
- **Hammer.js 2.0.8**: Touch gesture handling
- **Custom CSS**: No external CSS frameworks

#### Backend (`backoffice/`)
- **Express**: Web server framework
- **Multer**: File upload handling
- **Nodemon**: Development auto-restart
- **Other**: See `backoffice/package.json`

### Browser Support
- **Modern browsers**: Full functionality
- **Mobile devices**: Responsive design with touch support
- **Fallbacks**: Graceful degradation for older browsers

### Performance Optimizations
- **Image optimization**: Compressed images with multiple formats
- **Lazy loading**: Images load as needed
- **Minified assets**: Compressed CSS/JS where applicable
- **CDN fallbacks**: Local copies of external libraries

## 🚀 Deployment

### Local Development
1. Open `index.html` in browser for frontend
2. Run backoffice server for admin features
3. Use scripts for workflow automation

### Production Deployment
1. Upload all files to web server
2. Configure server for Node.js (backoffice)
3. Set up domain/subdomain for backoffice
4. Configure environment variables
5. Set up SSL certificates

### Environment Variables (`.env`)
```
ADMIN_PASSWORD=your-secure-password
PORT=3001
NODE_ENV=production
```

## 🔍 Troubleshooting

### Common Issues

#### Portfolio Not Updating
- **Solution**: Run `scripts\update-portfolio.bat`
- **Cause**: Frontend not synced with backoffice data

#### Backoffice Won't Start
- **Check**: Node.js installation
- **Check**: Port 3001 availability
- **Solution**: Run `scripts\open-backoffice.bat` for diagnostics

#### Images Not Loading
- **Check**: File paths in project data
- **Check**: Upload directory permissions
- **Solution**: Verify media files exist in `backoffice/uploads/`

#### Styles Not Applying
- **Check**: CSS file compilation
- **Check**: Browser cache
- **Solution**: Hard refresh or clear cache

### Debug Mode
- **Browser Console**: Check for JavaScript errors
- **Network Tab**: Verify file loading
- **Server Logs**: Check backoffice terminal output

## 📝 Code Conventions

### HTML
- **Semantic markup**: Use appropriate HTML5 elements
- **Accessibility**: Include alt texts, proper headings
- **Validation**: Follow HTML5 standards

### CSS/SASS
- **BEM methodology**: Block-Element-Modifier naming
- **Mobile-first**: Start with mobile styles, enhance for desktop
- **Modular structure**: Separate concerns into files

### JavaScript
- **ES5 compatibility**: For broader browser support
- **Progressive enhancement**: Core functionality without JS
- **Error handling**: Graceful fallbacks for failed operations

## 🔐 Security Considerations

### Backoffice Security
- **Password protection**: Simple but effective for single user
- **File upload validation**: Restrict file types and sizes
- **Path traversal protection**: Secure file handling
- **HTTPS recommended**: For production deployment

### Frontend Security
- **Input sanitization**: Escape user-generated content
- **XSS prevention**: Validate and sanitize data
- **CORS handling**: Proper cross-origin policies

## 📚 Learning Resources

### Technologies Used
- **HTML5/CSS3**: Modern web standards
- **JavaScript ES5/ES6**: Core programming language
- **Node.js/Express**: Backend development
- **SASS/SCSS**: CSS preprocessing
- **Git**: Version control (if applicable)

### Recommended Reading
- **MDN Web Docs**: HTML, CSS, JavaScript reference
- **Express.js Guide**: Backend development
- **SASS Documentation**: CSS preprocessing
- **Web Accessibility Guidelines**: WCAG standards

## 🤝 Getting Help

### For AI Assistants
When asking for help, provide:
1. **This README file**: Complete context
2. **Specific file contents**: The files you're working with
3. **Error messages**: Exact error text
4. **Desired outcome**: What you want to achieve

### For Human Developers
- **Code structure**: Well-documented and organized
- **Naming conventions**: Descriptive and consistent
- **Comments**: Explain complex logic
- **Documentation**: This README covers everything

## 🎨 Recent Updates

### Contact Section Redesign (Latest)
**Enhanced Contact Experience**: Complete redesign of the contact section with modern, engaging interface.

**New Features**:
- **Creative Headlines**: "Got a Project? Let's Make it Move" with personality-driven tagline
- **Enhanced Social Integration**: LinkedIn, Instagram, and Behance links with platform-specific hover effects
- **Interactive Elements**: Animated scroll hints, hover effects, and micro-animations
- **Improved Accessibility**: ARIA labels, semantic HTML5, and keyboard navigation support
- **Responsive Design**: Optimized for all screen sizes with mobile-first approach
- **Visual Enhancements**: Floating decorative elements, pulse animations, and smooth transitions

**Technical Implementation**:
- **Files Modified**: `index.html`, `assets/css/main-enhanced.css`
- **CSS Architecture**: Modular design following existing patterns
- **Animation System**: CSS keyframes with performance optimizations
- **Accessibility**: WCAG compliance with reduced motion support
- **Browser Support**: Cross-browser compatible with graceful fallbacks

**Contact Information**:
- **Email**: pedromdcostau@gmail.com (clickable mailto: link)
- **Location**: "Based in Braga, Portugal — working worldwide"
- **Social Links**: 
  - LinkedIn: https://www.linkedin.com/in/pedro-costa-descalco/
  - Instagram: https://www.instagram.com/descalcomedia/
  - Behance: https://www.behance.net/pdescalco

## 🔄 Future Enhancements

### Planned Features
- **Showreel integration**: Video portfolio showcase
- **Advanced filtering**: Category-based project filtering
- **Performance optimization**: Further speed improvements
- **SEO enhancement**: Better search engine optimization
- **Contact Form Enhancement**: Add message field and form validation

### Scalability Considerations
- **Database migration**: Move from JSON to proper database
- **CDN integration**: External asset hosting
- **Caching strategies**: Improve load times
- **API development**: RESTful API for external integrations

---

## 📞 Quick Reference

### Essential Commands
```bash
# Start backoffice
scripts\open-backoffice.bat

# Update portfolio
scripts\update-portfolio.bat

# Simple server start
scripts\start-backoffice.bat
```

### Key Files to Know
- **`index.html`**: Main homepage
- **`other-projects.html`**: Portfolio gallery
- **`backoffice/data/projects.json`**: Project database
- **`assets/js/portfolio-data.js`**: Generated portfolio data
- **`generate-portfolio-data.js`**: Data generator script

### Default Credentials
- **Backoffice URL**: `http://localhost:3001/login.html`
- **Password**: Check `backoffice/.env` file

This documentation should provide everything needed to understand, maintain, and enhance the DESCALCO MEDIA portfolio website. Keep this file updated as the project evolves!
