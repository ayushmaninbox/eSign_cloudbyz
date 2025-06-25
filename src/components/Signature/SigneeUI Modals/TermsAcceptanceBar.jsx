import React, { useState } from 'react';
import { CheckCircle2 } from 'lucide-react';
import TermsAndConditions from '../../ui/T&C';

const TermsAcceptanceBar = ({ onAccept }) => {
  const [isChecked, setIsChecked] = useState(false);
  const [isAccepted, setIsAccepted] = useState(false);
  const [showTermsModal, setShowTermsModal] = useState(false);

  const handleAccept = () => {
    if (isChecked) {
      setIsAccepted(true);
      setTimeout(() => {
        onAccept();
      }, 500);
    }
  };

  const handleTermsClick = (e) => {
    e.preventDefault();
    setShowTermsModal(true);
  };

  if (isAccepted) {
    return null;
  }

  return (
    <>
      <div className="fixed top-16 left-0 right-0 bg-gradient-to-r from-blue-50 via-white to-blue-50 border-b border-gray-200 shadow-sm px-6 py-3 flex items-center justify-between z-20 h-16">
        <div className="flex items-center space-x-3">
          <div className="flex items-center space-x-2">
            <input
              type="checkbox"
              id="terms-checkbox"
              checked={isChecked}
              onChange={(e) => setIsChecked(e.target.checked)}
              className="w-4 h-4 text-CloudbyzBlue bg-gray-100 border-gray-300 rounded focus:ring-CloudbyzBlue focus:ring-2"
            />
            <label
              htmlFor="terms-checkbox"
              className="text-sm text-gray-700 cursor-pointer"
            >
              I have read and agree to the{" "}
              <button
                onClick={handleTermsClick}
                className="text-CloudbyzBlue hover:text-CloudbyzBlue/80 underline font-medium"
              >
                Terms and Conditions
              </button>
            </label>
          </div>
        </div>

        <button
          onClick={handleAccept}
          disabled={!isChecked}
          className={`px-6 py-2 rounded-lg font-semibold transition-all duration-300 flex items-center space-x-2 ${
            isChecked
              ? "bg-gradient-to-r from-CloudbyzBlue to-CloudbyzBlue/80 hover:from-CloudbyzBlue/90 hover:to-CloudbyzBlue/70 text-white shadow-lg hover:shadow-xl hover:scale-105"
              : "bg-gray-300 text-gray-500 cursor-not-allowed opacity-60"
          }`}
        >
          <CheckCircle2 className="w-4 h-4" />
          <span>Confirm</span>
        </button>
      </div>

      <TermsAndConditions
        isOpen={showTermsModal}
        onClose={() => setShowTermsModal(false)}
      />
    </>
  );
};

export default TermsAcceptanceBar;