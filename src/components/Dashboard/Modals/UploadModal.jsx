import React, { useRef } from 'react';
import { Upload, X, FileText } from 'lucide-react';

const UploadModal = ({ isOpen, onClose, onFileSelect }) => {
  const fileInputRef = useRef(null);

  const handleFileUpload = (event) => {
    const file = event.target.files[0];
    if (file && file.type === 'application/pdf') {
      const fileURL = URL.createObjectURL(file);
      onFileSelect(fileURL);
    } else if (file) {
      alert('Please select a PDF file');
    }
  };

  const handleDrop = (event) => {
    event.preventDefault();
    const file = event.dataTransfer.files[0];
    if (file && file.type === 'application/pdf') {
      const fileURL = URL.createObjectURL(file);
      onFileSelect(fileURL);
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

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl overflow-hidden">
        <div className="bg-gradient-to-r from-CloudbyzBlue/10 to-CloudbyzBlue/5 px-6 py-4 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold text-gray-800">Upload Document</h2>
            <button
              onClick={onClose}
              className="p-2 hover:bg-red-100 rounded-full transition-colors"
            >
              <X className="w-5 h-5 text-red-500" />
            </button>
          </div>
        </div>

        <div className="p-8">
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
              onChange={handleFileUpload}
              className="hidden"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default UploadModal;