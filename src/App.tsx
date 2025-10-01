import React, { useState, Suspense } from 'react';
import { Canvas } from '@react-three/fiber';
import { RotateCcw, Wind, Mail, X, Play } from 'lucide-react';
import { contentConfig, getProductFamilyInfo } from './config/content';
import { ErrorBoundary } from './components/ErrorBoundary';
import { Showroom } from './components/Showroom';
import { ProductModal } from './components/ProductModal';
import { CameraDebugHelper } from './components/CameraDebugHelper';

interface CameraPosition {
  position: [number, number, number];
  rotation: [number, number, number];
  target: [number, number, number];
}

// Product families data
const productFamilies = [
  {
    id: 'akkodis-main',
    name: getProductFamilyInfo('akkodis-main').name,
    image: './images/Logo-White-Akkodis.png',
    description: contentConfig.general.contactMessage,
    mainProduct: { name: getProductFamilyInfo('akkodis-main').name, image: './images/Logo-White-Akkodis.png' }
  },
  {
    id: 'ai-core',
    name: getProductFamilyInfo('ai-core').name,
    image: './products/ai-core/AI-Core Platform copy copy.png',
    description: contentConfig.general.contactMessage,
    mainProduct: { name: getProductFamilyInfo('ai-core').name, image: './products/ai-core/AI-Core Platform copy copy.png' }
  },
  {
    id: 'netcomm',
    name: getProductFamilyInfo('netcomm').name,
    image: './products/netcomm/netcomm-validation copy.png',
    description: contentConfig.general.contactMessage,
    mainProduct: { name: getProductFamilyInfo('netcomm').name, image: './products/netcomm/netcomm-validation copy.png' }
  },
  {
    id: 'provetech',
    name: getProductFamilyInfo('provetech').name,
    image: './products/provetech/PROVEtech.png',
    description: contentConfig.general.contactMessage,
    mainProduct: { name: getProductFamilyInfo('provetech').name, image: './products/provetech/PROVEtech.png' }
  },
  {
    id: 'energy-solutions',
    name: getProductFamilyInfo('energy-solutions').name,
    image: './products/energy-solutions/Energy-Solutions.png',
    description: contentConfig.general.contactMessage,
    mainProduct: { name: getProductFamilyInfo('energy-solutions').name, image: './products/energy-solutions/Energy-Solutions.png' }
  }
];

// Camera positions for each product family
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
  'netcomm': {
    position: [-2.14, 2, -0.37],
    rotation: [0.000, -0.028, 0.000],
    target: [-2, 2, -5.5]
  },
  'provetech': {
    position: [0.26, 2.53, -1.21],
    rotation: [-0.122, 0.482, 0.057],
    target: [-2, 2, -5.5]
  },
  'energy-solutions': {
    position: [-1.59, 2.17, -1.21],
    rotation: [-0.239, 0.183, 0.044],
    target: [-2.5, 1, -6]
  }
};

// Camera positions for individual products
const productCameraPositions: Record<string, CameraPosition> = {
  // Main products for each family
  [getProductFamilyInfo('akkodis-main').name]: {
    position: [6.17, 2.52, 9.37],
    rotation: [-2.377, -0.741, -2.567],
    target: [9.5, 0, 12]
  },
  [getProductFamilyInfo('ai-core').name]: {
    position: [-4.49, 2, 4.78],
    rotation: [0.000, 1.261, 0.000],
    target: [-8.5, 2, 3.5]
  },
  [getProductFamilyInfo('netcomm').name]: {
    position: [-4.03, 1.47, -2.49],
    rotation: [-0.063, -0.136, -0.009],
    target: [-3, 1, -10]
  },
  [getProductFamilyInfo('provetech').name]: {
    position: [-1, 6, 4],
    rotation: [0, 0, 0],
    target: [0, 3.5, 0]
  },
  [getProductFamilyInfo('energy-solutions').name]: {
    position: [-3.25, 1.46, -3.02],
    rotation: [-0.390, -0.116, -0.048],
    target: [-2.5, -1, -9]
  }
};

