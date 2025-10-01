import React, { useState, useEffect } from 'react';
import { X, ChevronLeft, ChevronRight, FileText, Image as ImageIcon, Video, Presentation, Maximize2, Play } from 'lucide-react';
import { Document, Page, pdfjs } from 'react-pdf';
import { 
  contentConfig, 
  getProductFamilyInfo, 
  getImageContent, 
  getVideoContent, 
  getPresentationDescription, 
  getDocumentDescription 
} from '../config/content';
import 'react-pdf/dist/Page/AnnotationLayer.css';
import 'react-pdf/dist/Page/TextLayer.css';

// Set up PDF.js worker
pdfjs.GlobalWorkerOptions.workerSrc = new URL('pdfjs-dist/build/pdf.worker.mjs', import.meta.url).toString();

// Function to get AI-Core logo for a given index
const getAICoreLogoForIndex = (index: number): string => {
  const logos = [
    './products/ai-core/main/0-logos/AId-min.png',        // 0
    './products/ai-core/main/0-logos/ChatNow-min.png',    // 1
    './products/ai-core/main/0-logos/TestAId-min.png',    // 2
    './products/ai-core/main/0-logos/TestAId-min.png',    // 3
    './products/ai-core/main/0-logos/TestAId-min.png',    // 4
    './products/ai-core/main/0-logos/TestAId-min.png',    // 5
    './products/ai-core/main/0-logos/TestAId-min.png',    // 6
    './products/ai-core/main/0-logos/TestAId-min.png',    // 7
    './products/ai-core/main/0-logos/TestAId-min.png',    // 8
    './products/ai-core/main/0-logos/TestAId-min.png',    // 9
    './products/ai-core/main/0-logos/AId-min.png',        // 10
    './products/ai-core/main/0-logos/TestAId-min.png',    // 11
    './products/ai-core/main/0-logos/TestAId-min.png',    // 12
    './products/ai-core/main/0-logos/Meta-min.png'        // 13
  ];
  return logos[index % logos.length];
};

// Function to get AI-Core logo for videos with different order
const getAICoreLogoForVideoIndex = (index: number): string => {
  const logos = [
    './products/ai-core/main/0-logos/AId-min.png',        // 0 - video 1
    './products/ai-core/main/0-logos/AId-min.png',        // 1 - video 2
    './products/ai-core/main/0-logos/AId-min.png',        // 2 - video 3
    './products/ai-core/main/0-logos/Meta-min.png',       // 3 - video 4
    './products/ai-core/main/0-logos/TestAId-min.png',    // 4 - video 5
    './products/ai-core/main/0-logos/TestAId-min.png'     // 5 - video 6
  ];
  return logos[index % logos.length];
};

// Function to get NetComm logo for a given index
const getNetCommLogoForIndex = (index: number): string => {
  const logos = [
    './products/netcomm/main/0-logos/logo1.png',         // 0
    './products/netcomm/main/0-logos/logo2.png',         // 1
    './products/netcomm/main/0-logos/logo3.png'          // 2
  ];
  return logos[index % logos.length];
};

interface ProductModalProps {
  isOpen: boolean;
  onClose: () => void;
  productName: string;
  productFamily: string;
  productImage: string;
}

// Mapping of family IDs to display names
const familyDisplayNames: Record<string, string> = {
  'ai-core': 'AI-Core Platform',
  'netcomm': 'NetComm Validation',
  'provetech': 'PROVEtech Tool Suite',
  'gigaboxes': 'Gigaboxes',
  'energy-solutions': 'Energy Solutions'
};

interface MediaFile {
  name: string;
  path: string;
  type: 'image' | 'video' | 'document' | 'presentation';
}

interface ProductContent {
  presentations: PresentationGroup[];
  images: MediaFile[];
  videos: MediaFile[];
  documents: DocumentGroup[];
}

interface PresentationGroup {
  name: string;
  slides: MediaFile[];
}

interface DocumentGroup {
  name: string;
  pages: MediaFile[];
}

