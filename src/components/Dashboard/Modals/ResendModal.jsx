import React, { useState } from 'react';
import { X, Send, Mail, Clock } from 'lucide-react';

const ResendModal = ({ isOpen, onClose, document, onResend }) => {
  const [isResending, setIsResending] = useState(false);
  const [selectedRecipients, setSelectedRecipients] = useState([]);

  const handleResend = async () => {
    if (selectedRecipients.length === 0) {
      alert('Please select at least one recipient');
      return;
    }

    setIsResending(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 2000)); // Simulate API call
      onResend(selectedRecipients);
      onClose();
    } catch (error) {
      console.error('Error resending:', error);
    } finally {
      setIsResending(false);
    }
  };

  const toggleRecipient = (recipient) => {
    setSelectedRecipients(prev => {
      const isSelected = prev.some(r => r.email === recipient.email);
      if (isSelected) {
        return prev.filter(r => r.email !== recipient.email);
      } else {
        return [...prev, recipient];
      }
    });
  };

  const getPendingSignees = () => {
    if (!document) return [];
    return document.Signees.filter(signee => 
      !document.AlreadySigned.some(signed => signed.email === signee.email)
    );
  };

  if (!isOpen || !document) return null;

  const pendingSignees = getPendingSignees();

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden">
        <div className="bg-gradient-to-r from-CloudbyzBlue/10 to-CloudbyzBlue/5 px-6 py-4 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold text-gray-800">Resend Document</h2>
            <button
              onClick={onClose}
              className="p-2 hover:bg-red-100 rounded-full transition-colors"
            >
              <X className="w-5 h-5 text-red-500" />
            </button>
          </div>
        </div>

        <div className="p-6">
          <div className="mb-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-2">{document.DocumentName}</h3>
            <p className="text-sm text-gray-600">Select recipients to resend the document to:</p>
          </div>

          {pendingSignees.length === 0 ? (
            <div className="text-center py-8">
              <Clock className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-500">All recipients have already signed this document.</p>
            </div>
          ) : (
            <div className="space-y-3 mb-6">
              {pendingSignees.map((signee, index) => (
                <div key={index} className="flex items-center space-x-3 p-3 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
                  <input
                    type="checkbox"
                    id={`recipient-${index}`}
                    checked={selectedRecipients.some(r => r.email === signee.email)}
                    onChange={() => toggleRecipient(signee)}
                    className="rounded border-gray-300 text-CloudbyzBlue focus:ring-CloudbyzBlue"
                  />
                  <Mail className="w-4 h-4 text-gray-500" />
                  <div className="flex-1">
                    <label htmlFor={`recipient-${index}`} className="text-sm font-medium text-gray-800 cursor-pointer">
                      {signee.name}
                    </label>
                    <p className="text-xs text-gray-500">{signee.email}</p>
                  </div>
                </div>
              ))}
            </div>
          )}

          {pendingSignees.length > 0 && (
            <div className="flex justify-end space-x-3">
              <button
                onClick={onClose}
                className="px-4 py-2 text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleResend}
                disabled={isResending || selectedRecipients.length === 0}
                className={`flex items-center space-x-2 px-4 py-2 rounded-lg font-semibold transition-colors ${
                  isResending || selectedRecipients.length === 0
                    ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                    : 'bg-CloudbyzBlue text-white hover:bg-CloudbyzBlue/90'
                }`}
              >
                {isResending ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    <span>Resending...</span>
                  </>
                ) : (
                  <>
                    <Send className="w-4 h-4" />
                    <span>Resend ({selectedRecipients.length})</span>
                  </>
                )}
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ResendModal;