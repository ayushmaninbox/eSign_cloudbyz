import React, { useState, useEffect, useCallback } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { 
  PenTool, 
  Type, 
  FileText, 
  User, 
  CheckCircle2,
  AlertTriangle,
  Clock
} from "lucide-react";
import Loader from "../ui/Loader";
import Error404 from "../ui/404error";
import Navbar from "../Navbar/Navbar";
import EmailLinkAuthModal from "./SigneeUI/Modals/EmailLinkAuthModal";
import SignatureAuthModal from "./SigneeUI/Modals/SignatureAuthModal";
import TermsAcceptanceBar from "./SigneeUI/Modals/TermsAcceptanceBar";
import SignatureModal from "./SigneeUI/Modals/SignatureModal";
import InitialsModal from "./SigneeUI/Modals/InitialsModal";
import TextModal from "./SigneeUI/Modals/TextModal";

const SigneeUI = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [pageUrls, setPageUrls] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageInput, setPageInput] = useState('1');
  const [canvasDimensions, setCanvasDimensions] = useState({});
  const [isLoading, setIsLoading] = useState(true);
  const [isNavigating, setIsNavigating] = useState(false);
  const [serverError, setServerError] = useState(false);
  const [showInitialAuth, setShowInitialAuth] = useState(true);
  const [showSigningAuth, setShowSigningAuth] = useState(false);
  const [showTermsBar, setShowTermsBar] = useState(false);
  const [showSignatureModal, setShowSignatureModal] = useState(false);
  const [showInitialsModal, setShowInitialsModal] = useState(false);
  const [showTextModal, setShowTextModal] = useState(false);
  const [currentFieldType, setCurrentFieldType] = useState('signature');
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [signedFields, setSignedFields] = useState(new Set());

  const numPages = pageUrls.length;

  const loadingStates = [
    { text: 'Loading document for signing...' },
    { text: 'Preparing signature interface...' },
    { text: 'Checking authentication...' },
    { text: 'Setting up workspace...' }
  ];

  const navigatingStates = [
    { text: 'Processing signatures...' },
    { text: 'Finalizing document...' },
    { text: 'Saving changes...' },
    { text: 'Completing signature process...' }
  ];

  // Mock signature fields for demo
  const mockSignatureFields = [
    {
      id: 1,
      type: 'signature',
      xPercent: 20,
      yPercent: 70,
      widthPercent: 25,
      heightPercent: 8,
      page: 0,
      assignee: 'John Doe',
      required: true
    },
    {
      id: 2,
      type: 'initials',
      xPercent: 60,
      yPercent: 75,
      widthPercent: 10,
      heightPercent: 6,
      page: 0,
      assignee: 'John Doe',
      required: true
    },
    {
      id: 3,
      type: 'title',
      xPercent: 30,
      yPercent: 85,
      widthPercent: 20,
      heightPercent: 6,
      page: 0,
      assignee: 'John Doe',
      required: false
    }
  ];

  const drawImageOnCanvas = useCallback((canvas, imageUrl, pageIndex) => {
    const ctx = canvas.getContext('2d');
    const img = new Image();
    img.crossOrigin = "anonymous";
    
    img.onload = () => {
      const container = canvas.parentElement;
      const containerWidth = container.clientWidth;
      
      canvas.width = containerWidth;
      
      const aspectRatio = img.height / img.width;
      canvas.height = containerWidth * aspectRatio;
      
      setCanvasDimensions(prev => ({
        ...prev,
        [pageIndex]: {
          width: canvas.width,
          height: canvas.height
        }
      }));
      
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
        setTimeout(() => setIsLoading(false), 3000);
      }
    };

    fetchData();
  }, [navigate]);

  useEffect(() => {
    const initializeCanvases = () => {
      pageUrls.forEach((url, index) => {
        const pageCanvas = document.getElementById(`signee-page-${index}`);
        if (pageCanvas) drawImageOnCanvas(pageCanvas, url, index);
      });
    };

    if (pageUrls.length > 0) {
      setTimeout(initializeCanvases, 100);
    }

    const handleResize = () => {
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
    const pageElement = document.getElementById(`signee-page-container-${newPageNum}`);
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
    if (location.state?.from === "/manage") {
      navigate("/manage");
    } else {
      navigate('/home');
    }
  };

  const handleInitialAuthentication = () => {
    setIsAuthenticated(true);
    setShowInitialAuth(false);
    setShowTermsBar(true);
  };

  const handleTermsAccept = () => {
    setShowTermsBar(false);
    // Show first required field or allow user to click on fields
  };

  const handleTermsDecline = () => {
    navigate('/home');
  };

  const handleFieldClick = (field) => {
    if (!isAuthenticated) return;
    
    setShowSigningAuth(true);
    setCurrentFieldType(field.type);
  };

  const handleSigningAuthentication = () => {
    setShowSigningAuth(false);
    
    // Show appropriate modal based on field type
    switch (currentFieldType) {
      case 'signature':
        setShowSignatureModal(true);
        break;
      case 'initials':
        setShowInitialsModal(true);
        break;
      case 'title':
        setShowTextModal(true);
        break;
      default:
        setShowSignatureModal(true);
    }
  };

  const handleSignatureSave = (signatureData) => {
    // Mark field as signed
    const fieldId = mockSignatureFields.find(f => f.type === currentFieldType)?.id;
    if (fieldId) {
      setSignedFields(prev => new Set([...prev, fieldId]));
    }
    
    // Close modals
    setShowSignatureModal(false);
    setShowInitialsModal(false);
    setShowTextModal(false);
    
    // Check if all required fields are signed
    const requiredFields = mockSignatureFields.filter(f => f.required);
    const signedRequiredFields = requiredFields.filter(f => signedFields.has(f.id) || f.id === fieldId);
    
    if (signedRequiredFields.length === requiredFields.length) {
      // All required fields signed, show completion option
      setTimeout(() => {
        if (confirm('All required fields have been signed. Would you like to complete the signing process?')) {
          handleComplete();
        }
      }, 500);
    }
  };

  const handleComplete = async () => {
    setIsNavigating(true);
    
    try {
      // Test server connection
      const response = await fetch('http://localhost:5000/api/stats');
      if (!response.ok) {
        throw new Error('Server connection failed');
      }
      
      // Simulate processing time
      await new Promise(resolve => setTimeout(resolve, 3000));
      
      navigate('/signpreview', { state: { from: '/signeeui' } });
    } catch (error) {
      console.error('Server error:', error);
      setServerError(true);
    } finally {
      setIsNavigating(false);
    }
  };

  const getFieldIcon = (type) => {
    switch (type) {
      case 'signature':
        return <PenTool className="w-4 h-4" />;
      case 'initials':
        return <Type className="w-4 h-4" />;
      case 'title':
        return <FileText className="w-4 h-4" />;
      default:
        return <PenTool className="w-4 h-4" />;
    }
  };

  const getFieldDisplayName = (type) => {
    switch (type) {
      case 'signature':
        return 'Signature';
      case 'initials':
        return 'Initials';
      case 'title':
        return 'Text';
      default:
        return 'Signature';
    }
  };

  const renderSignatureField = (field) => {
    const actualX = (field.xPercent / 100) * (canvasDimensions[field.page]?.width || 0);
    const actualY = (field.yPercent / 100) * (canvasDimensions[field.page]?.height || 0);
    const actualWidth = (field.widthPercent / 100) * (canvasDimensions[field.page]?.width || 0);
    const actualHeight = (field.heightPercent / 100) * (canvasDimensions[field.page]?.height || 0);

    const isSigned = signedFields.has(field.id);
    const isClickable = isAuthenticated && !showTermsBar;

    return (
      <div
        key={field.id}
        className={`absolute border-2 rounded-lg select-none transition-all duration-300 ${
          isSigned 
            ? 'bg-green-100/80 border-green-400 cursor-default' 
            : isClickable
            ? 'bg-blue-100/80 border-blue-400 cursor-pointer hover:bg-blue-200/80 hover:border-blue-500'
            : 'bg-gray-100/80 border-gray-300 cursor-not-allowed'
        }`}
        style={{
          left: actualX,
          top: actualY,
          width: actualWidth,
          height: actualHeight,
          zIndex: 20,
        }}
        onClick={() => isClickable && !isSigned && handleFieldClick(field)}
      >
        <div className="flex items-center justify-center h-full">
          {isSigned ? (
            <div className="flex items-center space-x-2 text-green-700">
              <CheckCircle2 className="w-5 h-5" />
              <span className="text-sm font-medium">Signed</span>
            </div>
          ) : (
            <div className="flex items-center space-x-2 text-gray-700">
              {getFieldIcon(field.type)}
              <span className="text-sm font-medium">
                {field.required && <span className="text-red-500 mr-1">*</span>}
                {getFieldDisplayName(field.type)}
              </span>
            </div>
          )}
        </div>
      </div>
    );
  };

  if (serverError) {
    return <Error404 />;
  }

  if (numPages === 0) {
    return (
      <div className="flex flex-col h-screen bg-slate-100 text-slate-800 font-sans items-center justify-center">
        <Loader loading={isLoading}>
          {loadingStates}
        </Loader>
        <Navbar showTabs={false} />
        <p className="text-2xl font-semibold text-slate-600">Loading document...</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-screen bg-slate-100 text-slate-800 font-sans min-w-[768px]">
      <Loader loading={isLoading}>
        {loadingStates}
      </Loader>
      <Loader loading={isNavigating}>
        {navigatingStates}
      </Loader>
      <Navbar showTabs={false} />

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
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18"
              />
            </svg>
            Back
          </button>
        </div>
        
        <div className="flex items-center gap-4 justify-center w-1/3">
          <button
            onClick={() => navigatePage(-1)}
            disabled={currentPage <= 1}
            className="w-8 h-8 flex items-center justify-center rounded-full bg-white border border-slate-200 hover:bg-slate-50 hover:border-slate-300 disabled:opacity-40 disabled:cursor-not-allowed transition-all duration-200"
          >
            <span className="text-xl text-slate-600 transform -translate-y-[1px]">‹</span>
          </button>
          <input
            type="text"
            value={pageInput}
            onChange={handlePageInputChange}
            onBlur={handlePageInputSubmit}
            onKeyDown={handlePageInputSubmit}
            className="w-12 text-center text-sm bg-white text-slate-700 border border-slate-300 rounded-md py-1.5 focus:outline-none focus:ring-2 focus:ring-CloudbyzBlue focus:border-CloudbyzBlue"
          />
          <span className="px-1 text-sm text-slate-500">of {numPages}</span>
          <button
            onClick={() => navigatePage(1)}
            disabled={currentPage >= numPages}
            className="w-8 h-8 flex items-center justify-center rounded-full bg-white border border-slate-200 hover:bg-slate-50 hover:border-slate-300 disabled:opacity-40 disabled:cursor-not-allowed transition-all duration-200"
          >
            <span className="text-xl text-slate-600 transform -translate-y-[1px]">›</span>
          </button>
        </div>

        <div className="w-1/3 flex justify-end">
          {isAuthenticated && signedFields.size > 0 && (
            <button
              onClick={handleComplete}
              className="bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white px-6 py-2 rounded-lg font-semibold shadow-lg hover:shadow-xl transition-all duration-300 flex items-center space-x-2 hover:scale-105"
            >
              <span>Complete</span>
              <CheckCircle2 className="w-4 h-4" />
            </button>
          )}
        </div>
      </header>

      {/* Status Bar */}
      {isAuthenticated && (
        <div className="fixed top-32 left-0 right-0 bg-white/90 backdrop-blur-sm border-b border-gray-200 px-6 py-2 z-10">
          <div className="max-w-6xl mx-auto flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <User className="w-4 h-4 text-CloudbyzBlue" />
                <span className="text-sm font-medium text-gray-700">
                  Signing as: {localStorage.getItem('username') || 'John Doe'}
                </span>
              </div>
              <div className="flex items-center space-x-2">
                <Clock className="w-4 h-4 text-gray-500" />
                <span className="text-sm text-gray-600">
                  {signedFields.size} of {mockSignatureFields.filter(f => f.required).length} required fields signed
                </span>
              </div>
            </div>
            
            {signedFields.size < mockSignatureFields.filter(f => f.required).length && (
              <div className="flex items-center space-x-2 text-amber-600">
                <AlertTriangle className="w-4 h-4" />
                <span className="text-sm font-medium">Click on highlighted fields to sign</span>
              </div>
            )}
          </div>
        </div>
      )}

      <div className="flex flex-row flex-grow relative" style={{ marginTop: isAuthenticated ? '168px' : '128px' }}>
        {/* Main PDF area */}
        <main
          id="signee-main-container"
          className="w-full h-full overflow-y-auto bg-slate-200 px-[10%]"
          style={{ maxHeight: `calc(100vh - ${isAuthenticated ? '168px' : '128px'})` }}
        >
          {pageUrls.map((url, index) => (
            <div 
              id={`signee-page-container-${index + 1}`}
              key={`signee-page-container-${index + 1}`} 
              className="mb-6 relative"
              style={{ 
                width: '100%',
                maxWidth: '800px',
                margin: '0 auto 3rem auto',
              }}
            >
              <div className="w-full relative">
                <canvas
                  id={`signee-page-${index}`}
                  className="w-full h-auto shadow-xl rounded-sm"
                  style={{ 
                    display: 'block',
                    width: '100%',
                    height: 'auto',
                  }}
                />
                
                {/* Render signature fields for this page */}
                {mockSignatureFields
                  .filter(field => field.page === index)
                  .map(field => renderSignatureField(field))}
              </div>
            </div>
          ))}
        </main>
      </div>

      {/* Modals */}
      <EmailLinkAuthModal
        isOpen={showInitialAuth}
        onClose={() => navigate('/home')}
        onAuthenticate={handleInitialAuthentication}
        userEmail={localStorage.getItem('useremail')}
      />

      <SignatureAuthModal
        isOpen={showSigningAuth}
        onClose={() => setShowSigningAuth(false)}
        onAuthenticate={handleSigningAuthentication}
        userEmail={localStorage.getItem('useremail')}
      />

      <TermsAcceptanceBar
        isVisible={showTermsBar}
        onAccept={handleTermsAccept}
        onDecline={handleTermsDecline}
        documentName="Sample Document"
      />

      <SignatureModal
        isOpen={showSignatureModal}
        onClose={() => setShowSignatureModal(false)}
        onSave={handleSignatureSave}
        fieldType="signature"
      />

      <InitialsModal
        isOpen={showInitialsModal}
        onClose={() => setShowInitialsModal(false)}
        onSave={handleSignatureSave}
      />

      <TextModal
        isOpen={showTextModal}
        onClose={() => setShowTextModal(false)}
        onSave={handleSignatureSave}
        placeholder="Enter your text"
      />
    </div>
  );
};

export default SigneeUI;