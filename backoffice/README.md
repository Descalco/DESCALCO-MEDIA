# DESCALCO MEDIA - Portfolio Backoffice System

## 🚀 Overview

A complete content management system for your portfolio that allows you to add, edit, and manage projects without coding. The system automatically updates your main portfolio and handles two types of projects:

- **Simple Projects**: External links to videos, websites, or other content
- **Case Studies**: Full project pages (you code the detailed pages for important projects)

## 🔐 Security Features

- **Direct URL Access Only**: No public links or connections to your main website
- **Password Protected**: Secure admin authentication
- **Session Management**: Automatic logout after 24 hours
- **File Upload Security**: Validates file types and sizes

## 📁 System Architecture

```
backoffice/
├── admin/              # Frontend interface
│   ├── login.html      # Login page
│   ├── dashboard.html  # Main dashboard
│   └── add-project.html # Add/Edit project form
├── api/               # Backend endpoints (handled by server.js)
├── data/              # JSON database
│   └── projects.json  # Project metadata storage
├── uploads/           # Project assets
│   └── [project-slug]/ # Auto-generated project folders
└── server.js          # Main backend server
```

## 🛠️ Installation & Setup

### Prerequisites
- Node.js (v14 or higher)
- npm

### Installation
1. Navigate to the backoffice directory
2. Install dependencies:
   ```bash
   npm install
   ```

### Running the System
```bash
npm start
```

The system will be available at:
- **Admin Panel**: http://localhost:3001
- **Login**: http://localhost:3001 (redirects to login)
- **Dashboard**: http://localhost:3001/dashboard (after login)

### Default Credentials
- **Password**: `descalco2025`
- **Change this in**: `server.js` line 111

## 📋 Features

### Dashboard
- **Project Statistics**: Total, Simple, Case Studies, Featured counts
- **Project Management**: View, edit, delete all projects
- **Clean Interface**: Matches your portfolio design aesthetic

### Add/Edit Projects
- **Project Information**: Title, year, category, type
- **Content Management**: Description, tags, featured status
- **File Uploads**: Cover media, gallery images, gallery videos
- **Project Types**:
  - Simple: External link projects
  - Case Study: Full project pages (generates template)

### File Management
- **Automatic Organization**: Creates folders per project
- **File Validation**: Only allows images, videos, PDFs
- **Size Limits**: 100MB per file
- **Supported Formats**:
  - Images: JPG, PNG, GIF
  - Videos: MP4, MOV, AVI, WEBM
  - Documents: PDF

## 🔄 Workflow

### Adding Simple Projects
1. Login to backoffice
2. Click "Add Project"
3. Fill project details
4. Select "Simple Project"
5. Add external link
6. Upload media and gallery files
7. Click "Create Project"
8. **Result**: Project automatically appears in your main portfolio

### Adding Case Studies
1. Follow steps 1-3 above
2. Select "Case Study"
3. Upload media and content
4. Click "Create Project"
5. **Result**: Project metadata saved, you can code the detailed page later

### Editing Projects
1. Go to Dashboard
2. Click "Edit" on any project
3. Modify details
4. Save changes
5. **Result**: Portfolio automatically updates

## 🔧 Technical Details

### Data Storage
- **Format**: JSON files in `/data/projects.json`
- **Structure**: Each project has unique ID, slug, metadata, and file paths
- **Backup**: Recommended to backup `data/` and `uploads/` folders

### File Organization
```
uploads/
└── project-slug/
    ├── coverMedia-timestamp.mp4
    ├── galleryImages-timestamp-1.jpg
    ├── galleryImages-timestamp-2.jpg
    └── galleryVideos-timestamp.mp4
```

### Portfolio Integration
- **Automatic Updates**: Simple projects auto-appear in `other-projects.html`
- **HTML Generation**: Creates proper project cards with your styling
- **Media Paths**: Handles relative paths correctly

### API Endpoints
- `POST /api/login` - Authentication
- `GET /api/projects` - List all projects
- `GET /api/projects/:id` - Get single project
- `POST /api/projects` - Create new project
- `PUT /api/projects/:id` - Update project
- `DELETE /api/projects/:id` - Delete project

## 🎨 Customization

### Changing Password
Edit `server.js` line 111:
```javascript
const adminPassword = 'your-new-password';
```

### Adding Categories
Edit `add-project.html` around line 200 to add new category options.

### Styling
The interface uses your portfolio's color scheme and can be customized in the HTML files.

## 🚨 Important Notes

### Security
- **Never expose** the backoffice URL publicly
- **Change the default password** immediately
- **Backup regularly** - data and uploads folders
- **HTTPS recommended** for production use

### File Management
- Large files may take time to upload
- Check available disk space regularly
- Consider file compression for better performance

### Portfolio Updates
- Simple projects automatically update your portfolio
- Case study projects require manual HTML page creation
- Always test changes on a staging environment first

## 🔍 Troubleshooting

### Server Won't Start
- Check if port 3001 is available
- Verify Node.js installation
- Check for missing dependencies: `npm install`

### Login Issues
- Verify password in server.js
- Clear browser cache and cookies
- Check browser console for errors

### File Upload Problems
- Check file size (max 100MB)
- Verify file format is supported
- Ensure sufficient disk space

### Portfolio Not Updating
- Check if `other-projects.html` exists in parent directory
- Verify file permissions
- Check server console for errors

## 📞 Support

For technical issues:
1. Check server console logs
2. Verify file permissions
3. Test with different browsers
4. Check network connectivity

## 🎯 Future Enhancements

Potential improvements:
- Image optimization and compression
- Bulk project import/export
- Project templates
- Advanced user management
- Database integration (PostgreSQL/MongoDB)
- Cloud storage integration
- Automated backups

---

**Created for Descalco Media Portfolio Management**
*Secure, efficient, and user-friendly content management*
