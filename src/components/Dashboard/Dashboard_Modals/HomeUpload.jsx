import React, { useRef, useState } from 'react';
import { Upload, FileText, X } from 'lucide-react';
import Toast from '../../ui/Toast';
import PDFModal from './PDFModal';

const HomeUpload = () => {
  const fileInputRef = useRef(null);
  const [isDragOver, setIsDragOver] = useState(false);
  const [toast, setToast] = useState({ show: false, message: '', type: 'info' });
  const [selectedPDF, setSelectedPDF] = useState(null);

  const showToast = (message, type = 'info') => {
    setToast({ show: true, message, type });
  };

  const handleFileSelect = async (file) => {
    if (!file) return;

    if (file.type !== 'application/pdf') {
      showToast('Please select a PDF file', 'error');
      return;
    }

    if (file.size > 25 * 1024 * 1024) { // 25MB limit
      showToast('File size must be less than 25MB', 'error');
      return;
    }

    try {
      // Create URL for the PDF file and open PDFModal immediately
      const fileURL = URL.createObjectURL(file);
      setSelectedPDF(fileURL);
      showToast('Document uploaded successfully!', 'success');
    } catch (error) {
      console.error('Upload error:', error);
      showToast('Failed to upload document. Please try again.', 'error');
    } finally {
      // Reset file input
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  const handleFileInputChange = (e) => {
    const file = e.target.files[0];
    handleFileSelect(file);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragOver(false);
    
    const files = Array.from(e.dataTransfer.files);
    if (files.length > 0) {
      handleFileSelect(files[0]);
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    setIsDragOver(false);
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

  return (
    <>
      <div className="bg-white rounded-3xl shadow-xl overflow-hidden border border-CloudbyzBlue/10">
        <div className="bg-gradient-to-r from-CloudbyzBlue/5 to-CloudbyzBlue/10 px-8 py-6 border-b border-CloudbyzBlue/10">
          <h2 className="text-2xl font-bold text-gray-800 mb-2">
            Upload Documents
          </h2>
          <p className="text-gray-600">
            Drag and drop your PDF documents or click to browse
          </p>
        </div>
        
        <div className="p-8">
          <div
            className={`border-2 border-dashed rounded-2xl p-16 text-center transition-all duration-300 cursor-pointer ${
              isDragOver
                ? 'border-CloudbyzBlue/70 bg-CloudbyzBlue/10'
                : 'border-CloudbyzBlue/30 hover:border-CloudbyzBlue/50 hover:bg-CloudbyzBlue/5'
            } group`}
            onDrop={handleDrop}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onClick={handleUploadAreaClick}
          >
            <div className={`w-20 h-20 rounded-2xl flex items-center justify-center mx-auto mb-6 transition-colors duration-300 bg-CloudbyzBlue/10 group-hover:bg-CloudbyzBlue/20`}>
              <Upload className="h-10 w-10 text-CloudbyzBlue" />
            </div>
            
            <h3 className="text-xl font-semibold text-gray-800 mb-3">
              {isDragOver 
                ? 'Drop your PDF here' 
                : 'Drop PDF documents here to get started'
              }
            </h3>
            
            <p className="text-gray-600 mb-6">
              Supports PDF files up to 25MB
            </p>
            <p className="text-CloudbyzBlue font-medium">
              Click anywhere in this area to browse files
            </p>
            
            <input
              ref={fileInputRef}
              type="file"
              accept=".pdf,application/pdf"
              onChange={handleFileInputChange}
              className="hidden"
            />
          </div>
          
          {/* File format info */}
          <div className="mt-6 flex items-center justify-center space-x-4 text-sm text-gray-500">
            <div className="flex items-center space-x-2">
              <FileText className="w-4 h-4" />
              <span>PDF only</span>
            </div>
            <div className="w-1 h-1 bg-gray-300 rounded-full"></div>
            <span>Max 25MB</span>
            <div className="w-1 h-1 bg-gray-300 rounded-full"></div>
            <span>Secure upload</span>
          </div>
        </div>
      </div>

      {/* Toast */}
      {toast.show && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast({ ...toast, show: false })}
        />
      )}

      {/* PDF Modal */}
      <PDFModal 
        isOpen={!!selectedPDF} 
        onClose={closePDFModal} 
        pdfUrl={selectedPDF} 
      />
    </>
  );
};

export default HomeUpload;