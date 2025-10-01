import React, { useState, useEffect } from 'react';
import { X, Presentation, ImageIcon, Video, FileText, Play, ChevronLeft, ChevronRight } from 'lucide-react';
import { contentConfig, getProductFamilyInfo, getImageContent, getVideoContent, getPresentationDescription, getDocumentDescription } from '../config/content';

interface MediaFile {
  name: string;
  path: string;
  type: 'image' | 'video' | 'presentation' | 'document';
}

interface ProductModalProps {
  isOpen: boolean;
  onClose: () => void;
  productName: string;
  productFamily: string;
  productImage: string;
}

export function ProductModal({ isOpen, onClose, productName, productFamily, productImage }: ProductModalProps) {
  const [activeTab, setActiveTab] = useState<'overview' | 'presentations' | 'images' | 'videos' | 'documents'>('overview');
  const [content, setContent] = useState<{
    overview: MediaFile[];
    presentations: MediaFile[];
    images: MediaFile[];
    videos: MediaFile[];
    documents: MediaFile[];
  }>({
    overview: [],
    presentations: [],
    images: [],
    videos: [],
    documents: []
  });
  const [loading, setLoading] = useState(true);
  const [currentPresentationIndex, setCurrentPresentationIndex] = useState(0);
  const [currentDocumentIndex, setCurrentDocumentIndex] = useState(0);
  const [currentSlideIndex, setCurrentSlideIndex] = useState(0);
  const [currentPageIndex, setCurrentPageIndex] = useState(0);
  const [fullscreenMedia, setFullscreenMedia] = useState<{
    type: 'video' | 'presentation' | 'document' | 'image' | null;
    src: string;
    title?: string;
  }>({ type: null, src: '' });

  const productInfo = getProductFamilyInfo(productFamily);

  useEffect(() => {
    if (isOpen) {
      loadProductContent();
    }
  }, [isOpen, productName, productFamily]);

  const loadProductContent = async () => {
    setLoading(true);
    try {
      const productContent = await getProductContent(productFamily, productName);
      setContent(productContent);
    } catch (error) {
      console.error('Error loading product content:', error);
    } finally {
      setLoading(false);
    }
  };

  const openFullscreen = (type: 'video' | 'presentation' | 'document' | 'image', src: string, title?: string) => {
    setFullscreenMedia({ type, src, title });
  };

  const closeFullscreen = () => {
    setFullscreenMedia({ type: null, src: '' });
  };

  if (!isOpen) return null;

  const hasContent = (type: keyof typeof content) => content[type].length > 0;
  const availableContentTypes = Object.keys(content).filter(type => 
    type !== 'overview' && hasContent(type as keyof typeof content)
  ) as Array<keyof typeof content>;

  return (
    <>
      <div className="fixed top-0 right-0 h-full w-1/3 backdrop-blur-md bg-[#001f33]/95 border-l border-white/20 shadow-2xl z-50 overflow-y-auto popup-scrollbar">
        <div className="p-6">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 transition-colors z-10"
            style={{ color: 'white' }}
          >
            <X size={20} />
          </button>
          
          <div className="mb-6">
            {productFamily !== 'akkodis-main' && (
              <div className="w-20 h-20 overflow-hidden p-2 mb-4">
                <img
                  src={productImage}
                  alt={productName}
                  className="w-24 h-24 object-contain"
                  draggable={false}
                  onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    target.src = './images/logo.png';
                  }}
                />
              </div>
            )}
            <h2 className="text-2xl font-bold text-white mb-2">{productName}</h2>
            <p className="text-lg text-gray-300 mb-4">{productInfo.description}</p>
          </div>

          {/* Tab Navigation */}
          <div className="flex flex-wrap gap-2 mb-6 border-b border-white/20 pb-4">
            <button
              onClick={() => setActiveTab('overview')}
              className={`flex items-center space-x-2 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                activeTab === 'overview'
                  ? 'bg-[#ffb81c] text-[#001f33]'
                  : 'bg-[#001f33]/70 text-white hover:bg-[#001f33]/90'
              }`}
            >
              <span>Overview</span>
            </button>
            
            {hasContent('presentations') && (
              <button
                onClick={() => setActiveTab('presentations')}
                className={`flex items-center space-x-2 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                  activeTab === 'presentations'
                    ? 'bg-[#ffb81c] text-[#001f33]'
                    : 'bg-[#001f33]/70 text-white hover:bg-[#001f33]/90'
                }`}
              >
                <Presentation size={16} />
                <span>Presentations</span>
              </button>
            )}
            
            {hasContent('images') && (
              <button
                onClick={() => setActiveTab('images')}
                className={`flex items-center space-x-2 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                  activeTab === 'images'
                    ? 'bg-[#ffb81c] text-[#001f33]'
                    : 'bg-[#001f33]/70 text-white hover:bg-[#001f33]/90'
                }`}
              >
                <ImageIcon size={16} />
                <span>Images</span>
              </button>
            )}
            
            {hasContent('videos') && (
              <button
                onClick={() => setActiveTab('videos')}
                className={`flex items-center space-x-2 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                  activeTab === 'videos'
                    ? 'bg-[#ffb81c] text-[#001f33]'
                    : 'bg-[#001f33]/70 text-white hover:bg-[#001f33]/90'
                }`}
              >
                <Video size={16} />
                <span>Videos</span>
              </button>
            )}
            
            {hasContent('documents') && (
              <button
                onClick={() => setActiveTab('documents')}
                className={`flex items-center space-x-2 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                  activeTab === 'documents'
                    ? 'bg-[#ffb81c] text-[#001f33]'
                    : 'bg-[#001f33]/70 text-white hover:bg-[#001f33]/90'
                }`}
              >
                <FileText size={16} />
                <span>Documents</span>
              </button>
            )}
          </div>

          {/* Content Area */}
          <div className="space-y-6">
            {loading ? (
              <div className="text-center py-8">
                <div className="text-white">{contentConfig.general.loadingMessage}</div>
              </div>
            ) : (
              <>
                {/* Overview Tab */}
                {activeTab === 'overview' && (
                  <div className="space-y-6">
                    {/* Overview Image */}
                    {hasContent('overview') && (
                      <div className="bg-[#001f33]/70 border border-white/20 rounded-lg p-4">
                        <h3 className="text-xl font-semibold text-[#ffb81c] mb-3">Overview</h3>
                        <div className="relative">
                          <img
                            src={content.overview[0]?.path}
                            alt="Product Overview"
                            className="w-full max-h-64 object-contain bg-[#001f33]/30 border border-white/10 rounded-lg cursor-pointer"
                            onClick={() => openFullscreen('image', content.overview[0]?.path, 'Product Overview')}
                            onError={(e) => {
                              const target = e.target as HTMLImageElement;
                              target.style.display = 'none';
                            }}
                          />
                          <button
                            onClick={() => openFullscreen('image', content.overview[0]?.path, 'Product Overview')}
                            className="absolute top-2 right-2 w-8 h-8 backdrop-blur-md bg-[#001f33]/90 border border-white/20 rounded-sm flex items-center justify-center shadow-md hover:bg-[#001f33]/95"
                            title="View fullscreen"
                          >
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2">
                              <path d="M8 3H5a2 2 0 0 0-2 2v3m18 0V5a2 2 0 0 0-2-2h-3m0 18h3a2 2 0 0 0 2-2v-3M3 16v3a2 2 0 0 0 2 2h3" />
                            </svg>
                          </button>
                        </div>
                      </div>
                    )}

                    {/* Product Description */}
                    <div className="bg-[#001f33]/70 border border-white/20 rounded-lg p-4">
                      <h3 className="text-xl font-semibold text-[#ffb81c] mb-3">About {productName}</h3>
                      <p className="text-gray-300 leading-relaxed mb-4">
                        {productInfo.overviewDescription}
                      </p>
                    </div>

                    {/* Available Content */}
                    {availableContentTypes.length > 0 && (
                      <div className="bg-[#001f33]/70 border border-white/20 rounded-lg p-4">
                        <h3 className="text-xl font-semibold text-[#ffb81c] mb-3">Available Content</h3>
                        <div className="grid grid-cols-2 gap-3">
                          {availableContentTypes.map((type) => (
                            <button
                              key={type}
                              onClick={() => setActiveTab(type)}
                              className="flex items-center space-x-2 p-3 bg-[#001f33]/50 border border-white/10 rounded-lg hover:bg-[#001f33]/70 transition-colors text-left"
                            >
                              {type === 'presentations' && <Presentation size={16} className="text-[#ffb81c]" />}
                              {type === 'images' && <ImageIcon size={16} className="text-[#ffb81c]" />}
                              {type === 'videos' && <Video size={16} className="text-[#ffb81c]" />}
                              {type === 'documents' && <FileText size={16} className="text-[#ffb81c]" />}
                              <div>
                                <div className="text-white font-medium capitalize">{type}</div>
                                <div className="text-gray-400 text-sm">{content[type].length} items</div>
                              </div>
                            </button>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Contact Section */}
                    <div className="bg-[#001f33]/70 border border-white/20 rounded-lg p-4 text-center">
                      <h3 className="text-lg font-semibold text-white mb-3">Interested in {productName}?</h3>
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
                )}

                {/* Presentations Tab */}
                {activeTab === 'presentations' && (
                  <div className="space-y-4">
                    <h3 className="text-xl font-semibold text-[#ffb81c]">Presentations</h3>
                    {content.presentations.length > 0 ? (
                      <div className="space-y-4">
                        {content.presentations.map((presentation, index) => (
                          <div key={index} className="bg-[#001f33]/70 border border-white/20 rounded-lg p-4">
                            <h4 className="text-lg font-semibold text-white mb-2">{presentation.name}</h4>
                            <p className="text-gray-300 text-sm mb-3">
                              {getPresentationDescription(index)}
                            </p>
                            <div className="relative">
                              <img
                                src={presentation.path}
                                alt={`${presentation.name} - Slide 1`}
                                className="w-full max-h-48 object-contain bg-[#001f33]/30 border border-white/10 rounded-lg cursor-pointer"
                                onClick={() => openFullscreen('presentation', presentation.path, presentation.name)}
                                onError={(e) => {
                                  const target = e.target as HTMLImageElement;
                                  target.style.display = 'none';
                                }}
                              />
                              <button
                                onClick={() => openFullscreen('presentation', presentation.path, presentation.name)}
                                className="absolute top-2 right-2 w-8 h-8 backdrop-blur-md bg-[#001f33]/90 border border-white/20 rounded-sm flex items-center justify-center shadow-md hover:bg-[#001f33]/95"
                                title="View fullscreen"
                              >
                                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2">
                                  <path d="M8 3H5a2 2 0 0 0-2 2v3m18 0V5a2 2 0 0 0-2-2h-3m0 18h3a2 2 0 0 0 2-2v-3M3 16v3a2 2 0 0 0 2 2h3" />
                                </svg>
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p className="text-gray-400">{contentConfig.general.noMediaMessage}</p>
                    )}
                  </div>
                )}

                {/* Images Tab */}
                {activeTab === 'images' && (
                  <div className="space-y-4">
                    <h3 className="text-xl font-semibold text-[#ffb81c]">Images</h3>
                    {content.images.length > 0 ? (
                      <div className="grid grid-cols-1 gap-4">
                        {content.images.map((image, index) => {
                          const imageContent = getImageContent(index);
                          return (
                            <div key={index} className="bg-[#001f33]/70 border border-white/20 rounded-lg p-4">
                              <h4 className="text-lg font-semibold text-white mb-2">{imageContent.title}</h4>
                              <p className="text-gray-300 text-sm mb-3">
                                {imageContent.description}
                              </p>
                              <div className="relative">
                                <img
                                  src={image.path}
                                  alt={imageContent.title}
                                  className="w-full max-h-48 object-contain bg-[#001f33]/30 border border-white/10 rounded-lg cursor-pointer"
                                  onClick={() => openFullscreen('image', image.path, imageContent.title)}
                                  onError={(e) => {
                                    const target = e.target as HTMLImageElement;
                                    target.style.display = 'none';
                                  }}
                                />
                                <button
                                  onClick={() => openFullscreen('image', image.path, imageContent.title)}
                                  className="absolute top-2 right-2 w-8 h-8 backdrop-blur-md bg-[#001f33]/90 border border-white/20 rounded-sm flex items-center justify-center shadow-md hover:bg-[#001f33]/95"
                                  title="View fullscreen"
                                >
                                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2">
                                    <path d="M8 3H5a2 2 0 0 0-2 2v3m18 0V5a2 2 0 0 0-2-2h-3m0 18h3a2 2 0 0 0 2-2v-3M3 16v3a2 2 0 0 0 2 2h3" />
                                  </svg>
                                </button>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    ) : (
                      <p className="text-gray-400">{contentConfig.general.noMediaMessage}</p>
                    )}
                  </div>
                )}

                {/* Videos Tab */}
                {activeTab === 'videos' && (
                  <div className="space-y-4">
                    <h3 className="text-xl font-semibold text-[#ffb81c]">Videos</h3>
                    {content.videos.length > 0 ? (
                      <div className="space-y-4">
                        {content.videos.map((video, index) => {
                          const videoContent = getVideoContent(index);
                          return (
                            <div key={index} className="bg-[#001f33]/70 border border-white/20 rounded-lg p-4">
                              <h4 className="text-lg font-semibold text-white mb-2">{videoContent.title}</h4>
                              <p className="text-gray-300 text-sm mb-3">
                                {videoContent.description}
                              </p>
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
                                  className="w-full max-h-48 object-contain bg-[#001f33]/30 border border-white/10 rounded-lg cursor-pointer"
                                  style={{ aspectRatio: 'auto' }}
                                  onError={(e) => {
                                    const target = e.target as HTMLVideoElement;
                                    target.style.display = 'none';
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
                                    size={24} 
                                    className="text-white ml-1 drop-shadow-lg" 
                                    fill="white"
                                    style={{ 
                                      filter: 'drop-shadow(0 4px 8px rgba(0, 0, 0, 0.8))'
                                    }}
                                  />
                                </div>
                                <button
                                  onClick={() => openFullscreen('video', video.path, videoContent.title)}
                                  className="absolute top-2 right-2 w-8 h-8 backdrop-blur-md bg-[#001f33]/90 border border-white/20 rounded-sm flex items-center justify-center shadow-md hover:bg-[#001f33]/95"
                                  title="View fullscreen"
                                >
                                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2">
                                    <path d="M8 3H5a2 2 0 0 0-2 2v3m18 0V5a2 2 0 0 0-2-2h-3m0 18h3a2 2 0 0 0 2-2v-3M3 16v3a2 2 0 0 0 2 2h3" />
                                  </svg>
                                </button>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    ) : (
                      <p className="text-gray-400">{contentConfig.general.noMediaMessage}</p>
                    )}
                  </div>
                )}

                {/* Documents Tab */}
                {activeTab === 'documents' && (
                  <div className="space-y-4">
                    <h3 className="text-xl font-semibold text-[#ffb81c]">Documents</h3>
                    {content.documents.length > 0 ? (
                      <div className="space-y-4">
                        {content.documents.map((document, index) => (
                          <div key={index} className="bg-[#001f33]/70 border border-white/20 rounded-lg p-4">
                            <h4 className="text-lg font-semibold text-white mb-2">{document.name}</h4>
                            <p className="text-gray-300 text-sm mb-3">
                              {getDocumentDescription(index)}
                            </p>
                            <div className="relative">
                              <img
                                src={document.path}
                                alt={`${document.name} - Page 1`}
                                className="w-full max-h-48 object-contain bg-[#001f33]/30 border border-white/10 rounded-lg cursor-pointer"
                                onClick={() => openFullscreen('document', document.path, document.name)}
                                onError={(e) => {
                                  const target = e.target as HTMLImageElement;
                                  target.style.display = 'none';
                                }}
                              />
                              <button
                                onClick={() => openFullscreen('document', document.path, document.name)}
                                className="absolute top-2 right-2 w-8 h-8 backdrop-blur-md bg-[#001f33]/90 border border-white/20 rounded-sm flex items-center justify-center shadow-md hover:bg-[#001f33]/95"
                                title="View fullscreen"
                              >
                                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2">
                                  <path d="M8 3H5a2 2 0 0 0-2 2v3m18 0V5a2 2 0 0 0-2-2h-3m0 18h3a2 2 0 0 0 2-2v-3M3 16v3a2 2 0 0 0 2 2h3" />
                                </svg>
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p className="text-gray-400">{contentConfig.general.noMediaMessage}</p>
                    )}
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>

      {/* Fullscreen Overlays */}
      {fullscreenMedia.type && (
        <div 
          className="fixed inset-0 bg-black/90 flex items-center justify-center"
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            width: '100vw',
            height: '100vh',
            zIndex: 999999
          }}
          onClick={closeFullscreen}
        >
          {/* Close button */}
          <button
            onClick={closeFullscreen}
            className="absolute top-6 right-6 w-12 h-12 backdrop-blur-md bg-[#001f33]/90 border border-white/20 rounded-sm flex items-center justify-center shadow-lg text-white text-2xl hover:bg-[#001f33]/95 z-10"
          >
            ×
          </button>

          {/* Video Fullscreen */}
          {fullscreenMedia.type === 'video' && (
            <video
              src={fullscreenMedia.src}
              controls
              autoPlay
              className="max-w-full max-h-full object-contain"
              onClick={(e) => e.stopPropagation()}
            />
          )}

          {/* Image/Presentation/Document Fullscreen */}
          {(fullscreenMedia.type === 'image' || fullscreenMedia.type === 'presentation' || fullscreenMedia.type === 'document') && (
            <img
              src={fullscreenMedia.src}
              alt={fullscreenMedia.title || 'Fullscreen content'}
              className="max-w-full max-h-full object-contain"
              onClick={(e) => e.stopPropagation()}
            />
          )}
        </div>
      )}
    </>
  );
}

// Helper function to get product content
async function getProductContent(productFamily: string, productName: string) {
  const basePath = `./products/${productFamily}/main`;
  
  const content = {
    overview: [] as MediaFile[],
    presentations: [] as MediaFile[],
    images: [] as MediaFile[],
    videos: [] as MediaFile[],
    documents: [] as MediaFile[]
  };

  // Helper function to check if file exists
  const checkFileExists = async (path: string): Promise<boolean> => {
    try {
      const response = await fetch(path, { method: 'HEAD' });
      return response.ok;
    } catch {
      return false;
    }
  };

  // Load overview
  const overviewPath = `${basePath}/0-overview/overview.jpg`;
  if (await checkFileExists(overviewPath)) {
    content.overview.push({
      name: 'Overview',
      path: overviewPath,
      type: 'image'
    });
  }

  // Load presentations
  for (let i = 1; i <= 5; i++) {
    const presentationPath = `${basePath}/1-presentation/presentation${i}/Slide1.PNG`;
    if (await checkFileExists(presentationPath)) {
      content.presentations.push({
        name: `Presentation ${i}`,
        path: presentationPath,
        type: 'presentation'
      });
    }
  }

  // Load images
  for (let i = 1; i <= 15; i++) {
    const imagePath = `${basePath}/2-images/image${i}.jpg`;
    if (await checkFileExists(imagePath)) {
      content.images.push({
        name: `Image ${i}`,
        path: imagePath,
        type: 'image'
      });
    }
  }

  // Load videos
  for (let i = 1; i <= 10; i++) {
    const videoPath = `${basePath}/3-videos/video${i}.mp4`;
    const webmPath = `${basePath}/3-videos/video${i}.webm`;
    
    if (await checkFileExists(videoPath)) {
      content.videos.push({
        name: `Video ${i}`,
        path: videoPath,
        type: 'video'
      });
    } else if (await checkFileExists(webmPath)) {
      content.videos.push({
        name: `Video ${i}`,
        path: webmPath,
        type: 'video'
      });
    }
  }

  // Load documents
  for (let i = 1; i <= 5; i++) {
    const documentPath = `${basePath}/4-documents/document${i}/page1.jpg`;
    if (await checkFileExists(documentPath)) {
      content.documents.push({
        name: `Document ${i}`,
        path: documentPath,
        type: 'document'
      });
    }
  }

  return content;
}