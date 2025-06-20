import React, { useState, useEffect, useRef } from 'react';
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
  
  // Refs for scroll animations
  const heroRef = useRef(null);
  const galleryRef = useRef(null);
  const testimonialsRef = useRef(null);

  // Google Drive API configuration
  const FOLDER_ID = "1sk7C-nQPr2yfFtbpQGjFO1OPlXp9HPB9";
  const API_KEY = "AIzaSyCMaBUGCG5oZUdoF1VZz-wKQehd_ktYA5I";

  // Simple password check (in production, this should be server-side)
  const correctPassword = 'Alexandra2024';

  // Scroll progress and animations
  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.pageYOffset;
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      const scrollPercent = (scrollTop / docHeight) * 100;
      setScrollProgress(scrollPercent);
      
      // Show floating nav after scrolling past hero
      setShowFloatingNav(scrollTop > window.innerHeight * 0.5);
      
      // Parallax effects
      if (heroRef.current) {
        const heroBackground = heroRef.current.querySelector('.hero-background');
        if (heroBackground) {
          heroBackground.style.transform = `translateY(${scrollTop * 0.5}px)`;
        }
      }
      
      // Animate elements on scroll
      const animateOnScroll = (elements) => {
        elements.forEach(el => {
          if (el) {
            const rect = el.getBoundingClientRect();
            const isVisible = rect.top < window.innerHeight && rect.bottom > 0;
            if (isVisible) {
              el.classList.add('animate-in');
            }
          }
        });
      };
      
      const elementsToAnimate = document.querySelectorAll('.animate-on-scroll');
      animateOnScroll(elementsToAnimate);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

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
          title: file.name.replace(/\.[^/.]+$/, ""), // Remove file extension
          thumbnail: file.thumbnailLink || `https://drive.google.com/thumbnail?id=${file.id}`,
          type: file.mimeType.startsWith('video') ? 'video' : 'photo',
          driveId: file.id,
          mimeType: file.mimeType,
          size: file.size,
          createdTime: file.createdTime,
          downloadUrl: `https://drive.google.com/uc?export=download&id=${file.id}`,
          viewUrl: `https://drive.google.com/file/d/${file.id}/view`,
          aspectRatio: Math.random() > 0.5 ? 'tall' : 'wide' // Random for masonry
        };
        
        if (file.mimeType.startsWith('video')) {
          videos.push(mediaItem);
        } else if (file.mimeType.startsWith('image')) {
          photos.push(mediaItem);
        }
      });
      
      setMediaData({ photos, videos });
      
      // Initialize reactions for each media item
      const initialReactions = {};
      [...photos, ...videos].forEach(item => {
        initialReactions[item.id] = { hearts: 0, blessings: 0, prayers: 0 };
      });
      setMediaReactions(initialReactions);
      
    } catch (error) {
      console.error('Error loading media:', error);
      // Fallback to sample data if API fails
      const fallbackPhotos = [
        { id: 1, title: "Loading your photos...", thumbnail: "https://images.pexels.com/photos/32488939/pexels-photo-32488939.jpeg", type: "photo", driveId: "sample1", aspectRatio: 'wide' },
        { id: 2, title: "Beautiful moments...", thumbnail: "https://images.pexels.com/photos/2088142/pexels-photo-2088142.jpeg", type: "photo", driveId: "sample2", aspectRatio: 'tall' },
      ];
      const fallbackVideos = [
        { id: 3, title: "Loading your videos...", thumbnail: "https://images.pexels.com/photos/32488939/pexels-photo-32488939.jpeg", type: "video", driveId: "sample3", aspectRatio: 'wide' },
      ];
      setMediaData({ photos: fallbackPhotos, videos: fallbackVideos });
    } finally {
      setIsLoadingMedia(false);
    }
  };

  // Load media when authenticated
  useEffect(() => {
    if (isAuthenticated) {
      loadMediaFromDrive();
      // Initialize guest comments with sample data
      setGuestComments([
        { id: 1, name: "Grandma Rose", message: "What a blessed day! Alexandra looks like an angel.", timestamp: new Date().toLocaleDateString(), avatar: "👵" },
        { id: 2, name: "Uncle John", message: "So proud to witness this sacred moment. Beautiful ceremony!", timestamp: new Date().toLocaleDateString(), avatar: "👨" }
      ]);
    }
  }, [isAuthenticated]);

  const handlePasswordSubmit = (e) => {
    e.preventDefault();
    setIsLoading(true);
    
    setTimeout(() => {
      if (password === correctPassword) {
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

  if (!isAuthenticated) {
    return (
      <div className="password-screen">
        <div className="password-overlay"></div>
        <div className="password-container">
          <div className="password-card">
            <div className="angel-icon">👼</div>
            <h1 className="password-title">Alexandra's Heavenly Blessing</h1>
            <p className="password-subtitle">Enter the sacred password to view precious memories</p>
            
            <form onSubmit={handlePasswordSubmit} className="password-form">
              <div className="password-input-group">
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter password"
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
    <div className="landing-page">
      {/* Scroll Progress Bar */}
      <div className="scroll-progress-bar">
        <div 
          className="scroll-progress-fill" 
          style={{ width: `${scrollProgress}%` }}
        ></div>
      </div>

      {/* Floating Navigation */}
      {showFloatingNav && (
        <nav className="floating-nav">
          <div className="nav-items">
            <button onClick={() => scrollToSection('hero')} className="nav-item">Home</button>
            <button onClick={() => scrollToSection('gallery')} className="nav-item">Gallery</button>
            <button onClick={() => scrollToSection('testimonials')} className="nav-item">Messages</button>
            <button onClick={() => setShowGuestBook(true)} className="nav-item">Guest Book</button>
          </div>
        </nav>
      )}

      {/* Hero Section */}
      <section id="hero" className="hero-section" ref={heroRef}>
        <div className="hero-background"></div>
        <div className="hero-content animate-on-scroll">
          <div className="hero-text">
            <h1 className="hero-title">
              <span className="title-line">Alexandra's</span>
              <span className="title-line highlight">Heavenly Blessing</span>
            </h1>
            <p className="hero-subtitle">
              A sacred celebration captured in precious moments
            </p>
            <p className="hero-date">Christening Day • 2024</p>
            <div className="hero-actions">
              <button 
                onClick={() => scrollToSection('gallery')} 
                className="hero-cta primary"
              >
                View Gallery
              </button>
              <button 
                onClick={() => setShowStoryMode(true)} 
                className="hero-cta secondary"
              >
                Story Mode
              </button>
            </div>
          </div>
          <div className="hero-decoration">
            <div className="floating-element float-1">🌸</div>
            <div className="floating-element float-2">✨</div>
            <div className="floating-element float-3">🕊️</div>
            <div className="floating-element float-4">💕</div>
          </div>
        </div>
        <div className="scroll-indicator">
          <div className="scroll-arrow"></div>
          <span>Scroll to explore</span>
        </div>
      </section>

      {/* Gallery Introduction */}
      <section className="gallery-intro animate-on-scroll">
        <div className="container">
          <div className="intro-content">
            <h2 className="section-title">Sacred Memories</h2>
            <p className="section-description">
              Witness the divine moments of Alexandra's christening through our carefully curated collection 
              of photos and videos. Each image tells a story of love, faith, and heavenly blessings.
            </p>
            
            <div className="gallery-preview">
              <div className="preview-image">
                <img src="https://images.pexels.com/photos/32488939/pexels-photo-32488939.jpeg" alt="Christening celebration" />
                <div className="preview-overlay">
                  <div className="preview-stats">
                    <div className="stat">
                      <span className="stat-number">{getTotalCount().photos}</span>
                      <span className="stat-label">Photos</span>
                    </div>
                    <div className="stat">
                      <span className="stat-number">{getTotalCount().videos}</span>
                      <span className="stat-label">Videos</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Media Gallery */}
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
              </div>
            </div>
          </div>

          <div className="gallery-content animate-on-scroll">
            <div className="integrated-gallery">
              {isLoadingMedia ? (
                <div className="loading-gallery">
                  <div className="loading-spinner large"></div>
                  <p>Loading Alexandra's precious memories...</p>
                </div>
              ) : (
                <div className={`gallery-grid ${galleryLayout}`}>
                  {getFilteredMedia().map((media, index) => (
                    <div 
                      key={media.id} 
                      className={`media-item ${media.aspectRatio} animate-on-scroll`}
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
                  💝 Click any image to view in full size • Click reactions to bless the moment
                </p>
                <button onClick={handleViewInDrive} className="drive-access-button">
                  View Original Google Drive Folder
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section id="testimonials" className="testimonials-section" ref={testimonialsRef}>
        <div className="testimonials-background"></div>
        <div className="container">
          <h2 className="section-title white animate-on-scroll">Messages of Love</h2>
          
          <div className="testimonials-grid animate-on-scroll">
            <div className="testimonial-card">
              <div className="testimonial-quote">"</div>
              <p className="testimonial-text">
                "What a beautiful and blessed day! Alexandra looked like an angel during her christening. 
                These photos will be treasured forever."
              </p>
              <div className="testimonial-author">
                <div className="author-info">
                  <h4>Grandma Rose</h4>
                  <span>Proud Grandmother</span>
                </div>
              </div>
            </div>

            <div className="testimonial-card">
              <div className="testimonial-quote">"</div>
              <p className="testimonial-text">
                "The ceremony was absolutely magical. Seeing Alexandra surrounded by so much love 
                brought tears to my eyes. Thank you for sharing these precious moments."
              </p>
              <div className="testimonial-author">
                <div className="author-info">
                  <h4>Aunt Maria</h4>
                  <span>Loving Aunt</span>
                </div>
              </div>
            </div>

            <div className="testimonial-card">
              <div className="testimonial-quote">"</div>
              <p className="testimonial-text">
                "God's blessings were evident throughout the entire celebration. Alexandra is 
                truly blessed to have such a loving family surrounding her."
              </p>
              <div className="testimonial-author">
                <div className="author-info">
                  <h4>Father Michael</h4>
                  <span>Officiating Priest</span>
                </div>
              </div>
            </div>
          </div>
          
          <div className="add-message-section animate-on-scroll">
            <button 
              onClick={() => setShowGuestBook(true)} 
              className="add-message-btn"
            >
              ✍️ Share Your Blessing
            </button>
          </div>
        </div>
      </section>

      {/* Footer Section */}
      <footer className="footer-section">
        <div className="footer-background"></div>
        <div className="container">
          <div className="footer-content animate-on-scroll">
            <div className="footer-main">
              <h3 className="footer-title">Alexandra's Christening</h3>
              <p className="footer-subtitle">
                A day filled with divine blessings, family love, and heavenly joy
              </p>
              
              <div className="footer-details">
                <div className="detail-item">
                  <span className="detail-icon">📅</span>
                  <span>Celebrated in 2024</span>
                </div>
                <div className="detail-item">
                  <span className="detail-icon">⛪</span>
                  <span>Sacred Ceremony</span>
                </div>
                <div className="detail-item">
                  <span className="detail-icon">👪</span>
                  <span>Family & Friends</span>
                </div>
              </div>
            </div>

            <div className="footer-access">
              <h4>Access Media Gallery</h4>
              <p>View and download all photos and videos from this blessed day</p>
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
              © 2024 Alexandra's Christening • Created with Love
            </p>
          </div>
        </div>
      </footer>

      {/* Advanced Lightbox Modal */}
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
                <img src={selectedMedia.thumbnail} alt={selectedMedia.title} className="lightbox-image" />
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
        />
      )}
    </div>
  );
};

// Guest Book Modal Component
const GuestBookModal = ({ onClose, comments, onAddComment }) => {
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
      <div className="guest-book-modal" onClick={(e) => e.stopPropagation()}>
        <div className="guest-book-header">
          <h2>📖 Guest Book</h2>
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
                placeholder="Share your blessing or memory..."
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