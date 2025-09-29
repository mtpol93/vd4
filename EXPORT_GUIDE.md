# Complete Project Export Guide

## 📁 Built Files Location

Your production-ready files are in the `dist/` folder in this project. Here's what you'll find:

```
dist/
├── index.html (main entry point)
├── assets/ (CSS and JS bundles)
├── fonts/ (custom fonts)
├── hdri/ (environment maps)
├── images/ (UI images and logos)
├── models/ (3D models - .glb files)
├── products/ (product assets organized by family)
└── textures/ (3D textures)
```

## 🚀 How to Access and Upload

### Option 1: Direct FTP Upload
1. **Navigate to the `dist/` folder** in your file explorer
2. **Select ALL contents** inside the dist folder (not the dist folder itself)
3. **Upload everything** to your web server's public directory (usually `public_html/`, `www/`, or `htdocs/`)

### Option 2: Download as ZIP
If you need to download the files:
1. Right-click on the `dist/` folder
2. Create a ZIP archive
3. Download and extract on your local machine
4. Upload contents to your FTP server

## 📋 File Structure to Upload

Make sure these folders and files are uploaded to your web server root:

```
your-domain.com/
├── index.html ← Main entry point
├── assets/
│   ├── index-[hash].css
│   ├── index-[hash].js
│   ├── react-vendor-[hash].js
│   └── three-vendor-[hash].js
├── fonts/
│   ├── font-body.ttf
│   └── font-title.otf
├── hdri/
│   └── main.hdr
├── images/
│   ├── Logo-White-Akkodis.png
│   ├── qrcode.png
│   └── [other images]
├── models/
│   ├── Background_opt4.glb
│   ├── windtunnel-opt.glb
│   ├── lift-opt.glb
│   └── [other models]
├── products/
│   ├── ai-core/
│   ├── netcomm/
│   ├── provetech/
│   ├── energy-solutions/
│   └── gigaboxes/
└── textures/
    └── [texture files]
```

## ✅ Verification Steps

After uploading:
1. Visit `your-domain.com` in a browser
2. Check that the 3D scene loads
3. Test product buttons work
4. Verify wind tunnel animation
5. Test on mobile (landscape orientation)

## 🔧 Server Requirements

- **Static file hosting** (Apache, Nginx, etc.)
- **HTTPS recommended** for WebGPU support
- **Proper MIME types** for .glb files (optional but recommended)

## 📱 Mobile Optimization

The build includes:
- Automatic landscape orientation prompts
- Touch-optimized controls
- Responsive design
- Performance optimizations

Your application is ready to go live! 🚀