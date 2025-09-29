import React, { useRef, useState, useEffect, Suspense } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import { PerspectiveCamera, OrbitControls, Environment, ContactShadows, useGLTF, useAnimations } from '@react-three/drei';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
import { DRACOLoader } from 'three/examples/jsm/loaders/DRACOLoader';
import * as THREE from 'three';
import { CameraDebugHelper } from './CameraDebugHelper';

interface CameraPosition {
  position: [number, number, number];
  rotation: [number, number, number];
  target: [number, number, number];
}

interface ShowroomProps {
  selectedSector: string;
  showWindTunnel: boolean;
  showAICore: boolean;
  showNetComm: boolean;
  showPROVEtech: boolean;
  showEnergySolutions: boolean;
  showGigaboxes: boolean;
  cameraTarget?: CameraPosition | null;
  onCameraReached?: () => void;
  onWindTunnelAnimationChange?: (isAnimating: boolean) => void;
  onCameraInfoChange?: (info: { position: [number, number, number]; rotation: [number, number, number]; target: [number, number, number] }) => void;
  onTargetChange?: (target: [number, number, number]) => void;
}

// Tone Mapping Component to fix dark baked textures
function ToneMappingSetup() {
  const { gl } = useThree();
  
  useEffect(() => {
    // Blender-like tone mapping settings
    if (gl.backend === 'webgpu') {
      // WebGPU with Blender-like settings
      gl.toneMapping = THREE.LinearToneMapping;
      gl.toneMappingExposure = 1.0;
    } else {
      // WebGL with Blender-like settings
      gl.toneMapping = THREE.LinearToneMapping;
      gl.toneMappingExposure = 1.0;
    }
    
    gl.outputColorSpace = THREE.SRGBColorSpace;
  }, [gl]);
  
  return null;
}

// Silent Image Loader to suppress texture loading errors
class SilentImageLoader extends THREE.ImageLoader {
  load(url: string, onLoad?: (image: HTMLImageElement) => void, onProgress?: (event: ProgressEvent) => void, onError?: (event: ErrorEvent) => void): HTMLImageElement {
    const image = document.createElement('img');
    
    if (onLoad !== undefined) {
      image.addEventListener('load', () => onLoad(image), false);
    }
    
    if (onProgress !== undefined) {
      // Progress events are not supported for images
    }
    
    if (onError !== undefined) {
      image.addEventListener('error', (event) => {
        // Silently handle the error without calling onError to prevent console logging
      }, false);
    }
    
    if (this.crossOrigin !== undefined) image.crossOrigin = this.crossOrigin;
    
    image.src = url;
    
    return image;
  }
}

