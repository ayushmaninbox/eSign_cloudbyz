import React, { useState, useEffect, useCallback, useRef } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { User, Settings, LogOut, UserCircle } from 'lucide-react';
import Loader from '../ui/Loader';
import Error404 from '../ui/404error';

const ProfileModal = ({ isOpen, onClose }) => {
  const navigate = useNavigate();

  if (!isOpen) return null;

  const handleLogout = () => {
    localStorage.removeItem('username');
    localStorage.removeItem('useremail');
    navigate('/');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-end pt-16 pr-6">
      <div className="absolute inset-0" onClick={onClose}></div>
      <div className="bg-white rounded-xl shadow-2xl border border-gray-200 w-64 mt-2 relative z-10 overflow-hidden">
        <div className="py-2">
          <button className="w-full px-4 py-3 text-left hover:bg-gray-50 flex items-center space-x-3 transition-colors">
            <UserCircle className="w-5 h-5 text-gray-500" />
            <span className="text-gray-700">Profile</span>
          </button>
          <button className="w-full px-4 py-3 text-left hover:bg-gray-50 flex items-center space-x-3 transition-colors">
            <Settings className="w-5 h-5 text-gray-500" />
            <span className="text-gray-700">Account Settings</span>
          </button>
          <hr className="my-2 border-gray-100" />
          <button 
            onClick={handleLogout}
            className="w-full px-4 py-3 text-left hover:bg-red-50 flex items-center space-x-3 transition-colors text-red-600"
          >
            <LogOut className="w-5 h-5" />
            <span>Logout</span>
          </button>
        </div>
      </div>
    </div>
  );
};

const Navbar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [showProfileModal, setShowProfileModal] = useState(false);

  const handleBack = () => {
    // Check if we came from manage page or other pages
    if (location.state?.from === '/manage') {
      navigate('/manage');
    } else if (location.state?.from === '/signsetupui') {
      navigate('/signsetupui');
    } else if (location.state?.from === '/signeeui') {
      navigate('/signeeui');
    } else {
      // Default to home
      navigate('/home');
    }
  };

  const handleLogoClick = () => {
    const username = localStorage.getItem('username');
    if (username) {
      navigate('/home');
    } else {
      navigate('/');
    }
  };

  return (
    <>
      <nav className="fixed top-0 left-0 right-0 bg-white shadow-lg z-30 h-16 px-6 flex justify-between items-center border-b-2 border-CloudbyzBlue/10">
        <div className="flex items-center space-x-8">
          <img 
            src="/images/cloudbyz.png" 
            alt="Cloudbyz Logo" 
            className="h-10 object-contain cursor-pointer hover:scale-105 transition-transform" 
            onClick={handleLogoClick}
          />
        </div>
        
        <div className="flex items-center space-x-4">
          <span className="text-sm text-gray-600">John Doe</span>
          <button 
            onClick={() => setShowProfileModal(!showProfileModal)}
            className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 flex items-center justify-center transition-colors"
          >
            <User className="w-5 h-5 text-slate-600" />
          </button>
        </div>
      </nav>
      
      <ProfileModal 
        isOpen={showProfileModal} 
        onClose={() => setShowProfileModal(false)} 
      />
    </>
  );
};