// Comprehensive mapping of all known files in the directory structure
const getProductContent = (productFamily: string, productName: string): ProductContent => {
  // For main products, use the family-level directory structure
  const basePath = productFamily === 'akkodis-main' ? './products/akkodis' : `./products/${productFamily}`;
  
  // Consolidated presentations for main products
  const presentationFiles: Record<string, Record<string, { folder: string; files: string[] }[]>> = {
    'akkodis-main': {
      'Akkodis Main': [
        { folder: 'main/1-presentation/presentation1', files: ['Slide1.PNG', 'Slide2.PNG', 'Slide3.PNG'], name: '20250805_Akkodis' }
      ]
    },
    'ai-core': {
      'AI-Core Platform': [
        { folder: 'main/1-presentation/presentation1', files: ['Slide1.PNG', 'Slide2.PNG', 'Slide3.PNG', 'Slide4.PNG', 'Slide5.PNG', 'Slide6.PNG', 'Slide7.PNG', 'Slide8.PNG', 'Slide9.PNG', 'Slide10.PNG', 'Slide11.PNG', 'Slide12.PNG', 'Slide13.PNG', 'Slide14.PNG', 'Slide15.PNG', 'Slide16.PNG', 'Slide17.PNG', 'Slide18.PNG', 'Slide19.PNG', 'Slide20.PNG', 'Slide21.PNG', 'Slide22.PNG', 'Slide23.PNG', 'Slide24.PNG', 'Slide25.PNG', 'Slide26.PNG', 'Slide27.PNG', 'Slide28.PNG', 'Slide29.PNG', 'Slide30.PNG'], name: 'AI-Core Virtual Demonstrator Input' },
        { folder: 'main/1-presentation/presentation2', files: ['Slide1.PNG', 'Slide2.PNG', 'Slide3.PNG', 'Slide4.PNG', 'Slide5.PNG', 'Slide6.PNG', 'Slide7.PNG', 'Slide8.PNG', 'Slide9.PNG', 'Slide10.PNG'], name: 'AI-Core - Transforming Industries' },
        { folder: 'main/1-presentation/presentation3', files: ['Slide1.PNG', 'Slide2.PNG', 'Slide3.PNG', 'Slide4.PNG', 'Slide5.PNG', 'Slide6.PNG', 'Slide7.PNG', 'Slide8.PNG', 'Slide9.PNG'], name: 'One_pager_SalesEnablement2' }
      ]
    },
    'netcomm': {
      'NetComm Validation': [
        { folder: 'main/1-presentation/presentation1', files: ['Slide1.PNG', 'Slide2.PNG', 'Slide3.PNG', 'Slide4.PNG', 'Slide5.PNG', 'Slide6.PNG', 'Slide7.PNG', 'Slide8.PNG', 'Slide9.PNG', 'Slide10.PNG'], name: 'NetComm Validation Virtual Demonstrator Input' }
      ]
    },
    'provetech': {
      'PROVEtech Tool Suite': [
        { folder: 'main/1-presentation/presentation1', files: ['Slide1.PNG', 'Slide2.PNG', 'Slide3.PNG', 'Slide4.PNG', 'Slide5.PNG', 'Slide6.PNG'], name: 'PROVEtech Input Demonstrator' }
      ]
    },
    'gigaboxes': {
      'Gigaboxes': [
      ]
    },
    'energy-solutions': {
      'Energy Solutions': [
        { folder: 'main/1-presentation/presentation1', files: ['Slide1.PNG', 'Slide2.PNG', 'Slide3.PNG', 'Slide4.PNG', 'Slide5.PNG', 'Slide6.PNG'], name: '20250805 Akkodis EVAcharge General' }
      ]
    }
  };

  // Known images for products
  const imageFiles: Record<string, Record<string, string[]>> = {
    'akkodis-main': {
      'Akkodis Main': []
    },
    'ai-core': {
      'AI-Core Platform': [
        'main/2-images/image1.jpg', 'main/2-images/image1-2.jpg', 'main/2-images/image2.jpg', 'main/2-images/image3.jpg',
        'main/2-images/image4.jpg', 'main/2-images/image5.jpg', 'main/2-images/image6.jpg', 'main/2-images/image7.jpg',
        'main/2-images/image8.jpg', 'main/2-images/image9.jpg', 'main/2-images/image10.jpg', 'main/2-images/image11.jpg',
        'main/2-images/image12.jpg', 'main/2-images/image13.jpg'
      ]
    },
    'netcomm': {
      'NetComm Validation': [
        'main/2-images/image1.jpg', 'main/2-images/image2.jpg', 'main/2-images/image3.webp'
      ]
    },
    'provetech': {
      'PROVEtech Tool Suite': []
    },
    'gigaboxes': {
      'Gigaboxes': []
    },
    'energy-solutions': {
      'Energy Solutions': [
        'main/2-images/image1.jpg', 'main/2-images/image2.jpg', 'main/2-images/image3.jpg', 'main/2-images/image4.jpg'
      ]
    }
  };

  // Known videos for products (add as files become available)
  const videoFiles: Record<string, Record<string, string[]>> = {
    'akkodis-main': {
      'Akkodis Main': []
    },
    'ai-core': {
      'AI-Core Platform': [
        'main/3-videos/video1.webm', 'main/3-videos/Video2.mp4', 'main/3-videos/video3.mp4', 
        'main/3-videos/video1.mp4', 'main/3-videos/Video4.mp4', 'main/3-videos/Video5.mp4'
      ]
    },
    'netcomm': {
      'NetComm Validation': []
    },
    'provetech': {
      'PROVEtech Tool Suite': []
    },
    'gigaboxes': {
      'Gigaboxes': []
    },
    'energy-solutions': {
      'Energy Solutions': [
        'main/3-videos/video1.webm', 'main/3-videos/video2.webm', 'main/3-videos/video3.webm', 
        'main/3-videos/video4.webm', 'main/3-videos/video5.webm'
      ]
    }
  };

  // Known documents for products (add as files become available)
  const documentFiles: Record<string, Record<string, { folder: string; files: string[] }[]>> = {
    'akkodis-main': {
      'Akkodis Main': []
    },
    'ai-core': {
      'AI-Core Platform': []
    },
    'netcomm': {
      'NetComm Validation': []
    },
    'provetech': {
      'PROVEtech Tool Suite': []
    },
    'energy-solutions': {
      'Energy Solutions': [
        { folder: 'main/4-documents/document1', files: ['Gigabox Lion EN-1.jpg', 'Gigabox Lion EN-2.jpg'] },
        { folder: 'main/4-documents/document2', files: ['Gigabox Lion DE-1.jpg', 'Gigabox Lion DE-2.jpg'] },
        { folder: 'main/4-documents/document3', files: ['Gigabox Puma EN-1.jpg', 'Gigabox Puma EN-2.jpg'] },
        { folder: 'main/4-documents/document4', files: ['Gigabox Puma DE-1.jpg', 'Gigabox Puma DE-2.jpg'] }
      ]
    }
  };

  // Custom titles for images and videos
  const getCustomContent = (index: number, type: 'image' | 'video') => {
    if (type === 'image') {
      return getImageContent(index);
    } else {
      return getVideoContent(index);
    }
  };

  // Build the content structure
  const content: ProductContent = {
    presentations: [],
    images: [],
    videos: [],
    documents: []
  };

  // Debug logging
  console.log('=== PRODUCT CONTENT DEBUG ===');
  console.log('Product Family:', productFamily);
  console.log('Product Name:', productName);
  console.log('Base Path:', basePath);
  console.log('============================');
  // Get presentations
  const familyPresentations = presentationFiles[productFamily];
  if (familyPresentations && familyPresentations[productName]) {
    familyPresentations[productName].forEach((presentation, index) => {
      const slides: MediaFile[] = [];
      presentation.files.forEach(file => {
        const fullPath = `${basePath}/${presentation.folder}/${file}`;
        console.log('Adding slide:', fullPath);
        slides.push({
          name: file,
          path: fullPath,
          type: 'presentation'
        });
      });
      content.presentations.push({
        name: presentation.name || (presentation.folder.includes('main/') 
          ? `Presentation ${presentation.folder.split('/')[1] || (index + 1)}`
          : presentation.folder.split('/')[0] || `Presentation ${index + 1}`),
        slides: slides
      });
    });
  }

  // Get images
  const familyImages = imageFiles[productFamily];
  if (familyImages && familyImages[productName]) {
    familyImages[productName].forEach((file, index) => {
      const imageContent = getCustomContent(index, 'image');
      content.images.push({
        name: imageContent.title,
        path: `${basePath}/${file}`,
        type: 'image'
      });
    });
  }

  // Get videos
  const familyVideos = videoFiles[productFamily];
  if (familyVideos && familyVideos[productName]) {
    familyVideos[productName].forEach((file, index) => {
      const videoContent = getCustomContent(index, 'video');
      content.videos.push({
        name: videoContent.title,
        path: `${basePath}/${file}`,
        type: 'video'
      });
    });
  }

  // Get documents
  const familyDocuments = documentFiles[productFamily];
  if (familyDocuments && familyDocuments[productName]) {
    familyDocuments[productName].forEach((document, index) => {
      const pages: MediaFile[] = [];
      document.files.forEach(file => {
        pages.push({
          name: file,
          path: `${basePath}/${document.folder}/${file}`,
          type: 'document'
        });
      });
      content.documents.push({
        name: (() => {
          const folderName = document.folder.split('/').pop() || '';
          switch (folderName) {
            case 'document1': return 'Gigabox Lion EN';
            case 'document2': return 'Gigabox Lion DE';
            case 'document3': return 'Gigabox Puma EN';
            case 'document4': return 'Gigabox Puma DE';
            default: return `Document ${index + 1}`;
          }
        })(),
        pages: pages
      });
    });
  }

  return content;
};

