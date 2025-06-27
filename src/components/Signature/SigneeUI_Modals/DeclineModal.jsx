import React, { useState, useEffect } from 'react';
import { X, AlertTriangle, ChevronDown } from 'lucide-react';

const DeclineModal = ({ isOpen, onClose, onDecline, documentData }) => {
  const [selectedReason, setSelectedReason] = useState('');
  const [showReasonDropdown, setShowReasonDropdown] = useState(false);
  const [signatureReasons, setSignatureReasons] = useState([]);
  const [localOtherReasons, setLocalOtherReasons] = useState([]);
  const [customReason, setCustomReason] = useState('');
  const [isCustomReason, setIsCustomReason] = useState(false);
  const [tempInputValue, setTempInputValue] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (isOpen) {
      // Load local other reasons from localStorage
      const localReasons = localStorage.getItem("localOtherReasons");
      if (localReasons) {
        setLocalOtherReasons(JSON.parse(localReasons));
      }

      // Load signature reasons from backend
      fetch("http://localhost:5000/api/data")
        .then((response) => response.json())
        .then((data) => {
          setSignatureReasons(data.signatureReasons || []);
          // Set the first reason as default
          if (data.signatureReasons && data.signatureReasons.length > 0) {
            setSelectedReason(data.signatureReasons[0]);
          }
        })
        .catch((error) => console.error("Error fetching reasons:", error));
    }
  }, [isOpen]);

  const handleReasonSelect = (reason) => {
    if (reason === "Other") {
      setIsCustomReason(true);
      setSelectedReason("");
      setCustomReason("");
      setTempInputValue("");
    } else {
      setIsCustomReason(false);
      setSelectedReason(reason);
    }
    setShowReasonDropdown(false);
  };

  const handleCustomReasonSave = () => {
    if (tempInputValue.trim()) {
      const newReason = tempInputValue.trim();
      setSelectedReason(newReason);
      setCustomReason(newReason);
      setIsCustomReason(false);

      // Add to local other reasons
      const updatedLocalReasons = [...localOtherReasons, newReason];
      setLocalOtherReasons(updatedLocalReasons);
      localStorage.setItem(
        "localOtherReasons",
        JSON.stringify(updatedLocalReasons)
      );
    }
  };

  const handleDecline = async () => {
    if (!selectedReason && !tempInputValue.trim()) {
      alert('Please select a reason for declining to sign');
      return;
    }

    const finalReason = isCustomReason ? tempInputValue.trim() : selectedReason;

    if (isCustomReason && tempInputValue.trim()) {
      const newReason = tempInputValue.trim();
      const updatedLocalReasons = [...localOtherReasons, newReason];
      setLocalOtherReasons(updatedLocalReasons);
      localStorage.setItem(
        "localOtherReasons",
        JSON.stringify(updatedLocalReasons)
      );
    }

    setIsSubmitting(true);

    try {
      await onDecline(finalReason);
      handleClose();
    } catch (error) {
      console.error('Error declining document:', error);
      alert('Failed to decline document. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    setSelectedReason('');
    setCustomReason('');
    setTempInputValue('');
    setIsCustomReason(false);
    setShowReasonDropdown(false);
    setIsSubmitting(false);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-md overflow-hidden">
        <div className="bg-gradient-to-r from-red-50 to-red-100 px-6 py-4 border-b border-red-200">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-red-100 rounded-lg">
                <AlertTriangle className="w-6 h-6 text-red-600" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-red-800">Decline to Sign</h2>
                {documentData && (
                  <p className="text-sm text-red-600 mt-1">
                    {documentData.DocumentName}
                  </p>
                )}
              </div>
            </div>
            <button
              onClick={handleClose}
              className="w-8 h-8 rounded-full bg-red-100 hover:bg-red-200 flex items-center justify-center transition-colors group"
            >
              <X className="w-4 h-4 text-red-600 group-hover:text-red-700" />
            </button>
          </div>
        </div>

        <div className="p-6">
          <div className="mb-6">
            <p className="text-gray-700 mb-4">
              Are you sure you want to decline to sign this document? This action will cancel the document for all parties.
            </p>
            
            <label className="block text-sm font-semibold text-gray-700 mb-3">
              Reason for declining to sign *
            </label>
            
            <div className="relative">
              {isCustomReason ? (
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={tempInputValue}
                    onChange={(e) => setTempInputValue(e.target.value)}
                    placeholder="Enter custom reason"
                    className="flex-1 border border-gray-300 rounded-lg focus:border-CloudbyzBlue focus:ring-2 focus:ring-CloudbyzBlue/20 transition-all p-3 text-sm"
                    maxLength={100}
                  />
                  <button
                    onClick={handleCustomReasonSave}
                    className="bg-CloudbyzBlue text-white rounded-lg hover:bg-CloudbyzBlue/90 transition-colors px-4 py-3 text-sm"
                  >
                    Save
                  </button>
                  <button
                    onClick={() => {
                      setIsCustomReason(false);
                      setTempInputValue("");
                    }}
                    className="bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400 transition-colors px-4 py-3 text-sm"
                  >
                    Cancel
                  </button>
                </div>
              ) : (
                <button
                  onClick={() => setShowReasonDropdown(!showReasonDropdown)}
                  className="w-full flex items-center justify-between bg-white border border-gray-300 rounded-lg hover:border-gray-400 focus:border-CloudbyzBlue focus:ring-2 focus:ring-CloudbyzBlue/20 transition-all p-3 text-sm"
                >
                  <span
                    className={
                      selectedReason ? "text-gray-800" : "text-gray-500"
                    }
                  >
                    {selectedReason || "Select a reason for declining"}
                  </span>
                  <ChevronDown
                    className={`w-4 h-4 text-gray-500 transition-transform ${
                      showReasonDropdown ? "rotate-180" : ""
                    }`}
                  />
                </button>
              )}

              {showReasonDropdown && !isCustomReason && (
                <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-200 rounded-lg shadow-lg z-[70] max-h-48 overflow-y-auto">
                  {signatureReasons.map((reason, index) => (
                    <button
                      key={index}
                      onClick={() => handleReasonSelect(reason)}
                      className="w-full text-left hover:bg-gray-50 transition-colors p-3 text-sm"
                    >
                      {reason}
                    </button>
                  ))}
                  {localOtherReasons.map((reason, index) => (
                    <button
                      key={`local-${index}`}
                      onClick={() => handleReasonSelect(reason)}
                      className="w-full text-left hover:bg-gray-50 transition-colors p-3 text-sm"
                    >
                      {reason}
                    </button>
                  ))}
                  <div className="border-t border-gray-200">
                    <button
                      onClick={() => handleReasonSelect("Other")}
                      className="w-full text-left hover:bg-gray-50 transition-colors text-CloudbyzBlue font-medium p-3 text-sm"
                    >
                      Other reason...
                    </button>
                  </div>
                </div>
              )}
            </div>
            
            {(selectedReason || tempInputValue) && (
              <div className="text-xs text-gray-500 mt-1">
                {isCustomReason ? tempInputValue.length : selectedReason.length}/100 characters
              </div>
            )}
          </div>

          <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
            <div className="flex items-center">
              <AlertTriangle className="w-5 h-5 text-red-500 mr-2" />
              <p className="text-sm text-red-800 font-medium">
                This action will cancel the document for all parties and cannot be undone.
              </p>
            </div>
          </div>

          <div className="flex justify-end space-x-3">
            <button
              onClick={handleClose}
              disabled={isSubmitting}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-CloudbyzBlue focus:ring-offset-2 disabled:opacity-50"
            >
              Keep Document
            </button>
            <button
              onClick={handleDecline}
              disabled={isSubmitting || (!selectedReason && !tempInputValue.trim())}
              className={`px-4 py-2 text-sm font-medium text-white rounded-md focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 transition-colors ${
                isSubmitting || (!selectedReason && !tempInputValue.trim())
                  ? 'bg-gray-400 cursor-not-allowed'
                  : 'bg-red-600 hover:bg-red-700'
              }`}
            >
              {isSubmitting ? 'Declining...' : 'Decline to Sign'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DeclineModal;