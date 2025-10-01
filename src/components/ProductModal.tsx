import React, { useState, useEffect } from 'react';
import { X, ChevronLeft, ChevronRight, Play, Maximize2 } from 'lucide-react';
import { contentConfig, getImageContent, getVideoContent, getPresentationDescription, getDocumentDescription } from '../config/content';

interface ProductModalProps {
  isOpen: boolean;
  onClose: () => void;
  productName: string;
  productFamily: string;
  productImage: string;
}

interface MediaFile {
  type: 'image' | 'video' | 'presentation' | 'document';
  path: string;
  name: string;
  slides?: string[];
}

// Helper function to get AI-Core logo for index
const getAICoreLogoForIndex = (index: number): string => {
  const logos = [
    './products/ai-core/main/0-logos/AId-min.png',
    './products/ai-core/main/0-logos/Meta-min.png',
    './products/ai-core/main/0-logos/OneAI-min.png',
    './products/ai-core/main/0-logos/TestAId-min.png',
    './products/ai-core/main/0-logos/Agentic-min.png',
    './products/ai-core/main/0-logos/ChatNow-min.png'
  ];
  return logos[index % logos.length];
};

// Helper function to get NetComm logo for index
const getNetCommLogoForIndex = (index: number): string => {
  const logos = [
    './products/netcomm/main/0-logos/logo1.png',
    './products/netcomm/main/0-logos/logo2.png',
    './products/netcomm/main/0-logos/logo3.png'
  ];
  return logos[index % logos.length];
};

// Helper function to get PROVEtech logo for index
const getPROVEtechLogoForIndex = (index: number): string => {
  const logos = [
    './products/provetech/main/0-logos/logo1.png',
    './products/provetech/main/0-logos/logo2.png',
    './products/provetech/main/0-logos/logo3.png'
  ];
  return logos[index % logos.length];
};

// Helper function to get the appropriate logo based on product family
const getLogoForProductFamily = (productFamily: string, index: number): string => {
  switch (productFamily) {
    case 'netcomm':
      return getNetCommLogoForIndex(index);
    case 'provetech':
      return getPROVEtechLogoForIndex(index);
    case 'ai-core':
    default:
      return getAICoreLogoForIndex(index);
  }
};

// Helper function to check if product family should show logos
const shouldShowLogos = (productFamily: string): boolean => {
  return productFamily !== 'energy-solutions';
};

