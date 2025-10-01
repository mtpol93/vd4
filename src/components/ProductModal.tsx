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
                        className="absolute left-2 top-1/2 transform -translate-y-1/2 w-7 h-7 backdrop-blur-md bg-[#001f33]/90 border border-white