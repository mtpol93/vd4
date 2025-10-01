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
      logos: [
        {
          name: 'Energy Logo 1',
          path: './products/energy-solutions/main/0-logos/logo1.png'
        },
        {
          name: 'Energy Logo 2', 
          path: './products/energy-solutions/main/0-logos/logo2.png'
        },
        {
          name: 'Energy Logo 3',
          path: './products/energy-solutions/main/0-logos/logo3.png'
        },
        {
          name: 'Energy Logo 4',
          path: './products/energy-solutions/main/0-logos/logo4.png'
        }
      ],
    }
  },

  // Media Content Configuration
  mediaContent: {
    images: {
      titles: [
        'Lorem Ipsum Dolor Sit Amet Image 1',
        'Consectetur Adipiscing Elit Image 2',
        'Sed Do Eiusmod Tempor Image 3',
        'Incididunt Ut Labore Image 4',
        'Et Dolore Magna Aliqua Image 5',
        'Ut Enim Ad Minim Image 6',
        'Veniam Quis Nostrud Image 7',
        'Exercitation Ullamco Laboris Image 8',
        'Nisi Ut Aliquip Ex Image 9',
        'Ea Commodo Consequat Image 10',
        'Duis Aute Irure Dolor Image 11',
        'In Reprehenderit Voluptate Image 12',
        'Velit Esse Cillum Image 13',
        'Dolore Eu Fugiat Image 14',
        'Nulla Pariatur Excepteur Image 15'
      ],
      descriptions: [
        'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.',
        'Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.',
        'Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium, totam rem aperiam, eaque ipsa quae ab illo inventore veritatis et quasi architecto beatae vitae dicta sunt.',
        'At vero eos et accusamus et iusto odio dignissimos ducimus qui blanditiis praesentium voluptatum deleniti atque corrupti quos dolores et quas molestias excepturi sint occaecati cupiditate non provident.',
        'Similique sunt in culpa qui officia deserunt mollitia animi, id est laborum et dolorum fuga. Et harum quidem rerum facilis est et expedita distinctio nam libero tempore cum soluta nobis est eligendi optio.',
        'Cumque nihil impedit quo minus id quod maxime placeat facere possimus, omnis voluptas assumenda est, omnis dolor repellendus. Temporibus autem quibusdam et aut officiis debitis aut rerum necessitatibus saepe.',
        'Eveniet ut et voluptates repudiandae sint et molestiae non recusandae. Itaque earum rerum hic tenetur a sapiente delectus, ut aut reiciendis voluptatibus maiores alias consequatur aut perferendis doloribus asperiores.',
        'Repellat enim ipsam voluptatem quia voluptas sit aspernatur aut odit aut fugit, sed quia consequuntur magni dolores eos qui ratione voluptatem sequi nesciunt neque porro quisquam est qui dolorem.',
        'Ipsum quia dolor sit amet, consectetur, adipisci velit, sed quia non numquam eius modi tempora incidunt ut labore et dolore magnam aliquam quaerat voluptatem ut enim ad minima veniam.',
        'Ut aut reiciendis voluptatibus maiores alias consequatur aut perferendis doloribus asperiores repellat. Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium.',
        'Totam rem aperiam, eaque ipsa quae ab illo inventore veritatis et quasi architecto beatae vitae dicta sunt explicabo. Nemo enim ipsam voluptatem quia voluptas sit aspernatur aut odit aut fugit.',
        'Sed quia consequuntur magni dolores eos qui ratione voluptatem sequi nesciunt. Neque porro quisquam est, qui dolorem ipsum quia dolor sit amet, consectetur, adipisci velit.',
        'Sed quia non numquam eius modi tempora incidunt ut labore et dolore magnam aliquam quaerat voluptatem. Ut enim ad minima veniam, quis nostrum exercitationem ullam corporis suscipit laboriosam.',
        'Nisi ut aliquid ex ea commodi consequatur? Quis autem vel eum iure reprehenderit qui in ea voluptate velit esse quam nihil molestiae consequatur, vel illum qui dolorem eum fugiat quo voluptas nulla pariatur.',
        'At vero eos et accusamus et iusto odio dignissimos ducimus qui blanditiis praesentium voluptatum deleniti atque corrupti quos dolores et quas molestias excepturi sint occaecati cupiditate non provident, similique sunt in culpa.'
      ]
    },
    videos: {
      titles: [
        'Lorem Ipsum Video Demonstration 1',
        'Consectetur Adipiscing Video 2',
        'Sed Do Eiusmod Video Tutorial 3',
        'Incididunt Ut Labore Video 4',
        'Et Dolore Magna Video Guide 5',
        'Ut Enim Ad Minim Video 6',
        'Veniam Quis Nostrud Video 7',
        'Exercitation Ullamco Video 8',
        'Nisi Ut Aliquip Video Demo 9',
        'Ea Commodo Consequat Video 10'
      ],
      descriptions: [
        'Lorem ipsum dolor sit amet video content, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris.',
        'Duis aute irure dolor video tutorial in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt.',
        'Sed ut perspiciatis video demonstration unde omnis iste natus error sit voluptatem accusantium doloremque laudantium, totam rem aperiam, eaque ipsa quae ab illo inventore veritatis et quasi architecto.',
        'At vero eos video guide et accusamus et iusto odio dignissimos ducimus qui blanditiis praesentium voluptatum deleniti atque corrupti quos dolores et quas molestias excepturi sint occaecati.',
        'Similique sunt video training in culpa qui officia deserunt mollitia animi, id est laborum et dolorum fuga. Et harum quidem rerum facilis est et expedita distinctio nam libero tempore.',
        'Cumque nihil video tutorial impedit quo minus id quod maxime placeat facere possimus, omnis voluptas assumenda est, omnis dolor repellendus. Temporibus autem quibusdam et aut officiis debitis.',
        'Ut et voluptates video demo repudiandae sint et molestiae non recusandae. Itaque earum rerum hic tenetur a sapiente delectus, ut aut reiciendis voluptatibus maiores alias consequatur.',
        'Nam libero video showcase tempore, cum soluta nobis est eligendi optio cumque nihil impedit quo minus id quod maxime placeat facere possimus, omnis voluptas assumenda est.',
        'Temporibus autem video walkthrough quibusdam et aut officiis debitis aut rerum necessitatibus saepe eveniet ut et voluptates repudiandae sint et molestiae non recusandae itaque earum.',
        'Ut aut reiciendis video presentation voluptatibus maiores alias consequatur aut perferendis doloribus asperiores repellat. Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium.'
      ]
    },
    presentations: {
      descriptions: [
        'Lorem ipsum presentation dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation.',
        'Duis aute irure presentation dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia.',
        'Sed ut perspiciatis presentation unde omnis iste natus error sit voluptatem accusantium doloremque laudantium, totam rem aperiam, eaque ipsa quae ab illo inventore veritatis et quasi.',
        'At vero eos presentation et accusamus et iusto odio dignissimos ducimus qui blanditiis praesentium voluptatum deleniti atque corrupti quos dolores et quas molestias excepturi sint occaecati.',
        'Similique sunt presentation in culpa qui officia deserunt mollitia animi, id est laborum et dolorum fuga. Et harum quidem rerum facilis est et expedita distinctio nam libero tempore.'
      ]
    },
    documents: {
      descriptions: [
        'Lorem ipsum document dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation.',
        'Duis aute irure document dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia.',
        'Sed ut perspiciatis document unde omnis iste natus error sit voluptatem accusantium doloremque laudantium, totam rem aperiam, eaque ipsa quae ab illo inventore veritatis et quasi.',
        'At vero eos document et accusamus et iusto odio dignissimos ducimus qui blanditiis praesentium voluptatum deleniti atque corrupti quos dolores et quas molestias excepturi sint occaecati.',
        'Similique sunt document in culpa qui officia deserunt mollitia animi, id est laborum et dolorum fuga. Et harum quidem rerum facilis est et expedita distinctio nam libero tempore.'
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