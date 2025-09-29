# FTP Deployment Instructions

## Production Build Created

Your production build is ready in the `dist/` folder. This contains all the optimized files needed for deployment.

## FTP Upload Instructions

1. **Upload the entire `dist/` folder contents** to your web server's public directory (usually `public_html/`, `www/`, or similar)

2. **Folder structure to upload:**
```
dist/
├── index.html (main entry point)
├── assets/ (CSS and JS bundles)
├── fonts/ (custom fonts)
├── hdri/ (environment maps)
├── images/ (UI images and logos)
├── models/ (3D models - .glb files)
├── products/ (product assets)
├── textures/ (3D textures)
└── _redirects (for SPA routing)
```

## Important Notes

✅ **All paths are relative** - no configuration changes needed
✅ **Self-contained** - no external dependencies
✅ **Optimized** - minified CSS/JS, compressed assets
✅ **Mobile ready** - responsive design with orientation handling

## Server Requirements

- **Static file hosting** (Apache, Nginx, or any web server)
- **HTTPS recommended** for WebGPU support
- **No server-side processing** required

## File Sizes

The build includes:
- 3D models (largest files): ~50-100MB total
- Images and media: ~20-30MB
- Code bundles: ~2-5MB
- Total: ~100-150MB

## Testing After Upload

1. Navigate to your domain
2. Check that 3D models load properly
3. Test on mobile devices (landscape orientation)
4. Verify all product buttons work
5. Test wind tunnel animation

## Troubleshooting

If models don't load:
- Check file permissions (755 for folders, 644 for files)
- Ensure .glb files uploaded in binary mode
- Verify MIME types are configured for .glb files

## Performance Tips

- Enable gzip compression on your server
- Set proper cache headers for static assets
- Consider CDN for faster global loading

Your application is now ready for FTP deployment! 🚀