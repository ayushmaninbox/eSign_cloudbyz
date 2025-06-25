import React from 'react';
import DocumentPreview from './DocumentPreview';

const PDFModal = ({ isOpen, onClose, pdfUrl }) => {
  return (
    <DocumentPreview 
      isOpen={isOpen} 
      onClose={onClose} 
      pdfUrl={pdfUrl} 
      showNextButton={true}
    />
  );
};

export default PDFModal;