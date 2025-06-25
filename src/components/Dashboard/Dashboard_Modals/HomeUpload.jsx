import React, { useRef, useState } from 'react';
import { Upload, FileText, X } from 'lucide-react';
import Toast from '../../ui/Toast';
import DocumentPreview from '../Manage_Modals/DocumentPreview';

const HomeUpload = () => {
  const fileInputRef = useRef(null);
  const [isDragOver, setIsDragOver] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [toast, setToast] = useState({ show: false, message: '', type: 'info' });
  const [previewDocument, setPreviewDocument] = useState(null);

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

    setIsUploading(true);

    try {
      // Simulate upload process
      await new Promise(resolve => setTimeout(resolve, 2000));

      // Create a mock document object for preview
      const mockDocument = {
        DocumentID: `doc${Date.now()}`,
        DocumentName: file.name.replace('.pdf', ''),
        DateAdded: new Date().toISOString().split('T')[0],
        LastChangedDate: new Date().toISOString(),
        TotalPages: Math.floor(Math.random() * 20) + 1, // Random page count
        AuthorName: localStorage.getItem('username') || 'John Doe',
        AuthorID: 'us1122334456',
        AuthorEmail: localStorage.getItem('useremail') || 'john.doe@cloudbyz.com',
        Status: 'Draft',
        Signees: [],
        AlreadySigned: []
      };

      showToast('Document uploaded successfully!', 'success');
      setPreviewDocument(mockDocument);
    } catch (error) {
      console.error('Upload error:', error);
      showToast('Failed to upload document. Please try again.', 'error');
    } finally {
      setIsUploading(false);
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
    if (!isUploading) {
      fileInputRef.current?.click();
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
                : isUploading
                ? 'border-CloudbyzBlue/50 bg-CloudbyzBlue/5 cursor-wait'
                : 'border-CloudbyzBlue/30 hover:border-CloudbyzBlue/50 hover:bg-CloudbyzBlue/5'
            } group`}
            onDrop={handleDrop}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onClick={handleUploadAreaClick}
          >
            <div className={`w-20 h-20 rounded-2xl flex items-center justify-center mx-auto mb-6 transition-colors duration-300 ${
              isUploading
                ? 'bg-CloudbyzBlue/30'
                : 'bg-CloudbyzBlue/10 group-hover:bg-CloudbyzBlue/20'
            }`}>
              {isUploading ? (
                <div className="w-10 h-10 border-4 border-CloudbyzBlue border-t-transparent rounded-full animate-spin"></div>
              ) : (
                <Upload className="h-10 w-10 text-CloudbyzBlue" />
              )}
            </div>
            
            <h3 className="text-xl font-semibold text-gray-800 mb-3">
              {isUploading 
                ? 'Uploading your document...' 
                : isDragOver 
                ? 'Drop your PDF here' 
                : 'Drop PDF documents here to get started'
              }
            </h3>
            
            {!isUploading && (
              <>
                <p className="text-gray-600 mb-6">
                  Supports PDF files up to 25MB
                </p>
                <p className="text-CloudbyzBlue font-medium">
                  Click anywhere in this area to browse files
                </p>
              </>
            )}
            
            <input
              ref={fileInputRef}
              type="file"
              accept=".pdf,application/pdf"
              onChange={handleFileInputChange}
              className="hidden"
              disabled={isUploading}
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

      {/* Document Preview Modal */}
      {previewDocument && (
        <DocumentPreview
          isOpen={!!previewDocument}
          setIsOpen={(isOpen) => !isOpen && setPreviewDocument(null)}
          document={previewDocument}
        />
      )}
    </>
  );
};

export default HomeUpload;