// Custom hook to safely load GLB models with error handling
function useSafeGLTF(path: string) {
  const { gl } = useThree();
  const [model, setModel] = useState<any>(null);
  const [error, setError] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    console.log(`🔄 Loading model: ${path}`);
    setLoading(true);
    setError(false);
    
    // Store original console.error
    const originalConsoleError = console.error;
    
    // Override console.error to filter out GLTFLoader texture errors
    console.error = (...args: any[]) => {
      const message = args.join(' ');
      if (message.includes('THREE.GLTFLoader: Couldn\'t load texture')) {
        // Suppress this specific error
        return;
      }
      // Call original console.error for other errors
      originalConsoleError.apply(console, args);
    };

    // Create a custom loading manager that suppresses texture loading errors
    const loadingManager = new THREE.LoadingManager();
    
    // Register the silent image loader for texture files
    const silentImageLoader = new SilentImageLoader(loadingManager);
    loadingManager.addHandler(/\.(jpg|jpeg|png|gif|bmp|tga|tiff|webp)$/i, silentImageLoader);
    
    loadingManager.onError = () => {
      // Silently handle texture loading errors
    };

    const loader = new GLTFLoader(loadingManager);
    
    // Set up Draco compression support
    const dracoLoader = new DRACOLoader();
    dracoLoader.setDecoderPath('https://www.gstatic.com/draco/versioned/decoders/1.5.6/');
    dracoLoader.setDecoderConfig({ type: 'js' });
    loader.setDRACOLoader(dracoLoader);
    
    loader.load(
      path,
      (gltf) => {
        console.log(`✅ Model loaded successfully: ${path}`);
        // Process the model to handle texture errors
        gltf.scene.traverse((child) => {
          if (child instanceof THREE.Mesh) {
            child.castShadow = true;
            child.receiveShadow = true;
            
            // Optimize geometry for better performance
            if (child.geometry) {
              child.geometry.computeBoundingSphere();
              child.geometry.computeBoundingBox();
            }
            
            // Handle material texture errors
            if (child.material) {
              const material = child.material as THREE.MeshStandardMaterial;
              
              // WebGPU compatible material optimization
              if (gl?.backend === 'webgpu') {
                // WebGPU specific material settings
                material.transparent = material.transparent || false;
                material.alphaTest = material.alphaTest || 0;
              }
              
              material.needsUpdate = false;
              
              // Create fallback materials if textures fail to load
              if (material.map && !material.map.image) {
                material.map = null;
                material.color = new THREE.Color(0x666666);
              }
              
              if (material.normalMap && !material.normalMap.image) {
                material.normalMap = null;
              }
              
              if (material.roughnessMap && !material.roughnessMap.image) {
                material.roughnessMap = null;
                material.roughness = 0.5;
              }
              
              if (material.metalnessMap && !material.metalnessMap.image) {
                material.metalnessMap = null;
                material.metalness = 0.5;
              }
            }
          }
        });
        
        setModel(gltf);
        setError(false);
        setLoading(false);
        
        // Restore original console.error
        console.error = originalConsoleError;
      },
      undefined,
      (err) => {
        // Check if this is a 404/missing file error (HTML response instead of GLB)
        const errorMessage = err?.message || '';
        if (errorMessage.includes('Unexpected token') || errorMessage.includes('<!DOCTYPE')) {
          console.warn(`⚠️ Model file not found: ${path} - Using fallback geometry`);
        } else {
          console.error(`❌ Failed to load model ${path}:`, err);
        }
        setError(true);
        setModel(null);
        setLoading(false);
        
        // Restore original console.error
        console.error = originalConsoleError;
      }
    );

    // Cleanup function to restore console.error if component unmounts
    return () => {
      console.error = originalConsoleError;
      dracoLoader.dispose();
    };
  }, [path, gl]);

  return { model, error, loading };
}

