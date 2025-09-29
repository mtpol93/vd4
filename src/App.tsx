import React, { useState, Suspense } from 'react';
import { Canvas } from '@react-three/fiber';
import { RotateCcw, Wind, Mail, X } from 'lucide-react';
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

  const handleCameraReached = () => {
    console.log('📹 Camera animation completed');
    setIsAnimating(false);
    setCameraTarget(null);
  };


  const handleReset = () => {
    setSelectedFamily(null);
    setShowProductModal(false);
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
        <div className="absolute top-4 left-4 z-10 max-w-xs">
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
                  <div className="w-20 h-20 overflow-hidden flex items-center justify-center">
                    <img
                      src={family.image}
                      alt={family.name}
                     className="w-full h-16 object-contain"
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
                onClick={() => {
                  // Show both AI-Core and PROVEtech
                  setSelectedFamily('ai-core-provetech-combo');
                  // Move camera to a position that shows both
                  setCameraTarget({
                    position: [-6.32, 2.19, 6.24],
                    rotation: [0, 0, 0],
                    target: [-13, 1, 2]
                  });
                  setIsAnimating(true);
                }}
                onMouseDown={(e) => e.preventDefault()}
                onDragStart={(e) => e.preventDefault()}
                onContextMenu={(e) => e.preventDefault()}
                className="group relative transition-transform duration-300 backdrop-blur-md bg-[#001f33]/90 border border-white/20 rounded-lg hover:bg-[#001f33]/95 select-none"
                style={{ userSelect: 'none', WebkitUserSelect: 'none' }}
              >
                <div className="w-20 h-20 overflow-hidden flex items-center justify-center">
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

        {selectedFamilyData && !showProductModal && (
          <div className="absolute top-1/2 right-4 transform -translate-y-1/2 z-10 max-w-md">
            <div className="backdrop-blur-md bg-[#001f33]/90 border border-white/20 rounded-lg p-6 shadow-xl">
              <button
                onClick={handleReset}
                className="absolute top-2 right-2 w-6 h-6 flex items-center justify-center text-white hover:text-gray-300 transition-colors z-10"
                title="Close panel"
              >
                <X size={16} />
              </button>
              {selectedFamily !== 'akkodis-main' && (
                <div className="w-20 h-20 overflow-hidden p-2">
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
              <div>
                <h3 className="text-xl font-bold text-white">{selectedFamilyData.name}</h3>
                <p className="text-sm text-gray-300">Product Family</p>
              </div>
              <div className="text-white text-sm leading-relaxed mb-4">
                <p className="mb-3">{contentConfig.general.contactMessage}</p>
                <div className="flex flex-col items-center space-y-3">
                  <img
                    src="./images/qrcode.png"
                    alt="Contact QR Code"
                    className="w-24 h-24 object-contain"
                    onError={(e) => {
                      const target = e.target as HTMLImageElement;
                      target.style.display = 'none';
                    }}
                  />
                  <p className="text-center">or email us at <span style={{ color: '#ffb81c' }}>{contentConfig.general.emailAddress}</span></p>
                </div>
              </div>
              <div className="text-center">
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
        {selectedFamilyData && showProductModal && (
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