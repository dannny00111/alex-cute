import React, { useState, useEffect, useRef, useCallback } from 'react';
import './App.css';

const ChristeningLandingPage = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('photos');
  const [selectedMedia, setSelectedMedia] = useState(null);
  const [showLightbox, setShowLightbox] = useState(false);
  const [mediaData, setMediaData] = useState({ photos: [], videos: [] });
  const [isLoadingMedia, setIsLoadingMedia] = useState(false);
  const [scrollProgress, setScrollProgress] = useState(0);
  const [showFloatingNav, setShowFloatingNav] = useState(false);
  const [lightboxIndex, setLightboxIndex] = useState(0);
  const [showGuestBook, setShowGuestBook] = useState(false);
  const [guestComments, setGuestComments] = useState([]);
  const [mediaReactions, setMediaReactions] = useState({});
  const [galleryLayout, setGalleryLayout] = useState('masonry');
  const [showStoryMode, setShowStoryMode] = useState(false);
  
  // ================== ENHANCED STATE FOR BETTER UX ==================
  const [particles, setParticles] = useState([]);
  const [showImmersiveMode, setShowImmersiveMode] = useState(false);
  const [immersiveMedia, setImmersiveMedia] = useState(null);
  const [photoViewerState, setPhotoViewerState] = useState({ zoom: 1, x: 0, y: 0 });
  const [cursorTrails, setCursorTrails] = useState([]);
  const [showTimeline, setShowTimeline] = useState(false);
  const [timelineItems, setTimelineItems] = useState([]);
  const [showCollageBuilder, setShowCollageBuilder] = useState(false);
  const [collageItems, setCollageItems] = useState([]);
  const [gallery3DMode, setGallery3DMode] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [showAboutSection, setShowAboutSection] = useState(false);
  const [showDetailsPanel, setShowDetailsPanel] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [darkMode, setDarkMode] = useState(false);
  
  // Collapsible sections state - start most sections collapsed for minimal view
  const [collapsedSections, setCollapsedSections] = useState({
    galleryIntro: true,
    testimonials: true,
    guestBook: false,
    aboutNames: true,
    timeline: false
  });
  
  // Refs for scroll animations and interactions
  const heroRef = useRef(null);
  const galleryRef = useRef(null);
  const testimonialsRef = useRef(null);
  const photoViewerRef = useRef(null);
  const collageCanvasRef = useRef(null);
  const backgroundVideoRef = useRef(null);

  // Google Drive API configuration
  const FOLDER_ID = "1sk7C-nQPr2yfFtbpQGjFO1OPlXp9HPB9";
  const API_KEY = "AIzaSyCMaBUGCG5oZUdoF1VZz-wKQehd_ktYA5I";

  // Video configuration
  const BACKGROUND_VIDEO_ID = "1IWNvGhXP1LKhi_CR2y_LJsxy6ikQ9F7q";
  const BACKGROUND_VIDEO_URL = `https://drive.google.com/uc?export=download&id=${BACKGROUND_VIDEO_ID}`;
  
  // Additional video for gallery
  const GALLERY_VIDEO_ID = "163rWffXF7pW38eBzRbaZz2yycHMkme_3";
  const GALLERY_VIDEO_URL = `https://drive.google.com/uc?export=download&id=${GALLERY_VIDEO_ID}`;

  // Real ceremony details
  const ceremonyDetails = {
    childName: "ALEXANDRA JESUOLUWATOMISIN ESTHER MOJOLAOLUWA ADEOLA ABIMIFOLUWA ADUNNI",
    displayName: "Alexandra",
    fullName: "Alexandra Jesuoluwatomisin Esther Mojolaoluwa Adeola Abimifoluwa Adunni",
    parents: "Mr & Mrs Emmanuel OSHO",
    dateOfBirth: "11th June 2025",
    ceremonyDate: "18th June 2025",
    password: "Alexandra2025",
    namesMeanings: [
      { name: "Alexandra", meaning: "Defender of mankind" },
      { name: "Jesuoluwatomisin", meaning: "Jesus is sufficient for me to serve" },
      { name: "Esther", meaning: "Star" },
      { name: "Mojolaoluwa", meaning: "I enjoy the wealth of the Lord" },
      { name: "Adeola", meaning: "Crown of wealth" },
      { name: "Abimifoluwa", meaning: "I was born for God" },
      { name: "Adunni", meaning: "Sweet to have" }
    ]
  };

  // Fisher-Yates shuffle algorithm
  const shuffleArray = (array) => {
    const shuffled = [...array];
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
  };

  // Background video control functions (simplified for background use)
  const handleBackgroundVideoLoad = () => {
    if (backgroundVideoRef.current) {
      backgroundVideoRef.current.muted = true;
      backgroundVideoRef.current.play().catch(e => {
        console.log('Background video autoplay prevented:', e);
      });
    }
  };

  const handleBackgroundVideoError = (e) => {
    console.log('Background video load error:', e);
    // Video will fallback to background image
  };

  // Check if mobile device and initialize dark mode
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth <= 768);
    };
    
    // Check for saved dark mode preference
    const savedDarkMode = localStorage.getItem('darkMode');
    if (savedDarkMode !== null) {
      setDarkMode(JSON.parse(savedDarkMode));
    } else {
      // Check system preference
      const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      setDarkMode(prefersDark);
    }
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Update body class and save preference when dark mode changes
  useEffect(() => {
    document.body.classList.toggle('dark-mode', darkMode);
    localStorage.setItem('darkMode', JSON.stringify(darkMode));
  }, [darkMode]);

  // Toggle dark mode function
  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
  };

  // ================== ENHANCED FEATURES FUNCTIONS ==================

  // Particle Animation System
  const createParticle = useCallback(() => {
    const particles = ['❤️', '✨', '👼', '🌸', '💕', '🙏', '💖', '🕊️', '⭐'];
    const types = ['heart', 'star', 'angel'];
    return {
      id: Date.now() + Math.random(),
      emoji: particles[Math.floor(Math.random() * particles.length)],
      type: types[Math.floor(Math.random() * types.length)],
      x: Math.random() * window.innerWidth,
      delay: Math.random() * 8
    };
  }, []);

  // Initialize particles
  useEffect(() => {
    if (isAuthenticated) {
      const initialParticles = Array.from({ length: 12 }, createParticle);
      setParticles(initialParticles);
      
      const particleInterval = setInterval(() => {
        setParticles(prev => {
          const newParticles = [...prev];
          if (newParticles.length < 15) {
            newParticles.push(createParticle());
          }
          return newParticles.slice(-15);
        });
      }, 4000);

      return () => clearInterval(particleInterval);
    }
  }, [isAuthenticated, createParticle]);

  // Cursor Trail Effect
  const handleMouseMove = useCallback((e) => {
    if (isAuthenticated && !isMobile) {
      const trail = {
        id: Date.now(),
        x: e.clientX,
        y: e.clientY
      };
      setCursorTrails(prev => [...prev.slice(-8), trail]);
      
      setTimeout(() => {
        setCursorTrails(prev => prev.filter(t => t.id !== trail.id));
      }, 1000);
    }
  }, [isAuthenticated, isMobile]);

  // Photo Viewer Advanced Controls
  const handlePhotoZoom = (direction) => {
    setPhotoViewerState(prev => ({
      ...prev,
      zoom: Math.max(0.5, Math.min(3, prev.zoom + (direction * 0.25)))
    }));
  };

  const handlePhotoPan = (deltaX, deltaY) => {
    setPhotoViewerState(prev => ({
      ...prev,
      x: prev.x + deltaX,
      y: prev.y + deltaY
    }));
  };

  const resetPhotoViewer = () => {
    setPhotoViewerState({ zoom: 1, x: 0, y: 0 });
  };

  // Immersive Mode Functions
  const enterImmersiveMode = (media) => {
    setImmersiveMedia(media);
    setShowImmersiveMode(true);
    document.body.style.overflow = 'hidden';
  };

  const exitImmersiveMode = () => {
    setShowImmersiveMode(false);
    setImmersiveMedia(null);
    document.body.style.overflow = 'auto';
  };

  // Timeline Functions
  const initializeTimeline = () => {
    const timelineData = [
      {
        id: 1,
        title: "Birth of Alexandra",
        description: `On ${ceremonyDetails.dateOfBirth}, a precious gift was born to ${ceremonyDetails.parents}. A day of immense joy and divine blessing.`,
        time: ceremonyDetails.dateOfBirth,
        icon: "👶"
      },
      {
        id: 2,
        title: "Pre-Ceremony Preparations",
        description: "Getting ready with family, the anticipation and joy building up to this sacred naming ceremony.",
        time: "Morning - 18th June",
        icon: "🌅"
      },
      {
        id: 3,
        title: "The Sacred Naming Ceremony",
        description: `${ceremonyDetails.displayName} receives her beautiful names and God's blessing in the presence of loved ones on ${ceremonyDetails.ceremonyDate}.`,
        time: ceremonyDetails.ceremonyDate,
        icon: "⛪"
      },
      {
        id: 4,
        title: "Family Celebration",
        description: "Joyful celebration with family and friends, sharing in this blessed day of naming and thanksgiving.",
        time: "Evening - 18th June",
        icon: "🎉"
      },
      {
        id: 5,
        title: "Precious Memories",
        description: "Capturing every smile, every blessing, every moment of this divine day for generations to remember.",
        time: "Throughout the Day",
        icon: "📸"
      }
    ];
    setTimelineItems(timelineData);
  };

  // Collage Builder Functions
  const addToCollage = (media) => {
    const newItem = {
      id: Date.now(),
      media,
      x: Math.random() * 50,
      y: Math.random() * 50,
      width: 100 + Math.random() * 50,
      height: 100 + Math.random() * 50,
      rotation: (Math.random() - 0.5) * 20
    };
    setCollageItems(prev => [...prev, newItem]);
  };

  const removeFromCollage = (id) => {
    setCollageItems(prev => prev.filter(item => item.id !== id));
  };

  const clearCollage = () => {
    setCollageItems([]);
  };

  const saveCollage = () => {
    alert('Beautiful memory collage saved! ✨ (This would download the collage in a real implementation)');
  };

  // Scroll progress and animations
  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.pageYOffset;
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      const scrollPercent = (scrollTop / docHeight) * 100;
      setScrollProgress(scrollPercent);
      
      // Show floating nav after scrolling past hero
      setShowFloatingNav(scrollTop > window.innerHeight * 0.3);
      
      // Enhanced parallax effects
      if (heroRef.current) {
        const heroBackground = heroRef.current.querySelector('.hero-background');
        if (heroBackground) {
          heroBackground.style.transform = `translateX(-10%) translateY(-10%) translateZ(0) scale(${1 + scrollTop * 0.0001})`;
        }
      }
      
      // Enhanced scroll animations
      const animateOnScroll = (elements) => {
        elements.forEach(el => {
          if (el) {
            const rect = el.getBoundingClientRect();
            const isVisible = rect.top < window.innerHeight && rect.bottom > 0;
            const progress = Math.max(0, Math.min(1, (window.innerHeight - rect.top) / window.innerHeight));
            
            if (isVisible) {
              el.classList.add('animate-in');
              if (gallery3DMode && !isMobile) {
                el.style.transform = `translateY(0) rotateY(${(progress - 0.5) * 8}deg) rotateX(${(progress - 0.5) * 3}deg)`;
              }
            }
          }
        });
      };
      
      const elementsToAnimate = document.querySelectorAll('.animate-on-scroll');
      animateOnScroll(elementsToAnimate);

      // Timeline animation
      const timelineElements = document.querySelectorAll('.timeline-item');
      timelineElements.forEach(el => {
        const rect = el.getBoundingClientRect();
        if (rect.top < window.innerHeight * 0.8) {
          el.classList.add('visible');
        }
      });
    };

    window.addEventListener('scroll', handleScroll);
    if (!isMobile) {
      window.addEventListener('mousemove', handleMouseMove);
    }
    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('mousemove', handleMouseMove);
    };
  }, [handleMouseMove, gallery3DMode, isMobile]);

  // Load media from Google Drive
  const loadMediaFromDrive = async () => {
    setIsLoadingMedia(true);
    try {
      const response = await fetch(
        `https://www.googleapis.com/drive/v3/files` +
        `?q='${FOLDER_ID}'+in+parents&key=${API_KEY}` +
        `&fields=files(id,name,mimeType,thumbnailLink,size,createdTime)`
      );
      
      if (!response.ok) {
        throw new Error('Failed to fetch media from Google Drive');
      }
      
      const { files } = await response.json();
      
      const photos = [];
      const videos = [];
      
      files.forEach((file, index) => {
        const mediaItem = {
          id: file.id,
          title: file.name.replace(/\.[^/.]+$/, ""),
          thumbnail: file.thumbnailLink || `https://drive.google.com/thumbnail?id=${file.id}`,
          type: file.mimeType.startsWith('video') ? 'video' : 'photo',
          driveId: file.id,
          mimeType: file.mimeType,
          size: file.size,
          createdTime: file.createdTime,
          downloadUrl: `https://drive.google.com/uc?export=download&id=${file.id}`,
          viewUrl: `https://drive.google.com/file/d/${file.id}/view`,
          aspectRatio: Math.random() > 0.5 ? 'tall' : 'wide'
        };
        
        if (file.mimeType.startsWith('video')) {
          videos.push(mediaItem);
        } else if (file.mimeType.startsWith('image')) {
          photos.push(mediaItem);
        }
      });
      
      // Add the additional gallery video
      const additionalVideo = {
        id: GALLERY_VIDEO_ID,
        title: "Special Ceremony Moments",
        thumbnail: `https://drive.google.com/thumbnail?id=${GALLERY_VIDEO_ID}`,
        type: 'video',
        driveId: GALLERY_VIDEO_ID,
        mimeType: 'video/mp4',
        downloadUrl: GALLERY_VIDEO_URL,
        viewUrl: `https://drive.google.com/file/d/${GALLERY_VIDEO_ID}/view`,
        aspectRatio: 'wide'
      };
      videos.push(additionalVideo);
      
      // Shuffle both photos and videos for each page load
      const shuffledPhotos = shuffleArray(photos);
      const shuffledVideos = shuffleArray(videos);
      
      setMediaData({ photos: shuffledPhotos, videos: shuffledVideos });
      
      // Initialize reactions for each media item
      const initialReactions = {};
      [...shuffledPhotos, ...shuffledVideos].forEach(item => {
        initialReactions[item.id] = { hearts: 0, blessings: 0, prayers: 0 };
      });
      setMediaReactions(initialReactions);
      
    } catch (error) {
      console.error('Error loading media:', error);
      // Enhanced fallback data with naming ceremony theme
      const fallbackPhotos = [
        { id: 1, title: "Getting Ready for the Ceremony", thumbnail: "https://images.pexels.com/photos/32488939/pexels-photo-32488939.jpeg", type: "photo", driveId: "sample1", aspectRatio: 'wide' },
        { id: 2, title: "Beautiful Alexandra", thumbnail: "https://images.pexels.com/photos/2088142/pexels-photo-2088142.jpeg", type: "photo", driveId: "sample2", aspectRatio: 'tall' },
        { id: 3, title: "The Sacred Naming Ceremony", thumbnail: "https://images.pexels.com/photos/3551227/pexels-photo-3551227.jpeg", type: "photo", driveId: "sample3", aspectRatio: 'wide' },
        { id: 4, title: "Family Joy and Blessings", thumbnail: "https://images.pexels.com/photos/1648377/pexels-photo-1648377.jpeg", type: "photo", driveId: "sample4", aspectRatio: 'tall' },
        { id: 5, title: "Divine Blessings", thumbnail: "https://images.pexels.com/photos/3617457/pexels-photo-3617457.jpeg", type: "photo", driveId: "sample5", aspectRatio: 'wide' },
        { id: 6, title: "Precious Moments", thumbnail: "https://images.pexels.com/photos/3992949/pexels-photo-3992949.jpeg", type: "photo", driveId: "sample6", aspectRatio: 'tall' },
        { id: 7, title: "Family Celebration", thumbnail: "https://images.pexels.com/photos/4473817/pexels-photo-4473817.jpeg", type: "photo", driveId: "sample7", aspectRatio: 'wide' },
        { id: 8, title: "Blessed Day", thumbnail: "https://images.pexels.com/photos/5637765/pexels-photo-5637765.jpeg", type: "photo", driveId: "sample8", aspectRatio: 'tall' }
      ];
      const fallbackVideos = [
        { id: 9, title: "Ceremony Highlights", thumbnail: "https://images.pexels.com/photos/32488939/pexels-photo-32488939.jpeg", type: "video", driveId: "sample9", aspectRatio: 'wide' },
        { id: 10, title: "Family Celebration Video", thumbnail: "https://images.pexels.com/photos/2088142/pexels-photo-2088142.jpeg", type: "video", driveId: "sample10", aspectRatio: 'wide' },
        { 
          id: GALLERY_VIDEO_ID, 
          title: "Special Ceremony Moments", 
          thumbnail: `https://drive.google.com/thumbnail?id=${GALLERY_VIDEO_ID}`, 
          type: "video", 
          driveId: GALLERY_VIDEO_ID, 
          aspectRatio: 'wide',
          downloadUrl: GALLERY_VIDEO_URL,
          viewUrl: `https://drive.google.com/file/d/${GALLERY_VIDEO_ID}/view`
        }
      ];
      
      // Apply shuffling to fallback data as well
      const shuffledFallbackPhotos = shuffleArray(fallbackPhotos);
      const shuffledFallbackVideos = shuffleArray(fallbackVideos);
      
      setMediaData({ photos: shuffledFallbackPhotos, videos: shuffledFallbackVideos });
      
      // Initialize reactions for fallback data
      const initialReactions = {};
      [...shuffledFallbackPhotos, ...shuffledFallbackVideos].forEach(item => {
        initialReactions[item.id] = { hearts: Math.floor(Math.random() * 20), blessings: Math.floor(Math.random() * 15), prayers: Math.floor(Math.random() * 12) };
      });
      setMediaReactions(initialReactions);
    } finally {
      setIsLoadingMedia(false);
    }
  };

  // Load media and initialize features when authenticated
  useEffect(() => {
    if (isAuthenticated) {
      loadMediaFromDrive();
      initializeTimeline();
      // Initialize guest comments with real ceremony theme
      setGuestComments([
        { id: 1, name: "Grandma Osho", message: `What a blessed day! ${ceremonyDetails.displayName} is such a beautiful gift from God. Her names are so meaningful!`, timestamp: new Date().toLocaleDateString(), avatar: "👵" },
        { id: 2, name: "Uncle Tunde", message: `So proud to witness this sacred naming ceremony. ${ceremonyDetails.fullName} - what beautiful names for a beautiful child!`, timestamp: new Date().toLocaleDateString(), avatar: "👨" },
        { id: 3, name: "Aunt Bukola", message: `God's blessings are evident in every moment of this special day. Alexandra is truly blessed!`, timestamp: new Date().toLocaleDateString(), avatar: "👩" },
        { id: 4, name: "Pastor Williams", message: `May the Lord continue to bless Alexandra and the Osho family. What a wonderful celebration of life and faith!`, timestamp: new Date().toLocaleDateString(), avatar: "🙏" }
      ]);
    }
  }, [isAuthenticated]);

  const handlePasswordSubmit = (e) => {
    e.preventDefault();
    setIsLoading(true);
    
    setTimeout(() => {
      if (password === ceremonyDetails.password) {
        setIsAuthenticated(true);
      } else {
        alert('Incorrect password. Please try again.');
      }
      setIsLoading(false);
    }, 1000);
  };

  const handleMediaClick = (media) => {
    const allMedia = getFilteredMedia();
    const index = allMedia.findIndex(item => item.id === media.id);
    setLightboxIndex(index);
    setSelectedMedia(media);
    setShowLightbox(true);
    resetPhotoViewer();
  };

  const handleDownload = (media) => {
    window.open(media.downloadUrl || `https://drive.google.com/uc?export=download&id=${media.driveId}`, '_blank');
  };

  const handleViewInDrive = () => {
    window.open('https://drive.google.com/drive/folders/1sk7C-nQPr2yfFtbpQGjFO1OPlXp9HPB9', '_blank');
  };

  const getFilteredMedia = () => {
    if (activeTab === 'photos') return mediaData.photos;
    if (activeTab === 'videos') return mediaData.videos;
    return [...mediaData.photos, ...mediaData.videos];
  };

  const getTotalCount = () => {
    const photos = mediaData.photos.length;
    const videos = mediaData.videos.length;
    return { photos, videos, total: photos + videos };
  };

  // Lightbox navigation
  const navigateLightbox = (direction) => {
    const allMedia = getFilteredMedia();
    let newIndex = lightboxIndex + direction;
    if (newIndex < 0) newIndex = allMedia.length - 1;
    if (newIndex >= allMedia.length) newIndex = 0;
    setLightboxIndex(newIndex);
    setSelectedMedia(allMedia[newIndex]);
    resetPhotoViewer();
  };

  // Add reaction to media
  const addReaction = (mediaId, reactionType) => {
    setMediaReactions(prev => ({
      ...prev,
      [mediaId]: {
        ...prev[mediaId],
        [reactionType]: (prev[mediaId]?.[reactionType] || 0) + 1
      }
    }));
  };

  // Add guest comment
  const addGuestComment = (name, message) => {
    const newComment = {
      id: Date.now(),
      name,
      message,
      timestamp: new Date().toLocaleDateString(),
      avatar: name.charAt(0).toUpperCase()
    };
    setGuestComments(prev => [newComment, ...prev]);
  };

  // Scroll to section
  const scrollToSection = (sectionId) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  // Toggle functions for enhanced features
  const toggleTimeline = () => {
    setShowTimeline(!showTimeline);
  };

  const toggleCollageBuilder = () => {
    setShowCollageBuilder(!showCollageBuilder);
  };

  const toggle3DMode = () => {
    setGallery3DMode(!gallery3DMode);
  };

  const toggleAboutSection = () => {
    setShowAboutSection(!showAboutSection);
  };

  const toggleDetailsPanel = () => {
    setShowDetailsPanel(!showDetailsPanel);
  };

  // Toggle collapsible sections
  const toggleSection = (sectionName) => {
    setCollapsedSections(prev => ({
      ...prev,
      [sectionName]: !prev[sectionName]
    }));
  };

  if (!isAuthenticated) {
    return (
      <div className={`password-screen ${darkMode ? 'dark-mode' : ''}`}>
        {/* Background Video for Password Screen */}
        <video 
          className="password-video-background"
          autoPlay
          muted
          loop
          playsInline
          onError={(e) => console.log('Password screen video load error:', e)}
        >
          <source src={BACKGROUND_VIDEO_URL} type="video/mp4" />
        </video>
        
        {/* Video Overlay */}
        <div className="password-video-overlay"></div>
        
        {/* Dynamic Background */}
        <div className="dynamic-background"></div>
        
        {/* Floating Particles */}
        <div className="particles-container">
          {Array.from({ length: isMobile ? 6 : 10 }).map((_, i) => (
            <div
              key={i}
              className={`particle particle-${['heart', 'star', 'angel'][i % 3]}`}
              style={{
                left: `${Math.random() * 100}%`,
                '--delay': `${Math.random() * 8}s`,
                fontSize: `${0.8 + Math.random() * 0.8}rem`
              }}
            >
              {['❤️', '✨', '👼'][i % 3]}
            </div>
          ))}
        </div>

        <div className="password-overlay"></div>
        <div className="password-container">
          <div className="password-card">
            {/* Enhanced Dark Mode Toggle */}
            <button 
              onClick={toggleDarkMode} 
              className="dark-mode-toggle"
              title={darkMode ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
              aria-label={darkMode ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
            >
              <span className="toggle-icon">
                {darkMode ? '☀️' : '🌙'}
              </span>
            </button>
            
            <div className="angel-icon">👼</div>
            <h1 className="password-title">{ceremonyDetails.displayName}'s Naming Ceremony</h1>
            <p className="password-subtitle">Welcome to {ceremonyDetails.fullName}'s sacred naming ceremony</p>
            <p className="password-details">Celebrated on {ceremonyDetails.ceremonyDate}</p>
            
            <form onSubmit={handlePasswordSubmit} className="password-form">
              <div className="password-input-group">
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter access code"
                  className="password-input"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="password-toggle"
                >
                  {showPassword ? '👁️' : '👁️‍🗨️'}
                </button>
              </div>
              
              <button type="submit" className="password-submit" disabled={isLoading}>
                {isLoading ? (
                  <span className="loading-spinner"></span>
                ) : (
                  'Enter Sacred Gallery'
                )}
              </button>
            </form>
            
            <div className="password-decoration">
              <div className="decoration-line"></div>
              <span className="decoration-text">✨ Blessed Memories Await ✨</span>
              <div className="decoration-line"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={`landing-page ${darkMode ? 'dark-mode' : ''}`}>
      {/* Dynamic Background */}
      <div className="dynamic-background"></div>

      {/* Particle Animation System */}
      {!isMobile && (
        <div className="particles-container">
          {particles.map((particle) => (
            <div
              key={particle.id}
              className={`particle particle-${particle.type}`}
              style={{
                left: `${particle.x}px`,
                '--delay': `${particle.delay}s`
              }}
            >
              {particle.emoji}
            </div>
          ))}
        </div>
      )}

      {/* Cursor Trail Effect */}
      {!isMobile && cursorTrails.map((trail) => (
        <div
          key={trail.id}
          className="cursor-trail"
          style={{
            left: trail.x - 10,
            top: trail.y - 10
          }}
        />
      ))}

      {/* Scroll Progress Bar */}
      <div className="scroll-progress-bar">
        <div 
          className="scroll-progress-fill" 
          style={{ width: `${scrollProgress}%` }}
        ></div>
      </div>

      {/* Enhanced Floating Navigation */}
      {showFloatingNav && (
        <nav className="floating-nav">
          <div className="nav-items">
            <button onClick={() => scrollToSection('hero')} className="nav-item" title="Home">🏠</button>
            <button onClick={() => scrollToSection('about')} className="nav-item" title="About Alexandra">👶</button>
            <button onClick={() => scrollToSection('gallery')} className="nav-item" title="Gallery">📸</button>
            <button onClick={() => scrollToSection('testimonials')} className="nav-item" title="Messages">💌</button>
            <button onClick={() => setShowGuestBook(true)} className="nav-item" title="Guest Book">📖</button>
            <button onClick={toggleTimeline} className="nav-item" title="Timeline">⏰</button>
            <button onClick={toggleCollageBuilder} className="nav-item" title="Collage">🎨</button>
            {!isMobile && <button onClick={toggle3DMode} className="nav-item" title="3D Mode">🎭</button>}
            <button onClick={toggleDarkMode} className="nav-item" title={darkMode ? 'Light Mode' : 'Dark Mode'}>
              {darkMode ? '☀️' : '🌙'}
            </button>
          </div>
        </nav>
      )}

      {/* Hero Section with Background Video */}
      <section id="hero" className="hero-section" ref={heroRef}>
        {/* Background Video */}
        <video 
          ref={backgroundVideoRef}
          className="hero-video-background"
          autoPlay
          muted
          loop
          playsInline
          onLoadedData={handleBackgroundVideoLoad}
          onError={handleBackgroundVideoError}
        >
          <source src={BACKGROUND_VIDEO_URL} type="video/mp4" />
          {/* Fallback for browsers that don't support video */}
        </video>
        
        {/* Video Overlay */}
        <div className="hero-video-overlay"></div>
        
        {/* Fallback Background Image */}
        <div className="hero-background invitation-background"></div>
        
        <div className="hero-content animate-on-scroll">
          <div className="hero-text">
            <h1 className="hero-title">
              <span className="title-line">{ceremonyDetails.displayName}'s</span>
              <span className="title-line highlight">Naming Ceremony</span>
            </h1>
            <p className="hero-subtitle">
              Welcome to the sacred naming ceremony of our precious daughter
            </p>
            <div className="hero-details">
              <p className="hero-child-name">{ceremonyDetails.fullName}</p>
              <p className="hero-parents">Daughter of {ceremonyDetails.parents}</p>
              <p className="hero-dates">
                <span>Born: {ceremonyDetails.dateOfBirth}</span>
                <span>Named: {ceremonyDetails.ceremonyDate}</span>
              </p>
            </div>
            <div className="hero-actions">
              <button 
                onClick={() => scrollToSection('gallery')} 
                className="hero-cta primary"
              >
                View Gallery
              </button>
              <button 
                onClick={toggleAboutSection} 
                className="hero-cta secondary"
              >
                About Alexandra
              </button>
              <button 
                onClick={() => enterImmersiveMode(mediaData.photos[0])} 
                className="hero-cta secondary"
              >
                Immersive View
              </button>
            </div>
          </div>
        </div>
        <div className="scroll-indicator">
          <div className="scroll-arrow"></div>
          <span>Scroll to explore sacred memories</span>
        </div>
      </section>

      {/* About Alexandra Section */}
      {showAboutSection && (
        <section id="about" className="about-section animate-on-scroll">
          <div className="container">
            <div className="about-content">
              <button className="close-section-btn" onClick={toggleAboutSection}>×</button>
              <h2 className="section-title">About Our Precious {ceremonyDetails.displayName}</h2>
              
              <div className="about-details">
                <div className="detail-card">
                  <div className="detail-header">
                    <h3>👶 Birth Details</h3>
                    <button 
                      className="collapse-toggle small"
                      onClick={() => toggleSection('aboutNames')}
                      title={collapsedSections.aboutNames ? 'Expand' : 'Collapse'}
                    >
                      {collapsedSections.aboutNames ? '⬇️' : '⬆️'}
                    </button>
                  </div>
                  <p><strong>Date of Birth:</strong> {ceremonyDetails.dateOfBirth}</p>
                  <p><strong>Parents:</strong> {ceremonyDetails.parents}</p>
                  <p><strong>Naming Date:</strong> {ceremonyDetails.ceremonyDate}</p>
                </div>
                
                <div className="detail-card">
                  <h3>✨ Her Beautiful Names</h3>
                  {!collapsedSections.aboutNames ? (
                    <div className="names-breakdown">
                      {ceremonyDetails.namesMeanings.map((name, index) => (
                        <p key={index}>
                          <strong>{name.name}</strong> - {name.meaning}
                        </p>
                      ))}
                    </div>
                  ) : (
                    <p className="names-summary">
                      <strong>{ceremonyDetails.fullName}</strong> - Click to expand meanings
                    </p>
                  )}
                </div>
                
                <div className="detail-card">
                  <h3>🎉 Ceremony Highlights</h3>
                  <p><strong>Theme:</strong> Divine Blessings & Sacred Names</p>
                  <p><strong>Significance:</strong> A celebration of life, faith, and family</p>
                </div>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Interactive Memory Timeline */}
      {showTimeline && (
        <section className="memory-timeline">
          <div className="container">
            <div className="timeline-header">
              <h2 className="section-title animate-on-scroll">Sacred Journey Timeline</h2>
              <div className="timeline-controls">
                <button 
                  className="collapse-toggle"
                  onClick={() => toggleSection('timeline')}
                  title={collapsedSections.timeline ? 'Expand Details' : 'Collapse Details'}
                >
                  {collapsedSections.timeline ? '⬇️' : '⬆️'}
                </button>
                <button className="close-section-btn" onClick={toggleTimeline}>×</button>
              </div>
            </div>
            
            <div className="timeline-track">
              <div className="timeline-line"></div>
              {timelineItems.map((item, index) => (
                <div key={item.id} className={`timeline-item ${index % 2 === 0 ? 'left' : 'right'}`}>
                  <div className="timeline-content">
                    <div className="timeline-dot"></div>
                    <h3>{item.icon} {item.title}</h3>
                    <p className="timeline-time">{item.time}</p>
                    {!collapsedSections.timeline && (
                      <p>{item.description}</p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Gallery Introduction */}
      <section className="gallery-intro animate-on-scroll">
        <div className="container">
          <div className="intro-header">
            <h2 className="section-title">Sacred Memories</h2>
            <button 
              className="collapse-toggle"
              onClick={() => toggleSection('galleryIntro')}
              title={collapsedSections.galleryIntro ? 'Expand' : 'Collapse'}
              aria-label={collapsedSections.galleryIntro ? 'Expand gallery introduction' : 'Collapse gallery introduction'}
            >
              <span className="toggle-arrow">
                {collapsedSections.galleryIntro ? '⬇️' : '⬆️'}
              </span>
            </button>
          </div>
          
          <div className={`collapsible-content ${collapsedSections.galleryIntro ? 'collapsed' : 'expanded'}`}>
            <div className="intro-content">
              <p className="section-description">
                Witness the divine moments of {ceremonyDetails.displayName}'s naming ceremony through our carefully curated collection 
                of photos and videos. Each image tells a story of love, faith, and heavenly blessings from {ceremonyDetails.ceremonyDate}.
              </p>
              
              <div className="gallery-preview hover-lift">
                <div className="preview-image">
                  <img src="https://images.pexels.com/photos/32488939/pexels-photo-32488939.jpeg" alt="Naming ceremony celebration" />
                  <div className="preview-overlay">
                    <div className="preview-message">
                      <p className="preview-title">✨ Sacred memories await your discovery ✨</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Photo Collage Builder */}
      {showCollageBuilder && (
        <section className="collage-builder animate-on-scroll">
          <div className="container">
            <div className="collage-header">
              <h3>✨ Create Your Memory Collage</h3>
              <button className="close-section-btn" onClick={toggleCollageBuilder}>×</button>
            </div>
            <div className="collage-canvas" ref={collageCanvasRef}>
              {collageItems.map((item) => (
                <div
                  key={item.id}
                  className="collage-item"
                  style={{
                    left: `${item.x}%`,
                    top: `${item.y}%`,
                    width: `${item.width}px`,
                    height: `${item.height}px`,
                    transform: `rotate(${item.rotation}deg)`
                  }}
                  onClick={() => removeFromCollage(item.id)}
                >
                  <img src={item.media.thumbnail} alt={item.media.title} />
                </div>
              ))}
              {collageItems.length === 0 && (
                <div className="collage-placeholder">
                  <p>Click "Add to Collage" on any photo below to start creating your masterpiece!</p>
                  <span className="placeholder-icon">🎨</span>
                </div>
              )}
            </div>
            <div className="collage-controls">
              <button onClick={clearCollage} className="collage-btn">Clear All</button>
              <button onClick={saveCollage} className="collage-btn">Save Collage</button>
            </div>
          </div>
        </section>
      )}

      {/* Enhanced Media Gallery */}
      <section id="gallery" className="media-gallery" ref={galleryRef}>
        <div className="container">
          <div className="gallery-header animate-on-scroll">
            <div className="gallery-controls">
              <div className="tab-navigation">
                <button 
                  className={`tab-button ${activeTab === 'photos' ? 'active' : ''}`}
                  onClick={() => setActiveTab('photos')}
                >
                  📸 Photos
                </button>
                <button 
                  className={`tab-button ${activeTab === 'videos' ? 'active' : ''}`}
                  onClick={() => setActiveTab('videos')}
                >
                  🎥 Videos
                </button>
                <button 
                  className={`tab-button ${activeTab === 'all' ? 'active' : ''}`}
                  onClick={() => setActiveTab('all')}
                >
                  🎀 All Media
                </button>
              </div>
              
              <div className="layout-controls">
                <button 
                  className={`layout-btn ${galleryLayout === 'masonry' ? 'active' : ''}`}
                  onClick={() => setGalleryLayout('masonry')}
                  title="Masonry Layout"
                >
                  ⋮⋯
                </button>
                <button 
                  className={`layout-btn ${galleryLayout === 'grid' ? 'active' : ''}`}
                  onClick={() => setGalleryLayout('grid')}
                  title="Grid Layout"
                >
                  ⋮⋮
                </button>
                {!isMobile && (
                  <button 
                    className={`layout-btn ${gallery3DMode ? 'active' : ''}`}
                    onClick={toggle3DMode}
                    title="3D Mode"
                  >
                    🎭
                  </button>
                )}
              </div>
            </div>
          </div>

          <div className="gallery-content animate-on-scroll">
            <div className="integrated-gallery">
              {isLoadingMedia ? (
                <div className="loading-gallery">
                  <div className="loading-advanced">
                    <div className="loading-spinner-advanced"></div>
                  </div>
                  <p>Loading {ceremonyDetails.displayName}'s precious memories...</p>
                </div>
              ) : (
                <div className={`gallery-grid ${galleryLayout} ${gallery3DMode && !isMobile ? 'gallery-3d-mode' : ''}`}>
                  {getFilteredMedia().map((media, index) => (
                    <div 
                      key={media.id} 
                      className={`media-item ${media.aspectRatio} ${gallery3DMode && !isMobile ? 'media-item-3d' : ''} animate-on-scroll hover-lift`}
                      style={{ animationDelay: `${index * 0.1}s` }}
                      onClick={() => handleMediaClick(media)}
                    >
                      <div className="media-thumbnail">
                        <img src={media.thumbnail} alt={media.title} loading="lazy" />
                        <div className="media-overlay">
                          <div className="media-type">
                            {media.type === 'video' ? (
                              <>
                                <span className="play-icon">▶️</span>
                                <span className="duration">{media.duration || '0:00'}</span>
                              </>
                            ) : (
                              <span className="photo-icon">📸</span>
                            )}
                          </div>
                          <div className="media-actions">
                            <button className="action-button view-button" title="View">
                              👁️
                            </button>
                            <button 
                              className="action-button download-button" 
                              onClick={(e) => {
                                e.stopPropagation();
                                handleDownload(media);
                              }}
                              title="Download"
                            >
                              ⬇️
                            </button>
                            <button 
                              className="action-button" 
                              onClick={(e) => {
                                e.stopPropagation();
                                enterImmersiveMode(media);
                              }}
                              title="Immersive View"
                            >
                              🎭
                            </button>
                            {showCollageBuilder && (
                              <button 
                                className="action-button" 
                                onClick={(e) => {
                                  e.stopPropagation();
                                  addToCollage(media);
                                }}
                                title="Add to Collage"
                              >
                                🎨
                              </button>
                            )}
                          </div>
                        </div>
                      </div>
                      
                      <div className="media-info">
                        <div className="media-title">{media.title}</div>
                        <div className="media-reactions">
                          <button 
                            className="reaction-btn"
                            onClick={(e) => {
                              e.stopPropagation();
                              addReaction(media.id, 'hearts');
                            }}
                          >
                            ❤️ {mediaReactions[media.id]?.hearts || 0}
                          </button>
                          <button 
                            className="reaction-btn"
                            onClick={(e) => {
                              e.stopPropagation();
                              addReaction(media.id, 'blessings');
                            }}
                          >
                            🙏 {mediaReactions[media.id]?.blessings || 0}
                          </button>
                          <button 
                            className="reaction-btn"
                            onClick={(e) => {
                              e.stopPropagation();
                              addReaction(media.id, 'prayers');
                            }}
                          >
                            ✨ {mediaReactions[media.id]?.prayers || 0}
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
              
              <div className="gallery-footer">
                <p className="gallery-note">
                  💝 Click any image to view in full size • Use enhanced controls for zoom and pan • {!isMobile && 'Try 3D mode!'}
                </p>
                <div className="gallery-actions">
                  <button onClick={handleViewInDrive} className="drive-access-button">
                    View Original Google Drive Folder
                  </button>
                  <button onClick={toggleTimeline} className="drive-access-button">
                    {showTimeline ? 'Hide Timeline' : 'Show Timeline'}
                  </button>
                  <button onClick={toggleCollageBuilder} className="drive-access-button">
                    {showCollageBuilder ? 'Hide Collage Builder' : 'Show Collage Builder'}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section id="testimonials" className="testimonials-section animate-on-scroll">
        <div className="testimonials-background"></div>
        <div className="container">
          <div className="testimonials-header">
            <h2 className="section-title white">Blessed Messages & Testimonials</h2>
            <button 
              className="collapse-toggle"
              onClick={() => toggleSection('testimonials')}
              title={collapsedSections.testimonials ? 'Expand Messages' : 'Collapse Messages'}
              aria-label={collapsedSections.testimonials ? 'Expand testimonials section' : 'Collapse testimonials section'}
            >
              <span className="toggle-arrow">
                {collapsedSections.testimonials ? '⬇️' : '⬆️'}
              </span>
            </button>
          </div>

          <div className={`collapsible-content ${collapsedSections.testimonials ? 'collapsed' : 'expanded'}`}>
            <div className="testimonials-grid">
              <div className="testimonial-card">
                <div className="testimonial-quote">"</div>
                <p className="testimonial-text">
                  What a blessed and beautiful ceremony! {ceremonyDetails.displayName} is truly a gift from God. 
                  Her names carry such profound meaning and divine purpose. May she grow in wisdom and grace.
                </p>
                <div className="testimonial-author">
                  <div className="author-info">
                    <h4>👵 Grandma Adunni</h4>
                    <span>Family Elder</span>
                  </div>
                </div>
              </div>

              <div className="testimonial-card">
                <div className="testimonial-quote">"</div>
                <p className="testimonial-text">
                  Witnessing {ceremonyDetails.displayName}'s naming ceremony was a divine experience. The joy, 
                  the blessings, the sacred names - everything was perfect. God's favor shines upon this family.
                </p>
                <div className="testimonial-author">
                  <div className="author-info">
                    <h4>🙏 Pastor Adebayo</h4>
                    <span>Officiating Minister</span>
                  </div>
                </div>
              </div>

              <div className="testimonial-card">
                <div className="testimonial-quote">"</div>
                <p className="testimonial-text">
                  Such a precious little angel! {ceremonyDetails.displayName}'s names are so meaningful. 
                  May the Lord continue to bless her journey and keep her in His loving care always.
                </p>
                <div className="testimonial-author">
                  <div className="author-info">
                    <h4>👨‍👩‍👧‍👦 The Johnson Family</h4>
                    <span>Family Friends</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="section-divider"></div>

            <div className="add-message-section">
              <button 
                onClick={() => setShowGuestBook(true)} 
                className="add-message-btn"
              >
                📖 Add Your Blessing Message
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Footer Section */}
      <footer className="footer-section">
        <div className="footer-background"></div>
        <div className="container">
          <div className="footer-content animate-on-scroll">
            <div className="footer-main">
              <h3 className="footer-title">{ceremonyDetails.displayName}'s Naming Ceremony</h3>
              <p className="footer-subtitle">
                A day filled with divine blessings, family love, and heavenly joy as we welcomed {ceremonyDetails.fullName} with her beautiful names
              </p>
              
              <div className="footer-details">
                <div className="detail-item">
                  <span className="detail-icon">👶</span>
                  <span>Born {ceremonyDetails.dateOfBirth}</span>
                </div>
                <div className="detail-item">
                  <span className="detail-icon">🎉</span>
                  <span>Named {ceremonyDetails.ceremonyDate}</span>
                </div>
                <div className="detail-item">
                  <span className="detail-icon">👪</span>
                  <span>{ceremonyDetails.parents}</span>
                </div>
              </div>
            </div>

            <div className="footer-access">
              <h4>Access Media Gallery</h4>
              <p>View and download all photos and videos from this blessed naming ceremony</p>
              <button onClick={handleViewInDrive} className="footer-button">
                Visit Gallery
              </button>
            </div>
          </div>

          <div className="footer-bottom">
            <div className="footer-decoration">
              <div className="decoration-line"></div>
              <span className="decoration-text">✨ Blessed with Love ✨</span>
              <div className="decoration-line"></div>
            </div>
            <p className="footer-copyright">
              © 2025 {ceremonyDetails.displayName}'s Naming Ceremony • Created with Love • Enhanced with Divine Blessings ✨
            </p>
          </div>
        </div>
      </footer>

      {/* Immersive Mode */}
      {showImmersiveMode && immersiveMedia && (
        <div className="immersive-mode" onClick={exitImmersiveMode}>
          <div className="immersive-content" onClick={(e) => e.stopPropagation()}>
            <img 
              src={immersiveMedia.thumbnail} 
              alt={immersiveMedia.title} 
              className="immersive-image"
            />
            <div className="immersive-controls">
              <button 
                onClick={exitImmersiveMode}
                className="immersive-btn"
                title="Exit"
              >
                ✕
              </button>
              <button 
                onClick={() => handleDownload(immersiveMedia)}
                className="immersive-btn"
                title="Download"
              >
                ⬇️
              </button>
              <button 
                onClick={() => addReaction(immersiveMedia.id, 'hearts')}
                className="immersive-btn"
                title="Like"
              >
                ❤️
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Enhanced Lightbox Modal */}
      {showLightbox && selectedMedia && (
        <div className="lightbox-overlay advanced" onClick={() => setShowLightbox(false)}>
          <div className="lightbox-container advanced" onClick={(e) => e.stopPropagation()}>
            <div className="lightbox-header">
              <div className="lightbox-counter">
                {lightboxIndex + 1} of {getFilteredMedia().length}
              </div>
              <button className="lightbox-close" onClick={() => setShowLightbox(false)}>
                ✕
              </button>
            </div>
            
            <div className="lightbox-nav">
              <button 
                className="lightbox-nav-btn prev" 
                onClick={() => navigateLightbox(-1)}
                disabled={getFilteredMedia().length <= 1}
              >
                ‹
              </button>
              <button 
                className="lightbox-nav-btn next" 
                onClick={() => navigateLightbox(1)}
                disabled={getFilteredMedia().length <= 1}
              >
                ›
              </button>
            </div>
            
            <div className="lightbox-content">
              {selectedMedia.type === 'video' ? (
                <div className="video-placeholder">
                  <div className="video-info">
                    <h3>{selectedMedia.title}</h3>
                    <p>Duration: {selectedMedia.duration || 'Unknown'}</p>
                    <p>📹 Video content available in Google Drive</p>
                    <button onClick={() => handleDownload(selectedMedia)} className="download-from-lightbox">
                      Download Video
                    </button>
                  </div>
                </div>
              ) : (
                <div className="photo-viewer-advanced" ref={photoViewerRef}>
                  <img 
                    src={selectedMedia.thumbnail} 
                    alt={selectedMedia.title} 
                    className="photo-viewer-image lightbox-image" 
                    style={{
                      transform: `scale(${photoViewerState.zoom}) translate(${photoViewerState.x}px, ${photoViewerState.y}px)`
                    }}
                  />
                  <div className="photo-viewer-controls">
                    <button 
                      onClick={() => handlePhotoZoom(1)} 
                      className="zoom-control"
                      title="Zoom In"
                    >
                      +
                    </button>
                    <button 
                      onClick={() => handlePhotoZoom(-1)} 
                      className="zoom-control"
                      title="Zoom Out"
                    >
                      -
                    </button>
                    <button 
                      onClick={resetPhotoViewer} 
                      className="zoom-control"
                      title="Reset"
                    >
                      ⌂
                    </button>
                    <button 
                      onClick={() => enterImmersiveMode(selectedMedia)} 
                      className="zoom-control"
                      title="Immersive"
                    >
                      🎭
                    </button>
                  </div>
                </div>
              )}
            </div>
            
            <div className="lightbox-footer">
              <div className="lightbox-info">
                <h3 className="lightbox-title">{selectedMedia.title}</h3>
                <div className="lightbox-reactions">
                  <button onClick={() => addReaction(selectedMedia.id, 'hearts')} className="reaction-btn">
                    ❤️ {mediaReactions[selectedMedia.id]?.hearts || 0}
                  </button>
                  <button onClick={() => addReaction(selectedMedia.id, 'blessings')} className="reaction-btn">
                    🙏 {mediaReactions[selectedMedia.id]?.blessings || 0}
                  </button>
                  <button onClick={() => addReaction(selectedMedia.id, 'prayers')} className="reaction-btn">
                    ✨ {mediaReactions[selectedMedia.id]?.prayers || 0}
                  </button>
                </div>
              </div>
              <div className="lightbox-actions">
                <button onClick={() => handleDownload(selectedMedia)} className="lightbox-download">
                  Download Original
                </button>
                {showCollageBuilder && (
                  <button onClick={() => addToCollage(selectedMedia)} className="lightbox-download">
                    Add to Collage
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Guest Book Modal */}
      {showGuestBook && (
        <GuestBookModal 
          onClose={() => setShowGuestBook(false)}
          comments={guestComments}
          onAddComment={addGuestComment}
          childName={ceremonyDetails.displayName}
        />
      )}
    </div>
  );
};

// Enhanced Guest Book Modal Component
const GuestBookModal = ({ onClose, comments, onAddComment, childName }) => {
  const [name, setName] = useState('');
  const [message, setMessage] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (name.trim() && message.trim()) {
      onAddComment(name.trim(), message.trim());
      setName('');
      setMessage('');
    }
  };

  return (
    <div className="guest-book-overlay" onClick={onClose}>
      <div className="guest-book-modal hover-lift" onClick={(e) => e.stopPropagation()}>
        <div className="guest-book-header">
          <h2>📖 {childName}'s Guest Book</h2>
          <button onClick={onClose} className="close-btn">✕</button>
        </div>
        
        <div className="guest-book-content">
          <form onSubmit={handleSubmit} className="comment-form">
            <div className="form-group">
              <input
                type="text"
                placeholder="Your name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="form-input"
                required
              />
            </div>
            <div className="form-group">
              <textarea
                placeholder={`Share your blessing or memory for ${childName}...`}
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                className="form-textarea"
                rows="3"
                required
              />
            </div>
            <button type="submit" className="submit-btn">
              ✨ Add Blessing
            </button>
          </form>
          
          <div className="comments-list">
            <h3>Blessings & Messages ({comments.length})</h3>
            <div className="comments">
              {comments.map(comment => (
                <div key={comment.id} className="comment-card">
                  <div className="comment-avatar">{comment.avatar}</div>
                  <div className="comment-content">
                    <div className="comment-header">
                      <strong>{comment.name}</strong>
                      <span className="comment-date">{comment.timestamp}</span>
                    </div>
                    <p className="comment-message">{comment.message}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

function App() {
  return (
    <div className="App">
      <ChristeningLandingPage />
    </div>
  );
}

export default App;