// Centralized content configuration for easy customization
// Edit this file to change all titles, descriptions, and content throughout the application

export interface ContentConfig {
  // Product family descriptions
  productFamilies: {
    [key: string]: {
      name: string;
      description: string;
      overviewDescription: string;
    };
  };
  
  // Media content titles and descriptions
  mediaContent: {
    images: {
      titles: string[];
      descriptions: string[];
    };
    videos: {
      titles: string[];
      descriptions: string[];
    };
    presentations: {
      descriptions: string[];
    };
    documents: {
      descriptions: string[];
    };
  };
  
  // Contact and general content
  general: {
    contactMessage: string;
    emailAddress: string;
    noMediaMessage: string;
    loadingMessage: string;
  };
}

export const contentConfig: ContentConfig = {
  // Product Family Information
  productFamilies: {
    'akkodis-main': {
      name: 'Akkodis Main',
      description: 'Comprehensive engineering and technology solutions driving innovation across industries. Our flagship platform delivers cutting-edge capabilities for modern industrial challenges.',
      overviewDescription: 'Akkodis Main represents our core engineering excellence, providing comprehensive solutions that bridge the gap between traditional engineering and next-generation technology. Our platform empowers organizations to accelerate innovation, optimize operations, and achieve sustainable growth through advanced technological integration.'
    },
    'ai-core': {
      name: 'AI-Core Platform',
      description: 'Revolutionary artificial intelligence platform transforming industrial processes through advanced machine learning, predictive analytics, and intelligent automation systems.',
      overviewDescription: 'The AI-Core Platform harnesses the power of artificial intelligence to revolutionize industrial operations. Built on cutting-edge machine learning algorithms and neural networks, it provides real-time insights, predictive maintenance capabilities, and intelligent decision-making tools that optimize performance across complex industrial environments.'
    },
    'netcomm': {
      name: 'NetComm Validation',
      description: 'Advanced network communication validation suite ensuring robust, secure, and efficient data transmission across complex industrial networks and IoT ecosystems.',
      overviewDescription: 'NetComm Validation delivers comprehensive network testing and validation capabilities for mission-critical industrial communications. Our solution ensures seamless connectivity, validates protocol compliance, and maintains network integrity across diverse industrial environments, from manufacturing floors to smart city infrastructures.'
    },
    'provetech': {
      name: 'PROVEtech Tool Suite',
      description: 'Comprehensive testing and validation toolkit providing advanced diagnostic capabilities, performance analysis, and quality assurance for complex engineering systems.',
      overviewDescription: 'PROVEtech Tool Suite represents the pinnacle of engineering validation technology. Our comprehensive toolkit enables engineers to conduct thorough testing, performance analysis, and quality validation across diverse systems, ensuring reliability, safety, and optimal performance in demanding industrial applications.'
    },
    'energy-solutions': {
      name: 'Energy Solutions',
      description: 'Sustainable energy management platform optimizing power distribution, renewable integration, and energy efficiency across industrial and commercial applications.',
      overviewDescription: 'Our Energy Solutions platform addresses the critical need for sustainable and efficient energy management in modern industrial operations. Through advanced monitoring, intelligent distribution systems, and renewable energy integration, we help organizations reduce their carbon footprint while optimizing energy costs and reliability.'
    }
  },

  // Media Content Configuration
  mediaContent: {
    images: {
      titles: [
        'Advanced System Architecture Overview',
        'Real-time Performance Dashboard',
        'Integrated Control Interface',
        'Comprehensive Analytics Platform',
        'Intelligent Monitoring System',
        'Automated Workflow Management',
        'Predictive Maintenance Interface',
        'Quality Assurance Framework',
        'Security Management Console',
        'Operational Excellence Dashboard',
        'Strategic Implementation View',
        'Performance Optimization Tools',
        'Advanced Configuration Panel',
        'System Integration Overview',
        'Comprehensive Reporting Suite'
      ],
      descriptions: [
        'Detailed visualization showcasing the comprehensive system architecture and core components that drive operational excellence.',
        'Interactive dashboard providing real-time insights into system performance, key metrics, and operational status indicators.',
        'Intuitive control interface designed for seamless user interaction and efficient system management across all operational levels.',
        'Advanced analytics platform delivering deep insights through sophisticated data processing and intelligent reporting capabilities.',
        'Comprehensive monitoring system providing continuous oversight of critical parameters and automated alert mechanisms.',
        'Streamlined workflow management interface enabling efficient process automation and optimized operational sequences.',
        'Predictive maintenance dashboard utilizing advanced algorithms to forecast system needs and prevent operational disruptions.',
        'Robust quality assurance framework ensuring consistent performance standards and compliance with industry regulations.',
        'Centralized security management console providing comprehensive protection and monitoring of all system components.',
        'Operational excellence dashboard highlighting key performance indicators and strategic metrics for informed decision-making.',
        'Strategic implementation overview demonstrating successful deployment methodologies and best practices.',
        'Advanced performance optimization tools designed to maximize efficiency and minimize operational overhead.',
        'Comprehensive configuration panel enabling precise system customization and parameter adjustment capabilities.',
        'System integration overview showcasing seamless connectivity and interoperability across diverse platforms.',
        'Detailed reporting suite providing comprehensive documentation and analysis of all operational aspects.'
      ]
    },
    videos: {
      titles: [
        'Complete System Demonstration',
        'Advanced Feature Walkthrough',
        'Implementation Best Practices',
        'Performance Optimization Guide',
        'Comprehensive Training Overview',
        'Integration Methodology Demo',
        'Troubleshooting and Maintenance',
        'Security Configuration Guide',
        'Workflow Automation Tutorial',
        'Advanced Analytics Showcase'
      ],
      descriptions: [
        'Comprehensive video demonstration showcasing complete system capabilities, key features, and practical implementation scenarios.',
        'In-depth walkthrough of advanced features and functionalities, highlighting innovative capabilities and user benefits.',
        'Detailed guide covering implementation best practices, deployment strategies, and optimization techniques for maximum effectiveness.',
        'Performance optimization tutorial demonstrating advanced techniques for system tuning and efficiency improvements.',
        'Complete training overview providing comprehensive education on system operation, maintenance, and advanced usage scenarios.',
        'Integration methodology demonstration showing seamless connectivity with existing systems and third-party platforms.',
        'Comprehensive troubleshooting guide covering common issues, maintenance procedures, and preventive care strategies.',
        'Security configuration tutorial ensuring robust protection and compliance with industry security standards.',
        'Workflow automation demonstration highlighting process optimization and intelligent task management capabilities.',
        'Advanced analytics showcase demonstrating powerful data processing, visualization, and insight generation capabilities.'
      ]
    },
    presentations: {
      descriptions: [
        'Comprehensive presentation covering technical specifications, implementation strategies, and practical applications with detailed analysis.',
        'Strategic overview presentation highlighting key benefits, competitive advantages, and successful deployment case studies.',
        'Technical deep-dive presentation exploring advanced features, architectural components, and integration possibilities.',
        'Implementation roadmap presentation outlining deployment phases, timeline considerations, and success metrics.',
        'Performance analysis presentation demonstrating measurable improvements, efficiency gains, and ROI calculations.'
      ]
    },
    documents: {
      descriptions: [
        'Comprehensive technical documentation providing detailed specifications, implementation guidelines, and operational procedures.',
        'Strategic planning document outlining deployment strategies, best practices, and success criteria for optimal implementation.',
        'Advanced configuration guide covering system customization, parameter optimization, and integration requirements.',
        'Quality assurance documentation ensuring compliance with industry standards and regulatory requirements.',
        'Maintenance and support documentation providing comprehensive guidance for ongoing system care and optimization.'
      ]
    }
  },

  // General Content
  general: {
    contactMessage: 'Thank you for your interest in our innovative solutions! We\'re here to help you transform your operations and achieve exceptional results.',
    emailAddress: 'marketing-products@akkodis.com',
    noMediaMessage: 'Additional media content will be available soon. Please check back for updates or contact us for more information.',
    loadingMessage: 'Loading comprehensive content and media resources...'
  }
};

