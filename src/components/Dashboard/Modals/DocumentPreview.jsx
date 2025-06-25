import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { X, ChevronLeft, ChevronRight } from 'lucide-react';

const DocumentPreview = ({ isOpen, onClose, pdfUrl, onNext, showNextButton = false }) => {
  const navigate = useNavigate();
  const [pageUrls, setPageUrls] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageInput, setPageInput] = useState('1');
  const [canvasDimensions, setCanvasDimensions] = useState({});

  const numPages = pageUrls.length;

  const drawImageOnCanvas = useCallback((canvas, imageUrl, pageIndex) => {
    const ctx = canvas.getContext('2d');
    const img = new Image();
    img.crossOrigin = "anonymous";
    
    img.onload = () => {
      const containerWidth = canvas.parentElement.clientWidth;
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
    if (isOpen) {
      fetch('http://localhost:5000/api/images')
        .then(response => response.json())
        .then(data => {
          setPageUrls(data.images);
          setCurrentPage(1);
          setPageInput('1');
        })
        .catch(error => console.error('Error fetching images:', error));
    }
  }, [isOpen]);

  useEffect(() => {
    if (pageUrls.length > 0) {
      setTimeout(() => {
        pageUrls.forEach((url, index) => {
          const canvas = document.getElementById(`preview-page-${index}`);
          if (canvas) drawImageOnCanvas(canvas, url, index);
        });
      }, 100);
    }
  }, [pageUrls, drawImageOnCanvas]);

  const handleNext = () => {
    if (onNext) {
      onNext();
    } else {
      navigate('/recipientselection');
    }
  };

  const scrollToPage = useCallback((pageNum) => {
    const newPageNum = Math.max(1, Math.min(pageNum, numPages));
    const pageElement = document.getElementById(`preview-page-container-${newPageNum}`);
    if (pageElement) {
      pageElement.scrollIntoView({
        behavior: 'smooth',
        block: 'start',
      });
      setCurrentPage(newPageNum);
    }
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

  useEffect(() => {
    setPageInput(String(currentPage));
  }, [currentPage]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full h-full max-w-6xl max-h-[90vh] flex flex-col overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200 bg-gradient-to-r from-CloudbyzBlue/5 to-CloudbyzBlue/10">
          <div className="flex items-center w-1/3">
            <button
              onClick={onClose}
              className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-slate-700 hover:text-slate-900 bg-slate-100 hover:bg-slate-200 rounded-lg transition-all duration-200 group"
            >
              <X className="w-4 h-4" />
              Close
            </button>
          </div>
          
          <div className="flex items-center gap-4 justify-center w-1/3">
            <button
              onClick={() => navigatePage(-1)}
              disabled={currentPage <= 1}
              className="w-8 h-8 flex items-center justify-center rounded-full bg-white border border-slate-200 hover:bg-slate-50 hover:border-slate-300 disabled:opacity-40 disabled:cursor-not-allowed transition-all duration-200"
            >
              <ChevronLeft className="w-4 h-4" />
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
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
          
          {showNextButton && (
            <div className="flex items-center justify-end w-1/3">
              <button
                onClick={handleNext}
                className="bg-gradient-to-r from-CloudbyzBlue to-CloudbyzBlue/80 hover:from-CloudbyzBlue/90 hover:to-CloudbyzBlue/70 text-white px-6 py-2 rounded-lg font-semibold shadow-lg hover:shadow-xl transition-all duration-300 flex items-center space-x-2 hover:scale-105"
              >
                <span>Next</span>
                <svg 
                  xmlns="http://www.w3.org/2000/svg" 
                  fill="none" 
                  viewBox="0 0 24 24" 
                  strokeWidth={2} 
                  stroke="currentColor" 
                  className="w-4 h-4"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
                </svg>
              </button>
            </div>
          )}
        </div>

        {/* PDF Viewer */}
        <div className="flex-1 overflow-y-auto p-6 bg-slate-100">
          {pageUrls.map((url, index) => (
            <div 
              id={`preview-page-container-${index + 1}`}
              key={`preview-page-container-${index + 1}`} 
              className="mb-6 flex justify-center"
            >
              <div className="w-full max-w-4xl relative">
                <canvas
                  id={`preview-page-${index}`}
                  className="w-full h-auto shadow-xl rounded-sm"
                  style={{ display: 'block', width: '100%', height: 'auto' }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default DocumentPreview;