// Camera Controller Component
function CameraController({ target, onReached, onCameraInfoChange, onTargetChange }: { target: CameraPosition | null; onReached?: () => void; onCameraInfoChange?: (info: { position: [number, number, number]; rotation: [number, number, number]; target: [number, number, number] }) => void; onTargetChange?: (target: [number, number, number]) => void }) {
  const { camera } = useThree();
  const controlsRef = useRef<any>();
  const [isAnimating, setIsAnimating] = useState(false);
  const [startPosition, setStartPosition] = useState<THREE.Vector3 | null>(null);
  const [startTarget, setStartTarget] = useState<THREE.Vector3 | null>(null);
  const [animationProgress, setAnimationProgress] = useState(0);
  const animationSpeed = useRef(1.5); // Smooth animation speed

  // Handle target changes from debug helper
  const handleTargetChange = (newTarget: [number, number, number]) => {
    if (controlsRef.current && onTargetChange) {
      controlsRef.current.target.set(...newTarget);
      controlsRef.current.update();
      onTargetChange(newTarget);
    }
  };

  // Expose target change function
  React.useEffect(() => {
    if (onTargetChange) {
      (window as any).setCameraTarget = handleTargetChange;
    }
  }, [onTargetChange]);

  useEffect(() => {
    const updateCameraInfo = () => {
      if (camera && onCameraInfoChange) {
        // Get position
        const pos = camera.position;
        const position: [number, number, number] = [
          Math.round(pos.x * 100) / 100,
          Math.round(pos.y * 100) / 100,
          Math.round(pos.z * 100) / 100
        ];

        // Get rotation (convert from radians to degrees for readability)
        const rot = camera.rotation;
        const rotation: [number, number, number] = [
          Math.round((rot.x * 180 / Math.PI) * 100) / 100,
          Math.round((rot.y * 180 / Math.PI) * 100) / 100,
          Math.round((rot.z * 180 / Math.PI) * 100) / 100
        ];

        // Get target from controls if available
        let target: [number, number, number] = [0, 0, 0];
        if (controlsRef?.current?.target) {
          const tgt = controlsRef.current.target;
          target = [
            Math.round(tgt.x * 100) / 100,
            Math.round(tgt.y * 100) / 100,
            Math.round(tgt.z * 100) / 100
          ];
        }

        onCameraInfoChange({ position, rotation, target });
      }
    };

    const interval = setInterval(updateCameraInfo, 100); // Update 10 times per second
    return () => clearInterval(interval);
  }, [camera, onCameraInfoChange]);

  useEffect(() => {
    if (target && !isAnimating) {
      console.log('🎬 Starting camera animation to:', target);
      // Store starting position and target
      setStartPosition(camera.position.clone());
      setStartTarget(controlsRef.current?.target?.clone() || new THREE.Vector3(0, 0, 0));
      setIsAnimating(true);
      setAnimationProgress(0);
    }
  }, [target, camera, isAnimating]);

  useFrame((state, delta) => {
    if (isAnimating && target && startPosition && startTarget) {
      // Smooth animation progress
      const newProgress = Math.min(animationProgress + delta * animationSpeed.current, 1);
      setAnimationProgress(newProgress);

      // Smooth easing function
      const easeOutQuart = (t: number) => 1 - Math.pow(1 - t, 3); // Smooth easing
      const easedProgress = easeOutQuart(newProgress);

      // Interpolate camera position
      const targetPos = new THREE.Vector3(...target.position);
      const currentPos = startPosition.clone().lerp(targetPos, easedProgress);
      camera.position.copy(currentPos);

      // Interpolate camera target (what it's looking at)
      const targetLookAt = new THREE.Vector3(...target.target);
      const currentTarget = startTarget.clone().lerp(targetLookAt, easedProgress);
      
      if (controlsRef.current) {
        controlsRef.current.target.copy(currentTarget);
        controlsRef.current.update();
      }

      // Animation complete
      if (newProgress >= 1) {
        console.log('✅ Camera animation completed');
        setIsAnimating(false);
        setAnimationProgress(0);
        if (onReached) {
          onReached();
        }
      }
    }
    
    // Update controls
    if (controlsRef.current) {
      controlsRef.current.update();
    }
  });

  return (
    <>
      <OrbitControls 
        ref={controlsRef}
        enablePan={false}
        minDistance={0.25}
        maxDistance={8}
        minPolarAngle={Math.PI / 4}
        maxPolarAngle={Math.PI / 2}
        target={[0, 2.5, -1]}
        enableDamping={true}
        dampingFactor={0.05} // Smooth damping
        enabled={true} // Always allow camera controls
        makeDefault={false} // Prevent conflicts
      />
    </>
  );
}

function FallbackLift({ isTransitioning }: { isTransitioning: boolean }) {
  const groupRef = useRef<THREE.Group>();
  const [yPosition, setYPosition] = useState(0);
  
  useEffect(() => {
    if (isTransitioning) {
      // Simulate lift animation
      const animateDown = () => {
        setYPosition(-2);
        setTimeout(() => setYPosition(0), 600);
      };
      animateDown();
    }
  }, [isTransitioning]);

  return (
    <group ref={groupRef} position={[0, yPosition, 0]}>
      {/* Platform */}
      <mesh position={[0, -0.5, 0]}>
        <cylinderGeometry args={[3, 3, 0.2, 16]} />
        <meshStandardMaterial color="#444" metalness={0.8} roughness={0.2} />
      </mesh>
      {/* Support Column */}
      <mesh position={[0, -4, 0]}>
        <cylinderGeometry args={[0.5, 0.5, 8, 8]} />
        <meshStandardMaterial color="#666" metalness={0.7} roughness={0.3} />
      </mesh>
      {/* Base */}
      <mesh position={[0, -8, 0]}>
        <cylinderGeometry args={[2, 2, 0.5, 16]} />
        <meshStandardMaterial color="#333" metalness={0.6} roughness={0.4} />
      </mesh>
    </group>
  );
}