export function ProductModal({ isOpen, onClose, productName, productFamily, productImage }: ProductModalProps) {
  const [activeTab, setActiveTab] = useState<'overview' | 'presentations' | 'images' | 'videos' | 'documents'>('overview');
  const [content, setContent] = useState<ProductContent>({
    presentations: [],
    images: [],
    videos: [],
    documents: []
  });
  const [selectedMediaIndex, setSelectedMediaIndex] = useState(0);
  const [presentationIndices, setPresentationIndices] = useState<number[]>([]);
  const [documentIndices, setDocumentIndices] = useState<number[]>([]);
  const [loading, setLoading] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [currentPresentationGroup, setCurrentPresentationGroup] = useState<number>(0);
  const [currentDocumentGroup, setCurrentDocumentGroup] = useState<number>(0);
  const [overviewImage, setOverviewImage] = useState<string>(productImage);
  const [numPages, setNumPages] = useState<number | null>(null);
  const [pageNumber, setPageNumber] = useState<number>(1);
  const [pdfError, setPdfError] = useState<boolean>(false);

  useEffect(() => {
    if (isOpen && productName && productFamily) {
      // Always start with overview tab when opening modal
      setActiveTab('overview');
      
      setLoading(true);
      // Get content synchronously since we have the file mappings
      const productContent = getProductContent(productFamily, productName);
      setContent(productContent);
      
      // Initialize presentation indices
      setPresentationIndices(new Array(productContent.presentations.length).fill(0));
      
      // Check for overview image
      const overviewImagePath = productFamily === 'ai-core' 
        ? `./products/${productFamily}/main/0-overview/overview.jpg`
        : productFamily === 'provetech'
        ? `./products/${productFamily}/main/0-overview/overview.jpg`
        : productFamily === 'netcomm'
        ? `./products/${productFamily}/main/0-overview/overview.jpg`
        : productFamily === 'energy-solutions'
        ? `./products/${productFamily}/main/0-overview/overview.jpg`
        : productFamily === 'akkodis-main'
        ? `./products/akkodis/main/0-overview/overview.jpg`
        : `./products/${productFamily}/main/0-overview/overview.jpg`;
      const img = new Image();
      img.onload = () => {
        setOverviewImage(overviewImagePath);
      };
      img.onerror = () => {
        setOverviewImage(productImage); // Fallback to regular product image
      };
      img.src = overviewImagePath;
      
      setLoading(false);
    }
  }, [isOpen, productName, productFamily]);

  useEffect(() => {
    // Reset media index when switching tabs
    setSelectedMediaIndex(0);
    setPresentationIndices(new Array(content.presentations.length).fill(0));
    setDocumentIndices(new Array(content.documents.length).fill(0));
    setIsFullscreen(false);
    setPageNumber(1);
    setNumPages(null);
    setPdfError(false);
  }, [activeTab]);

  if (!isOpen) return null;

  const getCurrentMediaList = () => {
    switch (activeTab) {
      case 'presentations':
        // Return only slides from the current presentation group
        return content.presentations[currentPresentationGroup]?.slides || [];
      case 'images':
        return content.images;
      case 'videos':
        return content.videos;
      case 'documents':
        // Return only pages from the current document group
        return content.documents[currentDocumentGroup]?.pages || [];
      default:
        return [];
    }
  };

  const currentMediaList = getCurrentMediaList();
  const currentMedia = currentMediaList[selectedMediaIndex];

  const updatePresentationIndex = (groupIndex: number, newIndex: number) => {
    const newIndices = [...presentationIndices];
    newIndices[groupIndex] = newIndex;
    setPresentationIndices(newIndices);
  };

  const updateDocumentIndex = (groupIndex: number, newIndex: number) => {
    const newIndices = [...documentIndices];
    newIndices[groupIndex] = newIndex;
    setDocumentIndices(newIndices);
  };

  const nextMedia = () => {
    setSelectedMediaIndex((prev) => (prev + 1) % currentMediaList.length);
  };

  const prevMedia = () => {
    setSelectedMediaIndex((prev) => (prev - 1 + currentMediaList.length) % currentMediaList.length);
  };

  const toggleFullscreen = () => {
    setIsFullscreen(!isFullscreen);
  };

  const onDocumentLoadSuccess = ({ numPages }: { numPages: number }) => {
    setNumPages(numPages);
    setPdfError(false);
  };

  const onDocumentLoadError = (error: any) => {
    console.error('PDF loading error:', error);
    setPdfError(true);
  };

  const renderPresentationSliders = () => {
    if (content.presentations.length === 0) {
      return (
        <div className="flex flex-col items-center justify-center h-96 bg-[#001f33]/50 border border-white/10 rounded-lg">
          <div className="text-center">
            <Presentation size={64} className="mx-auto mb-4 text-gray-500" />
            <p className="text-gray-400">No presentations available</p>
          </div>
        </div>
      );
    }

    return (
      <div className="space-y-6">
        {content.presentations.map((presentationGroup, groupIndex) => {
          const currentSlideIndex = presentationIndices[groupIndex] || 0;
          const currentSlide = presentationGroup.slides[currentSlideIndex];
          
          const nextSlide = () => {
            const newIndex = (currentSlideIndex + 1) % presentationGroup.slides.length;
            updatePresentationIndex(groupIndex, newIndex);
          };
          
          const prevSlide = () => {
            const newIndex = (currentSlideIndex - 1 + presentationGroup.slides.length) % presentationGroup.slides.length;
            updatePresentationIndex(groupIndex, newIndex);
          };

          return (
            <div key={groupIndex} className="space-y-3">
              <div className="bg-[#001f33]/70 border border-white/20 rounded-lg p-4">
                <h4 className="text-lg font-semibold text-[#ffb81c] capitalize mb-2">
                  {presentationGroup.name}
                </h4>
                <p className="text-sm text-gray-300 mb-4">{getPresentationDescription(groupIndex)}</p>
                <div className="relative">
                  <img
                    src={currentSlide.path}
                    alt={currentSlide.name}
                    className="w-full max-h-80 object-contain bg-[#001f33]/30 border border-white/10 rounded-lg"
                    style={{ aspectRatio: 'auto' }}
                    onLoad={() => console.log('✅ Slide loaded:', currentSlide.path)}
                    onError={(e) => {
                      const target = e.target as HTMLImageElement;
                      console.error('❌ Failed to load slide:', currentSlide.path);
                      target.src = productImage;
                    }}
                  />
                  <button
                    onClick={toggleFullscreen}
                    className="absolute top-2 right-2 w-8 h-8 backdrop-blur-md bg-[#001f33]/90 border border-white/20 rounded-sm flex items-center justify-center shadow-md hover:bg-[#001f33]/95"
                    title="View fullscreen"
                  >
                    <Maximize2 size={16} color="white" />
                  </button>
                  {presentationGroup.slides.length > 1 && (
                    <>
                      <button
                        onClick={prevSlide}
                        className="absolute left-2 top-1/2 transform -translate-y-1/2 w-7 h-7 backdrop-blur-md bg-[#001f33]/90 border border-white/20 rounded-sm flex items-center justify-center shadow-md hover:bg-[#001f33]/95"
                      >
                        <ChevronLeft size={16} color="white" />
                      </button>
                      <button
                        onClick={nextSlide}
                        className="absolute right-2 top-1/2 transform -translate-y-1/2 w-7 h-7 backdrop-blur-md bg-[#001f33]/90 border border-white/20 rounded-sm flex items-center justify-center shadow-md hover:bg-[#001f33]/95"
                      >
                        <ChevronRight size={16} color="white" />
                      </button>
                    </>
                  )}
                </div>
                <div className="flex justify-between items-center mt-3">
                  <span className="text-sm text-gray-400">
                    Slide {currentSlideIndex + 1} of {presentationGroup.slides.length}
                  </span>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    );
  };

  // Helper function to get the appropriate logo based on product family and index
  const getLogoForMedia = (index: number, mediaType: 'image' | 'video' = 'image') => {
    if (productFamily === 'ai-core') {
      return mediaType === 'video' 
        ? getAICoreLogoForVideoIndex(index)
        : getAICoreLogoForIndex(index);
    } else if (productFamily === 'netcomm') {
      return getNetCommLogoForIndex(index);
    } else {
      // Fallback to AI-Core logos for other product families
      return mediaType === 'video' 
        ? getAICoreLogoForVideoIndex(index)
        : getAICoreLogoForIndex(index);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="backdrop-blur-md bg-[#001f33]/95 border border-white/20 rounded-xl max-w-6xl w-full max-h-[90vh] overflow-hidden flex">
        {/* Left Panel - Navigation */}
        <div className="w-1/3 border-r border-white/20 flex flex-col">
          {/* Header */}
          <div className="p-6 border-b border-white/20">
            <button
              onClick={onClose}
              className="absolute top-4 right-4 transition-colors z-10"
              style={{ color: 'white' }}
            >
              <X size={20} />
            </button>
            
            <div className="flex items-center space-x-4 mb-4">
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
                <h2 className="text-2xl font-bold text-white">{productName}</h2>
                <p className="text-sm text-gray-300">{familyDisplayNames[productFamily] || productFamily}</p>
              </div>
            </div>
          </div>

          {/* Tab Navigation */}
          <div className="flex-1 overflow-y-auto popup-scrollbar">
            <div className="p-4 space-y-2">
              {[
                { id: 'overview', label: 'Overview', icon: FileText },
                { id: 'presentations', label: 'Presentations', icon: Presentation },
                { id: 'images', label: 'Images', icon: ImageIcon },
                { id: 'videos', label: 'Videos', icon: Video },
                { id: 'documents', label: 'Documents', icon: FileText }
              ].map(({ id, label, icon: Icon }) => (
                <button
                  key={id}
                  onClick={() => setActiveTab(id as any)}
                  className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors ${
                    activeTab === id
                      ? 'bg-[#ffb81c] text-[#001f33]'
                      : 'text-white hover:bg-white/10'
                  }`}
                >
                  <Icon size={20} />
                  <span className="font-medium">{label}</span>
                  {id === 'presentations' && content.presentations.length > 0 && (
                    <span className="ml-auto bg-white/20 text-xs px-2 py-1 rounded-full">
                      {content.presentations.length}
                    </span>
                  )}
                  {id === 'images' && content.images.length > 0 && (
                    <span className="ml-auto bg-white/20 text-xs px-2 py-1 rounded-full">
                      {content.images.length}
                    </span>
                  )}
                  {id === 'videos' && content.videos.length > 0 && (
                    <span className="ml-auto bg-white/20 text-xs px-2 py-1 rounded-full">
                      {content.videos.length}
                    </span>
                  )}
                  {id === 'documents' && content.documents.length > 0 && (
                    <span className="ml-auto bg-white/20 text-xs px-2 py-1 rounded-full">
                      {content.documents.length}
                    </span>
                  )}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Right Panel - Content */}
        <div className="flex-1 flex flex-col overflow-hidden">
          <div className="flex-1 overflow-y-auto popup-scrollbar p-6">
            {activeTab === 'overview' && (
              <div className="space-y-6">
                <div className="text-center">
                  <img
                    src={overviewImage}
                    alt={`${productName} Overview`}
                    className="w-full max-h-64 object-contain mb-4 bg-[#001f33]/30 border border-white/10 rounded-lg"
                    onError={(e) => {
                      const target = e.target as HTMLImageElement;
                      target.src = productImage;
                    }}
                  />
                  <h3 className="text-2xl font-bold text-white mb-2">{productName}</h3>
                  <p className="text-lg text-gray-300 mb-4">{getProductFamilyInfo(productFamily).description}</p>
                </div>
                
                <div className="bg-[#001f33]/70 border border-white/20 rounded-lg p-6">
                  <h4 className="text-xl font-semibold text-[#ffb81c] mb-4">Product Overview</h4>
                  <p className="text-gray-300 leading-relaxed mb-6">
                    {getProductFamilyInfo(productFamily).overviewDescription}
                  </p>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="bg-[#001f33]/50 border border-white/10 rounded p-4">
                      <h5 className="font-semibold text-white mb-2">Key Features</h5>
                      <ul className="text-sm text-gray-300 space-y-1">
                        <li>• Advanced technology integration</li>
                        <li>• Scalable architecture</li>
                        <li>• Real-time performance monitoring</li>
                        <li>• Industry-standard compliance</li>
                      </ul>
                    </div>
                    <div className="bg-[#001f33]/50 border border-white/10 rounded p-4">
                      <h5 className="font-semibold text-white mb-2">Benefits</h5>
                      <ul className="text-sm text-gray-300 space-y-1">
                        <li>• Improved operational efficiency</li>
                        <li>• Reduced implementation time</li>
                        <li>• Enhanced system reliability</li>
                        <li>• Comprehensive support</li>
                      </ul>
                    </div>
                  </div>
                </div>

                <div className="bg-[#001f33]/70 border border-white/20 rounded-lg p-6 text-center">
                  <h4 className="text-xl font-semibold text-white mb-4">Interested in This Solution?</h4>
                  <p className="text-gray-300 mb-4">{contentConfig.general.contactMessage}</p>
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
              <div>
                <h3 className="text-2xl font-bold text-white mb-6">Presentations</h3>
                {renderPresentationSliders()}
              </div>
            )}

            {activeTab === 'images' && (
              <div>
                <h3 className="text-2xl font-bold text-white mb-6">Images</h3>
                {content.images.length === 0 ? (
                  <div className="flex flex-col items-center justify-center h-96 bg-[#001f33]/50 border border-white/10 rounded-lg">
                    <div className="text-center">
                      <ImageIcon size={64} className="mx-auto mb-4 text-gray-500" />
                      <p className="text-gray-400">No images available</p>
                    </div>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {content.images.map((image, index) => {
                      const logoPath = getLogoForMedia(index, 'image');
                      return (
                        <div key={index} className="bg-[#001f33]/70 border border-white/20 rounded-lg p-4">
                          <div className="flex items-center space-x-3 mb-3">
                            <img
                              src={logoPath}
                              alt="Product Logo"
                              className="w-8 h-8 object-contain"
                              onError={(e) => {
                                const target = e.target as HTMLImageElement;
                                target.src = productImage;
                              }}
                            />
                            <h4 className="text-lg font-semibold text-[#ffb81c]">{image.name}</h4>
                          </div>
                          <div className="relative group">
                            <img
                              src={image.path}
                              alt={image.name}
                              className="w-full h-48 object-cover rounded-lg cursor-pointer transition-transform group-hover:scale-105"
                              onClick={() => {
                                // Create fullscreen overlay
                                const overlay = document.createElement('div');
                                overlay.className = 'fixed inset-0 bg-black/90 flex items-center justify-center z-[999999]';
                                overlay.style.position = 'fixed';
                                overlay.style.top = '0';
                                overlay.style.left = '0';
                                overlay.style.width = '100vw';
                                overlay.style.height = '100vh';
                                overlay.style.zIndex = '999999';
                                
                                const fullscreenImage = document.createElement('img');
                                fullscreenImage.src = image.path;
                                fullscreenImage.className = 'max-w-full max-h-full object-contain';
                                
                                const closeButton = document.createElement('button');
                                closeButton.innerHTML = '×';
                                closeButton.className = 'absolute top-6 right-6 w-12 h-12 backdrop-blur-md bg-[#001f33]/90 border border-white/20 rounded-sm flex items-center justify-center shadow-lg text-white text-2xl hover:bg-[#001f33]/95';
                                closeButton.onclick = () => {
                                  document.body.removeChild(overlay);
                                };
                                
                                overlay.appendChild(fullscreenImage);
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
                                target.src = productImage;
                              }}
                            />
                            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors rounded-lg flex items-center justify-center">
                              <Maximize2 size={24} className="text-white opacity-0 group-hover:opacity-100 transition-opacity" />
                            </div>
                          </div>
                          <p className="text-sm text-gray-300 mt-3">{getImageContent(index).description}</p>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            )}

            {activeTab === 'videos' && (
              <div>
                <h3 className="text-2xl font-bold text-white mb-6">Videos</h3>
                {content.videos.length === 0 ? (
                  <div className="flex flex-col items-center justify-center h-96 bg-[#001f33]/50 border border-white/10 rounded-lg">
                    <div className="text-center">
                      <Video size={64} className="mx-auto mb-4 text-gray-500" />
                      <p className="text-gray-400">No videos available</p>
                    </div>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {content.videos.map((video, index) => {
                      const logoPath = getLogoForMedia(index, 'video');
                      return (
                        <div key={index} className="bg-[#001f33]/70 border border-white/20 rounded-lg p-4">
                          <div className="flex items-center space-x-3 mb-3">
                            <img
                              src={logoPath}
                              alt="Product Logo"
                              className="w-8 h-8 object-contain"
                              onError={(e) => {
                                const target = e.target as HTMLImageElement;
                                target.src = productImage;
                              }}
                            />
                            <h4 className="text-lg font-semibold text-[#ffb81c]">{video.name}</h4>
                          </div>
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
                              className="w-full max-h-64 object-contain bg-[#001f33]/30 border border-white/10 rounded-lg cursor-pointer"
                              style={{ aspectRatio: 'auto' }}
                              onError={(e) => {
                                const target = e.target as HTMLVideoElement;
                                target.style.display = 'none';
                                
                                const existingFallback = target.parentNode?.querySelector('.video-error-fallback');
                                if (!existingFallback) {
                                  const fallback = document.createElement('div');
                                  fallback.className = 'video-error-fallback flex items-center justify-center min-h-32 bg-[#001f33]/30 border border-white/10 rounded-lg';
                                  fallback.innerHTML = '<p class="text-gray-400 text-sm">Video preview not available</p>';
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
                                  closeButton.onclick = () => {
                                    document.body.removeChild(overlay);
                                  };
                                  
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
                              <Maximize2 size={16} color="white" />
                            </button>
                          </div>
                          <p className="text-sm text-gray-300 mt-3">{getVideoContent(index).description}</p>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            )}

            {activeTab === 'documents' && (
              <div>
                <h3 className="text-2xl font-bold text-white mb-6">Documents</h3>
                {content.documents.length === 0 ? (
                  <div className="flex flex-col items-center justify-center h-96 bg-[#001f33]/50 border border-white/10 rounded-lg">
                    <div className="text-center">
                      <FileText size={64} className="mx-auto mb-4 text-gray-500" />
                      <p className="text-gray-400">No documents available</p>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-6">
                    {content.documents.map((documentGroup, groupIndex) => {
                      const currentPageIndex = documentIndices[groupIndex] || 0;
                      const currentPage = documentGroup.pages[currentPageIndex];
                      
                      const nextPage = () => {
                        const newIndex = (currentPageIndex + 1) % documentGroup.pages.length;
                        updateDocumentIndex(groupIndex, newIndex);
                      };
                      
                      const prevPage = () => {
                        const newIndex = (currentPageIndex - 1 + documentGroup.pages.length) % documentGroup.pages.length;
                        updateDocumentIndex(groupIndex, newIndex);
                      };

                      return (
                        <div key={groupIndex} className="bg-[#001f33]/70 border border-white/20 rounded-lg p-4">
                          <h4 className="text-lg font-semibold text-[#ffb81c] capitalize mb-2">
                            {documentGroup.name}
                          </h4>
                          <p className="text-sm text-gray-300 mb-4">{getDocumentDescription(groupIndex)}</p>
                          <div className="relative">
                            <img
                              src={currentPage.path}
                              alt={currentPage.name}
                              className="w-full max-h-96 object-contain bg-[#001f33]/30 border border-white/10 rounded-lg"
                              onError={(e) => {
                                const target = e.target as HTMLImageElement;
                                target.src = productImage;
                              }}
                            />
                            <button
                              onClick={toggleFullscreen}
                              className="absolute top-2 right-2 w-8 h-8 backdrop-blur-md bg-[#001f33]/90 border border-white/20 rounded-sm flex items-center justify-center shadow-md hover:bg-[#001f33]/95"
                              title="View fullscreen"
                            >
                              <Maximize2 size={16} color="white" />
                            </button>
                            {documentGroup.pages.length > 1 && (
                              <>
                                <button
                                  onClick={prevPage}
                                  className="absolute left-2 top-1/2 transform -translate-y-1/2 w-7 h-7 backdrop-blur-md bg-[#001f33]/90 border border-white/20 rounded-sm flex items-center justify-center shadow-md hover:bg-[#001f33]/95"
                                >
                                  <ChevronLeft size={16} color="white" />
                                </button>
                                <button
                                  onClick={nextPage}
                                  className="absolute right-2 top-1/2 transform -translate-y-1/2 w-7 h-7 backdrop-blur-md bg-[#001f33]/90 border border-white/20 rounded-sm flex items-center justify-center shadow-md hover:bg-[#001f33]/95"
                                >
                                  <ChevronRight size={16} color="white" />
                                </button>
                              </>
                            )}
                          </div>
                          <div className="flex justify-between items-center mt-3">
                            <span className="text-sm text-gray-400">
                              Page {currentPageIndex + 1} of {documentGroup.pages.length}
                            </span>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Fullscreen Modal */}
      {isFullscreen && currentMedia && (
        <div className="fixed inset-0 bg-black/95 flex items-center justify-center z-[999999]">
          <button
            onClick={toggleFullscreen}
            className="absolute top-6 right-6 w-12 h-12 backdrop-blur-md bg-[#001f33]/90 border border-white/20 rounded-sm flex items-center justify-center shadow-lg text-white text-2xl hover:bg-[#001f33]/95"
          >
            ×
          </button>
          
          {currentMedia.type === 'image' || currentMedia.type === 'presentation' || currentMedia.type === 'document' ? (
            <img
              src={currentMedia.path}
              alt={currentMedia.name}
              className="max-w-full max-h-full object-contain"
            />
          ) : currentMedia.type === 'video' ? (
            <video
              src={currentMedia.path}
              controls
              autoPlay
              className="max-w-full max-h-full object-contain"
            />
          ) : null}
          
          {currentMediaList.length > 1 && (
            <>
              <button
                onClick={prevMedia}
                className="absolute left-6 top-1/2 transform -translate-y-1/2 w-12 h-12 backdrop-blur-md bg-[#001f33]/90 border border-white/20 rounded-sm flex items-center justify-center shadow-lg hover:bg-[#001f33]/95"
              >
                <ChevronLeft size={24} color="white" />
              </button>
              <button
                onClick={nextMedia}
                className="absolute right-6 top-1/2 transform -translate-y-1/2 w-12 h-12 backdrop-blur-md bg-[#001f33]/90 border border-white/20 rounded-sm flex items-center justify-center shadow-lg hover:bg-[#001f33]/95"
              >
                <ChevronRight size={24} color="white" />
              </button>
            </>
          )}
          
          <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2 text-white text-center">
            <p className="text-lg font-semibold">{currentMedia.name}</p>
            <p className="text-sm text-gray-300">
              {selectedMediaIndex + 1} of {currentMediaList.length}
            </p>
          </div>
        </div>
      )}
    </div>
  );
}