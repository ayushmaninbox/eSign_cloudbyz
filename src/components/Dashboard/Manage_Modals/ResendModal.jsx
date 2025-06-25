import React, { useState, useEffect } from 'react';
import { Dialog } from "@headlessui/react";
import { 
  X, 
  Mail, 
  UserCheck, 
  CheckCircle2, 
  AlertCircle, 
  Clock 
} from 'lucide-react';

const ResendModal = ({ isOpen, setIsOpen, document, onDocumentUpdate }) => {
  const [selectedSignees, setSelectedSignees] = useState([]);

  useEffect(() => {
    if (document && isOpen) {
      const unsignedSignees = document.Signees.filter(
        (signee) =>
          !document.AlreadySigned.some(
            (signed) => signed.email === signee.email
          )
      );
      setSelectedSignees(unsignedSignees.map((s) => s.email));
    }
  }, [document, isOpen]);

  const handleSigneeToggle = (email) => {
    setSelectedSignees((prev) =>
      prev.includes(email) ? prev.filter((e) => e !== email) : [...prev, email]
    );
  };

  const handleSelectAllPending = (checked) => {
    if (checked) {
      const unsignedSignees = document.Signees.filter(
        (signee) =>
          !document.AlreadySigned.some(
            (signed) => signed.email === signee.email
          )
      );
      setSelectedSignees((prev) => {
        const signedSelected = prev.filter((email) =>
          document.AlreadySigned.some((signed) => signed.email === email)
        );
        return [...signedSelected, ...unsignedSignees.map((s) => s.email)];
      });
    } else {
      setSelectedSignees((prev) =>
        prev.filter((email) =>
          document.AlreadySigned.some((signed) => signed.email === email)
        )
      );
    }
  };

  const handleResend = () => {
    console.log("Resending to:", selectedSignees);
    
    // Simulate signing completion for demo purposes
    if (selectedSignees.length > 0) {
      const updatedDocument = {
        ...document,
        AlreadySigned: [...document.AlreadySigned, ...document.Signees.filter(s => selectedSignees.includes(s.email))]
      };
      
      // Check if all signees have signed
      if (updatedDocument.AlreadySigned.length === updatedDocument.Signees.length) {
        updatedDocument.Status = "Completed";
      }
      
      // Call the update function to refresh the document list
      if (onDocumentUpdate) {
        onDocumentUpdate(updatedDocument);
      }
    }
    
    setIsOpen(false);
  };

  if (!document) return null;

  const totalSignees = document.Signees.length;
  const signedCount = document.AlreadySigned.length;
  const percentage = totalSignees > 0 ? (signedCount / totalSignees) * 100 : 0;
  const allSigned = signedCount === totalSignees && totalSignees > 0;

  const unsignedSignees = document.Signees.filter(
    (signee) =>
      !document.AlreadySigned.some((signed) => signed.email === signee.email)
  );

  const allPendingSelected = unsignedSignees.every((signee) =>
    selectedSignees.includes(signee.email)
  );

  return (
    <Dialog
      open={isOpen}
      onClose={() => setIsOpen(false)}
      className="relative z-50"
    >
      <div className="fixed inset-0 bg-black/30" aria-hidden="true" />
      <div className="fixed inset-0 flex items-center justify-center p-4">
        <Dialog.Panel className="mx-auto max-w-lg w-full rounded-xl bg-white shadow-2xl">
          <div className="flex justify-between items-center p-6 border-b border-gray-200">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-CloudbyzBlue/10 rounded-lg">
                <Mail className="w-6 h-6 text-CloudbyzBlue" />
              </div>
              <div>
                <Dialog.Title className="text-xl font-semibold text-gray-900">
                  Resend Document
                </Dialog.Title>
                <p className="text-sm text-gray-500 mt-1">
                  {document.DocumentName}
                </p>
              </div>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <X className="w-5 h-5 text-gray-400" />
            </button>
          </div>

          <div className="p-6 space-y-6 max-h-96 overflow-y-auto">
            <div className="bg-gradient-to-r from-CloudbyzBlue/10 to-blue-50 rounded-lg p-4">
              <div className="flex items-center justify-between mb-3">
                <h4 className="font-semibold text-gray-900 flex items-center">
                  <UserCheck className="w-5 h-5 mr-2 text-CloudbyzBlue" />
                  Signature Progress
                </h4>
                {allSigned && (
                  <div className="flex items-center text-green-600">
                    <CheckCircle2 className="w-4 h-4 mr-1" />
                    <span className="text-sm font-medium">Complete</span>
                  </div>
                )}
              </div>

              <div className="flex items-center space-x-3">
                <div className="flex-1 bg-white rounded-full h-3 overflow-hidden shadow-inner">
                  <div
                    className="h-full bg-gradient-to-r from-CloudbyzBlue to-blue-500 transition-all duration-500"
                    style={{ width: `${percentage}%` }}
                  />
                </div>
                <span className="text-sm font-semibold text-gray-700 min-w-fit">
                  {signedCount}/{totalSignees} signed
                </span>
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-4">
                <h4 className="font-semibold text-gray-900">
                  Select Recipients
                </h4>
                {unsignedSignees.length > 0 && (
                  <div className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      checked={allPendingSelected && unsignedSignees.length > 0}
                      onChange={(e) => handleSelectAllPending(e.target.checked)}
                      className="h-4 w-4 rounded border-gray-300 text-CloudbyzBlue focus:ring-CloudbyzBlue"
                    />
                    <span className="text-sm text-gray-600">
                      Select all pending
                    </span>
                  </div>
                )}
              </div>

              <div className="space-y-2 max-h-48 overflow-y-auto">
                {document.Signees.map((signee, index) => {
                  const hasSigned = document.AlreadySigned.some(
                    (signed) => signed.email === signee.email
                  );
                  const isSelected = selectedSignees.includes(signee.email);

                  return (
                    <div
                      key={index}
                      className={`flex items-center justify-between p-3 rounded-lg border transition-all ${
                        isSelected
                          ? "bg-CloudbyzBlue/5 border-CloudbyzBlue/30"
                          : "bg-gray-50 border-gray-200 hover:bg-gray-100"
                      }`}
                    >
                      <div className="flex items-center space-x-3">
                        <input
                          type="checkbox"
                          checked={isSelected}
                          onChange={() => handleSigneeToggle(signee.email)}
                          className="h-4 w-4 rounded border-gray-300 text-CloudbyzBlue focus:ring-CloudbyzBlue"
                        />
                        <div className="flex items-center space-x-3">
                          <div
                            className={`w-2 h-2 rounded-full ${
                              hasSigned ? "bg-green-500" : "bg-amber-500"
                            }`}
                          ></div>
                          <div>
                            <p className="text-sm font-medium text-gray-900">
                              {signee.name}
                            </p>
                            <p className="text-xs text-gray-500">
                              {signee.email}
                            </p>
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center space-x-2">
                        {hasSigned ? (
                          <div className="flex items-center text-green-600">
                            <CheckCircle2 className="w-4 h-4 mr-1" />
                            <span className="text-xs font-medium">Signed</span>
                          </div>
                        ) : (
                          <div className="flex items-center text-amber-600">
                            <AlertCircle className="w-4 h-4 mr-1" />
                            <span className="text-xs font-medium">Pending</span>
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {allSigned && (
              <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                <div className="flex items-center">
                  <CheckCircle2 className="w-5 h-5 text-green-500 mr-2" />
                  <p className="text-sm text-green-800">
                    All signees have completed signing this document.
                  </p>
                </div>
              </div>
            )}
          </div>

          <div className="flex justify-between items-center p-6 border-t border-gray-200 bg-gray-50 rounded-b-xl">
            <div className="text-sm text-gray-600">
              {selectedSignees.length} recipient
              {selectedSignees.length !== 1 ? "s" : ""} selected
            </div>
            <div className="flex space-x-3">
              <button
                onClick={() => setIsOpen(false)}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-CloudbyzBlue focus:ring-offset-2"
              >
                Cancel
              </button>
              <button
                onClick={handleResend}
                disabled={selectedSignees.length === 0}
                className="px-4 py-2 text-sm font-medium text-white bg-CloudbyzBlue rounded-md hover:bg-blue-600 disabled:bg-gray-300 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-CloudbyzBlue focus:ring-offset-2"
              >
                Resend ({selectedSignees.length})
              </button>
            </div>
          </div>
        </Dialog.Panel>
      </div>
    </Dialog>
  );
};

export default ResendModal;