function Lift({ isTransitioning }: { isTransitioning: boolean }) {
  const { model, error, loading } = useSafeGLTF('./models/lift-opt.glb');
  const groupRef = useRef<THREE.Group>();
  const { actions } = useAnimations(model?.animations || [], groupRef);
  const [hasPlayedOnce, setHasPlayedOnce] = useState(false);

  // Debug logging
  useEffect(() => {
    console.log('=== LIFT MODEL DEBUG ===');
    console.log('Loading:', loading);
    console.log('Model loaded:', !!model);
    console.log('Error:', error);
    console.log('Transitioning:', isTransitioning);
    console.log('========================');
  }, [loading, model, error, isTransitioning]);

  useEffect(() => {
    const allActions = Object.values(actions);
    
    if (allActions.length > 0 && isTransitioning) {
      allActions.forEach(action => {
        if (action) {
          action.reset();
          action.setLoop(THREE.LoopOnce, 1);
          action.clampWhenFinished = true;
          action.timeScale = 1;
          action.play();
        }
      });
      
      if (!hasPlayedOnce) {
        setHasPlayedOnce(true);
      }
    }
  }, [actions, isTransitioning, hasPlayedOnce]);

  if (loading) {
    console.log('🔄 Lift model still loading, using fallback...');
    return <FallbackLift isTransitioning={isTransitioning} />;
  }

  if (error || !model) {
    console.warn('⚠️ Lift model failed to load, using fallback');
    return <FallbackLift isTransitioning={isTransitioning} />;
  }

  console.log('✅ Lift model rendering successfully');
  return (
    <group ref={groupRef}>
      <primitive 
        object={model.scene} 
        scale={1}
      />
    </group>
  );
}

function FallbackWindTunnel({ show }: { show: boolean }) {
  const groupRef = useRef<THREE.Group>();

  if (!show) return null;

  return (
    <group ref={groupRef}>
      {/* Wind tunnel structure */}
      <mesh position={[0, 2, -5]}>
        <boxGeometry args={[8, 4, 1]} />
        <meshStandardMaterial color="#888" metalness={0.6} roughness={0.3} transparent opacity={0.8} />
      </mesh>
      <mesh position={[0, 2, 5]}>
        <boxGeometry args={[8, 4, 1]} />
        <meshStandardMaterial color="#888" metalness={0.6} roughness={0.3} transparent opacity={0.8} />
      </mesh>
      {/* Side walls */}
      <mesh position={[-4, 2, 0]}>
        <boxGeometry args={[1, 4, 10]} />
        <meshStandardMaterial color="#888" metalness={0.6} roughness={0.3} transparent opacity={0.8} />
      </mesh>
      <mesh position={[4, 2, 0]}>
        <boxGeometry args={[1, 4, 10]} />
        <meshStandardMaterial color="#888" metalness={0.6} roughness={0.3} transparent opacity={0.8} />
      </mesh>
      {/* Top */}
      <mesh position={[0, 4, 0]}>
        <boxGeometry args={[8, 1, 10]} />
        <meshStandardMaterial color="#888" metalness={0.6} roughness={0.3} transparent opacity={0.8} />
      </mesh>
    </group>
  );
}

