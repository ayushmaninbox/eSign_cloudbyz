import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { User, Settings, LogOut, UserCircle, PenTool, Type, FileSignature, X } from 'lucide-react';
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
  const [showProfileModal, setShowProfileModal] = useState(false);

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

const SignatureField = ({ field, onRemove, onDrag }) => {
  const [isDragging, setIsDragging] = useState(false);
  const [position, setPosition] = useState({ x: field.x, y: field.y });

  const handleMouseDown = (e) => {
    setIsDragging(true);
    const rect = e.currentTarget.parentElement.getBoundingClientRect();
    const offsetX = e.clientX - rect.left - position.x;
    const offsetY = e.clientY - rect.top - position.y;

    const handleMouseMove = (e) => {
      const rect = e.currentTarget.parentElement?.getBoundingClientRect();
      if (rect) {
        const newX = Math.max(0, Math.min(rect.width - 150, e.clientX - rect.left - offsetX));
        const newY = Math.max(0, Math.min(rect.height - 40, e.clientY - rect.top - offsetY));
        setPosition({ x: newX, y: newY });
        onDrag(field.id, { x: newX, y: newY });
      }
    };

    const handleMouseUp = () => {
      setIsDragging(false);
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };

    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);
  };

  const getFieldIcon = () => {
    switch (field.type) {
      case 'signature':
        return <PenTool className="w-4 h-4" />;
      case 'initials':
        return <Type className="w-4 h-4" />;
      case 'title':
        return <FileSignature className="w-4 h-4" />;
      default:
        return <PenTool className="w-4 h-4" />;
    }
  };

  const getFieldColor = () => {
    switch (field.type) {
      case 'signature':
        return 'bg-blue-100 border-blue-300 text-blue-700';
      case 'initials':
        return 'bg-green-100 border-green-300 text-green-700';
      case 'title':
        return 'bg-purple-100 border-purple-300 text-purple-700';
      default:
        return 'bg-blue-100 border-blue-300 text-blue-700';
    }
  };

  return (
    <div
      className={`absolute flex items-center gap-2 px-3 py-2 border-2 rounded-lg cursor-move select-none ${getFieldColor()} ${
        isDragging ? 'shadow-lg scale-105' : 'shadow-md'
      } transition-all duration-200`}
      style={{
        left: position.x,
        top: position.y,
        width: '150px',
        height: '40px',
        zIndex: isDragging ? 50 : 10,
      }}
      onMouseDown={handleMouseDown}
    >
      {getFieldIcon()}
      <span className="text-sm font-medium capitalize">{field.type}</span>
      <span className="text-xs">({field.assignee})</span>
      <button
        onClick={(e) => {
          e.stopPropagation();
          onRemove(field.id);
        }}
        className="ml-auto p-1 hover:bg-red-100 rounded-full transition-colors"
      >
        <X className="w-3 h-3 text-red-500" />
      </button>
    </div>
  );
};

