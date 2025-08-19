# 🚀 Descalco Media Backoffice - Quick Start Guide

## 📱 **Super Easy Launch Options**

### **Option 1: One-Click Launch (Recommended)**
Double-click: `open-backoffice.bat`
- ✅ Automatically starts server
- ✅ Opens browser to login page
- ✅ Shows credentials on screen
- ✅ Easy server shutdown

### **Option 2: Manual Launch**
Double-click: `start-backoffice.bat`
- Starts server only
- Manually open: http://localhost:3001/admin/login.html

### **Option 3: PowerShell (Advanced)**
Right-click `launch-backoffice.ps1` → "Run with PowerShell"

---

## 🔑 **Login Credentials**
- **Username:** `admin`
- **Password:** `admin123`

---

## 🎯 **What You Can Do**

### **📊 Dashboard**
- View all your projects at a glance
- See project statistics and analytics
- Quick navigation to all features

### **➕ Add New Project**
- **Simple Projects:** Just add title, description, and external link
- **Case Study Projects:** Full project pages with galleries
- **Drag & Drop:** Upload images and videos easily
- **Auto-Organization:** Files automatically organized by project

### **📈 Analytics**
- Track portfolio views and clicks
- See which projects are most popular
- Monitor daily activity

### **📁 Media Manager**
- View all uploaded files
- Organize project assets
- Copy file paths for use in projects

---

## 🛠️ **Tips for Best Experience**

1. **Always use the launch scripts** - Don't run `npm start` manually
2. **Keep the terminal window open** - This keeps your server running
3. **Use Chrome or Edge** - Best compatibility with the admin interface
4. **Upload images in JPG/PNG** - For best performance
5. **Keep video files under 50MB** - For faster loading

---

## 🆘 **Need Help?**

- **Server won't start?** Make sure Node.js is installed
- **Can't login?** Check credentials: admin/admin123
- **Upload not working?** Try refreshing the page
- **Browser won't open?** Manually go to: http://localhost:3001/admin/login.html

---

## 📂 **File Structure**
```
backoffice/
├── 🚀 open-backoffice.bat     ← **USE THIS ONE!**
├── 🚀 start-backoffice.bat    ← Alternative
├── 🚀 launch-backoffice.ps1   ← PowerShell version
├── admin/                     ← Admin interface files
├── data/                      ← Your project data
└── uploads/                   ← Your uploaded files
```

---

**🎉 You're all set! Double-click `open-backoffice.bat` to get started!**
