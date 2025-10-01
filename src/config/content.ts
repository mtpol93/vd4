// Centralized content configuration for easy customization
// Edit this file to change all titles, descriptions, and content throughout the application

export interface ContentConfig {
  // Product family descriptions
  productFamilies: {
    [key: string]: {
      name: string;
      description: string;
      overviewDescription: string;
      logoPath: string;
    };
  };
  
  // Specific media content for each product family
  familyMedia: {
    [key: string]: {
      images: Array<{
        title: string;
        description: string;
        filename: string;
      }>;
      videos: Array<{
        title: string;
        description: string;
        filename: string;
      }>;
      presentations: Array<{
        name: string;
        description: string;
        folderName: string;
      }>;
      documents: Array<{
        name: string;
        description: string;
        folderName: string;
      }>;
      subProducts: Array<{
        name: string;
        displayName: string;
        logoPath: string;
        description: string;
      }>;
    };
  };
  
  // UI and system content
  ui: {
    contactMessage: string;
    emailAddress: string;
    qrCodePath: string;
    fallbackLogoPath: string;
    noMediaMessage: string;
    loadingMessage: string;
    buttonLabels: {
      viewDetails: string;
      viewSlides: string;
      viewDocument: string;
      close: string;
      contactUs: string;
      reset: string;
      windTunnel: string;
    };
  };
}

