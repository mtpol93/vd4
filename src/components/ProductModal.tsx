import React, { useState, useEffect } from 'react';
import { X, ChevronLeft, ChevronRight, FileText, Image as ImageIcon, Video, Presentation, Maximize2, Play } from 'lucide-react';
import { Document, Page, pdfjs } from 'react-pdf';
import { 
  contentConfig, 
  getProductFamilyInfo, 
  getImageContent, 
  getVideoContent, 
  getPresentationDescription, 
  getDocumentDescription,
  getProductLogoForIndex
} from '../config/content';
import 'react-pdf/dist/Page/AnnotationLayer.css';
import 'react-pdf/dist/Page/TextLayer.css';

// Set up PDF.js worker
pdfjs.GlobalWorkerOptions.workerSrc = new URL('pdfjs-dist/build/pdf.worker.mjs', import.meta.url).toString();

// ========================================
// PRODUCT LOGOS CONFIGURATION
// ========================================
// Easy to adapt: Each logo has its own line for quick modifications

const PRODUCT_LOGOS = {
  // AI-Core Platform Logos (index-based)
  aiCore: {
    0: './products/ai-core/main/0-logos/AId-min.png',        // AId logo
    1: './products/ai-core/main/0-logos/Agentic-min.png',    // Agentic logo
    2: './products/ai-core/main/0-logos/ChatNow-min.png',    // ChatNow logo
    3: './products/ai-core/main/0-logos/Meta-min.png',       // Meta logo
    4: './products/ai-core/main/0-logos/OneAI-min.png',      // OneAI logo
    5: './products/ai-core/main/0-logos/TestAId-min.png'     // TestAId logo
  },
  
  // Energy Solutions Logos (index-based) 
  energySolutions: {
    0: './products/energy-solutions/main/0-logos/Agentic-min.png',     // Agentic logo
    1: './products/energy-solutions/main/0-logos/AId-min.png',         // AId logo
    2: './products/energy-solutions/main/0-logos/ChatNow-min.png',     // ChatNow logo
    3: './products/energy-solutions/main/0-logos/Meta-min.png',        // Meta logo
    4: './products/energy-solutions/main/0-logos/OneAI-min.png',       // OneAI logo
    5: './products/energy-solutions/main/0-logos/TestAId-min.png'      // TestAId logo
  },
  
  // NetComm Validation Logos (index-based)
  netcomm: {
    0: './products/ai-core/main/0-logos/Agentic-min.png',     // Agentic logo
    1: './products/ai-core/main/0-logos/AId-min.png',         // AId logo
    2: './products/ai-core/main/0-logos/ChatNow-min.png',     // ChatNow logo
    3: './products/ai-core/main/0-logos/Meta-min.png',        // Meta logo
    4: './products/ai-core/main/0-logos/OneAI-min.png',       // OneAI logo
    5: './products/ai-core/main/0-logos/TestAId-min.png'      // TestAId logo
  },
  
  // PROVEtech Tool Suite Logos (index-based)
  provetech: {
    0: './products/ai-core/main/0-logos/Agentic-min.png',     // Agentic logo
    1: './products/ai-core/main/0-logos/AId-min.png',         // AId logo
    2: './products/ai-core/main/0-logos/ChatNow-min.png',     // ChatNow logo
    3: './products/ai-core/main/0-logos/Meta-min.png',        // Meta logo
    4: './products/ai-core/main/0-logos/OneAI-min.png',       // OneAI logo
    5: './products/ai-core/main/0-logos/TestAId-min.png'      // TestAId logo
  }
};