function getProductContent(productFamily: string): MediaFile[] {
  const content: MediaFile[] = [];

  try {
    switch (productFamily) {
      case 'ai-core':
        // AI-Core presentations
        for (let i = 1; i <= 3; i++) {
          const slides: string[] = [];
          const maxSlides = i === 1 ? 30 : (i === 2 ? 10 : 9);
          for (let j = 1; j <= maxSlides; j++) {
            slides.push(`./products/ai-core/main/1-presentation/presentation${i}/Slide${j}.PNG`);
          }
          content.push({
            type: 'presentation',
            path: `./products/ai-core/main/1-presentation/presentation${i}/`,
            name: `AI-Core Presentation ${i}`,
            slides
          });
        }

        // AI-Core images
        for (let i = 1; i <= 13; i++) {
          content.push({
            type: 'image',
            path: `./products/ai-core/main/2-images/image${i}.jpg`,
            name: `AI-Core Image ${i}`
          });
        }

        // AI-Core videos
        for (let i = 1; i <= 5; i++) {
          const extension = i === 1 ? 'webm' : 'mp4';
          content.push({
            type: 'video',
            path: `./products/ai-core/main/3-videos/video${i}.${extension}`,
            name: `AI-Core Video ${i}`
          });
        }
        break;

      case 'netcomm':
        // NetComm presentation
        const netcommSlides: string[] = [];
        for (let j = 1; j <= 10; j++) {
          netcommSlides.push(`./products/netcomm/main/1-presentation/presentation1/Slide${j}.PNG`);
        }
        content.push({
          type: 'presentation',
          path: `./products/netcomm/main/1-presentation/presentation1/`,
          name: `NetComm Validation Overview`,
          slides: netcommSlides
        });

        // NetComm images
        content.push({
          type: 'image',
          path: `./products/netcomm/main/2-images/image1.jpg`,
          name: `NetComm Image 1`
        });
        content.push({
          type: 'image',
          path: `./products/netcomm/main/2-images/image2.jpg`,
          name: `NetComm Image 2`
        });
        content.push({
          type: 'image',
          path: `./products/netcomm/main/2-images/image3.webp`,
          name: `NetComm Image 3`
        });
        break;

      case 'provetech':
        // PROVEtech presentations
        const provetechPresentations = [
          { name: 'PROVEtech Input Demonstrator', slides: 6 },
          { name: 'PROVEtech Comprehensive Overview', slides: 29 },
          { name: 'PROVEtech Technical Deep Dive', slides: 13 }
        ];

        provetechPresentations.forEach((pres, i) => {
          const slides: string[] = [];
          for (let j = 1; j <= pres.slides; j++) {
            slides.push(`./products/provetech/main/1-presentation/presentation${i + 1}/Slide${j}.PNG`);
          }
          content.push({
            type: 'presentation',
            path: `./products/provetech/main/1-presentation/presentation${i + 1}/`,
            name: pres.name,
            slides
          });
        });

        // PROVEtech images
        for (let i = 1; i <= 3; i++) {
          content.push({
            type: 'image',
            path: `./products/provetech/main/2-images/image${i}.jpg`,
            name: `PROVEtech Image ${i}`
          });
        }

        // PROVEtech videos
        content.push({
          type: 'video',
          path: `./products/provetech/main/3-videos/video1.mp4`,
          name: `PROVEtech Video 1`
        });
        break;

      case 'energy-solutions':
        // Energy Solutions presentations
        const energySlides: string[] = [];
        for (let j = 1; j <= 6; j++) {
          energySlides.push(`./products/energy-solutions/main/1-presentation/presentation1/Slide${j}.PNG`);
        }
        content.push({
          type: 'presentation',
          path: `./products/energy-solutions/main/1-presentation/presentation1/`,
          name: `Energy Solutions Overview`,
          slides: energySlides
        });

        // Energy Solutions images
        for (let i = 1; i <= 4; i++) {
          content.push({
            type: 'image',
            path: `./products/energy-solutions/main/2-images/image${i}.jpg`,
            name: `Energy Solutions Image ${i}`
          });
        }

        // Energy Solutions videos
        for (let i = 1; i <= 5; i++) {
          content.push({
            type: 'video',
            path: `./products/energy-solutions/main/3-videos/video${i}.webm`,
            name: `Energy Solutions Video ${i}`
          });
        }

        // Energy Solutions documents
        for (let i = 1; i <= 4; i++) {
          const docSlides: string[] = [];
          const docNames = [
            'Gigabox Lion EN',
            'Gigabox Lion DE', 
            'Gigabox Puma EN',
            'Gigabox Puma DE'
          ];
          for (let j = 1; j <= 2; j++) {
            docSlides.push(`./products/energy-solutions/main/4-documents/document${i}/${docNames[i-1]}-${j}.jpg`);
          }
          content.push({
            type: 'document',
            path: `./products/energy-solutions/main/4-documents/document${i}/`,
            name: docNames[i-1],
            slides: docSlides
          });
        }
        break;

      case 'akkodis-main':
        // Akkodis presentation
        const akkodisSlides: string[] = [];
        for (let j = 1; j <= 3; j++) {
          akkodisSlides.push(`./products/akkodis/main/1-presentation/presentation1/Slide${j}.PNG`);
        }
        content.push({
          type: 'presentation',
          path: `./products/akkodis/main/1-presentation/presentation1/`,
          name: `Akkodis Overview`,
          slides: akkodisSlides
        });
        break;
    }
  } catch (error) {
    console.warn('Error loading product content:', error);
  }

  return content;
}

