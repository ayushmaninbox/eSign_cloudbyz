import React, { useState } from 'react';
import { Dialog } from "@headlessui/react";
import { X, AlertTriangle } from 'lucide-react';

const CancelModal = ({ isOpen, setIsOpen, document, onDocumentUpdate }) => {
  const [reason, setReason] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleCancel = async () => {
    if (!reason.trim()) {
      alert('Please provide a reason for cancellation');
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await fetch(`http://localhost:5000/api/documents/${document.DocumentID}/cancel`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          reason: reason.trim(),
          cancelledBy: 'John Doe'
        }),
      });

      if (response.ok) {
        const updatedDocument = await response.json();
        onDocumentUpdate(updatedDocument);
        setIsOpen(false);
        setReason('');
      } else {
        throw new Error('Failed to cancel document');
      }
    } catch (error) {
      console.error('Error cancelling document:', error);
      alert('Failed to cancel document. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    setReason('');
    setIsOpen(false);
  };

  if (!document) return null;

  return (
    <Dialog
      open={isOpen}
      onClose={handleClose}
      className="relative z-50"
    >
      <div className="fixed inset-0 bg-black/30" aria-hidden="true" />
      <div className="fixed inset-0 flex items-center justify-center p-4">
        <Dialog.Panel className="mx-auto max-w-md w-full rounded-xl bg-white shadow-2xl">
          <div className="flex justify-between items-center p-6 border-b border-gray-200">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-red-100 rounded-lg">
                <AlertTriangle className="w-6 h-6 text-red-600" />
              </div>
              <div>
                <Dialog.Title className="text-xl font-semibold text-gray-900">
                  Cancel Document
                </Dialog.Title>
                <p className="text-sm text-gray-500 mt-1">
                  {document.DocumentName}
                </p>
              </div>
            </div>
            <button
              onClick={handleClose}
              className="w-8 h-8 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center transition-colors"
            >
              <X className="w-4 h-4 text-gray-600" />
            </button>
          </div>

          <div className="p-6">
            <div className="mb-6">
              <p className="text-gray-700 mb-4">
                Are you sure you want to cancel this document? This action cannot be undone.
              </p>
              
              <label className="block text-sm font-semibold text-gray-700 mb-3">
                Reason for cancellation *
              </label>
              <textarea
                value={reason}
                onChange={(e) => setReason(e.target.value.slice(0, 100))}
                placeholder="Please provide a reason for cancelling this document..."
                className="w-full px-3 py-3 border border-gray-300 rounded-lg focus:border-CloudbyzBlue focus:ring-1 focus:ring-CloudbyzBlue resize-none text-sm"
                rows={4}
                maxLength={100}
                required
              />
              <div className="text-xs text-gray-500 mt-1 text-right">
                {reason.length}/100 characters
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
                onClick={handleCancel}
                disabled={isSubmitting || !reason.trim()}
                className={`px-4 py-2 text-sm font-medium text-white rounded-md focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 transition-colors ${
                  isSubmitting || !reason.trim()
                    ? 'bg-gray-400 cursor-not-allowed'
                    : 'bg-red-600 hover:bg-red-700'
                }`}
              >
                {isSubmitting ? 'Cancelling...' : 'Cancel Document'}
              </button>
            </div>
          </div>
        </Dialog.Panel>
      </div>
    </Dialog>
  );
};

export default CancelModal;