function WindTunnel({ show, onAnimationChange }: { show: boolean; onAnimationChange?: (isAnimating: boolean) => void }) {
  const { model, error } = useSafeGLTF('./models/windtunnel-opt.glb');
  const groupRef = useRef<THREE.Group>();
  const { actions, mixer } = useAnimations(model?.animations || [], groupRef);
  const [shouldRender, setShouldRender] = useState(false);
  const [currentAnimation, setCurrentAnimation] = useState('');
  const [animationState, setAnimationState] = useState<'hidden' | 'spawning-in' | 'visible' | 'spawning-out'>('hidden');
  const currentActionRef = useRef<THREE.AnimationAction | null>(null);
  const previousShowRef = useRef(show);
  const currentListenerRef = useRef<((event: any) => void) | null>(null);
  
  // Helper function to stop current animation
  const stopCurrentAnimation = () => {
    if (currentActionRef.current) {
      currentActionRef.current.stop();
      currentActionRef.current = null;
    }
    
    // Clean up event listener
    if (currentListenerRef.current && mixer) {
      mixer.removeEventListener('finished', currentListenerRef.current);
      currentListenerRef.current = null;
    }
  };

  // Helper function to play animation
  const playAnimation = (animationName: string, onFinished?: () => void) => {
    if (!actions || !actions[animationName] || !mixer) {
      console.warn(`⚠️ Animation "${animationName}" not found`);
      return;
    }

    stopCurrentAnimation();
    
    const action = actions[animationName];
    currentActionRef.current = action;
    
    // Reset and configure animation
    action.reset();
    action.setLoop(THREE.LoopOnce, 1);
    action.clampWhenFinished = true;
    action.paused = false;
    
    // Add finished listener
    if (onFinished) {
      const onFinishedHandler = (event: any) => {
        // Check if this is the specific action that finished
        if (event.action === action) {
          action.paused = true; // Pause at last frame
          onFinished();
          mixer.removeEventListener('finished', onFinishedHandler);
          currentListenerRef.current = null;
        }
      };
      currentListenerRef.current = onFinishedHandler;
      mixer.addEventListener('finished', onFinishedHandler);
    }
    
    action.play();
    console.log(`✅ Playing animation: ${animationName}`);
  };

  useEffect(() => {
    // Only process when show state changes and we have actions
    if (show !== previousShowRef.current && actions && Object.keys(actions).length > 0) {
      console.log('🌪️ WindTunnel show changed:', previousShowRef.current, '->', show);
      previousShowRef.current = show;

      if (show && animationState === 'hidden') {
        // Start spawn-in sequence
        console.log('🌪️ Starting spawn-in sequence');
        onAnimationChange?.(true);
        setShouldRender(true);
        setAnimationState('spawning-in');
        
        // Small delay to ensure model is mounted
        setTimeout(() => {
          playAnimation('Spawn_in', () => {
            console.log('🌪️ Spawn_in animation finished');
            setAnimationState('visible');
            onAnimationChange?.(false);
          });
        }, 50);
        
      } else if (!show && (animationState === 'visible' || animationState === 'spawning-in')) {
        // Start spawn-out sequence
        console.log('🌪️ Starting spawn-out sequence');
        onAnimationChange?.(true);
        setAnimationState('spawning-out');
        
        playAnimation('Spawn_out', () => {
          console.log('🌪️ Spawn_out animation finished');
          setAnimationState('hidden');
          setShouldRender(false);
          onAnimationChange?.(false);
        });
      }
    }
  }, [show, actions, animationState]);

  // Set initial visibility based on animation state
  useEffect(() => {
    if (groupRef.current) {
      if (animationState === 'hidden') {
        // Hide the model when hidden
        groupRef.current.visible = false;
      } else if (animationState === 'spawning-in') {
        // Hide initially, then show after 1 second delay
        groupRef.current.visible = false;
        setTimeout(() => {
          if (groupRef.current && animationState === 'spawning-in') {
            groupRef.current.visible = true;
          }
        }, 1000);
      } else {
        // Show for visible and spawning-out states
        groupRef.current.visible = true;
      }
    }
  }, [animationState]);
  // Cleanup on unmount
  useEffect(() => {
    return () => {
      stopCurrentAnimation();
    };
  }, []);

  // Debug available animations
  useEffect(() => {
    if (actions && Object.keys(actions).length > 0) {
      console.log('🌪️ WindTunnel animations available:');
      Object.entries(actions).forEach(([name, action]) => {
        if (action) {
          console.log(`🌪️ Action "${name}": duration=${action.getClip().duration}s`);
        }
      });
    } else {
      console.log('🌪️ No actions available yet');
    }
  }, [model, actions]);

  if (error || !model) {
    console.log('🌪️ Using fallback wind tunnel - error:', error, 'model:', !!model);
    return <FallbackWindTunnel show={show} />;
  }

  if (!shouldRender) return null;

  console.log('🌪️ Rendering WindTunnel component - state:', animationState);
  return (
    <group ref={groupRef}>
      <primitive 
        object={model.scene} 
        scale={1}
      />
    </group>
  );
}

