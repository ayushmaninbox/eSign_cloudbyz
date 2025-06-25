import React, { useState } from 'react';
import { CheckCircle2, FileText, AlertCircle } from 'lucide-react';

const TermsAcceptanceBar = ({ isVisible, onAccept, onDecline, documentName }) => {
  const [isAccepting, setIsAccepting] = useState(false);

  const handleAccept = async () => {
    setIsAccepting(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate processing
      onAccept();
    } finally {
      setIsAccepting(false);
    }
  };

  if (!isVisible) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white border-t-2 border-CloudbyzBlue shadow-2xl z-50 animate-slide-up">
      <div className="max-w-6xl mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="w-12 h-12 bg-CloudbyzBlue/10 rounded-full flex items-center justify-center">
              <FileText className="w-6 h-6 text-CloudbyzBlue" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-800">Ready to Sign</h3>
              <p className="text-sm text-gray-600">
                {documentName ? `Document: ${documentName}` : 'Please review and accept the terms to proceed with signing.'}
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-3">
            <div className="flex items-center space-x-2 text-sm text-gray-600">
              <AlertCircle className="w-4 h-4 text-amber-500" />
              <span>By signing, you agree to the terms and conditions</span>
            </div>
            
            <button
              onClick={onDecline}
              className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium"
            >
              Decline
            </button>
            
            <button
              onClick={handleAccept}
              disabled={isAccepting}
              className={`px-8 py-2 rounded-lg font-semibold transition-all duration-200 flex items-center space-x-2 ${
                isAccepting
                  ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                  : 'bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white shadow-lg hover:shadow-xl hover:scale-105'
              }`}
            >
              {isAccepting ? (
                <>
                  <div className="w-4 h-4 border-2 border-gray-400 border-t-transparent rounded-full animate-spin"></div>
                  <span>Processing...</span>
                </>
              ) : (
                <>
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Accept & Sign</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TermsAcceptanceBar;