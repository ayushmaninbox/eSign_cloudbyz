import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import {
  PenTool,
  Type,
  FileText,
  Palette,
  Layers,
  Eye,
  X,
} from 'lucide-react';
import Loader from '../ui/Loader';
import Error404 from '../ui/404error';
import Navbar from '../Navbar/Navbar';
import PrefilledTextModal from './SignSetupUI_Modals/PrefilledTextModal';
import SigneeDropdown from './SignSetupUI_Modals/SigneeDropdown';
import SignatureField from './SignSetupUI_Modals/SignatureField';

const SignSetupUI = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [pageUrls, setPageUrls] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageInput, setPageInput] = useState('1');
  const [signatureFields, setSignatureFields] = useState([]);
  const [canvasDimensions, setCanvasDimensions] = useState({});
  const [signees, setSignees] = useState([]);
  const [selectedSignee, setSelectedSignee] = useState(null);
  const [signInOrder, setSignInOrder] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isNavigating, setIsNavigating] = useState(false);
  const [serverError, setServerError] = useState(false);
  const [showPrefilledTextModal, setShowPrefilledTextModal] = useState(false);

  const recipientColors = [
    "#009edb",
    "#10B981", 
    "#F97316",
    "#8B5CF6",
    "#EC4899",
    "#14B8A6",
    "#EF4444",
  ];

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

  const drawImageOnCanvas = useCallback((canvas, imageUrl, pageIndex) => {
    const ctx = canvas.getContext('2d');
    const img = new Image();
    img.crossOrigin = "anonymous";
    
    img.onload = () => {
      // Get the container width (75% of the viewport minus padding)
      const container = canvas.parentElement;
      const containerWidth = container.clientWidth;
      
      // Set canvas to fill the container width completely
      canvas.width = containerWidth;
      
      // Calculate height to maintain aspect ratio
      const aspectRatio = img.height / img.width;
      canvas.height = containerWidth * aspectRatio;
      
      // Store canvas dimensions for this page
      setCanvasDimensions(prev => ({
        ...prev,
        [pageIndex]: {
          width: canvas.width,
          height: canvas.height
        }
      }));
      
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

        // Load recipient data from localStorage (simulating data from RecipientSelection)
        const storedRecipients = localStorage.getItem('recipients');
        const storedSignInOrder = localStorage.getItem('signInOrder');
        
        if (storedRecipients) {
          const recipients = JSON.parse(storedRecipients);
          setSignees(recipients);
          setSelectedSignee(recipients[0] || null); // Default to first signee
        } else {
          // Fallback mock data if no stored recipients
          const mockSignees = [
            { name: 'Mike Johnson', email: 'mike.johnson@cloudbyz.com', reason: 'I approve this document' },
            { name: 'Sarah Wilson', email: 'sarah.wilson@cloudbyz.com', reason: 'I have reviewed this document' },
            { name: 'David Brown', email: 'david.brown@cloudbyz.com', reason: 'I am the author of this document' }
          ];
          setSignees(mockSignees);
          setSelectedSignee(mockSignees[0]);
        }

        if (storedSignInOrder) {
          setSignInOrder(JSON.parse(storedSignInOrder));
        }
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
        const pageCanvas = document.getElementById(`page-${index}`);
        if (pageCanvas) drawImageOnCanvas(pageCanvas, url, index);
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

  // Update current page based on scroll position
  useEffect(() => {
    const handleScroll = () => {
      const mainContainer = document.getElementById('main-container');
      if (!mainContainer) return;

      const containerRect = mainContainer.getBoundingClientRect();
      const containerTop = containerRect.top;
      const containerHeight = containerRect.height;
      const centerY = containerTop + containerHeight / 2;

      // Find which page is closest to the center of the viewport
      let closestPage = 1;
      let closestDistance = Infinity;

      for (let i = 1; i <= numPages; i++) {
        const pageElement = document.getElementById(`page-container-${i}`);
        if (pageElement) {
          const pageRect = pageElement.getBoundingClientRect();
          const pageCenter = pageRect.top + pageRect.height / 2;
          const distance = Math.abs(pageCenter - centerY);
          
          if (distance < closestDistance) {
            closestDistance = distance;
            closestPage = i;
          }
        }
      }

      if (closestPage !== currentPage) {
        setCurrentPage(closestPage);
      }
    };

    const mainContainer = document.getElementById('main-container');
    if (mainContainer) {
      mainContainer.addEventListener('scroll', handleScroll);
      return () => mainContainer.removeEventListener('scroll', handleScroll);
    }
  }, [currentPage, numPages]);

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

  const scrollToField = (fieldId) => {
    const field = signatureFields.find(f => f.id === fieldId);
    if (!field) return;

    // Calculate the exact position of the field
    const pageElement = document.getElementById(`page-container-${field.page + 1}`);
    const canvas = document.getElementById(`page-${field.page}`);
    
    if (pageElement && canvas && canvasDimensions[field.page]) {
      const canvasRect = canvas.getBoundingClientRect();
      const canvasWidth = canvasDimensions[field.page].width;
      const canvasHeight = canvasDimensions[field.page].height;
      
      // Calculate field position
      const fieldX = (field.xPercent / 100) * canvasWidth;
      const fieldY = (field.yPercent / 100) * canvasHeight;
      const fieldWidth = (field.widthPercent / 100) * canvasWidth;
      const fieldHeight = (field.heightPercent / 100) * canvasHeight;
      
      // Calculate the center of the field
      const fieldCenterY = fieldY + (fieldHeight / 2);
      
      // Get main container
      const mainContainer = document.getElementById('main-container');
      if (mainContainer) {
        const containerHeight = mainContainer.clientHeight;
        const pageRect = pageElement.getBoundingClientRect();
        const mainContainerRect = mainContainer.getBoundingClientRect();
        
        // Calculate scroll position to center the field
        const targetScrollTop = mainContainer.scrollTop + 
          (pageRect.top - mainContainerRect.top) + 
          fieldCenterY - (containerHeight / 2);
        
        mainContainer.scrollTo({
          top: targetScrollTop,
          behavior: 'smooth'
        });
      }
    }
  };

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
      navigate('/recipientselection');
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

  const handleToolClick = (toolType) => {
    if (!selectedSignee) return;
    
    if (toolType === 'customText') {
      setShowPrefilledTextModal(true);
      return;
    }
    
    // Get the main container and its visible area
    const mainContainer = document.getElementById('main-container');
    if (!mainContainer) return;

    const containerRect = mainContainer.getBoundingClientRect();
    
    // Find the currently visible page
    let visiblePageIndex = currentPage - 1;
    const pageElement = document.getElementById(`page-container-${currentPage}`);
    
    if (pageElement && canvasDimensions[visiblePageIndex]) {
      const pageRect = pageElement.getBoundingClientRect();
      const canvas = document.getElementById(`page-${visiblePageIndex}`);
      
      if (canvas) {
        const canvasRect = canvas.getBoundingClientRect();
        const canvasWidth = canvasDimensions[visiblePageIndex].width;
        const canvasHeight = canvasDimensions[visiblePageIndex].height;
        
        // Calculate the center of the visible area of the canvas
        const visibleTop = Math.max(0, containerRect.top - canvasRect.top);
        const visibleBottom = Math.min(canvasRect.height, containerRect.bottom - canvasRect.top);
        const visibleCenterY = (visibleTop + visibleBottom) / 2;
        
        // Center horizontally
        const centerX = canvasWidth / 2;
        
        // Get field size - restored to original sizes
        const getFieldSize = (type) => {
          switch (type) {
            case 'signature':
              return { width: 500, height: 100 };
            case 'initials':
              return { width: 200, height: 80 };
            case 'title':
              return { width: 300, height: 100 };
            default:
              return { width: 200, height: 80 };
          }
        };

        const fieldSize = getFieldSize(toolType);
        
        // Calculate position (centered)
        const fieldX = centerX - (fieldSize.width / 2);
        const fieldY = visibleCenterY - (fieldSize.height / 2);
        
        // Convert to percentages for responsive positioning
        const xPercent = (fieldX / canvasWidth) * 100;
        const yPercent = (fieldY / canvasHeight) * 100;
        const widthPercent = (fieldSize.width / canvasWidth) * 100;
        const heightPercent = (fieldSize.height / canvasHeight) * 100;

        const newField = {
          id: Date.now(),
          type: toolType,
          xPercent,
          yPercent,
          widthPercent,
          heightPercent,
          page: visiblePageIndex,
          assignee: selectedSignee.name,
          email: selectedSignee.email,
          reason: selectedSignee.reason
        };

        setSignatureFields([...signatureFields, newField]);
      }
    }
  };

  const handlePrefilledTextSave = (customTextData) => {
    if (!selectedSignee) return;

    // Get the main container and its visible area
    const mainContainer = document.getElementById('main-container');
    if (!mainContainer) return;

    const containerRect = mainContainer.getBoundingClientRect();
    
    // Find the currently visible page
    let visiblePageIndex = currentPage - 1;
    const pageElement = document.getElementById(`page-container-${currentPage}`);
    
    if (pageElement && canvasDimensions[visiblePageIndex]) {
      const canvas = document.getElementById(`page-${visiblePageIndex}`);
      
      if (canvas) {
        const canvasRect = canvas.getBoundingClientRect();
        const canvasWidth = canvasDimensions[visiblePageIndex].width;
        const canvasHeight = canvasDimensions[visiblePageIndex].height;
        
        // Calculate the center of the visible area of the canvas
        const visibleTop = Math.max(0, containerRect.top - canvasRect.top);
        const visibleBottom = Math.min(canvasRect.height, containerRect.bottom - canvasRect.top);
        const visibleCenterY = (visibleTop + visibleBottom) / 2;
        
        // Center horizontally
        const centerX = canvasWidth / 2;
        
        // Calculate field size based on text length
        const textLength = customTextData.text.length;
        const estimatedWidth = Math.max(200, Math.min(400, textLength * 8 + 40)); // Dynamic width based on text
        const estimatedHeight = 60; // Fixed height for custom text
        
        // Calculate position (centered)
        const fieldX = centerX - (estimatedWidth / 2);
        const fieldY = visibleCenterY - (estimatedHeight / 2);
        
        // Convert to percentages for responsive positioning
        const xPercent = (fieldX / canvasWidth) * 100;
        const yPercent = (fieldY / canvasHeight) * 100;
        const widthPercent = (estimatedWidth / canvasWidth) * 100;
        const heightPercent = (estimatedHeight / canvasHeight) * 100;

        const newField = {
          id: Date.now(),
          type: 'customText',
          xPercent,
          yPercent,
          widthPercent,
          heightPercent,
          page: visiblePageIndex,
          assignee: selectedSignee.name,
          email: selectedSignee.email,
          reason: selectedSignee.reason,
          customTextData
        };

        setSignatureFields([...signatureFields, newField]);
      }
    }
  };

  const handleFieldRemove = (fieldId) => {
    setSignatureFields(fields => fields.filter(field => field.id !== fieldId));
  };

  const getSigneeColor = (signeeName) => {
    const index = signees.findIndex(s => s.name === signeeName);
    return recipientColors[index % recipientColors.length];
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

      <div className="flex flex-row flex-grow relative" style={{ marginTop: '128px' }}>
        {/* Left spacing - 5% */}
        <div className="w-[5%]"></div>

        {/* Main PDF area - 75% */}
        <main
          id="main-container"
          className="w-[75%] h-full overflow-y-auto bg-slate-200 transition-all duration-300 ease-in-out"
          style={{ maxHeight: 'calc(100vh - 128px)' }}
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
                  className="w-full h-auto shadow-xl cursor-default"
                  style={{ 
                    display: 'block',
                    width: '100%',
                    height: 'auto',
                  }}
                />
                
                {/* Render signature fields for this page */}
                {signatureFields
                  .filter(field => field.page === index)
                  .map(field => (
                    <SignatureField
                      key={field.id}
                      field={field}
                      onRemove={handleFieldRemove}
                      canvasWidth={canvasDimensions[index]?.width || 0}
                      canvasHeight={canvasDimensions[index]?.height || 0}
                      signeeColor={getSigneeColor(field.assignee)}
                    />
                  ))}
              </div>
            </div>
          ))}
        </main>

        {/* Right sidebar - 20% */}
        <aside
          className="w-[20%] h-full bg-gradient-to-b from-white to-gray-50 border-l border-gray-200 shadow-lg overflow-y-auto"
          style={{ maxHeight: 'calc(100vh - 128px)' }}
        >
          <div className="p-6">
            {/* Header */}
            <div className="mb-6">
              <h3 className="text-lg font-bold text-gray-800 mb-2 flex items-center">
                <Layers className="w-5 h-5 mr-2 text-CloudbyzBlue" />
                Signature Tools
              </h3>
              <p className="text-sm text-gray-600">Select a signee and tool to add fields</p>
            </div>

            {/* Signee Dropdown */}
            <div className="mb-6">
              <label className="block text-sm font-semibold text-gray-700 mb-3">
                Select the Signee
              </label>
              <SigneeDropdown
                signees={signees}
                selectedSignee={selectedSignee}
                onSigneeChange={setSelectedSignee}
                signInOrder={signInOrder}
              />
            </div>

            {/* Tool Buttons */}
            <div className="space-y-4 mb-8">
              <button
                onClick={() => handleToolClick('signature')}
                disabled={!selectedSignee}
                className={`w-full group relative overflow-hidden rounded-xl border-2 transition-all duration-300 ${
                  !selectedSignee 
                    ? 'bg-gray-100 text-gray-400 border-gray-200 cursor-not-allowed'
                    : 'bg-white text-CloudbyzBlue border-CloudbyzBlue/30 hover:border-CloudbyzBlue/60 hover:bg-CloudbyzBlue/5 hover:scale-102'
                }`}
              >
                <div className="flex items-center gap-3 px-4 py-4">
                  <div className={`p-2 rounded-lg ${
                    !selectedSignee 
                      ? 'bg-gray-200'
                      : 'bg-CloudbyzBlue/10'
                  }`}>
                    <PenTool className="w-5 h-5" />
                  </div>
                  <div className="text-left">
                    <div className="font-semibold">Signature</div>
                    <div className={`text-xs ${
                      !selectedSignee 
                        ? 'text-gray-400'
                        : 'text-gray-500'
                    }`}>
                      Full signature field
                    </div>
                  </div>
                </div>
              </button>

              <button
                onClick={() => handleToolClick('initials')}
                disabled={!selectedSignee}
                className={`w-full group relative overflow-hidden rounded-xl border-2 transition-all duration-300 ${
                  !selectedSignee 
                    ? 'bg-gray-100 text-gray-400 border-gray-200 cursor-not-allowed'
                    : 'bg-white text-green-600 border-green-300 hover:border-green-500 hover:bg-green-50 hover:scale-102'
                }`}
              >
                <div className="flex items-center gap-3 px-4 py-4">
                  <div className={`p-2 rounded-lg ${
                    !selectedSignee 
                      ? 'bg-gray-200'
                      : 'bg-green-100'
                  }`}>
                    <Type className="w-5 h-5" />
                  </div>
                  <div className="text-left">
                    <div className="font-semibold">Initials</div>
                    <div className={`text-xs ${
                      !selectedSignee 
                        ? 'text-gray-400'
                        : 'text-gray-500'
                    }`}>
                      Initial field
                    </div>
                  </div>
                </div>
              </button>

              <button
                onClick={() => handleToolClick('title')}
                disabled={!selectedSignee}
                className={`w-full group relative overflow-hidden rounded-xl border-2 transition-all duration-300 ${
                  !selectedSignee 
                    ? 'bg-gray-100 text-gray-400 border-gray-200 cursor-not-allowed'
                    : 'bg-white text-purple-600 border-purple-300 hover:border-purple-500 hover:bg-purple-50 hover:scale-102'
                }`}
              >
                <div className="flex items-center gap-3 px-4 py-4">
                  <div className={`p-2 rounded-lg ${
                    !selectedSignee 
                      ? 'bg-gray-200'
                      : 'bg-purple-100'
                  }`}>
                    <FileText className="w-5 h-5" />
                  </div>
                  <div className="text-left">
                    <div className="font-semibold">Text</div>
                    <div className={`text-xs ${
                      !selectedSignee 
                        ? 'text-gray-400'
                        : 'text-gray-500'
                    }`}>
                      Text input field
                    </div>
                  </div>
                </div>
              </button>

              <button
                onClick={() => handleToolClick('customText')}
                disabled={!selectedSignee}
                className={`w-full group relative overflow-hidden rounded-xl border-2 transition-all duration-300 ${
                  !selectedSignee 
                    ? 'bg-gray-100 text-gray-400 border-gray-200 cursor-not-allowed'
                    : 'bg-white text-indigo-600 border-indigo-300 hover:border-indigo-500 hover:bg-indigo-50 hover:scale-102'
                }`}
              >
                <div className="flex items-center gap-3 px-4 py-4">
                  <div className={`p-2 rounded-lg ${
                    !selectedSignee 
                      ? 'bg-gray-200'
                      : 'bg-indigo-100'
                  }`}>
                    <Palette className="w-5 h-5" />
                  </div>
                  <div className="text-left">
                    <div className="font-semibold">Pre-filled Text</div>
                    <div className={`text-xs ${
                      !selectedSignee 
                        ? 'text-gray-400'
                        : 'text-gray-500'
                    }`}>
                      Formatted custom text
                    </div>
                  </div>
                </div>
              </button>
            </div>

            {/* No Signee Selected Warning */}
            {!selectedSignee && (
              <div className="mb-6 p-4 bg-yellow-50 rounded-xl border border-yellow-200">
                <div className="flex items-center gap-2 mb-2">
                  <User className="w-4 h-4 text-yellow-600" />
                  <span className="text-sm font-semibold text-yellow-800">Select a Signee</span>
                </div>
                <p className="text-xs text-yellow-700">
                  Please select a signee from the dropdown above before adding fields.
                </p>
              </div>
            )}

            {/* Placed Fields */}
            {signatureFields.length > 0 && (
              <div>
                <h4 className="text-sm font-bold text-gray-800 mb-4 flex items-center">
                  <Layers className="w-4 h-4 mr-2 text-gray-600" />
                  Placed Fields ({signatureFields.length})
                </h4>
                <div className="space-y-3 max-h-64 overflow-y-auto">
                  {signatureFields.map((field, index) => (
                    <div key={field.id} className="group bg-white rounded-lg border border-gray-200 p-3 hover:shadow-md transition-all duration-200">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className={`p-1.5 rounded-lg ${
                            field.type === 'signature' ? 'bg-blue-100 text-blue-600' :
                            field.type === 'initials' ? 'bg-green-100 text-green-600' :
                            field.type === 'title' ? 'bg-purple-100 text-purple-600' :
                            field.type === 'customText' ? 'bg-indigo-100 text-indigo-600' :
                            'bg-gray-100 text-gray-600'
                          }`}>
                            {field.type === 'signature' && <PenTool className="w-3.5 h-3.5" />}
                            {field.type === 'initials' && <Type className="w-3.5 h-3.5" />}
                            {field.type === 'title' && <FileText className="w-3.5 h-3.5" />}
                            {field.type === 'customText' && <Palette className="w-3.5 h-3.5" />}
                          </div>
                          <div>
                            <div className="text-sm font-medium text-gray-800">
                              {field.type === 'title' ? 'Text' : 
                               field.type === 'customText' ? 'Pre-filled Text' :
                               field.type.charAt(0).toUpperCase() + field.type.slice(1)}
                            </div>
                            <div className="text-xs text-gray-500">
                              {field.assignee.length > 15 ? field.assignee.substring(0, 15) + '...' : field.assignee} • Page {field.page + 1}
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <div 
                            className="w-3 h-3 rounded-full border border-white shadow-sm"
                            style={{ backgroundColor: getSigneeColor(field.assignee) }}
                          />
                          <button
                            onClick={() => scrollToField(field.id)}
                            className="opacity-0 group-hover:opacity-100 p-1.5 hover:bg-blue-100 rounded-full transition-all duration-200"
                            title="View field location"
                          >
                            <Eye className="w-3.5 h-3.5 text-blue-500" />
                          </button>
                          <button
                            onClick={() => handleFieldRemove(field.id)}
                            className="opacity-0 group-hover:opacity-100 p-1.5 hover:bg-red-100 rounded-full transition-all duration-200"
                            title="Remove field"
                          >
                            <X className="w-3.5 h-3.5 text-red-500" />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Empty State */}
            {signatureFields.length === 0 && (
              <div className="text-center py-8">
                <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Layers className="w-8 h-8 text-gray-400" />
                </div>
                <p className="text-sm text-gray-500 mb-2">No fields placed yet</p>
                <p className="text-xs text-gray-400">Select a signee and click a tool above to get started</p>
              </div>
            )}
          </div>
        </aside>
      </div>

      {/* Pre-filled Text Modal */}
      <PrefilledTextModal
        isOpen={showPrefilledTextModal}
        onClose={() => setShowPrefilledTextModal(false)}
        onSave={handlePrefilledTextSave}
        selectedSignee={selectedSignee}
      />
    </div>
  );
};

export default SignSetupUI;