function AICore({ show }: { show: boolean }) {
  const { model, error } = useSafeGLTF('./products/ai-core/ai-core-opt.glb');
  const groupRef = useRef<THREE.Group>();

  if (!show) return null;

  if (error || !model) {
    console.warn('AI Core model not found, component will not render');
    return null;
  }

  return (
    <group 
      ref={groupRef} 
      position={[0, 0, 0]} 
      rotation={[0, 0, 0]}
      scale={[1, 1, 1]}
    >
      <primitive 
        object={model.scene} 
        scale={1}
      />
    </group>
  );
}

function NetComm({ show }: { show: boolean }) {
  const { model, error } = useSafeGLTF('./products/netcomm/netcomm-opt.glb');
  const groupRef = useRef<THREE.Group>();

  if (!show) return null;

  if (error || !model) {
    console.warn('NetComm model not found, component will not render');
    return null;
  }

  return (
    <group 
      ref={groupRef} 
      position={[0, 0, 0]} 
      rotation={[0, 0, 0]}
      scale={[1, 1, 1]}
    >
      <primitive 
        object={model.scene} 
        scale={1}
      />
    </group>
  );
}

function PROVEtech({ show }: { show: boolean }) {
  const { model, error } = useSafeGLTF('./products/provetech/provetech-opt.glb');
  const groupRef = useRef<THREE.Group>();

  if (!show) return null;

  if (error || !model) {
    console.warn('PROVEtech model not found, component will not render');
    return null;
  }

  return (
    <group 
      ref={groupRef} 
      position={[0, 0, 0]} 
      rotation={[0, 0, 0]}
      scale={[1, 1, 1]}
    >
      <primitive 
        object={model.scene} 
        scale={1}
      />
    </group>
  );
}

function EnergySolutions({ show }: { show: boolean }) {
  const { model, error } = useSafeGLTF('./products/energy-solutions/energysolutions-opt.glb');
  const groupRef = useRef<THREE.Group>();

  if (!show) return null;

  if (error || !model) {
    console.warn('Energy Solutions model not found, component will not render');
    return null;
  }

  return (
    <group 
      ref={groupRef} 
      position={[0, 0, 0]} 
      rotation={[0, 0, 0]}
      scale={[1, 1, 1]}
    >
      <primitive 
        object={model.scene} 
        scale={1}
      />
    </group>
  );
}

// Fallback component for Gigaboxes
function FallbackGigaboxes() {
  const groupRef = useRef<THREE.Group>();
  
  useFrame((state) => {
    if (groupRef.current) {
      const t = state.clock.getElapsedTime();
      groupRef.current.rotation.y = Math.sin(t * 0.5) * 0.1;
    }
  });

  return (
    <group ref={groupRef}>
      {/* Placeholder geometry for Gigaboxes */}
      <mesh position={[0, 1, 0]} castShadow>
        <boxGeometry args={[2, 2, 2]} />
        <meshStandardMaterial color="#4a90e2" metalness={0.7} roughness={0.3} />
      </mesh>
      <mesh position={[0, 1.5, 0]} castShadow>
        <boxGeometry args={[1.5, 0.5, 1.5]} />
        <meshStandardMaterial color="#fab724" metalness={0.8} roughness={0.2} />
      </mesh>
      {/* Text indicator */}
      <mesh position={[0, 3, 0]}>
        <boxGeometry args={[3, 0.5, 0.1]} />
        <meshStandardMaterial color="#00ffff" emissive="#00ffff" emissiveIntensity={0.3} />
      </mesh>
    </group>
  );
}