// Helper functions for easy content access
export const getImageContent = (familyId: string, index: number) => {
  const family = contentConfig.productFamilies[familyId];
  if (!family || !family.media.images[index]) {
    return {
      title: 'System Overview',
      description: 'Comprehensive system visualization and interface overview.',
      filename: `image${index + 1}.jpg`
    };
  }
  return family.media.images[index];
};

export const getVideoContent = (familyId: string, index: number) => {
  const family = contentConfig.productFamilies[familyId];
  if (!family || !family.media.videos[index]) {
    return {
      title: 'System Demonstration',
      description: 'Comprehensive system demonstration and feature overview.',
      filename: `video${index + 1}.mp4`
    };
  }
  return family.media.videos[index];
};

export const getPresentationDescription = (familyId: string, index: number) => {
  const family = contentConfig.productFamilies[familyId];
  if (!family || !family.media.presentations[index]) {
    return 'Comprehensive presentation covering technical specifications and implementation strategies.';
  }
  return family.media.presentations[index].description;
};

export const getDocumentDescription = (familyId: string, index: number) => {
  const family = contentConfig.productFamilies[familyId];
  if (!family || !family.media.documents[index]) {
    return 'Comprehensive technical documentation providing detailed specifications and guidelines.';
  }
  return family.media.documents[index].description;
};

// Helper functions for easy content access
export const getProductFamilyInfo = (familyId: string) => {
  return contentConfig.productFamilies[familyId] || {
    name: familyId,
    description: 'Advanced solution providing cutting-edge capabilities for modern industrial applications.',
    overviewDescription: 'This solution delivers comprehensive capabilities designed to meet demanding requirements and drive operational excellence.'
  };
};

export const getImageContent = (index: number) => {
  const images = contentConfig.mediaContent.images;
  return {
    title: images.titles[index % images.titles.length],
    description: images.descriptions[index % images.descriptions.length]
  };
};

export const getVideoContent = (index: number) => {
  const videos = contentConfig.mediaContent.videos;
  return {
    title: videos.titles[index % videos.titles.length],
    description: videos.descriptions[index % videos.descriptions.length]
  };
};

export const getPresentationDescription = (index: number) => {
  const presentations = contentConfig.mediaContent.presentations;
  return presentations.descriptions[index % presentations.descriptions.length];
};

export const getDocumentDescription = (index: number) => {
  const documents = contentConfig.mediaContent.documents;
  return documents.descriptions[index % documents.descriptions.length];
};