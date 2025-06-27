import React, { useRef, useEffect, useState } from 'react';
import { X, Upload } from 'lucide-react';
import PDFModal from '../Dashboard_Modals/PDFModal';

const UploadModal = ({ isOpen, setIsOpen }) => {
  const [selectedPDF, setSelectedPDF] = useState(null);
  const fileInputRef = useRef(null);
  const modalRef = useRef(null);

  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === 'Escape') {
        setIsOpen(false);
      }
    };

    const handleClickOutside = (e) => {
      if (modalRef.current && !modalRef.current.contains(e.target)) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
      document.addEventListener('mousedown', handleClickOutside);
      document.body.style.overflow = 'hidden';
    }

    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.removeEventListener('mousedown', handleClickOutside);
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, setIsOpen]);

  const handleFileSelect = (e) => {
    const file = e.target.files[0];
    if (file && file.type === "application/pdf") {
      const fileURL = URL.createObjectURL(file);
      setSelectedPDF(fileURL);
      setIsOpen(false);
    } else if (file) {
      alert("Please select a PDF file");
    }
  };

  const handleDrop = (event) => {
    event.preventDefault();
    const file = event.dataTransfer.files[0];
    if (file && file.type === 'application/pdf') {
      const fileURL = URL.createObjectURL(file);
      setSelectedPDF(fileURL);
      setIsOpen(false);
    } else {
      alert('Please drop a PDF file');
    }
  };

  const handleDragOver = (event) => {
    event.preventDefault();
  };

  const handleUploadAreaClick = () => {
    fileInputRef.current?.click();
  };

  const closePDFModal = () => {
    if (selectedPDF) {
      URL.revokeObjectURL(selectedPDF);
      setSelectedPDF(null);
    }
    // Reset the file input value to allow uploading the same file again
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  // Auto-open PDF modal when file is selected
  useEffect(() => {
    if (selectedPDF) {
      // Small delay to ensure modal closes first
      setTimeout(() => {
        // This will trigger the PDF modal to open
      }, 100);
    }
  }, [selectedPDF]);

  if (!isOpen) return null;

  return (
    <>
      <div className="fixed inset-0 bg-black/30 z-50 flex items-center justify-center p-4">
        <div 
          ref={modalRef}
          className="mx-auto max-w-md w-full rounded-lg bg-white p-6"
        >
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-medium">
              Upload Document
            </h2>
            <button 
              onClick={() => setIsOpen(false)}
              className="p-2 hover:bg-gray-100 rounded-full transition-colors"
            >
              <X className="w-5 h-5 text-gray-400 hover:text-gray-600" />
            </button>
          </div>

          <div className="space-y-4">
            <div
              className="border-2 border-dashed border-CloudbyzBlue/30 rounded-2xl p-16 text-center hover:border-CloudbyzBlue/50 hover:bg-CloudbyzBlue/5 transition-all duration-300 group cursor-pointer"
              onDrop={handleDrop}
              onDragOver={handleDragOver}
              onClick={handleUploadAreaClick}
            >
              <div className="w-20 h-20 bg-CloudbyzBlue/10 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:bg-CloudbyzBlue/20 transition-colors duration-300">
                <Upload className="h-10 w-10 text-CloudbyzBlue" />
              </div>
              <h3 className="text-xl font-semibold text-gray-800 mb-3">Drop PDF documents here to get started</h3>
              <p className="text-gray-600 mb-6">Supports PDF files up to 25MB</p>
              <p className="text-CloudbyzBlue font-medium">Click anywhere in this area to browse files</p>
              <input
                ref={fileInputRef}
                type="file"
                accept=".pdf"
                onChange={handleFileSelect}
                className="hidden"
              />
            </div>
          </div>
        </div>
      </div>

      {/* PDF Modal */}
      <PDFModal 
        isOpen={!!selectedPDF} 
        onClose={closePDFModal} 
        pdfUrl={selectedPDF} 
      />
    </>
  );
};

export default UploadModal;