export const contentConfig: ContentConfig = {
  // Product Family Information
  productFamilies: {
    'akkodis-main': {
      name: 'Akkodis Main',
      description: 'Comprehensive engineering and technology solutions driving innovation across industries. Our flagship platform delivers cutting-edge capabilities for modern industrial challenges.',
      overviewDescription: 'Akkodis Main represents our core engineering excellence, providing comprehensive solutions that bridge the gap between traditional engineering and next-generation technology. Our platform empowers organizations to accelerate innovation, optimize operations, and achieve sustainable growth through advanced technological integration.',
      logoPath: './images/Logo-White-Akkodis.png'
    },
    'ai-core': {
      name: 'AI-Core Platform',
      description: 'Revolutionary artificial intelligence platform transforming industrial processes through advanced machine learning, predictive analytics, and intelligent automation systems.',
      overviewDescription: 'The AI-Core Platform harnesses the power of artificial intelligence to revolutionize industrial operations. Built on cutting-edge machine learning algorithms and neural networks, it provides real-time insights, predictive maintenance capabilities, and intelligent decision-making tools that optimize performance across complex industrial environments.',
      logoPath: './products/ai-core/AI-Core Platform copy copy.png'
    },
    'netcomm': {
      name: 'NetComm Validation',
      description: 'Advanced network communication validation suite ensuring robust, secure, and efficient data transmission across complex industrial networks and IoT ecosystems.',
      overviewDescription: 'NetComm Validation delivers comprehensive network testing and validation capabilities for mission-critical industrial communications. Our solution ensures seamless connectivity, validates protocol compliance, and maintains network integrity across diverse industrial environments, from manufacturing floors to smart city infrastructures.',
      logoPath: './products/netcomm/netcomm-validation copy.png'
    },
    'provetech': {
      name: 'PROVEtech Tool Suite',
      description: 'Comprehensive testing and validation toolkit providing advanced diagnostic capabilities, performance analysis, and quality assurance for complex engineering systems.',
      overviewDescription: 'PROVEtech Tool Suite represents the pinnacle of engineering validation technology. Our comprehensive toolkit enables engineers to conduct thorough testing, performance analysis, and quality validation across diverse systems, ensuring reliability, safety, and optimal performance in demanding industrial applications.',
      logoPath: './products/provetech/PROVEtech.png'
    },
    'energy-solutions': {
      name: 'Energy Solutions',
      description: 'Sustainable energy management platform optimizing power distribution, renewable integration, and energy efficiency across industrial and commercial applications.',
      overviewDescription: 'Our Energy Solutions platform addresses the critical need for sustainable and efficient energy management in modern industrial operations. Through advanced monitoring, intelligent distribution systems, and renewable energy integration, we help organizations reduce their carbon footprint while optimizing energy costs and reliability.',
      logoPath: './products/energy-solutions/Energy-Solutions.png'
    }
  },

  // Family-specific media content
  familyMedia: {
    'ai-core': {
      images: [
        {
          title: 'AI-Core Dashboard Overview',
          description: 'Comprehensive dashboard showcasing real-time AI analytics, performance metrics, and system status indicators for optimal operational oversight.',
          filename: 'image1.jpg'
        },
        {
          title: 'Machine Learning Pipeline Visualization',
          description: 'Advanced visualization of machine learning workflows, data processing stages, and model training progress with detailed performance analytics.',
          filename: 'image2.jpg'
        },
        {
          title: 'Predictive Analytics Interface',
          description: 'Intuitive interface displaying predictive maintenance schedules, failure probability assessments, and optimization recommendations.',
          filename: 'image3.jpg'
        },
        {
          title: 'Neural Network Architecture Display',
          description: 'Detailed visualization of neural network structures, layer configurations, and data flow patterns for deep learning applications.',
          filename: 'image4.jpg'
        },
        {
          title: 'Real-time Performance Monitoring',
          description: 'Live performance monitoring dashboard with key performance indicators, system health metrics, and operational efficiency tracking.',
          filename: 'image5.jpg'
        },
        {
          title: 'AI Model Training Progress',
          description: 'Comprehensive view of AI model training processes, accuracy improvements, and validation results across multiple iterations.',
          filename: 'image6.jpg'
        },
        {
          title: 'Data Processing Pipeline',
          description: 'Visual representation of data ingestion, processing, and transformation workflows with quality assurance checkpoints.',
          filename: 'image7.jpg'
        },
        {
          title: 'Intelligent Automation Controls',
          description: 'Advanced control interface for automated processes, decision trees, and intelligent system responses to operational conditions.',
          filename: 'image8.jpg'
        },
        {
          title: 'System Integration Overview',
          description: 'Comprehensive view of system integrations, API connections, and data exchange protocols across enterprise platforms.',
          filename: 'image9.jpg'
        },
        {
          title: 'Advanced Analytics Reporting',
          description: 'Detailed analytics reports with trend analysis, performance comparisons, and actionable insights for strategic decision-making.',
          filename: 'image10.jpg'
        },
        {
          title: 'AI Configuration Management',
          description: 'Centralized configuration management interface for AI parameters, model settings, and system optimization controls.',
          filename: 'image11.jpg'
        },
        {
          title: 'Quality Assurance Dashboard',
          description: 'Comprehensive quality assurance monitoring with automated testing results, compliance tracking, and validation reports.',
          filename: 'image12.jpg'
        },
        {
          title: 'Strategic Implementation View',
          description: 'High-level strategic overview of AI implementation progress, milestone tracking, and success metrics across organizational units.',
          filename: 'image13.jpg'
        }
      ],
      videos: [
        {
          title: 'AI-Core Platform Complete Demonstration',
          description: 'Comprehensive demonstration of the AI-Core Platform showcasing key features, capabilities, and real-world implementation scenarios.',
          filename: 'video1.webm'
        },
        {
          title: 'Machine Learning Workflow Tutorial',
          description: 'Step-by-step tutorial covering machine learning workflow creation, model training, and deployment processes within the platform.',
          filename: 'Video2.mp4'
        },
        {
          title: 'Predictive Analytics Implementation Guide',
          description: 'Detailed guide on implementing predictive analytics solutions, configuring models, and interpreting results for operational optimization.',
          filename: 'video3.mp4'
        },
        {
          title: 'Advanced AI Features Walkthrough',
          description: 'In-depth walkthrough of advanced AI features including neural network configuration, deep learning capabilities, and custom model development.',
          filename: 'Video4.mp4'
        },
        {
          title: 'Integration and Deployment Best Practices',
          description: 'Best practices guide for integrating AI-Core Platform with existing systems, deployment strategies, and performance optimization techniques.',
          filename: 'Video5.mp4'
        }
      ],
      presentations: [
        {
          name: 'AI-Core Platform Technical Overview',
          description: 'Comprehensive technical presentation covering platform architecture, core capabilities, and implementation strategies for enterprise environments.',
          folderName: 'presentation1'
        },
        {
          name: 'Machine Learning Solutions Portfolio',
          description: 'Detailed portfolio presentation showcasing machine learning solutions, case studies, and success stories across various industry verticals.',
          folderName: 'presentation2'
        },
        {
          name: 'AI Implementation Roadmap',
          description: 'Strategic roadmap presentation outlining AI implementation phases, timeline considerations, and success metrics for organizational transformation.',
          folderName: 'presentation3'
        }
      ],
      documents: [],
      subProducts: [
        {
          name: 'AId',
          displayName: 'AI Development Suite',
          logoPath: './products/ai-core/products/AId.png',
          description: 'Advanced AI development environment with integrated tools for model creation, training, and deployment.'
        },
        {
          name: 'Meta',
          displayName: 'Meta Analytics Engine',
          logoPath: './products/ai-core/products/Meta.png',
          description: 'Powerful meta-analytics engine providing deep insights into AI model performance and optimization opportunities.'
        },
        {
          name: 'OneAI',
          displayName: 'Unified AI Platform',
          logoPath: './products/ai-core/products/OneAI.png',
          description: 'Unified AI platform integrating multiple AI services and capabilities into a single, cohesive solution.'
        },
        {
          name: 'Agentic',
          displayName: 'Agentic AI Framework',
          logoPath: './products/ai-core/products/Agentic.png',
          description: 'Advanced agentic AI framework enabling autonomous decision-making and intelligent process automation.'
        },
        {
          name: 'ChatNow',
          displayName: 'Conversational AI Interface',
          logoPath: './products/ai-core/products/ChatNow.png',
          description: 'Sophisticated conversational AI interface providing natural language interaction with AI systems.'
        },
        {
          name: 'TestAId',
          displayName: 'AI Testing Assistant',
          logoPath: './products/ai-core/products/TestAId.png',
          description: 'Intelligent testing assistant leveraging AI to automate test case generation and validation processes.'
        }
      ]
    },
    'netcomm': {
      images: [
        {
          title: 'Network Validation Dashboard',
          description: 'Comprehensive network validation dashboard displaying real-time connectivity status, protocol compliance, and performance metrics.',
          filename: 'image1.jpg'
        },
        {
          title: 'Communication Protocol Analysis',
          description: 'Detailed analysis interface for communication protocols, showing data flow patterns, error rates, and optimization recommendations.',
          filename: 'image2.jpg'
        },
        {
          title: 'Network Security Monitoring',
          description: 'Advanced security monitoring interface tracking network threats, access patterns, and compliance with security protocols.',
          filename: 'image3.webp'
        }
      ],
      videos: [],
      presentations: [
        {
          name: 'NetComm Validation Technical Specifications',
          description: 'Technical specification document covering NetComm validation capabilities, supported protocols, and implementation requirements.',
          folderName: 'presentation1'
        }
      ],
      documents: [],
      subProducts: [
        {
          name: 'DWT',
          displayName: 'Data Workflow Testing',
          logoPath: './products/netcomm/products/DWT.png',
          description: 'Comprehensive data workflow testing solution ensuring reliable data transmission and processing.'
        },
        {
          name: 'NTS',
          displayName: 'Network Testing Suite',
          logoPath: './products/netcomm/products/NTS.png',
          description: 'Complete network testing suite providing end-to-end validation of network infrastructure and performance.'
        },
        {
          name: 'OTS',
          displayName: 'Operational Testing System',
          logoPath: './products/netcomm/products/OTS.png',
          description: 'Operational testing system designed for continuous monitoring and validation of live network operations.'
        },
        {
          name: 'RTS',
          displayName: 'Real-time Testing Solution',
          logoPath: './products/netcomm/products/RTS.png',
          description: 'Real-time testing solution providing immediate feedback on network performance and reliability metrics.'
        }
      ]
    },
    'provetech': {
      images: [
        {
          title: 'PROVEtech Testing Interface',
          description: 'Advanced testing interface providing comprehensive diagnostic capabilities and real-time performance analysis for engineering systems.',
          filename: 'image1.jpg'
        },
        {
          title: 'Quality Assurance Dashboard',
          description: 'Centralized quality assurance dashboard displaying test results, compliance metrics, and validation status across multiple systems.',
          filename: 'image2.jpg'
        },
        {
          title: 'Performance Analysis Visualization',
          description: 'Detailed performance analysis visualization showing system behavior, stress test results, and optimization opportunities.',
          filename: 'image3.jpg'
        }
      ],
      videos: [
        {
          title: 'PROVEtech Tool Suite Demonstration',
          description: 'Complete demonstration of PROVEtech Tool Suite capabilities, testing methodologies, and validation processes for engineering applications.',
          filename: 'video1.mp4'
        }
      ],
      presentations: [
        {
          name: 'PROVEtech Testing Methodologies',
          description: 'Comprehensive presentation covering PROVEtech testing methodologies, validation frameworks, and quality assurance processes.',
          folderName: 'presentation1'
        },
        {
          name: 'Advanced Diagnostic Capabilities',
          description: 'Detailed presentation showcasing advanced diagnostic capabilities, performance analysis tools, and system optimization features.',
          folderName: 'presentation2'
        },
        {
          name: 'Quality Assurance Framework',
          description: 'Framework presentation outlining quality assurance processes, compliance standards, and validation procedures for engineering systems.',
          folderName: 'presentation3'
        }
      ],
      documents: [],
      subProducts: [
        {
          name: 'D-PDU-API',
          displayName: 'Diagnostic PDU API',
          logoPath: './products/provetech/products/D-PDU-API.png',
          description: 'Diagnostic Protocol Data Unit API providing standardized access to vehicle diagnostic systems.'
        },
        {
          name: 'PROVEtechRE',
          displayName: 'Requirements Engineering',
          logoPath: './products/provetech/products/PROVEtechRE.png',
          description: 'Requirements engineering tool ensuring comprehensive specification management and validation processes.'
        },
        {
          name: 'PROVEtechTA',
          displayName: 'Test Automation',
          logoPath: './products/provetech/products/PROVEtechTA.png',
          description: 'Advanced test automation platform streamlining testing processes and improving validation efficiency.'
        },
        {
          name: 'PROVEtechIVIY',
          displayName: 'Integration Verification',
          logoPath: './products/provetech/products/PROVEtechIVIY.png',
          description: 'Integration verification system ensuring seamless system integration and interoperability validation.'
        }
      ]
    },
    'energy-solutions': {
      images: [
        {
          title: 'Energy Management Dashboard',
          description: 'Comprehensive energy management dashboard displaying real-time consumption, distribution patterns, and efficiency metrics.',
          filename: 'image1.jpg'
        },
        {
          title: 'Renewable Energy Integration',
          description: 'Advanced interface showing renewable energy integration status, grid connectivity, and sustainable power distribution management.',
          filename: 'image2.jpg'
        },
        {
          title: 'Power Distribution Monitoring',
          description: 'Detailed power distribution monitoring system with load balancing, fault detection, and optimization recommendations.',
          filename: 'image3.jpg'
        },
        {
          title: 'Energy Efficiency Analytics',
          description: 'Comprehensive energy efficiency analytics platform providing insights into consumption patterns and optimization opportunities.',
          filename: 'image4.jpg'
        }
      ],
      videos: [
        {
          title: 'Energy Solutions Platform Overview',
          description: 'Complete overview of Energy Solutions platform capabilities, sustainable energy management features, and implementation benefits.',
          filename: 'video1.webm'
        },
        {
          title: 'Renewable Energy Integration Guide',
          description: 'Detailed guide on renewable energy integration processes, grid connectivity options, and sustainable power management strategies.',
          filename: 'video2.webm'
        },
        {
          title: 'Smart Grid Management Tutorial',
          description: 'Comprehensive tutorial on smart grid management, load balancing techniques, and automated power distribution optimization.',
          filename: 'video3.webm'
        },
        {
          title: 'Energy Efficiency Optimization',
          description: 'Advanced tutorial on energy efficiency optimization, consumption analysis, and cost reduction strategies for industrial applications.',
          filename: 'video4.webm'
        },
        {
          title: 'Sustainable Power Solutions',
          description: 'Overview of sustainable power solutions, environmental impact reduction, and green energy implementation best practices.',
          filename: 'video5.webm'
        }
      ],
      presentations: [
        {
          name: 'Energy Solutions Strategic Overview',
          description: 'Strategic overview presentation covering energy solutions portfolio, sustainability initiatives, and implementation roadmap for organizations.',
          folderName: 'presentation1'
        }
      ],
      documents: [
        {
          name: 'Energy Management Best Practices',
          description: 'Comprehensive documentation covering energy management best practices, optimization strategies, and implementation guidelines.',
          folderName: 'document1'
        },
        {
          name: 'Renewable Integration Guide',
          description: 'Detailed guide for renewable energy integration, covering technical requirements, implementation phases, and success metrics.',
          folderName: 'document2'
        },
        {
          name: 'Sustainability Compliance Framework',
          description: 'Framework documentation for sustainability compliance, regulatory requirements, and environmental impact assessment procedures.',
          folderName: 'document3'
        },
        {
          name: 'Smart Grid Implementation Manual',
          description: 'Technical manual for smart grid implementation, covering system architecture, deployment strategies, and operational procedures.',
          folderName: 'document4'
        }
      ],
      subProducts: [
        {
          name: 'EVAcharge',
          displayName: 'Electric Vehicle Charging',
          logoPath: './products/energy-solutions/products/EVAcharge.png',
          description: 'Advanced electric vehicle charging infrastructure with smart grid integration and load management capabilities.'
        },
        {
          name: 'Break Out Box',
          displayName: 'Power Distribution Hub',
          logoPath: './products/energy-solutions/products/Break Out Box.png',
          description: 'Intelligent power distribution hub providing flexible connectivity and automated load balancing for industrial applications.'
        },
        {
          name: 'Energy Containers',
          displayName: 'Modular Energy Storage',
          logoPath: './products/energy-solutions/products/Energy Containers.png',
          description: 'Modular energy storage containers offering scalable power solutions with integrated monitoring and management systems.'
        },
        {
          name: 'Charging Infrastructure',
          displayName: 'Charging Network Management',
          logoPath: './products/energy-solutions/products/Charging Infrastructure.png',
          description: 'Comprehensive charging network management system optimizing charging station operations and user experience.'
        }
      ]
    },
    'akkodis-main': {
      images: [],
      videos: [],
      presentations: [
        {
          name: 'Akkodis Corporate Overview',
          description: 'Corporate overview presentation showcasing Akkodis capabilities, service portfolio, and strategic vision for engineering excellence.',
          folderName: 'presentation1'
        }
      ],
      documents: [],
      subProducts: []
    }
  },

  // UI and system content
  ui: {
    contactMessage: 'Thank you for your interest in our innovative solutions! We\'re here to help you transform your operations and achieve exceptional results.',
    emailAddress: 'marketing-products@akkodis.com',
    qrCodePath: './images/qrcode.png',
    fallbackLogoPath: './images/logo.png',
    noMediaMessage: 'Additional media content will be available soon. Please check back for updates or contact us for more information.',
    loadingMessage: 'Loading comprehensive content and media resources...',
    buttonLabels: {
      viewDetails: 'View Details',
      viewSlides: 'View Slides',
      viewDocument: 'View Document',
      close: 'Close',
      contactUs: 'Contact Us',
      reset: 'Reset',
      windTunnel: 'Wind Tunnel'
    }
  }
};

// Helper functions for easy content access
export const getProductFamilyInfo = (familyId: string) => {
  return contentConfig.productFamilies[familyId] || {
    name: familyId,
    description: 'Advanced solution providing cutting-edge capabilities for modern industrial applications.',
    overviewDescription: 'This solution delivers comprehensive capabilities designed to meet demanding requirements and drive operational excellence.',
    logoPath: contentConfig.ui.fallbackLogoPath
  };
};

export const getFamilyMedia = (familyId: string) => {
  return contentConfig.familyMedia[familyId] || {
    images: [],
    videos: [],
    presentations: [],
    documents: [],
    subProducts: []
  };
};