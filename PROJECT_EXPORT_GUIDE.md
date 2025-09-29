# Virtual Demonstrator - Project Export Guide

## Project Structure
```
virtual-demonstrator/
├── public/
│   ├── models/
│   │   ├── Background_optimize3.glb
│   │   ├── lift-opt.glb
│   │   ├── model-1-opt.glb
│   │   ├── model-2-opt.glb
│   │   └── windtunnel-opt.glb
│   ├── products/
│   │   ├── ai-core/
│   │   ├── netcomm/
│   │   ├── provetech/
│   │   ├── gigaboxes/
│   │   └── energy-solutions/
│   ├── images/
│   ├── fonts/
│   └── hdri/
├── src/
│   ├── components/
│   │   ├── Showroom.tsx
│   │   ├── ProductModal.tsx
│   │   ├── ErrorBoundary.tsx
│   │   └── CameraDebugHelper.tsx
│   ├── App.tsx
│   ├── main.tsx
│   └── index.css
├── package.json
├── vite.config.ts
├── tailwind.config.js
├── tsconfig.json
├── tsconfig.app.json
├── tsconfig.node.json
└── index.html
```

## Key Dependencies
```json
{
  "dependencies": {
    "@react-three/drei": "^9.99.0",
    "@react-three/fiber": "^8.15.16",
    "lucide-react": "^0.344.0",
    "react": "^18.3.1",
    "react-dom": "^18.3.1",
    "three": "^0.161.0"
  }
}
```

## Setup Instructions
1. Extract all files maintaining the directory structure
2. Run `npm install` to install dependencies
3. Run `npm run dev` to start development server
4. Run `npm run build` to create production build

## Important Notes
- Ensure all 3D models (.glb files) are in the correct public/models/ directory
- Product images and media files must maintain their directory structure
- The application requires WebGPU support for optimal performance
- Fallback to WebGL is automatic if WebGPU is not available

## Build Commands
- Development: `npm run dev`
- Production Build: `npm run build`
- Preview Build: `npm run preview`
- Linting: `npm run lint`

## Browser Requirements
- Modern browser with WebGL 2.0 support
- WebGPU support recommended for best performance
- Minimum 4GB RAM recommended for smooth 3D rendering