// Function to get product logo for a given family and index
const getProductLogoForIndex = (productFamily: string, index: number): string => {
  const familyKey = (() => {
    switch (productFamily) {
      case 'ai-core': return 'aiCore';
      case 'energy-solutions': return 'energySolutions';
      case 'netcomm': return 'netcomm';
      case 'provetech': return 'provetech';
      default: return 'aiCore'; // fallback
    }
  })();
  
  const familyLogos = PRODUCT_LOGOS[familyKey];
  const logoIndex = index % Object.keys(familyLogos).length;
  return familyLogos[logoIndex];
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
                    className="absolute top-2 right-2 w-8 h-8 backdrop-blur-sm bg-black/30 hover:bg-black/50 border border-white/20 rounded-lg flex items-center justify-center transition-colors"
                  >
                    <Maximize2 size={16} className="text-white" />
                  </button>
                </div>
                <div className="flex items-center justify-between mt-4">
                  <button
                    onClick={prevSlide}
                    className="flex items-center gap-2 px-3 py-2 bg-[#ffb81c] hover:bg-[#e6a619] text-[#001f33] rounded-lg font-medium transition-colors"
                  >
                    <ChevronLeft size={16} />
                    Previous
                  </button>
                  <span className="text-sm text-gray-300">
                    {currentSlideIndex + 1} / {presentationGroup.slides.length}
                  </span>
                  <button
                    onClick={nextSlide}
                    className="flex items-center gap-2 px-3 py-2 bg-[#ffb81c] hover:bg-[#e6a619] text-[#001f33] rounded-lg font-medium transition-colors"
                  >
                    Next
                    <ChevronRight size={16} />
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    );
  };

  const renderDocumentSliders = () => {
    if (content.documents.length === 0) {
      return (
        <div className="flex flex-col items-center justify-center h-96 bg-[#001f33]/50 border border-white/10 rounded-lg">
          <div className="text-center">
            <FileText size={64} className="mx-auto mb-4 text-gray-500" />
            <p className="text-gray-400">No documents available</p>
          </div>
        </div>
      );
    }

    return (
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
            <div key={groupIndex} className="space-y-3">
              <div className="bg-[#001f33]/70 border border-white/20 rounded-lg p-4">
                <h4 className="text-lg font-semibold text-[#ffb81c] capitalize mb-2">
                  {documentGroup.name}
                </h4>
                <p className="text-sm text-gray-300 mb-4">{getDocumentDescription(groupIndex)}</p>
                <div className="relative">
                  <img
                    src={currentPage.path}
                    alt={currentPage.name}
                    className="w-full max-h-80 object-contain bg-[#001f33]/30 border border-white/10 rounded-lg"
                    style={{ aspectRatio: 'auto' }}
                    onLoad={() => console.log('✅ Document page loaded:', currentPage.path)}
                    onError={(e) => {
                      const target = e.target as HTMLImageElement;
                      console.error('❌ Failed to load document page:', currentPage.path);
                      target.src = productImage;
                    }}
                  />
                  <button
                    onClick={toggleFullscreen}
                    className="absolute top-2 right-2 w-8 h-8 backdrop-blur-sm bg-black/30 hover:bg-black/50 border border-white/20 rounded-lg flex items-center justify-center transition-colors"
                  >
                    <Maximize2 size={16} className="text-white" />
                  </button>
                </div>
                <div className="flex items-center justify-between mt-4">
                  <button
                    onClick={prevPage}
                    className="flex items-center gap-2 px-3 py-2 bg-[#ffb81c] hover:bg-[#e6a619] text-[#001f33] rounded-lg font-medium transition-colors"
                  >
                    <ChevronLeft size={16} />
                    Previous
                  </button>
                  <span className="text-sm text-gray-300">
                    {currentPageIndex + 1} / {documentGroup.pages.length}
                  </span>
                  <button
                    onClick={nextPage}
                    className="flex items-center gap-2 px-3 py-2 bg-[#ffb81c] hover:bg-[#e6a619] text-[#001f33] rounded-lg font-medium transition-colors"
                  >
                    Next
                    <ChevronRight size={16} />
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    );
  };

  const renderOverviewContent = () => {
    const familyInfo = getProductFamilyInfo(productFamily);
    
    return (
      <div className="space-y-6">
        {/* Main Overview Image */}
        <div className="relative">
          <img
            src={overviewImage}
            alt={`${productName} Overview`}
            className="w-full max-h-96 object-contain bg-[#001f33]/30 border border-white/10 rounded-lg"
            style={{ aspectRatio: 'auto' }}
            onError={(e) => {
              const target = e.target as HTMLImageElement;
              target.src = productImage;
            }}
          />
          <button
            onClick={toggleFullscreen}
            className="absolute top-2 right-2 w-8 h-8 backdrop-blur-sm bg-black/30 hover:bg-black/50 border border-white/20 rounded-lg flex items-center justify-center transition-colors"
          >
            <Maximize2 size={16} className="text-white" />
          </button>
        </div>

        {/* Product Family Information */}
        <div className="bg-[#001f33]/70 border border-white/20 rounded-lg p-6">
          <h3 className="text-xl font-semibold text-[#ffb81c] mb-4">
            {familyDisplayNames[productFamily] || productFamily}
          </h3>
          <p className="text-gray-300 leading-relaxed mb-6">
            {familyInfo.description}
          </p>
          
          {/* Key Features */}
          <div className="mb-6">
            <h4 className="text-lg font-semibold text-white mb-3">Key Features</h4>
            <ul className="space-y-2">
              {familyInfo.features.map((feature, index) => (
                <li key={index} className="flex items-start gap-3">
                  <div className="w-2 h-2 bg-[#ffb81c] rounded-full mt-2 flex-shrink-0"></div>
                  <span className="text-gray-300">{feature}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Technologies */}
          <div>
            <h4 className="text-lg font-semibold text-white mb-3">Technologies</h4>
            <div className="flex flex-wrap gap-2">
              {familyInfo.technologies.map((tech, index) => (
                <span
                  key={index}
                  className="px-3 py-1 bg-[#ffb81c]/20 border border-[#ffb81c]/30 text-[#ffb81c] rounded-full text-sm"
                >
                  {tech}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Product Logos Grid */}
        <div className="bg-[#001f33]/70 border border-white/20 rounded-lg p-6">
          <h4 className="text-lg font-semibold text-white mb-4">Product Portfolio</h4>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {Array.from({ length: 6 }, (_, index) => (
              <div key={index} className="flex flex-col items-center p-3 bg-[#001f33]/50 border border-white/10 rounded-lg hover:border-[#ffb81c]/30 transition-colors">
                <img
                  src={getProductLogoForIndex(productFamily, index)}
                  alt={`${productName} Logo ${index + 1}`}
                  className="w-12 h-12 object-contain mb-2"
                  onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    target.style.display = 'none';
                  }}
                />
                <span className="text-xs text-gray-400 text-center">
                  Product {index + 1}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  };

  const renderMediaGrid = () => {
    if (currentMediaList.length === 0) {
      const emptyStateConfig = {
        images: { icon: ImageIcon, text: 'No images available' },
        videos: { icon: Video, text: 'No videos available' },
        presentations: { icon: Presentation, text: 'No presentations available' },
        documents: { icon: FileText, text: 'No documents available' }
      };
      
      const config = emptyStateConfig[activeTab] || emptyStateConfig.images;
      const IconComponent = config.icon;
      
      return (
        <div className="flex flex-col items-center justify-center h-96 bg-[#001f33]/50 border border-white/10 rounded-lg">
          <div className="text-center">
            <IconComponent size={64} className="mx-auto mb-4 text-gray-500" />
            <p className="text-gray-400">{config.text}</p>
          </div>
        </div>
      );
    }

    return (
      <div className="space-y-6">
        {/* Media Display */}
        <div className="relative">
          {currentMedia?.type === 'video' ? (
            <video
              key={currentMedia.path}
              controls
              className="w-full max-h-96 bg-[#001f33]/30 border border-white/10 rounded-lg"
              onError={(e) => {
                console.error('❌ Failed to load video:', currentMedia.path);
              }}
            >
              <source src={currentMedia.path} type="video/mp4" />
              <source src={currentMedia.path} type="video/webm" />
              Your browser does not support the video tag.
            </video>
          ) : currentMedia?.type === 'document' && currentMedia.path.endsWith('.pdf') ? (
            <div className="bg-[#001f33]/30 border border-white/10 rounded-lg p-4">
              {pdfError ? (
                <div className="flex flex-col items-center justify-center h-96 text-center">
                  <FileText size={64} className="mx-auto mb-4 text-gray-500" />
                  <p className="text-gray-400">Unable to load PDF document</p>
                </div>
              ) : (
                <Document
                  file={currentMedia.path}
                  onLoadSuccess={onDocumentLoadSuccess}
                  onLoadError={onDocumentLoadError}
                  className="flex justify-center"
                >
                  <Page
                    pageNumber={pageNumber}
                    className="max-w-full"
                    renderTextLayer={false}
                    renderAnnotationLayer={false}
                  />
                </Document>
              )}
              {numPages && (
                <div className="flex items-center justify-between mt-4">
                  <button
                    onClick={() => setPageNumber(Math.max(1, pageNumber - 1))}
                    disabled={pageNumber <= 1}
                    className="flex items-center gap-2 px-3 py-2 bg-[#ffb81c] hover:bg-[#e6a619] disabled:bg-gray-600 disabled:cursor-not-allowed text-[#001f33] rounded-lg font-medium transition-colors"
                  >
                    <ChevronLeft size={16} />
                    Previous
                  </button>
                  <span className="text-sm text-gray-300">
                    Page {pageNumber} of {numPages}
                  </span>
                  <button
                    onClick={() => setPageNumber(Math.min(numPages, pageNumber + 1))}
                    disabled={pageNumber >= numPages}
                    className="flex items-center gap-2 px-3 py-2 bg-[#ffb81c] hover:bg-[#e6a619] disabled:bg-gray-600 disabled:cursor-not-allowed text-[#001f33] rounded-lg font-medium transition-colors"
                  >
                    Next
                    <ChevronRight size={16} />
                  </button>
                </div>
              )}
            </div>
          ) : (
            <img
              src={currentMedia?.path}
              alt={currentMedia?.name}
              className="w-full max-h-96 object-contain bg-[#001f33]/30 border border-white/10 rounded-lg"
              style={{ aspectRatio: 'auto' }}
              onError={(e) => {
                const target = e.target as HTMLImageElement;
                console.error('❌ Failed to load media:', currentMedia?.path);
                target.src = productImage;
              }}
            />
          )}
          <button
            onClick={toggleFullscreen}
            className="absolute top-2 right-2 w-8 h-8 backdrop-blur-sm bg-black/30 hover:bg-black/50 border border-white/20 rounded-lg flex items-center justify-center transition-colors"
          >
            <Maximize2 size={16} className="text-white" />
          </button>
        </div>

        {/* Media Info */}
        <div className="bg-[#001f33]/70 border border-white/20 rounded-lg p-4">
          <h4 className="text-lg font-semibold text-[#ffb81c] capitalize mb-2">
            {currentMedia?.name}
          </h4>
          <p className="text-sm text-gray-300 mb-4">
            {activeTab === 'images' && getImageContent(selectedMediaIndex).description}
            {activeTab === 'videos' && getVideoContent(selectedMediaIndex).description}
          </p>
        </div>

        {/* Navigation */}
        <div className="flex items-center justify-between">
          <button
            onClick={prevMedia}
            className="flex items-center gap-2 px-4 py-2 bg-[#ffb81c] hover:bg-[#e6a619] text-[#001f33] rounded-lg font-medium transition-colors"
          >
            <ChevronLeft size={16} />
            Previous
          </button>
          <span className="text-sm text-gray-300">
            {selectedMediaIndex + 1} / {currentMediaList.length}
          </span>
          <button
            onClick={nextMedia}
            className="flex items-center gap-2 px-4 py-2 bg-[#ffb81c] hover:bg-[#e6a619] text-[#001f33] rounded-lg font-medium transition-colors"
          >
            Next
            <ChevronRight size={16} />
          </button>
        </div>

        {/* Thumbnail Grid */}
        <div className="grid grid-cols-4 md:grid-cols-6 lg:grid-cols-8 gap-2">
          {currentMediaList.map((media, index) => (
            <button
              key={index}
              onClick={() => setSelectedMediaIndex(index)}
              className={`relative aspect-square rounded-lg overflow-hidden border-2 transition-colors ${
                index === selectedMediaIndex
                  ? 'border-[#ffb81c]'
                  : 'border-white/10 hover:border-white/30'
              }`}
            >
              {media.type === 'video' ? (
                <div className="w-full h-full bg-[#001f33]/50 flex items-center justify-center">
                  <Play size={16} className="text-white" />
                </div>
              ) : (
                <img
                  src={media.path}
                  alt={media.name}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    target.src = productImage;
                  }}
                />
              )}
            </button>
          ))}
        </div>
      </div>
    );
  };

  const renderTabContent = () => {
    switch (activeTab) {
      case 'overview':
        return renderOverviewContent();
      case 'presentations':
        return renderPresentationSliders();
      case 'documents':
        return renderDocumentSliders();
      case 'images':
      case 'videos':
        return renderMediaGrid();
      default:
        return null;
    }
  };

  const getTabCounts = () => ({
    presentations: content.presentations.length,
    images: content.images.length,
    videos: content.videos.length,
    documents: content.documents.length
  });

  const tabCounts = getTabCounts();

  return (
    <>
      {/* Modal Backdrop */}
      <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
        <div className="bg-[#001f33] border border-white/20 rounded-xl w-full max-w-6xl max-h-[90vh] overflow-hidden flex flex-col">
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-white/10">
            <div>
              <h2 className="text-2xl font-bold text-white capitalize">{productName}</h2>
              <p className="text-[#ffb81c] text-sm">{familyDisplayNames[productFamily] || productFamily}</p>
            </div>
            <button
              onClick={onClose}
              className="w-10 h-10 rounded-lg bg-white/10 hover:bg-white/20 border border-white/20 flex items-center justify-center transition-colors"
            >
              <X size={20} className="text-white" />
            </button>
          </div>

          {/* Tabs */}
          <div className="flex border-b border-white/10 bg-[#001f33]/50">
            {[
              { id: 'overview', label: 'Overview', icon: FileText },
              { id: 'presentations', label: 'Presentations', icon: Presentation, count: tabCounts.presentations },
              { id: 'images', label: 'Images', icon: ImageIcon, count: tabCounts.images },
              { id: 'videos', label: 'Videos', icon: Video, count: tabCounts.videos },
              { id: 'documents', label: 'Documents', icon: FileText, count: tabCounts.documents }
            ].map(({ id, label, icon: Icon, count }) => (
              <button
                key={id}
                onClick={() => setActiveTab(id as any)}
                className={`flex items-center gap-2 px-4 py-3 border-b-2 transition-colors ${
                  activeTab === id
                    ? 'border-[#ffb81c] text-[#ffb81c] bg-[#ffb81c]/10'
                    : 'border-transparent text-gray-400 hover:text-white hover:bg-white/5'
                }`}
              >
                <Icon size={16} />
                <span className="font-medium">{label}</span>
                {count !== undefined && count > 0 && (
                  <span className="bg-[#ffb81c]/20 text-[#ffb81c] text-xs px-2 py-1 rounded-full">
                    {count}
                  </span>
                )}
              </button>
            ))}
          </div>

          {/* Content */}
          <div className="flex-1 overflow-y-auto p-6">
            {loading ? (
              <div className="flex items-center justify-center h-64">
                <div className="text-center">
                  <div className="w-8 h-8 border-2 border-[#ffb81c] border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                  <p className="text-gray-400">Loading content...</p>
                </div>
              </div>
            ) : (
              renderTabContent()
            )}
          </div>
        </div>
      </div>

      {/* Fullscreen Modal */}
      {isFullscreen && (
        <div className="fixed inset-0 bg-black z-[60] flex items-center justify-center">
          <button
            onClick={toggleFullscreen}
            className="absolute top-4 right-4 w-10 h-10 rounded-lg bg-black/50 hover:bg-black/70 border border-white/20 flex items-center justify-center transition-colors z-10"
          >
            <X size={20} className="text-white" />
          </button>
          
          <div className="w-full h-full flex items-center justify-center p-4">
            {activeTab === 'overview' ? (
              <img
                src={overviewImage}
                alt={`${productName} Overview`}
                className="max-w-full max-h-full object-contain"
              />
            ) : activeTab === 'presentations' ? (
              <img
                src={content.presentations[currentPresentationGroup]?.slides[presentationIndices[currentPresentationGroup] || 0]?.path}
                alt="Presentation Slide"
                className="max-w-full max-h-full object-contain"
              />
            ) : activeTab === 'documents' ? (
              <img
                src={content.documents[currentDocumentGroup]?.pages[documentIndices[currentDocumentGroup] || 0]?.path}
                alt="Document Page"
                className="max-w-full max-h-full object-contain"
              />
            ) : currentMedia?.type === 'video' ? (
              <video
                controls
                className="max-w-full max-h-full"
                autoPlay
              >
                <source src={currentMedia.path} type="video/mp4" />
                <source src={currentMedia.path} type="video/webm" />
                Your browser does not support the video tag.
              </video>
            ) : (
              <img
                src={currentMedia?.path}
                alt={currentMedia?.name}
                className="max-w-full max-h-full object-contain"
              />
            )}
          </div>
        </div>
      )}
    </>
  );
}