function Gigaboxes({ show }: { show: boolean }) {
  const { model, error } = useSafeGLTF('./products/gigaboxes/gigaboxes-opt-2.glb');
  const groupRef = useRef<THREE.Group>();

  // Debug logging
  useEffect(() => {
    console.log('=== GIGABOXES DEBUG ===');
    console.log('Show:', show);
    console.log('Model loaded:', !!model);
    console.log('Error:', error);
    console.log('Model path: /products/gigaboxes/gigaboxes-opt-2.glb');
    if (model) {
      console.log('Model scene:', model.scene);
      console.log('Model children count:', model.scene.children.length);
    }
    console.log('======================');
  }, [show, model, error]);

  if (!show) {
    console.log('Gigaboxes not showing - show is false');
    return null;
  }

  if (error) {
    console.warn('Gigaboxes model failed to load, using fallback');
    return <FallbackGigaboxes />;
  }

  if (!model) {
    console.log('Gigaboxes model still loading, using fallback...');
    return <FallbackGigaboxes />;
  }

  console.log('✅ Gigaboxes rendering with actual model');

  return (
    <group 
      ref={groupRef} 
      position={[0, 0, 0]} 
      rotation={[0, 0, 0]}
      scale={[1, 1, 1]}
    >
      <primitive 
        object={model.scene} 
        scale={1}
        position={[0, 0, 0]}
        rotation={[0, 0, 0]}
      />
    </group>
  );
}

function Model({ type, yPosition }: { type: string; yPosition: number }) {
  const modelRef = useRef<THREE.Group>();
  const isFloating = type === 'aerospace';
  
  const modelPath = (() => {
    switch (type) {
      case 'automotive':
        return './models/model-1-opt.glb';
      case 'aerospace':
        return './models/model-2-opt.glb';
      default:
        return './models/model-1-opt.glb';
    }
  })();

  const { model, error, loading } = useSafeGLTF(modelPath);

  // Debug logging
  useEffect(() => {
    console.log(`=== MODEL DEBUG (${type}) ===`);
    console.log('Path:', modelPath);
    console.log('Loading:', loading);
    console.log('Model loaded:', !!model);
    console.log('Error:', error);
    console.log('============================');
  }, [type, modelPath, loading, model, error]);

  useFrame((state) => {
    if (modelRef.current && isFloating) {
      const t = state.clock.getElapsedTime();
      modelRef.current.position.y = yPosition + Math.sin(t * 1.5) * 0.2;
      modelRef.current.rotation.y = Math.sin(t * 0.5) * 0.1;
    }
  });

  if (loading) {
    console.log(`🔄 ${type} model still loading...`);
    return (
      <group ref={modelRef} position={[0, yPosition, 0]}>
        <mesh>
          <boxGeometry args={[2, 1, 4]} />
          <meshStandardMaterial color="#666" opacity={0.5} transparent />
        </mesh>
      </group>
    );
  }

  if (error || !model) {
    console.warn(`❌ Model ${modelPath} failed to load, component will not render`);
    return null;
  }

  console.log(`✅ ${type} model rendering successfully`);
  return (
    <group ref={modelRef} position={[0, isFloating ? yPosition : yPosition, 0]}>
      <primitive object={model.scene} scale={1} />
    </group>
  );
}

function FallbackBackground() {
  return (
    <group>
      {/* Floor */}
      <mesh position={[0, -1, 0]} receiveShadow>
        <planeGeometry args={[50, 50]} />
        <meshStandardMaterial color="#333" />
      </mesh>
      {/* Back wall */}
      <mesh position={[0, 10, -25]} rotation={[0, 0, 0]}>
        <planeGeometry args={[50, 20]} />
        <meshStandardMaterial color="#444" />
      </mesh>
      {/* Side walls */}
      <mesh position={[-25, 10, 0]} rotation={[0, Math.PI / 2, 0]}>
        <planeGeometry args={[50, 20]} />
        <meshStandardMaterial color="#444" />
      </mesh>
      <mesh position={[25, 10, 0]} rotation={[0, -Math.PI / 2, 0]}>
        <planeGeometry args={[50, 20]} />
        <meshStandardMaterial color="#444" />
      </mesh>
    </group>
  );
}

