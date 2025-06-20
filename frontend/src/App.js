import React, { useState, useEffect } from 'react';
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

  // Google Drive API configuration
  const FOLDER_ID = "1sk7C-nQPr2yfFtbpQGjFO1OPlXp9HPB9";
  const API_KEY = "AIzaSyCMaBUGCG5oZUdoF1VZz-wKQehd_ktYA5I";

  // Simple password check (in production, this should be server-side)
  const correctPassword = 'Alexandra2024';

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

  const getTotalCount = () => {
    return {
      photos: mediaData.photos.length,
      videos: mediaData.videos.length
    };
  };

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
          viewUrl: `https://drive.google.com/file/d/${file.id}/view`
        };
        
        if (file.mimeType.startsWith('video')) {
          videos.push(mediaItem);
        } else if (file.mimeType.startsWith('image')) {
          photos.push(mediaItem);
        }
      });
      
      setMediaData({ photos, videos });
    } catch (error) {
      console.error('Error loading media:', error);
      // Fallback to sample data if API fails
      setMediaData({
        photos: [
          { id: 1, title: "Loading your photos...", thumbnail: "https://images.pexels.com/photos/32488939/pexels-photo-32488939.jpeg", type: "photo", driveId: "sample1" },
        ],
        videos: [
          { id: 2, title: "Loading your videos...", thumbnail: "https://images.pexels.com/photos/32488939/pexels-photo-32488939.jpeg", type: "video", driveId: "sample2" },
        ]
      });
    } finally {
      setIsLoadingMedia(false);
    }
  };

  // Load media when authenticated
  useEffect(() => {
    if (isAuthenticated) {
      loadMediaFromDrive();
    }
  }, [isAuthenticated]);

  const handleMediaClick = (media) => {
    setSelectedMedia(media);
    setShowLightbox(true);
  };

  const handleDownload = (media) => {
    // In production, this would trigger download from Google Drive
    const driveDownloadUrl = `https://drive.google.com/uc?export=download&id=${media.driveId}`;
    window.open(driveDownloadUrl, '_blank');
  };

  const handleViewInDrive = () => {
    window.open('https://drive.google.com/drive/folders/1sk7C-nQPr2yfFtbpQGjFO1OPlXp9HPB9', '_blank');
  };

  const getFilteredMedia = () => {
    if (activeTab === 'photos') return mediaData.photos;
    if (activeTab === 'videos') return mediaData.videos;
    return [...mediaData.photos, ...mediaData.videos];
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
      {/* Hero Section */}
      <section className="hero-section">
        <div className="hero-background"></div>
        <div className="hero-content">
          <div className="hero-text">
            <h1 className="hero-title">
              <span className="title-line">Alexandra's</span>
              <span className="title-line highlight">Heavenly Blessing</span>
            </h1>
            <p className="hero-subtitle">
              A sacred celebration captured in precious moments
            </p>
            <p className="hero-date">Christening Day • 2024</p>
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
      <section className="gallery-intro">
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
      <section className="media-gallery">
        <div className="container">
          <div className="gallery-header">
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
          </div>

          <div className="gallery-content">
            <div className="integrated-gallery">
              <div className="gallery-grid">
                {getFilteredMedia().map((media) => (
                  <div key={media.id} className="media-item" onClick={() => handleMediaClick(media)}>
                    <div className="media-thumbnail">
                      <img src={media.thumbnail} alt={media.title} />
                      <div className="media-overlay">
                        <div className="media-type">
                          {media.type === 'video' ? (
                            <>
                              <span className="play-icon">▶️</span>
                              <span className="duration">{media.duration}</span>
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
                    <div className="media-title">{media.title}</div>
                  </div>
                ))}
              </div>
              
              <div className="gallery-footer">
                <p className="gallery-note">
                  💝 Click any image to view in full size • Click download to save to your device
                </p>
                <button onClick={handleViewInDrive} className="drive-access-button">
                  View Original Google Drive Folder
                </button>
              </div>
            </div>
          </div>

          {/* Lightbox Modal */}
          {showLightbox && selectedMedia && (
            <div className="lightbox-overlay" onClick={() => setShowLightbox(false)}>
              <div className="lightbox-container" onClick={(e) => e.stopPropagation()}>
                <button className="lightbox-close" onClick={() => setShowLightbox(false)}>
                  ✕
                </button>
                
                <div className="lightbox-content">
                  {selectedMedia.type === 'video' ? (
                    <div className="video-placeholder">
                      <div className="video-info">
                        <h3>{selectedMedia.title}</h3>
                        <p>Duration: {selectedMedia.duration}</p>
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
                  <h3 className="lightbox-title">{selectedMedia.title}</h3>
                  <div className="lightbox-actions">
                    <button onClick={() => handleDownload(selectedMedia)} className="lightbox-download">
                      Download Original
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="testimonials-section">
        <div className="testimonials-background"></div>
        <div className="container">
          <h2 className="section-title white">Messages of Love</h2>
          
          <div className="testimonials-grid">
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
        </div>
      </section>

      {/* Footer Section */}
      <footer className="footer-section">
        <div className="footer-background"></div>
        <div className="container">
          <div className="footer-content">
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