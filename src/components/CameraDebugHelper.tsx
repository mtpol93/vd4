import React, { useState, useRef } from 'react';
import { Eye, Copy, Check, Edit3, Sliders, RotateCw } from 'lucide-react';

interface CameraDebugHelperProps {
  position: [number, number, number];
  rotation: [number, number, number];
  target: [number, number, number];
  onPositionChange?: (position: [number, number, number]) => void;
  onRotationChange?: (rotation: [number, number, number]) => void;
  onTargetChange?: (target: [number, number, number]) => void;
}

export function CameraDebugHelper({ position, rotation, target, onPositionChange, onRotationChange, onTargetChange }: CameraDebugHelperProps) {
  const [isVisible, setIsVisible] = useState(false);
  const [copied, setCopied] = useState(false);
  const [showSliders, setShowSliders] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [dragStartRotation, setDragStartRotation] = useState([0, 0, 0]);
  const gizmoRef = useRef<HTMLDivElement>(null);

  const copyToClipboard = () => {
    const cameraConfig = `{
  position: [${position.join(', ')}],
  rotation: [${rotation.map(r => (r * Math.PI / 180).toFixed(3)).join(', ')}],
  target: [${target.join(', ')}]
}`;

    navigator.clipboard.writeText(cameraConfig).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  const handlePositionChange = (axis: number, value: number) => {
    if (onPositionChange) {
      const newPosition = [...position] as [number, number, number];
      newPosition[axis] = value;
      onPositionChange(newPosition);
    }
  };

  const handleRotationChange = (axis: number, value: number) => {
    if (onRotationChange) {
      const newRotation = [...rotation] as [number, number, number];
      newRotation[axis] = value;
      onRotationChange(newRotation);
    }
  };

  const handleTargetChange = (axis: number, value: number) => {
    if (onTargetChange) {
      const newTarget = [...target] as [number, number, number];
      newTarget[axis] = value;
      onTargetChange(newTarget);
    }
  };

  // Gizmo interaction handlers
  const handleGizmoMouseDown = (e: React.MouseEvent) => {
    e.preventDefault();
    setIsDragging(true);
    setDragStart({ x: e.clientX, y: e.clientY });
    setDragStartRotation([...rotation]);
    document.addEventListener('mousemove', handleGizmoMouseMove);
    document.addEventListener('mouseup', handleGizmoMouseUp);
  };

  const handleGizmoMouseMove = (e: MouseEvent) => {
    if (!isDragging) return;
    
    const deltaX = e.clientX - dragStart.x;
    const deltaY = e.clientY - dragStart.y;
    
    // Convert mouse movement to rotation
    const sensitivity = 0.5;
    const newRotationY = dragStartRotation[1] + deltaX * sensitivity;
    const newRotationX = dragStartRotation[0] - deltaY * sensitivity;
    
    // Clamp rotation values
    const clampedRotationX = Math.max(-360, Math.min(360, newRotationX));
    const clampedRotationY = Math.max(-360, Math.min(360, newRotationY));
    
    if (onRotationChange) {
      onRotationChange([clampedRotationX, clampedRotationY, rotation[2]]);
    }
  };

  const handleGizmoMouseUp = () => {
    setIsDragging(false);
    document.removeEventListener('mousemove', handleGizmoMouseMove);
    document.removeEventListener('mouseup', handleGizmoMouseUp);
  };

  // Cleanup event listeners on unmount
  React.useEffect(() => {
    return () => {
      document.removeEventListener('mousemove', handleGizmoMouseMove);
      document.removeEventListener('mouseup', handleGizmoMouseUp);
    };
  }, []);

  if (!isVisible) {
    return (
      <button
        onClick={() => setIsVisible(true)}
        className="fixed bottom-20 right-4 w-12 h-12 backdrop-blur-md bg-[#001f33]/90 border border-white/20 text-white rounded-full flex items-center justify-center shadow-lg z-30 hover:bg-[#001f33]/95"
        title="Show camera debug info"
      >
        <Eye size={20} />
      </button>
    );
  }

  return (
    <div className="fixed bottom-4 right-4 backdrop-blur-md bg-[#001f33]/95 border border-white/20 text-white p-4 rounded-lg shadow-xl z-30 font-mono text-sm max-w-lg">
      <div className="flex items-center justify-between mb-3">
        <h3 className="font-bold text-[#ffb81c]">Camera Debug</h3>
        <div className="flex items-center space-x-2">
          <button
            onClick={() => setShowSliders(!showSliders)}
            className="text-gray-400 hover:text-white transition-colors backdrop-blur-md bg-[#001f33]/90 border border-white/20 rounded p-1"
            title="Toggle sliders"
          >
            <Sliders size={16} />
          </button>
          <button
            onClick={() => setIsVisible(false)}
            className="text-gray-400 text-lg leading-none hover:text-white transition-colors backdrop-blur-md bg-[#001f33]/90 border border-white/20 rounded px-2 py-1"
          >
            ×
          </button>
        </div>
      </div>
      
      <div className="space-y-3">
        {/* Camera Rotation Gizmo */}
        <div>
          <div className="text-yellow-400 font-semibold mb-2 flex items-center space-x-2">
            <RotateCw size={14} />
            <span>Rotation Gizmo:</span>
          </div>
          <div className="flex items-center space-x-4">
            {/* Round Gizmo */}
            <div className="relative">
              <div
                ref={gizmoRef}
                className={`w-20 h-20 rounded-full border-2 border-yellow-400 bg-gray-800 cursor-grab active:cursor-grabbing relative ${
                  isDragging ? 'ring-2 ring-yellow-300' : ''
                }`}
                onMouseDown={handleGizmoMouseDown}
                style={{ userSelect: 'none' }}
              >
                {/* Center dot */}
                <div className="absolute top-1/2 left-1/2 w-2 h-2 bg-yellow-400 rounded-full transform -translate-x-1/2 -translate-y-1/2"></div>
                
                {/* Rotation indicator */}
                <div
                  className="absolute w-1 h-6 bg-yellow-400 rounded-full"
                  style={{
                    top: '10%',
                    left: '50%',
                    transformOrigin: '50% 300%',
                    transform: `translateX(-50%) rotate(${rotation[1]}deg)`
                  }}
                ></div>
                
                {/* Axis labels */}
                <div className="absolute -top-6 left-1/2 transform -translate-x-1/2 text-xs text-yellow-300">Y</div>
                <div className="absolute top-1/2 -right-6 transform -translate-y-1/2 text-xs text-yellow-300">X</div>
              </div>
              <div className="text-center mt-1 text-xs text-gray-400">
                Drag to rotate
              </div>
            </div>
            
            {/* Z-axis rotation slider */}
            <div className="flex-1 space-y-2">
              <div className="text-xs text-yellow-300">Z-Axis Roll:</div>
              <div className="flex items-center space-x-2">
                <input
                  type="range"
                  min="-360"
                  max="360"
                  step="5"
                  value={rotation[2]}
                  onChange={(e) => handleRotationChange(2, parseFloat(e.target.value))}
                  className="flex-1 h-1 bg-gray-700 rounded-lg appearance-none cursor-pointer slider"
                />
                <span className="w-12 text-xs">{rotation[2].toFixed(0)}°</span>
              </div>
            </div>
          </div>
        </div>

        {/* Position Sliders */}
        <div>
          <div className="text-green-400 font-semibold mb-2">Position:</div>
          <div className="space-y-2">
            <div className="flex items-center space-x-2">
              <span className="w-4 text-xs text-green-300">X:</span>
              <input
                type="range"
                min="-50"
                max="50"
                step="0.5"
                value={position[0]}
                onChange={(e) => handlePositionChange(0, parseFloat(e.target.value))}
                className="flex-1 h-1 bg-gray-700 rounded-lg appearance-none cursor-pointer slider"
              />
              <span className="w-16 text-xs">{position[0].toFixed(1)}</span>
            </div>
            <div className="flex items-center space-x-2">
              <span className="w-4 text-xs text-green-300">Y:</span>
              <input
                type="range"
                min="-20"
                max="50"
                step="0.5"
                value={position[1]}
                onChange={(e) => handlePositionChange(1, parseFloat(e.target.value))}
                className="flex-1 h-1 bg-gray-700 rounded-lg appearance-none cursor-pointer slider"
              />
              <span className="w-16 text-xs">{position[1].toFixed(1)}</span>
            </div>
            <div className="flex items-center space-x-2">
              <span className="w-4 text-xs text-green-300">Z:</span>
              <input
                type="range"
                min="-50"
                max="50"
                step="0.5"
                value={position[2]}
                onChange={(e) => handlePositionChange(2, parseFloat(e.target.value))}
                className="flex-1 h-1 bg-gray-700 rounded-lg appearance-none cursor-pointer slider"
              />
              <span className="w-16 text-xs">{position[2].toFixed(1)}</span>
            </div>
          </div>
        </div>

        {/* Target Sliders */}
        <div>
          <div className="text-[#ffb81c] font-semibold mb-2">Target:</div>
          <div className="space-y-2">
            <div className="flex items-center space-x-2">
              <span className="w-4 text-xs text-purple-300">X:</span>
              <input
                type="range"
                min="-50"
                max="50"
                step="0.5"
                value={target[0]}
                onChange={(e) => handleTargetChange(0, parseFloat(e.target.value))}
                className="flex-1 h-1 bg-gray-700 rounded-lg appearance-none cursor-pointer slider"
              />
              <span className="w-16 text-xs">{target[0].toFixed(1)}</span>
            </div>
            <div className="flex items-center space-x-2">
              <span className="w-4 text-xs text-purple-300">Y:</span>
              <input
                type="range"
                min="-50"
                max="50"
                step="0.5"
                value={target[1]}
                onChange={(e) => handleTargetChange(1, parseFloat(e.target.value))}
                className="flex-1 h-1 bg-gray-700 rounded-lg appearance-none cursor-pointer slider"
              />
              <span className="w-16 text-xs">{target[1].toFixed(1)}</span>
            </div>
            <div className="flex items-center space-x-2">
              <span className="w-4 text-xs text-purple-300">Z:</span>
              <input
                type="range"
                min="-50"
                max="50"
                step="0.5"
                value={target[2]}
                onChange={(e) => handleTargetChange(2, parseFloat(e.target.value))}
                className="flex-1 h-1 bg-gray-700 rounded-lg appearance-none cursor-pointer slider"
              />
              <span className="w-16 text-xs">{target[2].toFixed(1)}</span>
            </div>
          </div>
        </div>

        {/* Current Values Display */}
        <div className="text-xs text-gray-400 space-y-1">
          <div><span className="text-green-400">Position:</span> [{position.join(', ')}]</div>
          <div><span className="text-yellow-400">Rotation:</span> [{rotation.join(', ')}]°</div>
          <div><span className="text-purple-400">Target:</span> [{target.join(', ')}]</div>
        </div>
      </div>

      <button
        onClick={copyToClipboard}
        className="mt-3 w-full backdrop-blur-md bg-[#001f33]/90 border border-white/20 text-white px-3 py-2 rounded flex items-center justify-center space-x-2 text-xs hover:bg-[#001f33]/95"
      >
        {copied ? (
          <>
            <Check size={14} />
            <span>Copied!</span>
          </>
        ) : (
          <>
            <Copy size={14} />
            <span>Copy Config</span>
          </>
        )}
      </button>

      <div className="mt-2 text-xs text-gray-400 text-center">
        Drag gizmo to rotate • Use sliders for position & target
      </div>
      
      <style jsx>{`
        .slider::-webkit-slider-thumb {
          appearance: none;
          height: 12px;
          width: 12px;
          border-radius: 50%;
          background: #ffb81c;
          cursor: pointer;
          border: 2px solid #001f33;
        }
        
        .slider::-moz-range-thumb {
          height: 12px;
          width: 12px;
          border-radius: 50%;
          background: #ffb81c;
          cursor: pointer;
          border: 2px solid #001f33;
        }
      `}</style>
    </div>
  );
}