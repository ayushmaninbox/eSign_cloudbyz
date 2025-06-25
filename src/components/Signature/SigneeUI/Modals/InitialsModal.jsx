import React from 'react';
import SignatureModal from './SignatureModal';

const InitialsModal = ({ isOpen, onClose, onSave }) => {
  return (
    <SignatureModal 
      isOpen={isOpen} 
      onClose={onClose} 
      onSave={onSave} 
      fieldType="initials"
    />
  );
};

export default InitialsModal;