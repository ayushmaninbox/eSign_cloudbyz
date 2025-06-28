import React, { useRef, useState } from 'react';
import { Upload } from 'lucide-react';
import PDFModal from '../Dashboard_Modals/PDFModal';

const UploadModal = ({ isOpen, setIsOpen }) => {
  const [selectedPDF, setSelectedPDF] = useState(null);
  const fileInputRef = useRef(null);

  const handleFileSelect = (file) => {
    if (file && file.type === "application/pdf") {
      const fileURL = URL.createObjectURL(file);
      setSelectedPDF(fileURL);
      setIsOpen(false); // Close the upload modal immediately
    } else if (file) {
      alert("Please select a PDF file");
    }
  };

  const handleFileInputChange = (e) => {
    const file = e.target.files[0];
    handleFileSelect(file);
  };

  const handleDrop = (event) => {
    event.preventDefault();
    const file = event.dataTransfer.files[0];
    handleFileSelect(file);
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

  if (!isOpen) {
    return (
      <>
        {/* PDF Modal - show even when upload modal is closed */}
        <PDFModal 
          isOpen={!!selectedPDF} 
          onClose={closePDFModal} 
          pdfUrl={selectedPDF} 
        />
      </>
    );
  }

  return (
    <>
      <div className="fixed inset-0 bg-black/30 backdrop-blur-sm z-50 flex items-center justify-center p-4">
        <div className="mx-auto max-w-md w-full rounded-lg bg-white p-6 shadow-2xl">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-medium">
              Upload Document
            </h3>
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
                onChange={handleFileInputChange}
                className="hidden"
              />
            </div>
          </div>

          <div className="flex justify-end mt-6">
            <button
              onClick={() => setIsOpen(false)}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-CloudbyzBlue focus:ring-offset-2"
            >
              Cancel
            </button>
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