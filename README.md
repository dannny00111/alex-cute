# Alexandra's Sacred Naming Ceremony - Static SPA

A beautiful, responsive single-page application celebrating Alexandra Jesuoluwatomisin Esther Mojolaoluwa's naming ceremony. Built as a static React SPA with PWA capabilities.

## 🌟 Features

- **Password Protected Access** - Enter "Alexandra2025" to view the gallery
- **Responsive Design** - Works perfectly on desktop, tablet, and mobile
- **PWA Ready** - Can be installed as a mobile app
- **Collapsible Gallery** - Separate sections for photos and videos
- **Lightbox Viewer** - Full screen viewing with keyboard navigation
- **Download Functionality** - Download individual media items
- **Background Videos** - Beautiful ceremony videos as backgrounds
- **Static Deployment** - No backend required, deploys anywhere

## 📱 PWA Installation

Users can install this as a mobile app:
1. Visit the website on mobile
2. Tap "Add to Home Screen" when prompted
3. Access like a native app

## 🚀 Quick Deploy

### Netlify (Recommended)
1. Fork/clone this repository
2. Connect to Netlify
3. Deploy automatically with `netlify.toml` configuration
4. Your site will be live at `https://your-site-name.netlify.app`

### Vercel
1. Connect repository to Vercel
2. Deploy with `vercel.json` configuration
3. Your site will be live at `https://your-project.vercel.app`

### Manual Static Hosting
1. Run `cd frontend && npm install && npm run build`
2. Upload the `frontend/build` folder to any static hosting service
3. Configure redirects to serve `index.html` for all routes

## 🛠 Development

```bash
# Install dependencies
cd frontend
npm install

# Start development server
npm start

# Build for production
npm run build

# Serve production build locally
npm run serve
```

## 📁 Structure

```
/
├── frontend/               # React SPA application
│   ├── public/            # Static assets and PWA files
│   │   ├── manifest.json  # PWA manifest
│   │   ├── sw.js         # Service worker
│   │   └── index.html    # Main HTML template
│   ├── src/              # React source code
│   │   ├── App.js        # Main application component
│   │   ├── App.css       # Styles
│   │   └── index.js      # React entry point
│   └── package.json      # Dependencies and scripts
├── netlify.toml          # Netlify deployment configuration
├── vercel.json           # Vercel deployment configuration
└── README.md             # This file
```

## 🎨 Customization

To customize for your own event:

1. **Update ceremony details** in `frontend/src/App.js`:
   ```javascript
   const ceremonyDetails = {
     displayName: "Your Child's Name",
     fullName: "Full Name Here",
     parents: "Parent Names",
     dateOfBirth: "Birth Date",
     ceremonyDate: "Ceremony Date",
     password: "YourPassword"
   };
   ```

2. **Replace media** in the `staticMediaData` object
3. **Update PWA details** in `frontend/public/manifest.json`
4. **Customize colors** in CSS variables in `frontend/src/App.css`

## 🔒 Security

- Password protected access
- Static deployment (no server vulnerabilities)
- Security headers configured
- No sensitive data stored client-side

## 📱 Browser Support

- Chrome/Edge 90+
- Firefox 88+
- Safari 14+
- Mobile browsers with PWA support

## 📄 License

Private family project. All rights reserved.

---

**Built with love for Alexandra's special day ✨**