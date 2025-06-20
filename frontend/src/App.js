import React, { useState, useEffect, useRef } from 'react';
import './App.css';

const ChristeningLandingPage = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedMedia, setSelectedMedia] = useState(null);
  const [showLightbox, setShowLightbox] = useState(false);
  const [lightboxIndex, setLightboxIndex] = useState(0);
  const [mediaData, setMediaData] = useState({ photos: [], videos: [] });
  const [isLoadingMedia, setIsLoadingMedia] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  
  // Collapsible sections state - start collapsed for minimal view
  const [collapsedSections, setCollapsedSections] = useState({
    photos: true,
    videos: true
  });

  // Refs
  const backgroundVideoRef = useRef(null);

  // Static video configuration - no backend needed
  const BACKGROUND_VIDEO_ID = "1IWNvGhXP1LKhi_CR2y_LJsxy6ikQ9F7q";
  const BACKGROUND_VIDEO_URL = `https://drive.google.com/uc?export=download&id=${BACKGROUND_VIDEO_ID}`;
  
  // Additional video for gallery
  const GALLERY_VIDEO_ID = "163rWffXF7pW38eBzRbaZz2yycHMkme_3";
  const GALLERY_VIDEO_URL = `https://drive.google.com/uc?export=download&id=${GALLERY_VIDEO_ID}`;

  // Real ceremony details - static data
  const ceremonyDetails = {
    childName: "ALEXANDRA JESUOLUWATOMISIN ESTHER MOJOLAOLUWA ADEOLA ABIMIFOLUWA ADUNNI",
    displayName: "Alexandra",
    fullName: "Alexandra Jesuoluwatomisin Esther Mojolaoluwa Adeola Abimifoluwa Adunni",
    parents: "Mr & Mrs Emmanuel OSHO",
    dateOfBirth: "11th June 2025",
    ceremonyDate: "18th June 2025",
    password: "Alexandra2025"
  };

  // Static media data - all client-side, no backend API calls
  const staticMediaData = {
    photos: [
      {
        id: '1',
        title: 'Sacred Naming Ceremony - Blessed Moment 1',
        thumbnail: 'https://images.pexels.com/photos/32488939/pexels-photo-32488939.jpeg?auto=compress&cs=tinysrgb&w=400',
        fullSize: 'https://images.pexels.com/photos/32488939/pexels-photo-32488939.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
        type: 'photo'
      },
      {
        id: '2',
        title: 'Sacred Naming Ceremony - Family Joy',
        thumbnail: 'https://images.pexels.com/photos/1166209/pexels-photo-1166209.jpeg?auto=compress&cs=tinysrgb&w=400',
        fullSize: 'https://images.pexels.com/photos/1166209/pexels-photo-1166209.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
        type: 'photo'
      },
      {
        id: '3',
        title: 'Sacred Naming Ceremony - Divine Blessing',
        thumbnail: 'https://images.pexels.com/photos/1116302/pexels-photo-1116302.jpeg?auto=compress&cs=tinysrgb&w=400',
        fullSize: 'https://images.pexels.com/photos/1116302/pexels-photo-1116302.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
        type: 'photo'
      },
      {
        id: '4',
        title: 'Sacred Naming Ceremony - Precious Memories',
        thumbnail: 'https://images.pexels.com/photos/1648377/pexels-photo-1648377.jpeg?auto=compress&cs=tinysrgb&w=400',
        fullSize: 'https://images.pexels.com/photos/1648377/pexels-photo-1648377.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
        type: 'photo'
      },
      {
        id: '5',
        title: 'Sacred Naming Ceremony - Beautiful Celebration',
        thumbnail: 'https://images.pexels.com/photos/1181563/pexels-photo-1181563.jpeg?auto=compress&cs=tinysrgb&w=400',
        fullSize: 'https://images.pexels.com/photos/1181563/pexels-photo-1181563.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
        type: 'photo'
      },
      {
        id: '6',
        title: 'Sacred Naming Ceremony - Joyful Gathering',
        thumbnail: 'https://images.pexels.com/photos/1058277/pexels-photo-1058277.jpeg?auto=compress&cs=tinysrgb&w=400',
        fullSize: 'https://images.pexels.com/photos/1058277/pexels-photo-1058277.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
        type: 'photo'
      }
    ],
    videos: [
      {
        id: 'v1',
        title: 'Special Ceremony Moments',
        thumbnail: 'https://images.pexels.com/photos/1166209/pexels-photo-1166209.jpeg?auto=compress&cs=tinysrgb&w=400',
        fullSize: GALLERY_VIDEO_URL,
        type: 'video',
        duration: '2:30'
      },
      {
        id: 'v2',
        title: 'Sacred Blessing Video',
        thumbnail: 'https://images.pexels.com/photos/1648377/pexels-photo-1648377.jpeg?auto=compress&cs=tinysrgb&w=400',
        fullSize: BACKGROUND_VIDEO_URL,
        type: 'video',
        duration: '1:45'
      }
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

  // Initialize mobile detection
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth <= 768);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Load static media data when authenticated
  useEffect(() => {
    if (isAuthenticated) {
      loadStaticMedia();
    }
  }, [isAuthenticated]);

  const loadStaticMedia = () => {
    setIsLoadingMedia(true);
    
    // Simulate loading delay for better UX
    setTimeout(() => {
      // Shuffle the arrays for random order on each page load
      const shuffledPhotos = shuffleArray(staticMediaData.photos);
      const shuffledVideos = shuffleArray(staticMediaData.videos);

      setMediaData({
        photos: shuffledPhotos,
        videos: shuffledVideos
      });
      setIsLoadingMedia(false);
    }, 1000);
  };

  const handlePasswordSubmit = (e) => {
    e.preventDefault();
    setIsLoading(true);
    
    // Simulate authentication delay
    setTimeout(() => {
      if (password === ceremonyDetails.password) {
        setIsAuthenticated(true);
        setPassword('');
      } else {
        alert('Incorrect access code. Please try again.');
      }
      setIsLoading(false);
    }, 500);
  };

  const handleMediaClick = (media) => {
    const allMedia = [...mediaData.photos, ...mediaData.videos];
    const index = allMedia.findIndex(item => item.id === media.id);
    setSelectedMedia(media);
    setLightboxIndex(index);
    setShowLightbox(true);
  };

  const closeLightbox = () => {
    setShowLightbox(false);
    setSelectedMedia(null);
  };

  const navigateLightbox = (direction) => {
    const allMedia = [...mediaData.photos, ...mediaData.videos];
    const currentIndex = allMedia.findIndex(item => item.id === selectedMedia.id);
    let newIndex;
    
    if (direction === 'next') {
      newIndex = currentIndex < allMedia.length - 1 ? currentIndex + 1 : 0;
    } else {
      newIndex = currentIndex > 0 ? currentIndex - 1 : allMedia.length - 1;
    }
    
    setSelectedMedia(allMedia[newIndex]);
    setLightboxIndex(newIndex);
  };

  const handleDownload = (media) => {
    try {
      // For static deployment, we'll use a different approach
      const link = document.createElement('a');
      link.href = media.fullSize;
      link.download = media.title;
      link.target = '_blank';
      link.rel = 'noopener noreferrer';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (error) {
      // Fallback: open in new tab if download fails
      window.open(media.fullSize, '_blank', 'noopener,noreferrer');
    }
  };

  const toggleSection = (section) => {
    setCollapsedSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };

  // Handle keyboard navigation
  useEffect(() => {
    const handleKeyPress = (e) => {
      if (showLightbox) {
        if (e.key === 'ArrowLeft') {
          navigateLightbox('prev');
        } else if (e.key === 'ArrowRight') {
          navigateLightbox('next');
        } else if (e.key === 'Escape') {
          closeLightbox();
        }
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [showLightbox, selectedMedia]);

  // Password Screen
  if (!isAuthenticated) {
    return (
      <div className="password-screen">
        {/* Background Video */}
        <video 
          ref={backgroundVideoRef}
          className="password-video-background"
          autoPlay
          muted
          loop
          playsInline
          poster="https://images.pexels.com/photos/32488939/pexels-photo-32488939.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2"
        >
          <source src={BACKGROUND_VIDEO_URL} type="video/mp4" />
        </video>
        
        {/* Video Overlay */}
        <div className="password-video-overlay"></div>
        
        <div className="password-overlay"></div>
        <div className="password-container">
          <div className="password-card">
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
                  autoComplete="off"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="password-toggle"
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
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
    <div className="landing-page">
      {/* Hero Section with Background Video */}
      <section id="hero" className="hero-section">
        {/* Background Video */}
        <video 
          className="hero-video-background"
          autoPlay
          muted
          loop
          playsInline
          poster="https://images.pexels.com/photos/32488939/pexels-photo-32488939.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2"
        >
          <source src={BACKGROUND_VIDEO_URL} type="video/mp4" />
        </video>
        
        {/* Video Overlay */}
        <div className="hero-video-overlay"></div>
        
        <div className="hero-content">
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
                onClick={() => document.getElementById('gallery').scrollIntoView({ behavior: 'smooth' })}
                className="hero-cta primary"
              >
                View Gallery
              </button>
            </div>
          </div>
        </div>
        <div className="scroll-indicator">
          <div className="scroll-arrow"></div>
          <span>Scroll to explore memories</span>
        </div>
      </section>

      {/* Simplified Media Gallery */}
      <section id="gallery" className="media-gallery">
        <div className="container">
          <div className="gallery-header">
            <h2 className="section-title">Sacred Memories</h2>
            <p className="gallery-subtitle">Beautiful moments from {ceremonyDetails.displayName}'s naming ceremony</p>
          </div>

          {/* Photos Section - Collapsible */}
          <div className="media-section">
            <button 
              className="section-toggle"
              onClick={() => toggleSection('photos')}
              aria-expanded={!collapsedSections.photos}
              aria-controls="photos-content"
            >
              <span className="section-title">📸 All Photos ({mediaData.photos.length})</span>
              <span className="toggle-arrow">
                {collapsedSections.photos ? '⬇️' : '⬆️'}
              </span>
            </button>
            
            <div 
              id="photos-content"
              className={`collapsible-content ${collapsedSections.photos ? 'collapsed' : 'expanded'}`}
            >
              {isLoadingMedia ? (
                <div className="loading-gallery">
                  <div className="loading-spinner"></div>
                  <p>Loading photos...</p>
                </div>
              ) : (
                <div className="simple-gallery-grid">
                  {mediaData.photos.map((photo, index) => (
                    <div 
                      key={photo.id} 
                      className="simple-media-item"
                      onClick={() => handleMediaClick(photo)}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter' || e.key === ' ') {
                          e.preventDefault();
                          handleMediaClick(photo);
                        }
                      }}
                      tabIndex={0}
                      role="button"
                      aria-label={`View ${photo.title}`}
                    >
                      <img 
                        src={photo.thumbnail} 
                        alt={photo.title} 
                        loading="lazy"
                        onError={(e) => {
                          e.target.src = 'https://images.pexels.com/photos/32488939/pexels-photo-32488939.jpeg?auto=compress&cs=tinysrgb&w=400';
                        }}
                      />
                      <div className="media-overlay">
                        <div className="simple-actions">
                          <button 
                            className="action-btn view-btn" 
                            title="Full Screen View"
                            aria-label="View in full screen"
                          >
                            🔍
                          </button>
                          <button 
                            className="action-btn download-btn" 
                            onClick={(e) => {
                              e.stopPropagation();
                              handleDownload(photo);
                            }}
                            title="Download"
                            aria-label="Download image"
                          >
                            ⬇️
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Videos Section - Collapsible */}
          <div className="media-section">
            <button 
              className="section-toggle"
              onClick={() => toggleSection('videos')}
              aria-expanded={!collapsedSections.videos}
              aria-controls="videos-content"
            >
              <span className="section-title">🎥 All Videos ({mediaData.videos.length})</span>
              <span className="toggle-arrow">
                {collapsedSections.videos ? '⬇️' : '⬆️'}
              </span>
            </button>
            
            <div 
              id="videos-content"
              className={`collapsible-content ${collapsedSections.videos ? 'collapsed' : 'expanded'}`}
            >
              {isLoadingMedia ? (
                <div className="loading-gallery">
                  <div className="loading-spinner"></div>
                  <p>Loading videos...</p>
                </div>
              ) : (
                <div className="simple-gallery-grid">
                  {mediaData.videos.map((video, index) => (
                    <div 
                      key={video.id} 
                      className="simple-media-item video-item"
                      onClick={() => handleMediaClick(video)}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter' || e.key === ' ') {
                          e.preventDefault();
                          handleMediaClick(video);
                        }
                      }}
                      tabIndex={0}
                      role="button"
                      aria-label={`View ${video.title}`}
                    >
                      <img 
                        src={video.thumbnail} 
                        alt={video.title} 
                        loading="lazy"
                        onError={(e) => {
                          e.target.src = 'https://images.pexels.com/photos/1166209/pexels-photo-1166209.jpeg?auto=compress&cs=tinysrgb&w=400';
                        }}
                      />
                      <div className="video-indicator">
                        <span className="play-icon">▶️</span>
                        <span className="duration">{video.duration || '0:00'}</span>
                      </div>
                      <div className="media-overlay">
                        <div className="simple-actions">
                          <button 
                            className="action-btn view-btn" 
                            title="Full Screen View"
                            aria-label="View video in full screen"
                          >
                            🔍
                          </button>
                          <button 
                            className="action-btn download-btn" 
                            onClick={(e) => {
                              e.stopPropagation();
                              handleDownload(video);
                            }}
                            title="Download"
                            aria-label="Download video"
                          >
                            ⬇️
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Lightbox Modal */}
      {showLightbox && selectedMedia && (
        <div 
          className="lightbox-overlay" 
          onClick={closeLightbox}
          role="dialog"
          aria-modal="true"
          aria-labelledby="lightbox-title"
        >
          <div className="lightbox-container" onClick={(e) => e.stopPropagation()}>
            <button 
              className="lightbox-close" 
              onClick={closeLightbox}
              aria-label="Close lightbox"
            >
              ×
            </button>
            
            {/* Navigation Arrows */}
            <button 
              className="lightbox-nav lightbox-prev" 
              onClick={() => navigateLightbox('prev')}
              aria-label="Previous media"
            >
              ❮
            </button>
            <button 
              className="lightbox-nav lightbox-next" 
              onClick={() => navigateLightbox('next')}
              aria-label="Next media"
            >
              ❯
            </button>
            
            <div className="lightbox-content">
              {selectedMedia.type === 'video' ? (
                <video 
                  controls 
                  className="lightbox-video"
                  src={selectedMedia.fullSize}
                  aria-label={selectedMedia.title}
                >
                  Your browser does not support the video tag.
                </video>
              ) : (
                <img 
                  src={selectedMedia.fullSize} 
                  alt={selectedMedia.title}
                  className="lightbox-image"
                  onError={(e) => {
                    e.target.src = selectedMedia.thumbnail;
                  }}
                />
              )}
            </div>
            
            <div className="lightbox-info">
              <h3 id="lightbox-title">{selectedMedia.title}</h3>
              <div className="lightbox-actions">
                <button 
                  className="lightbox-download"
                  onClick={() => handleDownload(selectedMedia)}
                  aria-label={`Download ${selectedMedia.title}`}
                >
                  ⬇️ Download
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Hide Emergent Badge */}
      <style>
        {`
          #emergent-badge {
            display: none !important;
          }
          
          /* Ensure no backend references */
          .backend-references {
            display: none !important;
          }
        `}
      </style>
    </div>
  );
};

export default ChristeningLandingPage;