function App() {
  const [cameraTarget, setCameraTarget] = useState<CameraPosition | null>(null);
  const [isAnimating, setIsAnimating] = useState(false);
  const [selectedFamily, setSelectedFamily] = useState<string | null>(null);
  const [showWindTunnel, setShowWindTunnel] = useState(false);
  const [windTunnelAnimating, setWindTunnelAnimating] = useState(false);
  const [showQRCode, setShowQRCode] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [showProductModal, setShowProductModal] = useState(false);
  const [showComboPanel, setShowComboPanel] = useState(false);
  const [cameraInfo, setCameraInfo] = useState<{
    position: [number, number, number];
    rotation: [number, number, number];
    target: [number, number, number];
  }>({
    position: [0, 2.5, 1],
    rotation: [0, 0, 0],
    target: [0, 2.5, -1]
  });

  // Listen for fullscreen changes
  React.useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };

    document.addEventListener('fullscreenchange', handleFullscreenChange);
    return () => document.removeEventListener('fullscreenchange', handleFullscreenChange);
  }, []);

  const handleFamilyClick = (familyId: string) => {
    // Prevent rapid clicks but allow immediate response
    const now = Date.now();
    if ((window as any).lastFamilyClick && now - (window as any).lastFamilyClick < 100) return;
    (window as any).lastFamilyClick = now;
    
    console.log(`🎯 Family clicked: ${familyId}`);
    
    setSelectedFamily(familyId);
    setShowComboPanel(false); // Close combo panel when selecting individual family
    
    // Open the product modal immediately for the main product
    const familyData = productFamilies.find(f => f.id === familyId);
    if (familyData) {
      setShowProductModal(true);
    }
    
    // Move camera to product family position
    const position = cameraPositions[familyId];
    if (position) {
      console.log(`📹 Moving camera to position:`, position);
      setIsAnimating(true);
      setCameraTarget(position);
    } else {
      console.warn(`❌ No camera position found for family: ${familyId}`);
    }
  };

  const handleComboClick = () => {
    console.log('🎯 AI-Core + PROVEtech combo clicked');
    
    // Close individual product modal and show combo panel
    setShowProductModal(false);
    setSelectedFamily('ai-core-provetech-combo');
    setShowComboPanel(true);
    
    // Move camera to a position that shows both AI-Core and PROVEtech
    setCameraTarget({
      position: [-6.32, 2.19, 6.24],
      rotation: [0, 0, 0],
      target: [-13, 1, 2]
    });
    setIsAnimating(true);
  };
  const handleCameraReached = () => {
    console.log('📹 Camera animation completed');
    setIsAnimating(false);
    setCameraTarget(null);
  };


  const handleReset = () => {
    setSelectedFamily(null);
    setShowProductModal(false);
    setShowComboPanel(false);
    // Reset camera to starting position
    setCameraTarget({
      position: [0, 2.5, 1],
      rotation: [0, 0, 0],
      target: [0, 2.5, -1]
    });
    setIsAnimating(false);
    setShowWindTunnel(false);
    console.log('🔄 Application reset');
  };

  const handleWindTunnel = () => {
    if (windTunnelAnimating) return; // Prevent clicks during animation
    
    setShowWindTunnel(!showWindTunnel);
    console.log(`💨 Wind tunnel ${!showWindTunnel ? 'enabled' : 'disabled'}`);
  };

  const handleContactUs = () => {
    setShowQRCode(true);
    console.log('📧 Contact us QR code opened');
  };

  const selectedFamilyData = productFamilies.find(f => f.id === selectedFamily);

  return (
    <ErrorBoundary>
      <div className="w-full h-screen bg-[#001f33] relative overflow-hidden" style={{ minHeight: '100vh', backgroundColor: '#001f33' }}>
        {/* 3D Scene */}
        <Canvas
          shadows
          camera={{ position: [0, 2.5, 1], fov: 50 }}
          gl={{ 
            backend: 'webgpu',
            antialias: true,
            alpha: false,
            powerPreference: "high-performance",
            stencil: false,
            depth: true,
            preserveDrawingBuffer: false
          }}
          dpr={[1, 2]} // Limit device pixel ratio for better performance
          performance={{ min: 0.5 }} // Allow frame rate to drop to maintain responsiveness
          className="w-full h-full"
          onCreated={({ gl }) => {
            // WebGPU specific optimizations
            if (gl.backend === 'webgpu') {
              console.log('✅ WebGPU renderer initialized');
             console.log('🚀 WebGPU Details:', {
               backend: gl.backend,
               capabilities: gl.capabilities,
               extensions: gl.extensions
             });
            } else {
              console.log('⚠️ Falling back to WebGL renderer');
             console.log('📊 WebGL Details:', {
               backend: gl.backend || 'webgl',
               version: gl.capabilities?.isWebGL2 ? 'WebGL2' : 'WebGL1',
               renderer: gl.getParameter(gl.RENDERER),
               vendor: gl.getParameter(gl.VENDOR)
             });
            }
          }}
        >
            <Suspense fallback={null}>
              <Showroom
                selectedSector="automotive"
                showWindTunnel={showWindTunnel}
                showAICore={selectedFamily === 'ai-core'}
                showNetComm={selectedFamily === 'netcomm'}
                showPROVEtech={selectedFamily === 'provetech'}
                showEnergySolutions={selectedFamily === 'energy-solutions'}
                showGigaboxes={false}
                cameraTarget={cameraTarget}
                onCameraReached={handleCameraReached}
                onWindTunnelAnimationChange={setWindTunnelAnimating}
                onCameraInfoChange={(info) => {
                  setCameraInfo({
                    position: info.position,
                    rotation: info.rotation,
                    target: info.target
                  });
                }}
              />
            </Suspense>
        </Canvas>

        {/* Camera Debug Helper - Outside Canvas */}
        <CameraDebugHelper
          position={cameraInfo.position}
          rotation={cameraInfo.rotation}
          target={cameraInfo.target}
          onPositionChange={(position) => {
            setCameraTarget({
              position,
              rotation: cameraInfo.rotation,
              target: cameraInfo.target
            });
            setIsAnimating(true);
          }}
          onRotationChange={(rotation) => {
            setCameraTarget({
              position: cameraInfo.position,
              rotation,
              target: cameraInfo.target
            });
            setIsAnimating(true);
          }}
          onTargetChange={(target) => {
            setCameraTarget({
              position: cameraInfo.position,
              rotation: cameraInfo.rotation,
              target
            });
            setIsAnimating(true);
          }}
        />

        {/* Fullscreen Button */}
        <div className="absolute top-4 right-4 z-20">
          <button
            onClick={() => {
              if (!document.fullscreenElement) {
                document.documentElement.requestFullscreen();
              } else {
                document.exitFullscreen();
              }
            }}
            className="w-12 h-12 backdrop-blur-md bg-[#001f33]/90 border border-white/20 rounded-sm flex items-center justify-center hover:bg-[#001f33]/95"
          >
            {isFullscreen ? (
              <svg
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="white"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M18 6L6 18M6 6l12 12" />
              </svg>
            ) : (
              <svg
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="white"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M8 3H5a2 2 0 0 0-2 2v3m18 0V5a2 2 0 0 0-2-2h-3m0 18h3a2 2 0 0 0 2-2v-3M3 16v3a2 2 0 0 0 2 2h3" />
              </svg>
            )}
          </button>
        </div>

        {/* Main Product Family Buttons */}
        <div className="absolute top-4 left-4 z-10 max-w-[225px]">
          <div className="backdrop-blur-md bg-[#001f33]/90 rounded-lg p-3 shadow-lg border border-white/20">
            {/* First row - Akkodis alone */}
            <div className="grid grid-cols-1 gap-1 mb-1">
              {productFamilies.slice(0, 1).map((family) => (
                <button
                  key={family.id}
                  onClick={() => handleFamilyClick(family.id)}
                  onMouseDown={(e) => e.preventDefault()}
                  onDragStart={(e) => e.preventDefault()}
                  onContextMenu={(e) => e.preventDefault()}
                  className="group relative transition-transform duration-300 backdrop-blur-md bg-[#001f33]/90 border border-white/20 rounded-lg hover:bg-[#001f33]/95 select-none"
                  style={{ userSelect: 'none', WebkitUserSelect: 'none' }}
                >
                  <div className="h-20 overflow-hidden flex items-center justify-center px-4">
                    <img
                      src={family.image}
                      alt={family.name}
                     className="h-16 object-contain"
                      draggable={false}
                      onError={(e) => {
                        const target = e.target as HTMLImageElement;
                        target.src = './images/logo.png';
                      }}
                    />
                  </div>
                </button>
              ))}
            </div>
            {/* Second row - AI-Core and Energy Solutions */}
            <div className="grid grid-cols-2 gap-1 mb-1">
              {[productFamilies[1], productFamilies[4]].map((family) => (
                <button
                  key={family.id}
                  onClick={() => handleFamilyClick(family.id)}
                  onMouseDown={(e) => e.preventDefault()}
                  onDragStart={(e) => e.preventDefault()}
                  onContextMenu={(e) => e.preventDefault()}
                  className="group relative transition-transform duration-300 backdrop-blur-md bg-[#001f33]/90 border border-white/20 rounded-lg hover:bg-[#001f33]/95 select-none"
                  style={{ userSelect: 'none', WebkitUserSelect: 'none' }}
                >
                  <div className="w-20 h-20 overflow-hidden">
                    <img
                      src={family.image}
                      alt={family.name}
                      className="w-full h-full object-contain p-2"
                      draggable={false}
                      onError={(e) => {
                        const target = e.target as HTMLImageElement;
                        target.src = './images/logo.png';
                      }}
                    />
                  </div>
                </button>
              ))}
            </div>
            {/* Third row - NetComm and PROVEtech */}
            <div className="grid grid-cols-2 gap-1">
              {[productFamilies[2], productFamilies[3]].map((family) => (
                <button
                  key={family.id}
                  onClick={() => handleFamilyClick(family.id)}
                  onMouseDown={(e) => e.preventDefault()}
                  onDragStart={(e) => e.preventDefault()}
                  onContextMenu={(e) => e.preventDefault()}
                  className="group relative transition-transform duration-300 backdrop-blur-md bg-[#001f33]/90 border border-white/20 rounded-lg hover:bg-[#001f33]/95 select-none"
                  style={{ userSelect: 'none', WebkitUserSelect: 'none' }}
                >
                  <div className="w-20 h-20 overflow-hidden">
                    <img
                      src={family.image}
                      alt={family.name}
                      className="w-full h-full object-contain p-2"
                      draggable={false}
                      onError={(e) => {
                        const target = e.target as HTMLImageElement;
                        target.src = './images/logo.png';
                      }}
                    />
                  </div>
                </button>
              ))}
            </div>
            {/* Fourth row - AI-Core+PROVEtech combination */}
            <div className="grid grid-cols-1 gap-1 mt-1">
              <button
                onClick={handleComboClick}
                onMouseDown={(e) => e.preventDefault()}
                onDragStart={(e) => e.preventDefault()}
                onContextMenu={(e) => e.preventDefault()}
                className="group relative transition-transform duration-300 backdrop-blur-md bg-[#001f33]/90 border border-white/20 rounded-lg hover:bg-[#001f33]/95 select-none"
                style={{ userSelect: 'none', WebkitUserSelect: 'none' }}
              >
                <div className="h-20 overflow-hidden flex items-center justify-center px-2">
                  <div className="flex items-center space-x-1 p-1">
                    <img
                      src="./products/ai-core/AI-Core Platform copy copy.png"
                      alt="AI-Core"
                      className="w-8 h-8 object-contain"
                      draggable={false}
                      onError={(e) => {
                        const target = e.target as HTMLImageElement;
                        target.src = './images/logo.png';
                      }}
                    />
                    <span className="text-white text-xs font-bold">+</span>
                    <img
                      src="./products/provetech/PROVEtech.png"
                      alt="PROVEtech"
                      className="w-8 h-8 object-contain"
                      draggable={false}
                      onError={(e) => {
                        const target = e.target as HTMLImageElement;
                        target.src = './images/logo.png';
                      }}
                    />
                  </div>
                </div>
              </button>
            </div>
          </div>
        </div>

        {/* Bottom Left Control Buttons */}
        <div className="absolute bottom-4 left-4 z-10 flex flex-col space-y-2">
          {/* Reset Button */}
          <button
            onClick={handleReset}
            onMouseDown={(e) => e.preventDefault()}
            onDragStart={(e) => e.preventDefault()}
            onContextMenu={(e) => e.preventDefault()}
            className="group flex items-center space-x-2 backdrop-blur-md bg-[#001f33]/90 px-4 py-2 rounded-lg shadow-lg border border-white/20 select-none"
            style={{ userSelect: 'none', WebkitUserSelect: 'none' }}
            title="Reset to initial view"
          >
            <RotateCcw size={16} className="text-white" />
            <span className="text-sm font-medium text-white">Reset</span>
          </button>

          {/* Wind Tunnel Button */}
          <button
            onClick={handleWindTunnel}
            onMouseDown={(e) => e.preventDefault()}
            onDragStart={(e) => e.preventDefault()}
            onContextMenu={(e) => e.preventDefault()}
            className={`group flex items-center space-x-2 backdrop-blur-md px-4 py-2 rounded-lg shadow-lg border border-white/20 transition-all duration-200 hover:scale-105 select-none ${
              showWindTunnel
                ? 'bg-[#ffb81c]/90'
                : 'bg-[#001f33]/90'
            } ${
              windTunnelAnimating ? 'opacity-50 cursor-not-allowed' : ''
            }`}
            style={{ userSelect: 'none', WebkitUserSelect: 'none' }}
            title={windTunnelAnimating ? 'Animation in progress...' : (showWindTunnel ? 'Hide wind tunnel' : 'Show wind tunnel')}
            disabled={windTunnelAnimating}
          >
            <Wind size={16} className={showWindTunnel ? 'text-[#001f33]' : 'text-white'} />
            <span className={`text-sm font-medium ${showWindTunnel ? 'text-[#001f33]' : 'text-white'}`}>Wind Tunnel</span>
          </button>

          {/* Contact Us Button */}
          <button
            onClick={handleContactUs}
            onMouseDown={(e) => e.preventDefault()}
            onDragStart={(e) => e.preventDefault()}
            onContextMenu={(e) => e.preventDefault()}
            className="group flex items-center space-x-2 backdrop-blur-md bg-[#ffb81c]/90 px-4 py-2 rounded-lg shadow-lg border border-[#ffb81c]/40 select-none hover:bg-[#ffb81c]/95"
            style={{ userSelect: 'none', WebkitUserSelect: 'none' }}
            title="Contact Akkodis team"
          >
            <Mail size={16} className="text-[#001f33]" />
            <span className="text-sm font-medium text-[#001f33]">Contact Us</span>
          </button>
        </div>

        {/* QR Code Modal */}
        {showQRCode && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="backdrop-blur-md bg-[#001f33]/95 border border-white/20 rounded-xl p-6 max-w-sm w-full text-center relative flex flex-col items-center justify-center">
              <button
                onClick={() => setShowQRCode(false)}
                className="absolute top-4 right-4"
                style={{ color: 'white' }}
              >
                <X size={20} />
              </button>
              <div className="flex flex-col items-center justify-center space-y-4">
                <img
                  src="/images/Logo-White-Akkodis.png"
                  alt="Contact Us Logo"
                  className="w-32 h-24 object-contain"
                  onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    target.style.display = 'none';
                  }}
                />
                <h3 className="text-xl font-bold text-white -mt-4">Contact Us</h3>
                <img
                  src="/images/qrcode.png"
                  alt="Contact QR Code"
                  className="w-40 h-40 object-contain -mt-2"
                  onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    target.style.display = 'none';
                  }}
                />
                <p className="text-gray-300 text-sm -mt-2">
                  or email us at <span style={{ color: '#ffb81c' }}>marketing-products@akkodis.com</span>
                </p>
              </div>
            </div>
          </div>
        )}

        {/* AI-Core + PROVEtech Combination Panel */}
        {showComboPanel && (
          <div className="fixed top-0 right-0 h-full w-1/3 backdrop-blur-md bg-[#001f33]/95 border-l border-white/20 shadow-2xl z-50 overflow-y-auto popup-scrollbar">
            <div className="p-6">
              <button
                onClick={() => setShowComboPanel(false)}
                className="absolute top-4 right-4 transition-colors z-10"
                style={{ color: 'white' }}
              >
                <X size={20} />
              </button>
              
              <div className="mb-6">
                <div className="flex items-center space-x-3 mb-4">
                  <img
                    src="./products/ai-core/AI-Core Platform copy copy.png"
                    alt="AI-Core"
                    className="w-12 h-12 object-contain"
                    onError={(e) => {
                      const target = e.target as HTMLImageElement;
                      target.src = './images/logo.png';
                    }}
                  />
                  <span className="text-white text-xl font-bold">+</span>
                  <img
                    src="./products/provetech/PROVEtech.png"
                    alt="PROVEtech"
                    className="w-12 h-12 object-contain"
                    onError={(e) => {
                      const target = e.target as HTMLImageElement;
                      target.src = './images/logo.png';
                    }}
                  />
                </div>
                <h2 className="text-2xl font-bold text-white mb-2">AI-Core + PROVEtech</h2>
                <p className="text-lg text-gray-300 mb-4">Integrated Solution Suite</p>
              </div>

              <div className="space-y-6">
                {/* Combined Solution Overview */}
                <div className="bg-[#001f33]/70 border border-white/20 rounded-lg p-4">
                  <h3 className="text-xl font-semibold text-[#ffb81c] mb-3">Integrated Solution</h3>
                  
                  {/* Video Overview */}
                  <div className="mb-4">
                    <div className="relative">
                      <video
                       ref={(el) => {
                         if (el) {
                           el.addEventListener('play', () => {
                             const overlay = el.parentNode?.querySelector('.video-play-overlay') as HTMLElement;
                             if (overlay) overlay.style.display = 'none';
                           });
                           el.addEventListener('pause', () => {
                             const overlay = el.parentNode?.querySelector('.video-play-overlay') as HTMLElement;
                             if (overlay) overlay.style.display = 'flex';
                           });
                           el.addEventListener('ended', () => {
                             const overlay = el.parentNode?.querySelector('.video-play-overlay') as HTMLElement;
                             if (overlay) overlay.style.display = 'flex';
                           });
                         }
                       }}
                        src="./products/ai-core/main/3-videos/video1.webm"
                        controls={false}
                        className="w-full max-h-48 object-contain bg-[#001f33]/30 border border-white/10 rounded-lg cursor-pointer"
                        style={{ aspectRatio: 'auto' }}
                        onError={(e) => {
                          const target = e.target as HTMLVideoElement;
                          // Hide the video element and show a fallback message
                          target.style.display = 'none';
                          
                          // Check if fallback already exists to prevent duplicates
                          const existingFallback = target.parentNode?.querySelector('.video-error-fallback');
                          if (!existingFallback) {
                            const fallback = document.createElement('div');
                            fallback.className = 'video-error-fallback flex items-center justify-center min-h-32 bg-[#001f33]/30 border border-white/10 rounded-lg';
                            fallback.innerHTML = '<p class="text-gray-400 text-sm">Video preview not available</p>';
                            target.parentNode?.appendChild(fallback);
                          }
                        }}
                      />
                      {/* Play Icon Overlay */}
                      <div 
                       className="video-play-overlay absolute inset-0 flex items-center justify-center cursor-pointer"
                        onClick={(e) => {
                         const video = e.currentTarget.parentElement?.querySelector('video') as HTMLVideoElement;
                          if (video) {
                            if (video.paused) {
                              video.play();
                            } else {
                              video.pause();
                            }
                          }
                        }}
                      >
                        <Play 
                          size={24} 
                          className="text-white ml-1 drop-shadow-lg" 
                          fill="white"
                          style={{ 
                            filter: 'drop-shadow(0 4px 8px rgba(0, 0, 0, 0.8))'
                          }}
                        />
                      </div>
                     {/* Fullscreen button */}
                     <button
                       onClick={(e) => {
                         e.stopPropagation();
                         const video = e.currentTarget.parentElement?.querySelector('video') as HTMLVideoElement;
                         if (video) {
                           // Create fullscreen overlay
                           const overlay = document.createElement('div');
                           overlay.className = 'fixed inset-0 bg-black/90 flex items-center justify-center z-[999999]';
                           overlay.style.position = 'fixed';
                           overlay.style.top = '0';
                           overlay.style.left = '0';
                           overlay.style.width = '100vw';
                           overlay.style.height = '100vh';
                           overlay.style.zIndex = '999999';
                           
                           // Clone video for fullscreen
                           const fullscreenVideo = video.cloneNode(true) as HTMLVideoElement;
                           fullscreenVideo.controls = true;
                           fullscreenVideo.autoplay = true;
                           fullscreenVideo.className = 'w-full h-full object-contain';
                           fullscreenVideo.currentTime = video.currentTime;
                           
                           // Close button
                           const closeButton = document.createElement('button');
                           closeButton.innerHTML = '×';
                           closeButton.className = 'absolute top-6 right-6 w-12 h-12 backdrop-blur-md bg-[#001f33]/90 border border-white/20 rounded-sm flex items-center justify-center shadow-lg text-white text-2xl hover:bg-[#001f33]/95';
                           closeButton.onclick = () => {
                             document.body.removeChild(overlay);
                           };
                           
                           overlay.appendChild(fullscreenVideo);
                           overlay.appendChild(closeButton);
                           document.body.appendChild(overlay);
                           
                           // Close on overlay click
                           overlay.addEventListener('click', (e) => {
                             if (e.target === overlay) {
                               document.body.removeChild(overlay);
                             }
                           });
                         }
                       }}
                       className="absolute top-2 right-2 w-8 h-8 backdrop-blur-md bg-[#001f33]/90 border border-white/20 rounded-sm flex items-center justify-center shadow-md hover:bg-[#001f33]/95"
                       title="View fullscreen"
                     >
                       <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2">
                         <path d="M8 3H5a2 2 0 0 0-2 2v3m18 0V5a2 2 0 0 0-2-2h-3m0 18h3a2 2 0 0 0 2-2v-3M3 16v3a2 2 0 0 0 2 2h3" />
                       </svg>
                     </button>
                    </div>
                    <p className="text-sm text-gray-300 mt-2 text-center">AI-Core Platform Overview</p>
                  </div>
                  
                  <p className="text-gray-300 leading-relaxed mb-4">
                    The combination of AI-Core Platform and PROVEtech Tool Suite creates a powerful, 
                    comprehensive testing and validation ecosystem. This integrated approach leverages 
                    artificial intelligence to enhance traditional testing methodologies, providing 
                    unprecedented insights and automation capabilities.
                  </p>
                  <div className="grid grid-cols-1 gap-3">
                    <div className="bg-[#001f33]/50 border border-white/10 rounded p-3">
                      <h4 className="font-semibold text-white mb-2">🤖 AI-Enhanced Testing</h4>
                      <p className="text-sm text-gray-300">
                        Intelligent test case generation, predictive failure analysis, and automated optimization
                      </p>
                    </div>
                    <div className="bg-[#001f33]/50 border border-white/10 rounded p-3">
                      <h4 className="font-semibold text-white mb-2">🔧 Comprehensive Validation</h4>
                      <p className="text-sm text-gray-300">
                        End-to-end testing capabilities from unit tests to system-wide validation
                      </p>
                    </div>
                    <div className="bg-[#001f33]/50 border border-white/10 rounded p-3">
                      <h4 className="font-semibold text-white mb-2">📊 Advanced Analytics</h4>
                      <p className="text-sm text-gray-300">
                        Real-time insights, performance metrics, and predictive maintenance recommendations
                      </p>
                    </div>
                  </div>
                </div>

                {/* AI-Core Platform Section */}
                <div className="bg-[#001f33]/70 border border-white/20 rounded-lg p-4">
                  <div className="flex items-center space-x-3 mb-3">
                    <img
                      src="./products/ai-core/AI-Core Platform copy copy.png"
                      alt="AI-Core"
                      className="w-8 h-8 object-contain"
                      onError={(e) => {
                        const target = e.target as HTMLImageElement;
                        target.src = './images/logo.png';
                      }}
                    />
                    <h3 className="text-lg font-semibold text-[#ffb81c]">AI-Core Platform</h3>
                  </div>
                  <p className="text-gray-300 text-sm mb-3">
                    {getProductFamilyInfo('ai-core').description}
                  </p>
                  <button
                    onClick={() => {
                      setShowComboPanel(false);
                      handleFamilyClick('ai-core');
                    }}
                    className="bg-[#ffb81c] text-[#001f33] px-3 py-1 rounded text-sm font-medium hover:bg-[#ffb81c]/90 transition-colors"
                  >
                    View Details
                  </button>
                </div>

                {/* PROVEtech Section */}
                <div className="bg-[#001f33]/70 border border-white/20 rounded-lg p-4">
                  <div className="flex items-center space-x-3 mb-3">
                    <img
                      src="./products/provetech/PROVEtech.png"
                      alt="PROVEtech"
                      className="w-8 h-8 object-contain"
                      onError={(e) => {
                        const target = e.target as HTMLImageElement;
                        target.src = './images/logo.png';
                      }}
                    />
                    <h3 className="text-lg font-semibold text-[#ffb81c]">PROVEtech Tool Suite</h3>
                  </div>
                  <p className="text-gray-300 text-sm mb-3">
                    {getProductFamilyInfo('provetech').description}
                  </p>
                  <button
                    onClick={() => {
                      setShowComboPanel(false);
                      handleFamilyClick('provetech');
                    }}
                    className="bg-[#ffb81c] text-[#001f33] px-3 py-1 rounded text-sm font-medium hover:bg-[#ffb81c]/90 transition-colors"
                  >
                    View Details
                  </button>
                </div>

                {/* Key Benefits */}
                <div className="bg-[#001f33]/70 border border-white/20 rounded-lg p-4">
                  <h3 className="text-lg font-semibold text-[#ffb81c] mb-3">Key Benefits</h3>
                  <ul className="space-y-2 text-sm text-gray-300">
                    <li className="flex items-start space-x-2">
                      <span className="text-[#ffb81c] mt-1">•</span>
                      <span>Reduced testing time by up to 60% through AI-powered automation</span>
                    </li>
                    <li className="flex items-start space-x-2">
                      <span className="text-[#ffb81c] mt-1">•</span>
                      <span>Enhanced test coverage with intelligent scenario generation</span>
                    </li>
                    <li className="flex items-start space-x-2">
                      <span className="text-[#ffb81c] mt-1">•</span>
                      <span>Predictive failure detection before issues reach production</span>
                    </li>
                    <li className="flex items-start space-x-2">
                      <span className="text-[#ffb81c] mt-1">•</span>
                      <span>Seamless integration with existing development workflows</span>
                    </li>
                    <li className="flex items-start space-x-2">
                      <span className="text-[#ffb81c] mt-1">•</span>
                      <span>Real-time performance monitoring and optimization recommendations</span>
                    </li>
                  </ul>
                </div>

                {/* Contact Section */}
                <div className="bg-[#001f33]/70 border border-white/20 rounded-lg p-4 text-center">
                  <h3 className="text-lg font-semibold text-white mb-3">Interested in This Solution?</h3>
                  <p className="text-gray-300 text-sm mb-4">
                    {contentConfig.general.contactMessage}
                  </p>
                  <div className="flex flex-col items-center space-y-3">
                    <img
                      src="./images/qrcode.png"
                      alt="Contact QR Code"
                     className="w-20 h-20 object-contain mb-2"
                      onError={(e) => {
                        const target = e.target as HTMLImageElement;
                        target.style.display = 'none';
                      }}
                    />
                   <p className="text-center text-sm mt-2">
                      or email us at <span style={{ color: '#ffb81c' }}>{contentConfig.general.emailAddress}</span>
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
        {selectedFamilyData && !showProductModal && (
          <div className="fixed top-0 right-0 h-full w-1/3 backdrop-blur-md bg-[#001f33]/95 border-l border-white/20 shadow-2xl z-50 overflow-y-auto popup-scrollbar">
            <div className="p-6">
              <button
                onClick={handleReset}
                className="absolute top-4 right-4 transition-colors z-10"
                style={{ color: 'white' }}
                title="Close panel"
              >
                <X size={20} />
              </button>
              
              <div className="mb-6">
              {selectedFamily !== 'akkodis-main' && (
                <div className="w-20 h-20 overflow-hidden p-2 mb-4">
                  <img
                    src={selectedFamilyData.image}
                    alt={selectedFamilyData.name}
                    className="w-24 h-24 object-contain"
                    draggable={false}
                    onError={(e) => {
                      const target = e.target as HTMLImageElement;
                      target.src = './images/logo.png';
                    }}
                  />
                </div>
              )}
                <h2 className="text-2xl font-bold text-white mb-2">{selectedFamilyData.name}</h2>
                <p className="text-lg text-gray-300 mb-4">Product Family</p>
              </div>
              
              <div className="text-white text-sm leading-relaxed mb-4">
                <p className="mb-3">{contentConfig.general.contactMessage}</p>
                <div className="flex flex-col items-center space-y-3">
                  <img
                    src="./images/qrcode.png"
                    alt="Contact QR Code"
                    className="w-20 h-20 object-contain mb-2"
                    onError={(e) => {
                      const target = e.target as HTMLImageElement;
                      target.style.display = 'none';
                    }}
                  />
                  <p className="text-center text-sm mt-2">
                    or email us at <span style={{ color: '#ffb81c' }}>{contentConfig.general.emailAddress}</span>
                  </p>
                </div>
              </div>
              
              <div className="text-center mt-6">
                <button
                  onClick={handleReset}
                  className="bg-[#ffb81c] text-[#001f33] px-4 py-2 rounded-lg font-medium hover:bg-[#ffb81c]/90 transition-colors"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Product Modal */}
        {selectedFamilyData && showProductModal && !showComboPanel && (
          <ProductModal
            isOpen={true}
            onClose={() => {
              setShowProductModal(false);
            }}
            productName={selectedFamilyData.mainProduct.name}
            productFamily={selectedFamily!}
            productImage={selectedFamilyData.mainProduct.image}
          />
        )}
      </div>
    </ErrorBoundary>
  );
}

export default App;