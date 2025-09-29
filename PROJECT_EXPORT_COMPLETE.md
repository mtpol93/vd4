# Virtual Demonstrator - Complete Project Export

## Project Overview
This is a complete 3D virtual demonstrator application built with React, Three.js, and WebGPU/WebGL. It showcases Akkodis products in an interactive 3D environment with detailed product information, presentations, images, videos, and documents.

## Key Features
- **3D Interactive Environment**: Full 3D showroom with product models
- **WebGPU Support**: Optimized for modern browsers with WebGL fallback
- **Product Showcase**: Multiple product families with detailed media
- **Mobile Optimized**: Responsive design with landscape orientation
- **Wind Tunnel Animation**: Interactive wind tunnel with spawn animations
- **Camera System**: Smooth camera transitions between products
- **Product Modal**: Comprehensive product information viewer
- **Debug Tools**: Camera position debugging helper

## Project Structure
```
virtual-demonstrator/
├── public/
│   ├── models/                    # 3D models (.glb files)
│   │   ├── Background_opt4.glb
│   │   ├── lift-opt.glb
│   │   ├── model-1-opt.glb
│   │   ├── model-2-opt.glb
│   │   └── windtunnel-opt.glb
│   ├── products/                  # Product-specific assets
│   │   ├── ai-core/
│   │   │   ├── ai-core-opt.glb
│   │   │   └── main/
│   │   │       ├── 0-overview/
│   │   │       ├── 1-presentation/
│   │   │       ├── 2-images/
│   │   │       └── 3-videos/
│   │   ├── netcomm/
│   │   ├── provetech/
│   │   ├── energy-solutions/
│   │   └── gigaboxes/
│   ├── images/                    # UI images and logos
│   ├── fonts/                     # Custom fonts
│   └── hdri/                      # Environment maps
├── src/
│   ├── components/
│   │   ├── Showroom.tsx          # Main 3D scene component
│   │   ├── ProductModal.tsx      # Product information modal
│   │   ├── ErrorBoundary.tsx     # Error handling
│   │   └── CameraDebugHelper.tsx # Camera debugging tool
│   ├── App.tsx                   # Main application component
│   ├── main.tsx                  # Application entry point
│   └── index.css                 # Global styles
├── package.json                  # Dependencies and scripts
├── vite.config.ts               # Vite configuration
├── tailwind.config.js           # Tailwind CSS configuration
└── tsconfig.json                # TypeScript configuration
```

## Technology Stack
- **Frontend**: React 18 + TypeScript
- **3D Graphics**: Three.js + React Three Fiber + Drei
- **Styling**: Tailwind CSS
- **Build Tool**: Vite
- **Icons**: Lucide React
- **PDF Support**: React PDF

## Key Dependencies
```json
{
  "dependencies": {
    "@react-three/drei": "^9.99.0",
    "@react-three/fiber": "^8.15.16",
    "lucide-react": "^0.344.0",
    "pdfjs-dist": "^5.4.149",
    "react": "^18.3.1",
    "react-dom": "^18.3.1",
    "react-pdf": "^10.1.0",
    "three": "^0.161.0"
  }
}
```

## Setup Instructions

### 1. Install Dependencies
```bash
npm install
```

### 2. Development Server
```bash
npm run dev
```

### 3. Build for Production
```bash
npm run build
```

### 4. Preview Production Build
```bash
npm run preview
```

## Product Configuration

### Product Families
The application supports 5 main product families:

1. **Akkodis Main** (`akkodis-main`)
2. **AI-Core Platform** (`ai-core`)
3. **NetComm Validation** (`netcomm`)
4. **PROVEtech Tool Suite** (`provetech`)
5. **Energy Solutions** (`energy-solutions`)

### Camera Positions
Each product has predefined camera positions for optimal viewing:

```typescript
const cameraPositions: Record<string, CameraPosition> = {
  'akkodis-main': {
    position: [5.56, 2.06, 8.64],
    rotation: [-2.741, -0.800, -2.846],
    target: [11, 0, 13.5]
  },
  'ai-core': {
    position: [-4.13, 2, 0.33],
    rotation: [0.000, -0.598, 0.000],
    target: [-0.5, 2, -5]
  },
  // ... more positions
};
```

## Media File Structure
Each product follows a consistent directory structure:

```
products/{family}/main/
├── 0-overview/
│   └── overview.jpg
├── 1-presentation/
│   ├── presentation1/
│   │   ├── Slide1.PNG
│   │   ├── Slide2.PNG
│   │   └── ...
│   └── presentation2/
├── 2-images/
│   ├── image1.jpg
│   ├── image2.jpg
│   └── ...
├── 3-videos/
│   ├── video1.mp4
│   ├── video2.mp4
│   └── ...
└── 4-documents/
    ├── document1/
    └── document2/
```

## 3D Models
All 3D models are optimized .glb files:
- **Background_opt4.glb**: Main environment
- **windtunnel-opt.glb**: Animated wind tunnel
- **lift-opt.glb**: Platform lift mechanism
- **Product models**: Individual product 3D representations

## Browser Requirements
- **Recommended**: Modern browser with WebGPU support
- **Minimum**: WebGL 2.0 support
- **RAM**: 4GB+ recommended for smooth 3D rendering
- **Mobile**: Landscape orientation preferred

## Performance Optimizations
- WebGPU with WebGL fallback
- Optimized 3D model loading
- Texture compression support
- Efficient memory management
- Mobile-specific optimizations

## Deployment Notes
- All assets use relative paths (`./`)
- No external dependencies for assets
- Fully self-contained build
- CDN-ready static files

## Development Features
- **Hot Module Replacement**: Fast development iteration
- **TypeScript**: Full type safety
- **ESLint**: Code quality enforcement
- **Camera Debug Helper**: Real-time camera position debugging
- **Error Boundaries**: Graceful error handling

## Customization Guide

### Adding New Products
1. Create product directory in `public/products/`
2. Add 3D model (.glb file)
3. Organize media files following the structure
4. Update `productFamilies` array in `App.tsx`
5. Add camera position in `cameraPositions`
6. Update `getProductContent()` in `ProductModal.tsx`

### Modifying Camera Positions
Use the built-in Camera Debug Helper:
1. Click the eye icon in bottom-right
2. Adjust position/rotation with sliders or gizmo
3. Copy the generated configuration
4. Update the camera positions in code

### Adding New Media Types
1. Extend the `MediaFile` interface
2. Update `getProductContent()` function
3. Add rendering logic in `ProductModal.tsx`

## Troubleshooting

### Common Issues
1. **3D Models Not Loading**: Check file paths and .glb format
2. **WebGPU Not Working**: Browser will fallback to WebGL automatically
3. **Mobile Performance**: Reduce model complexity or texture resolution
4. **Font Loading**: Ensure font files are in public/fonts/

### Debug Tools
- Browser DevTools for WebGL/WebGPU debugging
- Camera Debug Helper for positioning
- Console logs for model loading status

## License & Credits
- Built with React Three Fiber ecosystem
- Uses Three.js for 3D rendering
- Tailwind CSS for styling
- Lucide React for icons

## Support
For technical support or questions about this implementation, refer to:
- React Three Fiber documentation
- Three.js documentation
- Vite build tool documentation

---

**Export Date**: January 2025
**Version**: Production Ready
**Status**: Complete and Deployable