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
    './products/ai-core/main/0-logos/TestAId-min.png',
    './products/ai-core/main/0-logos/OneAI-min.png',
    './products/ai-core/main/0-logos/Meta-min.png',
    './products/ai-core/main/0-logos/ChatNow-min.png',
    './products/ai-core/main/0-logos/AId-min.png',
    './products/ai-core/main/0-logos/Agentic-min.png'
  ];
  return logos[index % logos.length];
};

// Function to get NetComm logo for a given index
const getNetCommLogoForIndex = (index: number): string => {
  const logos = [
    './products/netcomm/main/0-logos/logo1.png',
    './products/netcomm/main/0-logos/logo2.png',
    './products/netcomm/main/0-logos/logo3.png'
  ];
  return logos[index % logos.length];
};

// Function to get PROVEtech logo for a given index
const getPROVEtechLogoForIndex = (index: number): string => {
  const logos = [
    './products/provetech/main/0-logos/logo1.png',
    './products/provetech/main/0-logos/logo2.png',
    './products/provetech/main/0-logos/logo3.png'
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
  const presentationFiles: Record<string, Record<string, { folder: string; files: string[]; name?: string }[]>> = {
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
        { folder: 'main/1-presentation/presentation1', files: ['Slide1.PNG', 'Slide2.PNG', 'Slide3.PNG', 'Slide4.PNG', 'Slide5.PNG', 'Slide6.PNG'], name: 'PROVEtech Input Demonstrator' },
        { folder: 'main/1-presentation/presentation2', files: ['Slide1.PNG', 'Slide2.PNG', 'Slide3.PNG', 'Slide4.PNG', 'Slide5.PNG', 'Slide6.PNG', 'Slide7.PNG', 'Slide8.PNG', 'Slide9.PNG', 'Slide10.PNG', 'Slide11.PNG', 'Slide12.PNG', 'Slide13.PNG', 'Slide14.PNG', 'Slide15.PNG', 'Slide16.PNG', 'Slide17.PNG', 'Slide18.PNG', 'Slide19.PNG', 'Slide20.PNG', 'Slide21.PNG', 'Slide22.PNG', 'Slide23.PNG', 'Slide24.PNG', 'Slide25.PNG', 'Slide26.PNG', 'Slide27.PNG', 'Slide28.PNG', 'Slide29.PNG'], name: 'PROVEtech Comprehensive Overview' },
        { folder: 'main/1-presentation/presentation3', files: ['Slide1.PNG', 'Slide2.PNG', 'Slide3.PNG', 'Slide4.PNG', 'Slide5.PNG', 'Slide6.PNG', 'Slide7.PNG', 'Slide8.PNG', 'Slide9.PNG', 'Slide10.PNG', 'Slide11.PNG', 'Slide12.PNG', 'Slide13.PNG'], name: 'PROVEtech Technical Deep Dive' }
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
      'PROVEtech Tool Suite': [
        'main/3-videos/video1.mp4'
      ]
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
                  <div className="absolute bottom-2 left-1/2 transform -translate-x-1/2 backdrop-blur-md bg-[#001f33]/90 border border-white/20 px-2 py-1 rounded-sm text-xs font-medium shadow-md text-white">
                    {currentSlideIndex + 1} / {presentationGroup.slides.length}
                  </div>
                </div>
                {presentationGroup.slides.length > 1 && (
                  <div className="flex items-center justify-center space-x-2 mt-3">
                    {presentationGroup.slides.map((_, slideIndex) => (
                      <button
                        key={slideIndex}
                        onClick={() => updatePresentationIndex(groupIndex, slideIndex)}
                        className={`w-2 h-2 rounded-full transition-colors backdrop-blur-md border border-white/20 ${
                          slideIndex === currentSlideIndex ? 'bg-[#ffb81c]' : 'bg-[#001f33]/90'
                        }`}
                        style={slideIndex === currentSlideIndex ? { backgroundColor: '#ffb81c' } : {}}
                      />
                    ))}
                  </div>
                )}
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
          
          // Check if this is a PDF file
          const isPDF = currentPage.path.toLowerCase().endsWith('.pdf');

          return (
            <div key={groupIndex} className="space-y-3">
              <div className="bg-[#001f33]/70 border border-white/20 rounded-lg p-4">
                <div className="flex items-center space-x-3 mb-2">
                  {(productFamily === 'ai-core' || productFamily === 'energy-solutions' || productFamily === 'netcomm' || productFamily === 'provetech') && (
                    <img
                      src={getAICoreLogoForIndex(groupIndex)}
                      alt={`${productFamily} Product`}
                      className="w-8 h-8 object-contain"
                      onError={(e) => {
                        const target = e.target as HTMLImageElement;
                        target.style.display = 'none';
                      }}
                    />
                  )}
                  <h4 className="text-lg font-semibold text-[#ffb81c] capitalize">
                    {documentGroup.name}
                  </h4>
                </div>
                <p className="text-sm text-gray-300 mb-4">{getDocumentDescription(groupIndex)}</p>
                <div className="relative">
                  {isPDF ? (
                    <div className="bg-white rounded-lg p-2">
                      <Document
                        file={currentPage.path}
                        onLoadSuccess={onDocumentLoadSuccess}
                        onLoadError={onDocumentLoadError}
                        loading={
                          <div className="flex items-center justify-center h-80">
                            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#ffb81c]"></div>
                          </div>
                        }
                      >
                        {!pdfError && (
                          <Page
                            pageNumber={pageNumber}
                            width={Math.min(400, window.innerWidth * 0.2)}
                            renderTextLayer={false}
                            renderAnnotationLayer={false}
                          />
                        )}
                      </Document>
                      {pdfError && (
                        <div className="flex items-center justify-center h-80 bg-gray-100">
                          <div className="text-center">
                            <FileText size={48} className="mx-auto mb-2 text-gray-400" />
                            <p className="text-gray-600">Unable to load PDF</p>
                            <p className="text-sm text-gray-500">{currentPage.name}</p>
                          </div>
                        </div>
                      )}
                    </div>
                  ) : (
                    <img
                      src={currentPage.path}
                      alt={currentPage.name}
                      className="w-full max-h-80 object-contain bg-[#001f33]/30 border border-white/10 rounded-lg cursor-pointer"
                      style={{ aspectRatio: 'auto' }}
                      onClick={() => {
                        setCurrentDocumentGroup(groupIndex);
                        setSelectedMediaIndex(currentPageIndex);
                        toggleFullscreen();
                      }}
                      onError={(e) => {
                        const target = e.target as HTMLImageElement;
                        target.src = productImage;
                      }}
                    />
                  )}
                  <button
                    onClick={() => {
                      setCurrentDocumentGroup(groupIndex);
                      setSelectedMediaIndex(currentPageIndex);
                      toggleFullscreen();
                    }}
                    className="absolute top-2 right-2 w-8 h-8 backdrop-blur-md bg-[#001f33]/90 border border-white/20 rounded-sm flex items-center justify-center shadow-md hover:bg-[#001f33]/95"
                    title="View fullscreen"
                  >
                    <Maximize2 size={16} color="white" />
                  </button>
                  {isPDF && numPages && numPages > 1 && (
                    <>
                      <button
                        onClick={() => setPageNumber(page => Math.max(1, page - 1))}
                        disabled={pageNumber <= 1}
                        className="absolute left-2 top-1/2 transform -translate-y-1/2 w-7 h-7 backdrop-blur-md bg-[#001f33]/90 border border-white/20 rounded-sm flex items-center justify-center shadow-md hover:bg-[#001f33]/95"
                      >
                        <ChevronLeft size={16} color="white" />
                      </button>
                      <button
                        onClick={() => setPageNumber(page => Math.min(numPages, page + 1))}
                        disabled={pageNumber >= numPages}
                        className="absolute right-2 top-1/2 transform -translate-y-1/2 w-7 h-7 backdrop-blur-md bg-[#001f33]/90 border border-white/20 rounded-sm flex items-center justify-center shadow-md hover:bg-[#001f33]/95"
                      >
                        <ChevronRight size={16} color="white" />
                      </button>
                    </>
                  )}
                  {isPDF && numPages && (
                    <div className="absolute bottom-2 left-1/2 transform -translate-x-1/2 backdrop-blur-md bg-[#001f33]/90 border border-white/20 px-2 py-1 rounded-sm text-xs font-medium shadow-md text-white">
                      {pageNumber} / {numPages}
                    </div>
                  )}
                  {!isPDF && documentGroup.pages.length > 1 && (
                    <>
                      <button
                        onClick={() => {
                          const newIndex = (currentPageIndex - 1 + documentGroup.pages.length) % documentGroup.pages.length;
                          updateDocumentIndex(groupIndex, newIndex);
                        }}
                        className="absolute left-2 top-1/2 transform -translate-y-1/2 w-7 h-7 backdrop-blur-md bg-[#001f33]/90 border border-white/20 rounded-sm flex items-center justify-center shadow-md hover:bg-[#001f33]/95"
                      >
                        <ChevronLeft size={16} color="white" />
                      </button>
                      <button
                        onClick={() => {
                          const newIndex = (currentPageIndex + 1) % documentGroup.pages.length;
                          updateDocumentIndex(groupIndex, newIndex);
                        }}
                        className="absolute right-2 top-1/2 transform -translate-y-1/2 w-7 h-7 backdrop-blur-md bg-[#001f33]/90 border border-white/20 rounded-sm flex items-center justify-center shadow-md hover:bg-[#001f33]/95"
                      >
                        <ChevronRight size={16} color="white" />
                      </button>
                      <div className="absolute bottom-2 left-1/2 transform -translate-x-1/2 backdrop-blur-md bg-[#001f33]/90 border border-white/20 px-2 py-1 rounded-sm text-xs font-medium shadow-md text-white">
                        {currentPageIndex + 1} / {documentGroup.pages.length}
                      </div>
                    </>
                  )}
                </div>
                {isPDF && numPages && numPages > 1 && (
                  <div className="flex items-center justify-center space-x-2 mt-3">
                    {Array.from(new Array(Math.min(numPages, 10)), (el, index) => (
                      <button
                        key={index}
                        onClick={() => setPageNumber(index + 1)}
                        className={`w-2 h-2 rounded-full transition-colors backdrop-blur-md border border-white/20 ${
                          index + 1 === pageNumber ? 'bg-[#ffb81c]' : 'bg-[#001f33]/90'
                        }`}
                        style={index + 1 === pageNumber ? { backgroundColor: '#ffb81c' } : {}}
                      />
                    ))}
                    {numPages > 10 && <span className="text-xs text-gray-400">...</span>}
                  </div>
                )}
                {!isPDF && documentGroup.pages.length > 1 && (
                  <div className="flex items-center justify-center space-x-2 mt-3">
                    {documentGroup.pages.map((_, pageIndex) => (
                      <button
                        key={pageIndex}
                        onClick={() => updateDocumentIndex(groupIndex, pageIndex)}
                        className={`w-2 h-2 rounded-full transition-colors backdrop-blur-md border border-white/20 ${
                          pageIndex === currentPageIndex ? 'bg-[#ffb81c]' : 'bg-[#001f33]/90'
                        }`}
                        style={pageIndex === currentPageIndex ? { backgroundColor: '#ffb81c' } : {}}
                      />
                    ))}
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    );
  };
  const renderMediaViewer = () => {
    if (activeTab === 'presentations') {
      return renderPresentationSliders();
    }
    
    if (activeTab === 'documents') {
      return renderDocumentSliders();
    }
    
    if (!currentMedia) {
      return (
        <div className="flex flex-col items-center justify-center h-96 bg-[#001f33]/50 border border-white/10 rounded-lg">
          <div className="text-center">
            {activeTab === 'images' && <ImageIcon size={64} className="mx-auto mb-4 text-gray-500" />}
            {activeTab === 'videos' && <Video size={64} className="mx-auto mb-4 text-gray-500" />}
            {activeTab === 'documents' && <FileText size={64} className="mx-auto mb-4 text-gray-500" />}
            <p className="text-gray-400">No {activeTab} available</p>
          </div>
        </div>
      );
    }

    // Special handling for images, videos, and documents - show all stacked vertically
    if (activeTab === 'images') {
      return (
        <div className="space-y-4">
          {content.images.map((image, index) => (
            <div key={index} className="bg-[#001f33]/70 border border-white/20 rounded-lg p-4">
              <div className="flex items-center space-x-3 mb-2">
                {(productFamily === 'ai-core' || productFamily === 'energy-solutions') && (
                  <img
                    src={getAICoreLogoForIndex(index)}
                    alt={`${productFamily} Product`}
                    className="object-contain"
                    style={{ width: '192px', height: '192px' }}
                    onError={(e) => {
                      const target = e.target as HTMLImageElement;
                      target.style.display = 'none';
                    }}
                  />
                )}
                {productFamily === 'netcomm' && (
                  <img
                    src={getNetCommLogoForIndex(index)}
                    alt="NetComm Product"
                    className="object-contain"
                    style={{ width: '192px', height: '192px' }}
                    onError={(e) => {
                      const target = e.target as HTMLImageElement;
                      target.style.display = 'none';
                    }}
                  />
                )}
                {productFamily === 'provetech' && (
                  <img
                    src={getPROVEtechLogoForIndex(index)}
                    alt="PROVEtech Product"
                    className="object-contain"
                    style={{ width: '192px', height: '192px' }}
                    onError={(e) => {
                      const target = e.target as HTMLImageElement;
                      target.style.display = 'none';
                    }}
                  />
                )}
              </div>
              <p className="text-sm text-gray-300 mb-4">{getImageContent(index).description}</p>
              <div className="relative">
                <img
                  src={image.path}
                  alt={image.name}
                  className="w-full max-h-80 object-contain bg-[#001f33]/30 border border-white/10 rounded-lg"
                  style={{ aspectRatio: 'auto' }}
                  onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    target.src = productImage;
                  }}
                />
              </div>
            </div>
          ))}
        </div>
      );
    }

    // Special handling for videos - show all videos stacked vertically
    if (activeTab === 'videos') {
      return (
        <div className="space-y-4">
          {content.videos.map((video, index) => (
            <div key={index} className="bg-[#001f33]/70 border border-white/20 rounded-lg p-4">
              <div className="flex items-center space-x-3 mb-2">
                {productFamily === 'provetech' && (
                  <img
                    src="./products/provetech/main/0-logos/logo1.png"
                    alt="PROVEtech"
                    className="w-8 h-8 object-contain"
                    onError={(e) => {
                      const target = e.target as HTMLImageElement;
                      target.style.display = 'none';
                    }}
                  />
                )}
                {(productFamily === 'ai-core' || productFamily === 'energy-solutions' || productFamily === 'netcomm') && (
                  <img
                    src={getAICoreLogoForIndex(index)}
                    alt={`${productFamily} Product`}
                    className="object-contain"
                    style={{ width: '192px', height: '192px' }}
                    onError={(e) => {
                      const target = e.target as HTMLImageElement;
                      target.style.display = 'none';
                    }}
                  />
                )}
                <h4 className="text-lg font-semibold text-[#ffb81c]">{getVideoContent(index).title}</h4>
              </div>
              <p className="text-sm text-gray-300 mb-4">{getVideoContent(index).description}</p>
              <div className="relative">
                <video
                  src={video.path}
                  controls={false}
                  className="w-full max-h-80 object-contain bg-[#001f33]/30 border border-white/10 rounded-lg cursor-pointer"
                  style={{ aspectRatio: 'auto' }}
                  onClick={() => {
                    setSelectedMediaIndex(index);
                    toggleFullscreen();
                  }}
                  onError={(e) => {
                    const target = e.target as HTMLVideoElement;
                    // Hide the video element and show a fallback message
                    target.style.display = 'none';
                    
                    // Check if fallback already exists to prevent duplicates
                    const existingFallback = target.parentNode?.querySelector('.video-error-fallback');
                    if (!existingFallback) {
                      const fallback = document.createElement('div');
                      fallback.className = 'video-error-fallback flex items-center justify-center min-h-48 bg-[#001f33]/30 border border-white/10 rounded-lg';
                      fallback.innerHTML = '<p class="text-gray-400 text-sm">Video preview not available</p>';
                      target.parentNode?.appendChild(fallback);
                    }
                  }}
                />
              </div>
            </div>
          ))}
        </div>
      );
    }

    return null;
  };

  return (
    <div className="fixed top-0 right-0 h-full w-1/6 backdrop-blur-md bg-[#001f33]/95 border-l border-white/20 shadow-2xl z-50 overflow-y-auto popup-scrollbar">
      <div className="h-full flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-white/10">
          <div className="flex items-center space-x-4">
            <img
              src={productImage}
              alt={productName}
              className="w-12 h-12 object-contain rounded-lg border border-white/20"
            />
            <div>
              <h2 className="text-xl font-bold text-white">{productName}</h2>
              <p className="text-[#ffb81c] text-sm">{familyDisplayNames[productFamily] || productFamily}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="transition-colors z-10"
            style={{ color: 'white' }}
          >
            <X size={20} />
          </button>
        </div>

        {/* Tab Navigation */}
        <div className="flex border-b border-white/10 bg-[#001f33]/50">
          {[
            { id: 'overview', label: 'Overview', icon: '📋' },
            { id: 'presentations', label: 'Presentations', icon: '📊' },
            { id: 'images', label: 'Images', icon: '🖼️' },
            { id: 'videos', label: 'Videos', icon: '🎥' },
            { id: 'documents', label: 'Documents', icon: '📄' }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex-1 px-4 py-3 text-sm font-medium transition-colors border-b-2 ${
                activeTab === tab.id
                  ? 'text-[#ffb81c] border-[#ffb81c] bg-[#001f33]/70'
                  : 'text-gray-300 border-transparent hover:text-white hover:bg-[#001f33]/30'
              }`}
            >
              <span className="mr-2">{tab.icon}</span>
              {tab.label}
            </button>
          ))}
        </div>

        {/* Content */}
        <div className="p-6 flex-1">
          {loading ? (
            <div className="flex items-center justify-center h-96">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#ffb81c]"></div>
            </div>
          ) : activeTab === 'overview' ? (
            <div className="space-y-6">
              <div className="bg-[#001f33]/70 border border-white/20 rounded-lg p-6">
                <h3 className="text-xl font-semibold text-[#ffb81c] mb-4">Product Overview</h3>
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <img
                      src={overviewImage}
                      alt={`${productName} Overview`}
                      className="w-full h-64 object-cover rounded-lg border border-white/10"
                      onError={(e) => {
                        const target = e.target as HTMLImageElement;
                        target.src = productImage;
                      }}
                    />
                  </div>
                  <div className="space-y-4">
                    <div>
                      <h4 className="text-lg font-medium text-white mb-2">Product Family</h4>
                      <p className="text-gray-300">{familyDisplayNames[productFamily] || productFamily}</p>
                    </div>
                    <div>
                      <h4 className="text-lg font-medium text-white mb-2">Description</h4>
                      <p className="text-gray-300">
                        {getProductFamilyInfo(productFamily).description}
                      </p>
                    </div>
                    <div>
                      <h4 className="text-lg font-medium text-white mb-2">Available Content</h4>
                      <div className="grid grid-cols-2 gap-2 text-sm">
                        <div className="flex items-center space-x-2">
                          <span>📊</span>
                          <span className="text-gray-300">{content.presentations.length} Presentations</span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <span>🖼️</span>
                          <span className="text-gray-300">{content.images.length} Images</span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <span>🎥</span>
                          <span className="text-gray-300">{content.videos.length} Videos</span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <span>📄</span>
                          <span className="text-gray-300">{content.documents.length} Documents</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            renderMediaViewer()
          )}
        </div>
      </div>

      {/* Fullscreen Modal */}
      {isFullscreen && currentMedia && (
        <div className="fixed inset-0 bg-black/95 flex items-center justify-center z-60">
          <button
            onClick={toggleFullscreen}
            className="absolute top-4 right-4 w-10 h-10 backdrop-blur-md bg-[#001f33]/90 border border-white/20 rounded-lg flex items-center justify-center hover:bg-[#001f33]/95 z-10"
          >
            <X size={20} color="white" />
          </button>
          
          {currentMediaList.length > 1 && (
            <>
              <button
                onClick={prevMedia}
                className="absolute left-4 top-1/2 transform -translate-y-1/2 w-12 h-12 backdrop-blur-md bg-[#001f33]/90 border border-white/20 rounded-lg flex items-center justify-center hover:bg-[#001f33]/95 z-10"
              >
                <ChevronLeft size={24} color="white" />
              </button>
              <button
                onClick={nextMedia}
                className="absolute right-4 top-1/2 transform -translate-y-1/2 w-12 h-12 backdrop-blur-md bg-[#001f33]/90 border border-white/20 rounded-lg flex items-center justify-center hover:bg-[#001f33]/95 z-10"
              >
                <ChevronRight size={24} color="white" />
              </button>
            </>
          )}

          <div className="w-full h-full flex items-center justify-center p-8">
            {currentMedia.type === 'video' ? (
              <video
                src={currentMedia.path}
                controls
                autoPlay
                className="max-w-full max-h-full object-contain"
                onError={(e) => {
                  const target = e.target as HTMLVideoElement;
                  console.error('Video failed to load:', currentMedia.path);
                }}
              />
            ) : (
              <img
                src={currentMedia.path}
                alt={currentMedia.name}
                className="max-w-full max-h-full object-contain"
                onError={(e) => {
                  const target = e.target as HTMLImageElement;
                  target.src = productImage;
                }}
              />
            )}
          </div>

          {currentMediaList.length > 1 && (
            <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 backdrop-blur-md bg-[#001f33]/90 border border-white/20 px-4 py-2 rounded-lg text-white">
              {selectedMediaIndex + 1} / {currentMediaList.length}
            </div>
          )}
        </div>
      )}
    </div>
  );
}