function SignPreview() {
  const navigate = useNavigate();
  const location = useLocation();
  const [pageUrls, setPageUrls] = useState([]);
  const [events, setEvents] = useState([]);
  const numPages = pageUrls.length;
  const [currentPage, setCurrentPage] = useState(1);
  const [pageInput, setPageInput] = useState('1');
  const [isThumbnailCollapsed, setIsThumbnailCollapsed] = useState(false);
  const [isAuditCollapsed, setIsAuditCollapsed] = useState(false);
  const [activeTab, setActiveTab] = useState('audit');
  const [isLoading, setIsLoading] = useState(true);
  const [isNavigating, setIsNavigating] = useState(false);
  const [serverError, setServerError] = useState(false);

  const loadingStates = [
    { text: 'Loading document preview...' },
    { text: 'Fetching audit trail...' },
    { text: 'Preparing document viewer...' },
    { text: 'Loading signature data...' }
  ];

  const navigatingStates = [
    { text: 'Finalizing document...' },
    { text: 'Saving changes...' },
    { text: 'Processing completion...' },
    { text: 'Redirecting to dashboard...' }
  ];

  const handleBack = () => {
    // Check if we came from manage page or other pages
    if (location.state?.from === '/manage') {
      navigate('/manage');
    } else if (location.state?.from === '/signsetupui') {
      navigate('/signsetupui');
    } else if (location.state?.from === '/signeeui') {
      navigate('/signeeui');
    } else {
      // Default to home
      navigate('/home');
    }
  };

  const handleFinish = async () => {
    setIsNavigating(true);
    
    try {
      // Test server connection
      const response = await fetch('http://localhost:5000/api/stats');
      if (!response.ok) {
        throw new Error('Server connection failed');
      }
      
      // Simulate processing time
      await new Promise(resolve => setTimeout(resolve, 3000));
      
      navigate('/home');
    } catch (error) {
      console.error('Server error:', error);
      setServerError(true);
    } finally {
      setIsNavigating(false);
    }
  };

  const getEventIcon = (eventText) => {
    const imagesDir = '/images';
    if (eventText.includes('created')) return `${imagesDir}/created.png`;
    if (eventText.includes('emailed')) return `${imagesDir}/emailed.png`;
    if (eventText.includes('viewed')) return `${imagesDir}/viewed.png`;
    if (eventText.includes('password')) return `${imagesDir}/password.png`;
    if (eventText.includes('signed')) return `${imagesDir}/signed.png`;
    if (eventText.includes('approved')) return `${imagesDir}/approved.png`;
    if (eventText.includes('review')) return `${imagesDir}/review.png`;
    if (eventText.includes('verified')) return `${imagesDir}/verified.png`;
    if (eventText.includes('archived')) return `${imagesDir}/archived.png`;
    if (eventText.includes('processing')) return `${imagesDir}/processing.png`;
    return `${imagesDir}/created.png`;
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [imagesResponse, eventsResponse] = await Promise.all([
          fetch('http://localhost:5000/api/images'),
          fetch('http://localhost:5000/api/events'),
        ]);
        
        if (!imagesResponse.ok || !eventsResponse.ok) {
          throw new Error('Server connection failed');
        }
        
        const imagesData = await imagesResponse.json();
        const eventsData = await eventsResponse.json();
        setPageUrls(imagesData.images);
        setEvents(eventsData.events);
      } catch (error) {
        console.error('Error fetching data:', error);
        setServerError(true);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  const drawImageOnCanvas = useCallback((canvas, imageUrl) => {
    const ctx = canvas.getContext('2d');
    const img = new Image();
    img.crossOrigin = "anonymous";
    
    img.onload = () => {
      const containerWidth = canvas.parentElement.clientWidth;
      canvas.width = containerWidth;
      
      const aspectRatio = img.height / img.width;
      canvas.height = containerWidth * aspectRatio;
      
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
    };
    
    img.src = imageUrl;
  }, []);

  useEffect(() => {
    const initializeCanvases = () => {
      pageUrls.forEach((url, index) => {
        const pageCanvas = document.getElementById(`page-${index}`);
        const thumbCanvas = document.getElementById(`thumb-${index}`);
        if (pageCanvas) drawImageOnCanvas(pageCanvas, url);
        if (thumbCanvas) drawImageOnCanvas(thumbCanvas, url);
      });
    };

    initializeCanvases();

    if (!isThumbnailCollapsed) {
      setTimeout(initializeCanvases, 300);
    }

    const handleResize = () => {
      initializeCanvases();
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [drawImageOnCanvas, pageUrls, isThumbnailCollapsed]);

  const scrollToPage = useCallback((pageNum) => {
    const newPageNum = Math.max(1, Math.min(pageNum, numPages));
    const pageElement = document.getElementById(`page-container-${newPageNum}`);
    if (pageElement) {
      pageElement.scrollIntoView({
        behavior: 'smooth',
        block: 'start',
      });
      setCurrentPage(newPageNum);
    }
  }, [numPages]);

  useEffect(() => {
    setPageInput(String(currentPage));
  }, [currentPage]);

  useEffect(() => {
    if (!isThumbnailCollapsed) {
      const thumbElement = document.getElementById(`thumb-container-${currentPage - 1}`);
      if (thumbElement) {
        thumbElement.scrollIntoView({
          behavior: 'smooth',
          block: 'nearest',
          inline: 'nearest',
        });
      }
    }
  }, [currentPage, isThumbnailCollapsed]);

  useEffect(() => {
    const observerCallback = (entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const pageNum = parseInt(entry.target.dataset.pageNumber, 10);
          if (!isNaN(pageNum)) {
            setCurrentPage(pageNum);
          }
        }
      });
    };

    const observerOptions = {
      root: document.getElementById('main-container'),
      rootMargin: '0px',
      threshold: 0.5,
    };

    const observer = new IntersectionObserver(observerCallback, observerOptions);
    const pageElements = Array.from(document.querySelectorAll('[data-page-number]'));
    pageElements.forEach(element => observer.observe(element));
    
    return () => pageElements.forEach(element => observer.unobserve(element));
  }, [numPages]);

  const handlePageInputChange = (e) => {
    setPageInput(e.target.value);
  };

  const handlePageInputSubmit = (e) => {
    if (e.type === 'blur' || (e.type === 'keydown' && e.key === 'Enter')) {
      const newPage = parseInt(pageInput, 10);
      if (!isNaN(newPage) && newPage >= 1 && newPage <= numPages) {
        scrollToPage(newPage);
        if (e.key === 'Enter' && document.activeElement) {
          document.activeElement.blur();
        }
      } else {
        setPageInput(String(currentPage));
      }
    }
  };
  
  const navigatePage = (direction) => {
    let newPage = currentPage + direction;
    newPage = Math.max(1, Math.min(newPage, numPages));
    scrollToPage(newPage);
  };

  if (serverError) {
    return <Error404 />;
  }

  if (numPages === 0) {
    return (
      <div className="flex flex-col h-screen bg-slate-100 text-slate-800 font-sans items-center justify-center">
        <Loader loadingStates={loadingStates} loading={isLoading} duration={3000} />
        <Navbar />
        <p className="text-2xl font-semibold text-slate-600">Loading images...</p>
      </div>
    );
  }

  const getMainContentWidth = () => {
    if (isThumbnailCollapsed && isAuditCollapsed) return 'w-full';
    if (isThumbnailCollapsed || isAuditCollapsed) return 'w-[85%]';
    return 'w-[65%]';
  };

  return (
    <div className="flex flex-col h-screen bg-slate-100 text-slate-800 font-sans min-w-[768px]">
      <Loader loadingStates={loadingStates} loading={isLoading} duration={3000} />
      <Loader loadingStates={navigatingStates} loading={isNavigating} duration={3000} />
      <Navbar />

      <header className="bg-gradient-to-r from-CloudbyzBlue/10 via-white/70 to-CloudbyzBlue/10 backdrop-blur-sm shadow-sm px-6 py-3 flex items-center fixed top-16 left-0 right-0 z-20">
        <div className="flex items-center w-1/3">
          <button
            onClick={handleBack}
            className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-slate-700 hover:text-slate-900 bg-slate-100 hover:bg-slate-200 rounded-lg transition-all duration-200 group"
          >
            <svg 
              xmlns="http://www.w3.org/2000/svg" 
              fill="none" 
              viewBox="0 0 24 24" 
              strokeWidth={2} 
              stroke="currentColor" 
              className="w-4 h-4 transition-transform duration-200 group-hover:-translate-x-1"
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18" />
            </svg>
            <span>Back</span>
          </button>
        </div>
        
        <div className="flex items-center gap-4 justify-center w-1/3">
          <button
            onClick={() => navigatePage(-1)}
            disabled={currentPage <= 1}
            className="w-8 h-8 flex items-center justify-center rounded-full bg-white border border-slate-200 hover:bg-slate-50 hover:border-slate-300 disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:bg-white disabled:hover:border-slate-200 transition-all duration-200"
            title="Previous Page"
          >
            <span className="text-xl text-slate-600 transform -translate-y-[1px]">‹</span>
          </button>
          <input
            type="text"
            value={pageInput}
            onChange={handlePageInputChange}
            onBlur={handlePageInputSubmit}
            onKeyDown={handlePageInputSubmit}
            className="w-12 text-center text-sm bg-white text-slate-700 border border-slate-300 rounded-md py-1.5 focus:outline-none focus:ring-2 focus:ring-CloudbyzBlue focus:border-CloudbyzBlue transition-shadow"
          />
          <span className="px-1 text-sm text-slate-500">of {numPages}</span>
          <button
            onClick={() => navigatePage(1)}
            disabled={currentPage >= numPages}
            className="w-8 h-8 flex items-center justify-center rounded-full bg-white border border-slate-200 hover:bg-slate-50 hover:border-slate-300 disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:bg-white disabled:hover:border-slate-200 transition-all duration-200"
            title="Next Page"
          >
            <span className="text-xl text-slate-600 transform -translate-y-[1px]">›</span>
          </button>
        </div>

        <div className="w-1/3 flex justify-end">
          <button
            onClick={handleFinish}
            className="bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white px-6 py-2 rounded-lg font-semibold shadow-lg hover:shadow-xl transition-all duration-300 flex items-center space-x-2 hover:scale-105"
          >
            <span>Finish</span>
            <svg 
              xmlns="http://www.w3.org/2000/svg" 
              fill="none" 
              viewBox="0 0 24 24" 
              strokeWidth={2} 
              stroke="currentColor" 
              className="w-4 h-4"
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
            </svg>
          </button>
        </div>
      </header>

      <div className="flex flex-row flex-grow pt-30 relative">
        <aside
          className={`h-full overflow-y-auto bg-slate-50 border-r border-slate-200 shadow-sm transition-all duration-300 ease-in-out ${
            isThumbnailCollapsed ? 'w-0 p-0 opacity-0' : 'w-[15%] p-3 opacity-100'
          }`}
          style={{ maxHeight: 'calc(100vh - 120px)', visibility: isThumbnailCollapsed ? 'hidden' : 'visible', marginTop: '120px' }}
        >
          {!isThumbnailCollapsed && pageUrls.map((thumbUrl, index) => (
            <div
              id={`thumb-container-${index}`}
              key={`thumb-${index}`}
              className={`p-1.5 cursor-pointer border-2 rounded-md transition-all duration-150 ease-in-out mb-2 ${
                currentPage === index + 1 ? 'border-CloudbyzBlue bg-blue-50 shadow-md' : 'border-transparent hover:border-slate-300 hover:bg-white'
              }`}
              onClick={() => scrollToPage(index + 1)}
              title={`Page ${index + 1}`}
            >
              <canvas
                id={`thumb-${index}`}
                className="w-full h-auto shadow-sm rounded object-contain"
                style={{maxHeight: '100px'}}
              />
              <p className="text-center text-xs mt-1.5 text-slate-600">{index + 1}</p>
            </div>
          ))}
        </aside>

        <button
          onClick={() => setIsThumbnailCollapsed(!isThumbnailCollapsed)}
          className={`flex absolute top-1/2 -translate-y-1/2 z-10 w-10 h-10 bg-white rounded-full shadow-lg hover:bg-blue-50 hover:shadow-xl transition-all duration-300 ease-in-out items-center justify-center transform hover:scale-105 ${
            isThumbnailCollapsed ? 'left-4' : 'left-[15%] -ml-5'
          }`}
          title={isThumbnailCollapsed ? "Expand Thumbnails" : "Collapse Thumbnails"}
        >
          <span className="text-slate-600 hover:text-CloudbyzBlue text-lg font-medium">
            {isThumbnailCollapsed ? '›' : '‹'}
          </span>
        </button>

        <main
          id="main-container"
          className={`h-full overflow-y-auto px-[10%] py-6 bg-slate-200 transition-all duration-300 ease-in-out ${getMainContentWidth()}`}
          style={{ maxHeight: 'calc(100vh - 120px)', marginTop: '120px' }}
        >
          {pageUrls.map((url, index) => (
            <div 
              id={`page-container-${index + 1}`}
              key={`page-container-${index + 1}`} 
              className="mb-6 flex justify-center"
              style={{ 
                width: '100%',
                maxWidth: '800px',
                margin: '0 auto 3rem auto',
                transition: 'all 0.3s ease-in-out',
              }}
            >
              <div className="w-full relative" style={{ minHeight: '200px' }}>
                <canvas
                  id={`page-${index}`}
                  data-page-number={index + 1}
                  className="w-full h-auto shadow-xl rounded-sm"
                  style={{ 
                    display: 'block',
                    width: '100%',
                    height: '100%',
                    objectFit: 'contain'
                  }}
                />
              </div>
            </div>
          ))}
        </main>

        <aside
          className={`h-full overflow-hidden bg-white border-l border-slate-200 shadow-sm transition-all duration-300 ease-in-out ${
            isAuditCollapsed ? 'w-0 p-0 opacity-0' : 'w-[20%] opacity-100'
          }`}
          style={{ maxHeight: 'calc(100vh - 120px)', visibility: isAuditCollapsed ? 'hidden' : 'visible', marginTop: '120px' }}
        >
          <div className="flex border-b border-slate-200">
            <button
              className={`flex-1 px-4 py-3 text-sm font-medium transition-colors ${
                activeTab === 'audit'
                  ? 'text-CloudbyzBlue border-b-2 border-CloudbyzBlue'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
              onClick={() => setActiveTab('audit')}
            >
              Audit Trail
            </button>
          </div>

          <div className="overflow-y-auto h-[calc(100%-44px)]">
            {activeTab === 'audit' && (
              <div className="p-4 space-y-3">
                {events.map((event, index) => (
                  <div
                    key={index}
                    className="flex items-start gap-2 p-2 rounded-lg hover:bg-slate-50 transition-colors duration-200"
                  >
                    <img 
                      src={getEventIcon(event)}
                      alt=""
                      className="w-4 h-4 mt-0.5 object-contain"
                    />
                    <p className="text-xs text-slate-700 leading-tight">{event}
                    </p>
                  </div>
                ))}
              </div>
            )}
          </div>
        </aside>

        <button
          onClick={() => setIsAuditCollapsed(!isAuditCollapsed)}
          className={`flex absolute top-1/2 -translate-y-1/2 z-10 w-10 h-10 bg-white rounded-full shadow-lg hover:bg-blue-50 hover:shadow-xl transition-all duration-300 ease-in-out items-center justify-center transform hover:scale-105
            ${isAuditCollapsed ? 'right-4' : 'right-[20%] -mr-5'}`}
          title={isAuditCollapsed ? "Expand Sidebar" : "Collapse Sidebar"}
        >
          <span className="text-slate-600 hover:text-CloudbyzBlue text-lg font-medium">
            {isAuditCollapsed ? '‹' : '›'}
          </span>
        </button>
      </div>
    </div>
  );
}

export default SignPreview;