const SignSetupUI = () => {
  const navigate = useNavigate();
  const [pageUrls, setPageUrls] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageInput, setPageInput] = useState('1');
  const [signatureFields, setSignatureFields] = useState([]);
  const [selectedTool, setSelectedTool] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isNavigating, setIsNavigating] = useState(false);
  const [serverError, setServerError] = useState(false);

  const loadingStates = [
    { text: 'Setting up signature fields...' },
    { text: 'Loading document editor...' },
    { text: 'Preparing signature tools...' },
    { text: 'Configuring workspace...' }
  ];

  const navigatingStates = [
    { text: 'Finalizing document setup...' },
    { text: 'Saving configuration...' },
    { text: 'Preparing for completion...' },
    { text: 'Redirecting to dashboard...' }
  ];

  const numPages = pageUrls.length;

  const drawImageOnCanvas = useCallback((canvas, imageUrl) => {
    const ctx = canvas.getContext('2d');
    const img = new Image();
    img.crossOrigin = "anonymous";
    
    img.onload = () => {
      // Get the container width (80% of the viewport minus padding)
      const container = canvas.parentElement;
      const containerWidth = container.clientWidth;
      
      // Set canvas to fill the container width completely
      canvas.width = containerWidth;
      
      // Calculate height to maintain aspect ratio
      const aspectRatio = img.height / img.width;
      canvas.height = containerWidth * aspectRatio;
      
      // Clear and draw the image to fill the entire canvas
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
    };
    
    img.src = imageUrl;
  }, []);

  useEffect(() => {
    // Check authentication
    const username = localStorage.getItem('username');
    if (!username) {
      navigate('/signin');
      return;
    }

    const fetchData = async () => {
      try {
        const response = await fetch('http://localhost:5000/api/images');
        if (!response.ok) {
          throw new Error('Server connection failed');
        }
        
        const data = await response.json();
        setPageUrls(data.images);
      } catch (error) {
        console.error('Error fetching data:', error);
        setServerError(true);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [navigate]);

  useEffect(() => {
    const initializeCanvases = () => {
      pageUrls.forEach((url, index) => {
        const pageCanvas = document.getElementById(`page-${index}`);
        if (pageCanvas) drawImageOnCanvas(pageCanvas, url);
      });
    };

    // Initial load
    if (pageUrls.length > 0) {
      // Small delay to ensure DOM is ready
      setTimeout(initializeCanvases, 100);
    }

    const handleResize = () => {
      // Debounce resize events
      clearTimeout(window.resizeTimeout);
      window.resizeTimeout = setTimeout(initializeCanvases, 150);
    };

    window.addEventListener('resize', handleResize);
    return () => {
      window.removeEventListener('resize', handleResize);
      clearTimeout(window.resizeTimeout);
    };
  }, [drawImageOnCanvas, pageUrls]);

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

  const handleBack = () => {
    navigate('/recipientselection');
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
      
      navigate('/signpreview', { state: { from: '/signsetupui' } });
    } catch (error) {
      console.error('Server error:', error);
      setServerError(true);
    } finally {
      setIsNavigating(false);
    }
  };

  const handleCanvasClick = (e, pageIndex) => {
    if (!selectedTool) return;

    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const newField = {
      id: Date.now(),
      type: selectedTool,
      x: x - 75, // Center the field
      y: y - 20,
      page: pageIndex,
      assignee: 'John Doe'
    };

    setSignatureFields([...signatureFields, newField]);
    setSelectedTool(null);
  };

  const handleFieldDrag = (fieldId, newPosition) => {
    setSignatureFields(fields =>
      fields.map(field =>
        field.id === fieldId ? { ...field, ...newPosition } : field
      )
    );
  };

  const handleFieldRemove = (fieldId) => {
    setSignatureFields(fields => fields.filter(field => field.id !== fieldId));
  };

  if (serverError) {
    return <Error404 />;
  }

  if (numPages === 0) {
    return (
      <div className="flex flex-col h-screen bg-slate-100 text-slate-800 font-sans items-center justify-center">
        <Loader loadingStates={loadingStates} loading={isLoading} duration={3000} />
        <Navbar />
        <p className="text-2xl font-semibold text-slate-600">Loading document...</p>
      </div>
    );
  }

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
            Back
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
        {/* Left spacing - 5% */}
        <div className="w-[5%]" style={{ marginTop: '120px' }}></div>

        {/* Main PDF area - 80% */}
        <main
          id="main-container"
          className="w-[80%] h-full overflow-y-auto bg-slate-200 transition-all duration-300 ease-in-out"
          style={{ maxHeight: 'calc(100vh - 120px)', marginTop: '120px' }}
        >
          {pageUrls.map((url, index) => (
            <div 
              id={`page-container-${index + 1}`}
              key={`page-container-${index + 1}`} 
              className="mb-6 relative"
              style={{ 
                width: '100%',
                transition: 'all 0.3s ease-in-out',
              }}
            >
              <div className="w-full relative">
                <canvas
                  id={`page-${index}`}
                  data-page-number={index + 1}
                  className={`w-full h-auto shadow-xl ${selectedTool ? 'cursor-crosshair' : 'cursor-default'}`}
                  style={{ 
                    display: 'block',
                    width: '100%',
                    height: 'auto',
                  }}
                  onClick={(e) => handleCanvasClick(e, index)}
                />
                
                {/* Render signature fields for this page */}
                {signatureFields
                  .filter(field => field.page === index)
                  .map(field => (
                    <SignatureField
                      key={field.id}
                      field={field}
                      onRemove={handleFieldRemove}
                      onDrag={handleFieldDrag}
                    />
                  ))}
              </div>
            </div>
          ))}
        </main>

        {/* Right sidebar - 15% */}
        <aside
          className="w-[15%] h-full bg-white border-l border-slate-200 shadow-sm p-4 overflow-y-auto"
          style={{ maxHeight: 'calc(100vh - 120px)', marginTop: '120px' }}
        >
          <div className="space-y-3">
            <button
              onClick={() => setSelectedTool(selectedTool === 'signature' ? null : 'signature')}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg border-2 transition-all duration-200 ${
                selectedTool === 'signature'
                  ? 'bg-CloudbyzBlue text-white border-CloudbyzBlue shadow-lg'
                  : 'bg-CloudbyzBlue/10 text-CloudbyzBlue border-CloudbyzBlue/30 hover:bg-CloudbyzBlue/20'
              }`}
            >
              <PenTool className="w-5 h-5" />
              <span className="font-medium">Signature</span>
            </button>

            <button
              onClick={() => setSelectedTool(selectedTool === 'initials' ? null : 'initials')}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg border-2 transition-all duration-200 ${
                selectedTool === 'initials'
                  ? 'bg-CloudbyzBlue text-white border-CloudbyzBlue shadow-lg'
                  : 'bg-CloudbyzBlue/10 text-CloudbyzBlue border-CloudbyzBlue/30 hover:bg-CloudbyzBlue/20'
              }`}
            >
              <Type className="w-5 h-5" />
              <span className="font-medium">Initials</span>
            </button>

            <button
              onClick={() => setSelectedTool(selectedTool === 'title' ? null : 'title')}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg border-2 transition-all duration-200 ${
                selectedTool === 'title'
                  ? 'bg-CloudbyzBlue text-white border-CloudbyzBlue shadow-lg'
                  : 'bg-CloudbyzBlue/10 text-CloudbyzBlue border-CloudbyzBlue/30 hover:bg-CloudbyzBlue/20'
              }`}
            >
              <FileSignature className="w-5 h-5" />
              <span className="font-medium">Title</span>
            </button>
          </div>

          {selectedTool && (
            <div className="mt-6 p-3 bg-blue-50 rounded-lg border border-blue-200">
              <p className="text-sm text-blue-700 font-medium mb-2">
                Click on the document to place a {selectedTool} field
              </p>
              <p className="text-xs text-blue-600">
                You can drag the field to reposition it after placing.
              </p>
            </div>
          )}

          {signatureFields.length > 0 && (
            <div className="mt-6">
              <h3 className="text-sm font-medium text-slate-700 mb-3">Placed Fields</h3>
              <div className="space-y-2">
                {signatureFields.map(field => (
                  <div key={field.id} className="flex items-center justify-between p-2 bg-slate-50 rounded-lg">
                    <div className="flex items-center gap-2">
                      {field.type === 'signature' && <PenTool className="w-4 h-4 text-blue-600" />}
                      {field.type === 'initials' && <Type className="w-4 h-4 text-green-600" />}
                      {field.type === 'title' && <FileSignature className="w-4 h-4 text-purple-600" />}
                      <span className="text-xs font-medium capitalize">{field.type}</span>
                    </div>
                    <button
                      onClick={() => handleFieldRemove(field.id)}
                      className="p-1 hover:bg-red-100 rounded-full transition-colors"
                    >
                      <X className="w-3 h-3 text-red-500" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}
        </aside>
      </div>
    </div>
  );
};

export default SignSetupUI;