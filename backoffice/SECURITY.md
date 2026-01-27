# 🔒 Security Documentation - DESCALCO MEDIA Portfolio

## Security Measures Implemented

This document outlines the security measures implemented in the DESCALCO MEDIA backoffice system.

---

## 🛡️ Authentication & Authorization

### Rate Limiting
- **Login attempts**: 5 attempts per 15 minutes per IP
- **General API**: 100 requests per minute per IP
- **Analytics tracking**: 30 events per minute per IP

### Password Security
- Passwords are **stored in environment variables** (`.env` file)
- **No hardcoded passwords** in source code
- Timing-safe password comparison to prevent timing attacks
- Delayed response on failed login attempts

### Session Security
- `httpOnly: true` - Prevents XSS access to cookies
- `sameSite: 'strict'` - Prevents CSRF attacks
- `secure: true` in production - HTTPS only
- Custom session name (not default `connect.sid`)

---

## 🔐 Security Headers (Helmet.js)

The following security headers are automatically applied:
- **Content-Security-Policy** - Prevents XSS and injection attacks
- **X-Content-Type-Options** - Prevents MIME sniffing
- **X-Frame-Options** - Prevents clickjacking
- **X-XSS-Protection** - Browser XSS filter
- **Strict-Transport-Security** - Forces HTTPS (production)

---

## ✅ Input Validation

### Project Creation
- Title: Required, max 200 characters
- Year: Required, must be 1900-2100
- Category: Required, max 100 characters
- Description: Required, max 5000 characters
- External links: Must be valid HTTP/HTTPS URLs

### File Uploads
- Allowed types: `jpeg, jpg, png, gif, mp4, mov, avi, webm, pdf`
- Blocked types: `exe, bat, cmd, scr, pif, com, js, vbs, jar`
- Max file size: 100MB

### Analytics Tracking
- Valid actions only: `view`, `click`, `hover`
- Project ID max length: 100 characters
- User agent max length: 500 characters

---

## 🛡️ XSS Prevention

- All user-generated content is escaped using `escapeHtml()` function
- Content-Security-Policy headers restrict script execution
- Input validation on server-side

---

## 📁 Path Traversal Protection

- File serving validates resolved paths stay within `uploads` directory
- Path traversal attempts are logged and blocked

---

## 🔒 Privacy & GDPR

- IP addresses are **anonymized** (SHA-256 hashed)
- Only partial hashes are stored (16 characters)
- Analytics data is automatically pruned (max 10,000 events)

---

## 📋 Configuration Checklist

### Required Environment Variables

Create a `.env` file in the `backoffice` folder:

```env
# REQUIRED - Change this immediately!
ADMIN_PASSWORD=your_secure_password_here

# REQUIRED - Generate with: node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
SESSION_SECRET=your_64_character_hex_string_here

# Optional
NODE_ENV=production
PORT=3001
```

### Files to Never Commit

Ensure these are in `.gitignore`:
- `.env` (all environment files)
- `backoffice/data/analytics.json` (contains user data)
- `node_modules/`

---

## 🚨 Security Warnings

### If Your Password Was Exposed
If your password was previously committed to git history:

1. **Change your password immediately** in the `.env` file
2. **Consider the password compromised**
3. **Clean git history** (if needed):
   ```bash
   git filter-branch --force --index-filter \
     "git rm --cached --ignore-unmatch <sensitive-file>" \
     --prune-empty --tag-name-filter cat -- --all
   ```

### Production Checklist
- [ ] Set `NODE_ENV=production`
- [ ] Use HTTPS (SSL certificate)
- [ ] Set strong `ADMIN_PASSWORD` (16+ characters)
- [ ] Generate random `SESSION_SECRET`
- [ ] Configure firewall rules
- [ ] Enable log monitoring

---

## 📦 Security Dependencies

```json
{
  "helmet": "Security headers middleware",
  "express-rate-limit": "Rate limiting",
  "express-validator": "Input validation",
  "bcryptjs": "Password hashing (available for future use)"
}
```

---

## 🔄 Regular Maintenance

1. **Weekly**: Run `npm audit` to check for vulnerabilities
2. **Monthly**: Update dependencies with `npm update`
3. **Quarterly**: Review access logs and security configurations

---

## 📞 Reporting Security Issues

If you discover a security vulnerability, please handle it responsibly:
1. Do not publicly disclose the issue
2. Contact the maintainer directly
3. Allow reasonable time for a fix before disclosure

---

*Last updated: January 2026*