export function ProductModal({ isOpen, onClose, productName, productFamily, productImage }: ProductModalProps) {
  const [activeTab, setActiveTab] = useState<'overview' | 'presentations' | 'images' | 'videos' | 'documents'>('overview');
  const [selectedPresentation, setSelectedPresentation] = useState<number>(0);
  const [currentSlide, setCurrentSlide] = useState<number>(0);
  const [content, setContent] = useState<MediaFile[]>([]);

  useEffect(() => {
    if (isOpen) {
      const productContent = getProductContent(productFamily);
      setContent(productContent);
      setActiveTab('overview');
      setSelectedPresentation(0);
      setCurrentSlide(0);
    }
  }, [isOpen, productFamily]);

  if (!isOpen) return null;

  const presentations = content.filter(item => item.type === 'presentation');
  const images = content.filter(item => item.type === 'image');
  const videos = content.filter(item => item.type === 'video');
  const documents = content.filter(item => item.type === 'document');

  const currentPresentation = presentations[selectedPresentation];

  const nextSlide = () => {
    if (currentPresentation && currentSlide < currentPresentation.slides!.length - 1) {
      setCurrentSlide(currentSlide + 1);
    }
  };

  const prevSlide = () => {
    if (currentSlide > 0) {
      setCurrentSlide(currentSlide - 1);
    }
  };

  const getProductFamilyInfo = (family: string) => {
    return contentConfig.productFamilies[family] || {
      name: family,
      description: 'Advanced solution providing cutting-edge capabilities.',
      overviewDescription: 'This solution delivers comprehensive capabilities designed to meet demanding requirements.'
    };
  };

  const familyInfo = getProductFamilyInfo(productFamily);

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="backdrop-blur-md bg-[#001f33]/95 border border-white/20 rounded-xl w-full max-w-6xl h-[90vh] flex flex-col relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-10 transition-colors"
          style={{ color: 'white' }}
        >
          <X size={24} />
        </button>

        {/* Header */}
        <div className="p-6 border-b border-white/20">
          <div className="flex items-center space-x-4">
            <img
              src={productImage}
              alt={productName}
              className="w-16 h-16 object-contain"
              onError={(e) => {
                const target = e.target as HTMLImageElement;
                target.src = './images/logo.png';
              }}
            />
            <div>
              <h2 className="text-2xl font-bold text-white">{familyInfo.name}</h2>
              <p className="text-lg text-gray-300">{familyInfo.description}</p>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex border-b border-white/20 px-6">
          {[
            { id: 'overview', label: 'Overview', count: null },
            { id: 'presentations', label: 'Presentations', count: presentations.length },
            { id: 'images', label: 'Images', count: images.length },
            { id: 'videos', label: 'Videos', count: videos.length },
            { id: 'documents', label: 'Documents', count: documents.length }
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`px-4 py-3 font-medium transition-colors border-b-2 ${
                activeTab === tab.id
                  ? 'text-[#ffb81c] border-[#ffb81c]'
                  : 'text-gray-400 border-transparent hover:text-white'
              }`}
            >
              {tab.label}
              {tab.count !== null && tab.count > 0 && (
                <span className="ml-2 px-2 py-1 text-xs bg-[#ffb81c] text-[#001f33] rounded-full">
                  {tab.count}
                </span>
              )}
            </button>
          ))}
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto popup-scrollbar p-6">
          {activeTab === 'overview' && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div>
                  <img
                    src={`./products/${productFamily}/main/0-overview/overview.jpg`}
                    alt="Product Overview"
                    className="w-full h-64 object-cover rounded-lg"
                    onError={(e) => {
                      const target = e.target as HTMLImageElement;
                      target.src = 'https://images.unsplash.com/photo-1518709268805-4e9042af2176?w=800&h=600&fit=crop';
                    }}
                  />
                </div>
                <div className="space-y-4">
                  <h3 className="text-xl font-semibold text-[#ffb81c]">Product Overview</h3>
                  <p className="text-gray-300 leading-relaxed">
                    {familyInfo.overviewDescription}
                  </p>
                  <div className="bg-[#001f33]/70 border border-white/20 rounded-lg p-4">
                    <h4 className="font-semibold text-white mb-2">Key Features</h4>
                    <ul className="space-y-2 text-sm text-gray-300">
                      <li className="flex items-start space-x-2">
                        <span className="text-[#ffb81c] mt-1">•</span>
                        <span>Advanced technology integration</span>
                      </li>
                      <li className="flex items-start space-x-2">
                        <span className="text-[#ffb81c] mt-1">•</span>
                        <span>Comprehensive solution suite</span>
                      </li>
                      <li className="flex items-start space-x-2">
                        <span className="text-[#ffb81c] mt-1">•</span>
                        <span>Industry-leading performance</span>
                      </li>
                      <li className="flex items-start space-x-2">
                        <span className="text-[#ffb81c] mt-1">•</span>
                        <span>Scalable architecture</span>
                      </li>
                    </ul>
                  </div>
                </div>
              </div>

              <div className="bg-[#001f33]/70 border border-white/20 rounded-lg p-6 text-center">
                <h3 className="text-xl font-semibold text-white mb-3">Interested in This Solution?</h3>
                <p className="text-gray-300 mb-4">
                  {contentConfig.general.contactMessage}
                </p>
                <div className="flex flex-col items-center space-y-3">
                  <img
                    src="./images/qrcode.png"
                    alt="Contact QR Code"
                    className="w-32 h-32 object-contain"
                    onError={(e) => {
                      const target = e.target as HTMLImageElement;
                      target.style.display = 'none';
                    }}
                  />
                  <p className="text-center">
                    or email us at <span style={{ color: '#ffb81c' }}>{contentConfig.general.emailAddress}</span>
                  </p>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'presentations' && (
            <div className="space-y-6">
              {presentations.length > 0 ? (
                <>
                  {presentations.length > 1 && (
                    <div className="flex flex-wrap gap-2 mb-4">
                      {presentations.map((pres, index) => (
                        <button
                          key={index}
                          onClick={() => {
                            setSelectedPresentation(index);
                            setCurrentSlide(0);
                          }}
                          className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                            selectedPresentation === index
                              ? 'bg-[#ffb81c] text-[#001f33]'
                              : 'bg-[#001f33]/70 text-white border border-white/20 hover:bg-[#001f33]/90'
                          }`}
                        >
                          {pres.name}
                        </button>
                      ))}
                    </div>
                  )}

                  {currentPresentation && (
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <h3 className="text-xl font-semibold text-[#ffb81c]">{currentPresentation.name}</h3>
                        <div className="text-sm text-gray-400">
                          Slide {currentSlide + 1} of {currentPresentation.slides!.length}
                        </div>
                      </div>

                      <div className="relative">
                        <img
                          src={currentPresentation.slides![currentSlide]}
                          alt={`Slide ${currentSlide + 1}`}
                          className="w-full max-h-96 object-contain bg-white rounded-lg"
                          onError={(e) => {
                            const target = e.target as HTMLImageElement;
                            target.src = 'https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=800&h=600&fit=crop';
                          }}
                        />

                        {currentPresentation.slides!.length > 1 && (
                          <>
                            <button
                              onClick={prevSlide}
                              disabled={currentSlide === 0}
                              className="absolute left-4 top-1/2 transform -translate-y-1/2 w-10 h-10 backdrop-blur-md bg-[#001f33]/90 border border-white/20 rounded-full flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed hover:bg-[#001f33]/95"
                            >
                              <ChevronLeft size={20} className="text-white" />
                            </button>
                            <button
                              onClick={nextSlide}
                              disabled={currentSlide === currentPresentation.slides!.length - 1}
                              className="absolute right-4 top-1/2 transform -translate-y-1/2 w-10 h-10 backdrop-blur-md bg-[#001f33]/90 border border-white/20 rounded-full flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed hover:bg-[#001f33]/95"
                            >
                              <ChevronRight size={20} className="text-white" />
                            </button>
                          </>
                        )}
                      </div>

                      <p className="text-gray-300 text-center">
                        {getPresentationDescription(selectedPresentation)}
                      </p>
                    </div>
                  )}
                </>
              ) : (
                <div className="text-center py-12">
                  <p className="text-gray-400">{contentConfig.general.noMediaMessage}</p>
                </div>
              )}
            </div>
          )}

          {activeTab === 'images' && (
            <div className="space-y-6">
              {images.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {images.map((image, index) => {
                    const imageContent = getImageContent(index);
                    return (
                      <div key={index} className="bg-[#001f33]/70 border border-white/20 rounded-lg overflow-hidden">
                        <div className="relative">
                          <img
                            src={image.path}
                            alt={imageContent.title}
                            className="w-full h-48 object-cover"
                            onError={(e) => {
                              const target = e.target as HTMLImageElement;
                              target.src = 'https://images.unsplash.com/photo-1518709268805-4e9042af2176?w=400&h=300&fit=crop';
                            }}
                          />
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              const overlay = document.createElement('div');
                              overlay.className = 'fixed inset-0 bg-black/90 flex items-center justify-center z-[999999]';
                              overlay.style.position = 'fixed';
                              overlay.style.top = '0';
                              overlay.style.left = '0';
                              overlay.style.width = '100vw';
                              overlay.style.height = '100vh';
                              overlay.style.zIndex = '999999';
                              
                              const fullscreenImg = document.createElement('img');
                              fullscreenImg.src = image.path;
                              fullscreenImg.className = 'max-w-full max-h-full object-contain';
                              
                              const closeButton = document.createElement('button');
                              closeButton.innerHTML = '×';
                              closeButton.className = 'absolute top-6 right-6 w-12 h-12 backdrop-blur-md bg-[#001f33]/90 border border-white/20 rounded-sm flex items-center justify-center shadow-lg text-white text-2xl hover:bg-[#001f33]/95';
                              closeButton.onclick = () => document.body.removeChild(overlay);
                              
                              overlay.appendChild(fullscreenImg);
                              overlay.appendChild(closeButton);
                              document.body.appendChild(overlay);
                              
                              overlay.addEventListener('click', (e) => {
                                if (e.target === overlay) {
                                  document.body.removeChild(overlay);
                                }
                              });
                            }}
                            className="absolute top-2 right-2 w-8 h-8 backdrop-blur-md bg-[#001f33]/90 border border-white/20 rounded-sm flex items-center justify-center shadow-md hover:bg-[#001f33]/95"
                            title="View fullscreen"
                          >
                            <Maximize2 size={16} className="text-white" />
                          </button>
                        </div>
                        <div className="p-4">
                          <div className="flex items-center space-x-3 mb-3">
                            {shouldShowLogos(productFamily) && (
                              <img
                                src={getLogoForProductFamily(productFamily, index)}
                                alt="Product Logo"
                                className="w-8 h-8 object-contain"
                                onError={(e) => {
                                  const target = e.target as HTMLImageElement;
                                  target.src = './images/logo.png';
                                }}
                              />
                            )}
                            <h3 className="text-lg font-semibold text-[#ffb81c]">{imageContent.title}</h3>
                          </div>
                          <p className="text-gray-300 text-sm">{imageContent.description}</p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              ) : (
                <div className="text-center py-12">
                  <p className="text-gray-400">{contentConfig.general.noMediaMessage}</p>
                </div>
              )}
            </div>
          )}

          {activeTab === 'videos' && (
            <div className="space-y-6">
              {videos.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {videos.map((video, index) => {
                    const videoContent = getVideoContent(index);
                    return (
                      <div key={index} className="bg-[#001f33]/70 border border-white/20 rounded-lg overflow-hidden">
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
                            src={video.path}
                            controls={false}
                            className="w-full h-48 object-cover cursor-pointer"
                            onError={(e) => {
                              const target = e.target as HTMLVideoElement;
                              target.style.display = 'none';
                              
                              const existingFallback = target.parentNode?.querySelector('.video-error-fallback');
                              if (!existingFallback) {
                                const fallback = document.createElement('div');
                                fallback.className = 'video-error-fallback flex items-center justify-center h-48 bg-gray-800 text-gray-400';
                                fallback.innerHTML = '<p>Video preview not available</p>';
                                target.parentNode?.appendChild(fallback);
                              }
                            }}
                          />
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
                              size={32} 
                              className="text-white ml-1 drop-shadow-lg" 
                              fill="white"
                              style={{ 
                                filter: 'drop-shadow(0 4px 8px rgba(0, 0, 0, 0.8))'
                              }}
                            />
                          </div>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              const video = e.currentTarget.parentElement?.querySelector('video') as HTMLVideoElement;
                              if (video) {
                                const overlay = document.createElement('div');
                                overlay.className = 'fixed inset-0 bg-black/90 flex items-center justify-center z-[999999]';
                                overlay.style.position = 'fixed';
                                overlay.style.top = '0';
                                overlay.style.left = '0';
                                overlay.style.width = '100vw';
                                overlay.style.height = '100vh';
                                overlay.style.zIndex = '999999';
                                
                                const fullscreenVideo = video.cloneNode(true) as HTMLVideoElement;
                                fullscreenVideo.controls = true;
                                fullscreenVideo.autoplay = true;
                                fullscreenVideo.className = 'w-full h-full object-contain';
                                fullscreenVideo.currentTime = video.currentTime;
                                
                                const closeButton = document.createElement('button');
                                closeButton.innerHTML = '×';
                                closeButton.className = 'absolute top-6 right-6 w-12 h-12 backdrop-blur-md bg-[#001f33]/90 border border-white/20 rounded-sm flex items-center justify-center shadow-lg text-white text-2xl hover:bg-[#001f33]/95';
                                closeButton.onclick = () => document.body.removeChild(overlay);
                                
                                overlay.appendChild(fullscreenVideo);
                                overlay.appendChild(closeButton);
                                document.body.appendChild(overlay);
                                
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
                            <Maximize2 size={16} className="text-white" />
                          </button>
                        </div>
                        <div className="p-4">
                          <div className="flex items-center space-x-3 mb-3">
                            {shouldShowLogos(productFamily) && (
                              <img
                                src={getLogoForProductFamily(productFamily, index)}
                                alt="Product Logo"
                                className="w-8 h-8 object-contain"
                                onError={(e) => {
                                  const target = e.target as HTMLImageElement;
                                  target.src = './images/logo.png';
                                }}
                              />
                            )}
                            <h3 className="text-lg font-semibold text-[#ffb81c]">{videoContent.title}</h3>
                          </div>
                          <p className="text-gray-300 text-sm">{videoContent.description}</p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              ) : (
                <div className="text-center py-12">
                  <p className="text-gray-400">{contentConfig.general.noMediaMessage}</p>
                </div>
              )}
            </div>
          )}

          {activeTab === 'documents' && (
            <div className="space-y-6">
              {documents.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {documents.map((doc, index) => (
                    <div key={index} className="bg-[#001f33]/70 border border-white/20 rounded-lg p-4">
                      <div className="mb-3">
                        <h3 className="text-lg font-semibold text-[#ffb81c] mb-3">{doc.name}</h3>
                      </div>
                      <div className="space-y-3">
                        {doc.slides?.map((slide, slideIndex) => (
                          <div key={slideIndex} className="relative">
                            <img
                              src={slide}
                              alt={`${doc.name} - Page ${slideIndex + 1}`}
                              className="w-full h-32 object-contain bg-white rounded cursor-pointer"
                              onClick={() => {
                                const overlay = document.createElement('div');
                                overlay.className = 'fixed inset-0 bg-black/90 flex items-center justify-center z-[999999]';
                                overlay.style.position = 'fixed';
                                overlay.style.top = '0';
                                overlay.style.left = '0';
                                overlay.style.width = '100vw';
                                overlay.style.height = '100vh';
                                overlay.style.zIndex = '999999';
                                
                                const fullscreenImg = document.createElement('img');
                                fullscreenImg.src = slide;
                                fullscreenImg.className = 'max-w-full max-h-full object-contain';
                                
                                const closeButton = document.createElement('button');
                                closeButton.innerHTML = '×';
                                closeButton.className = 'absolute top-6 right-6 w-12 h-12 backdrop-blur-md bg-[#001f33]/90 border border-white/20 rounded-sm flex items-center justify-center shadow-lg text-white text-2xl hover:bg-[#001f33]/95';
                                closeButton.onclick = () => document.body.removeChild(overlay);
                                
                                overlay.appendChild(fullscreenImg);
                                overlay.appendChild(closeButton);
                                document.body.appendChild(overlay);
                                
                                overlay.addEventListener('click', (e) => {
                                  if (e.target === overlay) {
                                    document.body.removeChild(overlay);
                                  }
                                });
                              }}
                              onError={(e) => {
                                const target = e.target as HTMLImageElement;
                                target.src = 'https://images.unsplash.com/photo-1568667256549-094345857637?w=400&h=300&fit=crop';
                              }}
                            />
                            <div className="absolute bottom-2 right-2 bg-black/70 text-white text-xs px-2 py-1 rounded">
                              Page {slideIndex + 1}
                            </div>
                          </div>
                        ))}
                      </div>
                      <p className="text-gray-300 text-sm mt-3">
                        {getDocumentDescription(index)}
                      </p>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12">
                  <p className="text-gray-400">{contentConfig.general.noMediaMessage}</p>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}