function Background() {
  const { model, error, loading } = useSafeGLTF('./models/Background_opt4.glb');
  const groupRef = useRef<THREE.Group>();
  const { actions } = useAnimations(model?.animations || [], groupRef);

  // Debug logging
  useEffect(() => {
    console.log('=== BACKGROUND MODEL DEBUG ===');
    console.log('Loading:', loading);
    console.log('Model loaded:', !!model);
    console.log('Error:', error);
    console.log('==============================');
  }, [loading, model, error]);

  // Play pulse animations on loop
  useEffect(() => {
    if (actions && Object.keys(actions).length > 0) {
      console.log('Background animations found:', Object.keys(actions));
      
      // Find and play all "pulse" animations
      Object.entries(actions).forEach(([name, action]) => {
        if (name.toLowerCase().includes('pulse') && action) {
          console.log(`Playing pulse animation: ${name}`);
          action.reset();
          action.setLoop(THREE.LoopRepeat, Infinity); // Loop infinitely
          action.play();
        }
      });
    }
  }, [actions]);

  if (loading) {
    console.log('🔄 Background model still loading...');
    return <FallbackBackground />;
  }

  if (error || !model) {
    console.warn('⚠️ Background model failed to load, using fallback');
    return <FallbackBackground />;
  }

  console.log('✅ Background model rendering successfully');
  return (
    <primitive 
      ref={groupRef}
      object={model.scene} 
      scale={1} 
      position={[0, 0, 0]}
    />
  );
}

export function Showroom({ 
  selectedSector, 
  showWindTunnel, 
  showAICore, 
  showNetComm,
  showPROVEtech,
  showEnergySolutions,
  showGigaboxes,
  cameraTarget, 
  onCameraReached,
  onWindTunnelAnimationChange,
  onCameraInfoChange,
  onTargetChange
}: ShowroomProps) {
  const { gl } = useThree();

  // Optimize renderer settings for better performance
  useEffect(() => {
    // WebGPU and WebGL compatible settings
    gl.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    
    if (gl.backend === 'webgpu') {
      // WebGPU specific optimizations
      gl.shadowMap.enabled = true;
      gl.shadowMap.type = THREE.PCFShadowMap; // WebGPU compatible
      console.log('🚀 WebGPU renderer optimizations applied');
    } else {
      // WebGL fallback optimizations
      gl.shadowMap.enabled = true;
      gl.shadowMap.type = THREE.PCFSoftShadowMap;
      gl.powerPreference = "high-performance";
      console.log('⚡ WebGL renderer optimizations applied');
    }
  }, [gl]);

  return (
    <>
      <ToneMappingSetup />
      
      <PerspectiveCamera 
        makeDefault 
        position={[0, 2.5, 1]}
        rotation={[0, 0, 0]}
        fov={50}
        near={0.1}
        far={1000}
      />
      
      <CameraController 
        target={cameraTarget} 
        onReached={onCameraReached}
        onCameraInfoChange={onCameraInfoChange}
        onTargetChange={onTargetChange}
      />
      
      <Suspense fallback={null}>
        <Environment 
          files="./hdri/main.hdr"
          background
          blur={0.5}
          resolution={2048}
          intensity={2.0}
        />
      </Suspense>
      
      <Suspense fallback={null}>
        <Background />
      </Suspense>
      
      <Suspense fallback={null}>
        <WindTunnel show={showWindTunnel} onAnimationChange={onWindTunnelAnimationChange} />
      </Suspense>

      <Suspense fallback={null}>
        <AICore show={showAICore} />
      </Suspense>

      <Suspense fallback={null}>
        <NetComm show={showNetComm} />
      </Suspense>

      <Suspense fallback={null}>
        <PROVEtech show={showPROVEtech} />
      </Suspense>

      <Suspense fallback={null}>
        <EnergySolutions show={showEnergySolutions} />
      </Suspense>

      <Suspense fallback={null}>
        <Gigaboxes show={showGigaboxes} />
      </Suspense>

      <ContactShadows
        position={[0, -0.5, 0]}
        opacity={0.6}
        scale={10}
        blur={2}
        far={4}
        resolution={512} // Reduce shadow resolution for better performance
      />
    </>
  );
}