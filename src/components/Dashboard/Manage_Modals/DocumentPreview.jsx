import React, { useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { format } from 'date-fns';
import { 
  FileText, 
  Shield, 
  Building2, 
  Users, 
  Clock4, 
  ExternalLink,
  X
} from 'lucide-react';

const DocumentPreview = ({ isOpen, setIsOpen, document }) => {
  const navigate = useNavigate();
  const modalRef = useRef(null);

  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === 'Escape') {
        setIsOpen(false);
      }
    };

    const handleClickOutside = (e) => {
      if (modalRef.current && !modalRef.current.contains(e.target)) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
      document.addEventListener('mousedown', handleClickOutside);
      document.body.style.overflow = 'hidden';
    }

    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.removeEventListener('mousedown', handleClickOutside);
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, setIsOpen]);

  if (!isOpen || !document) return null;

  const getStatusColor = (status) => {
    switch (status) {
      case "Completed":
        return "bg-green-100 text-green-800 border-green-200";
      case "Sent for signature":
        return "bg-amber-100 text-amber-800 border-amber-200";
      case "Draft":
        return "bg-blue-100 text-blue-800 border-blue-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case "Completed":
        return <div className="w-5 h-5 text-green-500">✓</div>;
      case "Sent for signature":
        return <div className="w-5 h-5 text-amber-500">⏱</div>;
      case "Draft":
        return <div className="w-5 h-5 text-blue-500">✎</div>;
      default:
        return null;
    }
  };

  const handleOpenPDF = () => {
    navigate('/signpreview', { state: { from: '/manage' } });
  };

  return (
    <div className="fixed inset-0 bg-black/30 z-50 flex items-center justify-center p-4">
      <div 
        ref={modalRef}
        className="mx-auto max-w-2xl w-full rounded-xl bg-white shadow-2xl"
      >
        <div className="flex justify-between items-center p-6 border-b border-gray-200">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-blue-100 rounded-lg">
              <FileText className="w-6 h-6 text-blue-600" />
            </div>
            <div>
              <h2 className="text-xl font-semibold text-gray-900">
                {document.DocumentName}
              </h2>
              <p className="text-sm text-gray-500 mt-1">Document Preview</p>
            </div>
          </div>
          <button
            onClick={() => setIsOpen(false)}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
          >
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        <div className="p-6 space-y-6 max-h-96 overflow-y-auto">
          <div className="bg-gray-50 rounded-lg p-4">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-sm font-medium text-gray-900 flex items-center">
                <Shield className="w-4 h-4 mr-2 text-gray-600" />
                Document Status
              </h3>
              <div className="flex items-center space-x-3">
                <div
                  className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium border ${getStatusColor(
                    document.Status
                  )}`}
                >
                  {getStatusIcon(document.Status)}
                  <span className="ml-2">{document.Status}</span>
                </div>
                <button
                  onClick={handleOpenPDF}
                  className="inline-flex items-center px-3 py-1 text-sm font-medium text-CloudbyzBlue bg-blue-50 border border-blue-200 rounded-md hover:bg-blue-100 transition-colors"
                >
                  <ExternalLink className="w-4 h-4 mr-1" />
                  Open PDF
                </button>
              </div>
            </div>
            {document.Status === "Sent for signature" && (
              <div className="flex items-center space-x-2">
                <div className="w-16 h-2 bg-gray-200 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-green-500 transition-all duration-300"
                    style={{ 
                      width: `${document.Signees.length > 0 ? (document.AlreadySigned.length / document.Signees.length) * 100 : 0}%` 
                    }}
                  />
                </div>
                <span className="text-xs text-gray-600">
                  {document.AlreadySigned.length}/{document.Signees.length} signed
                </span>
              </div>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-gray-50 rounded-lg p-4">
              <h4 className="text-sm font-medium text-gray-900 mb-2 flex items-center">
                <Building2 className="w-4 h-4 mr-2 text-gray-600" />
                Author Information
              </h4>
              <div className="space-y-1">
                <p className="text-sm text-gray-700 font-medium">
                  {document.AuthorName}
                </p>
                <p className="text-xs text-gray-500">
                  {document.AuthorEmail}
                </p>
              </div>
            </div>

            <div className="bg-gray-50 rounded-lg p-4">
              <h4 className="text-sm font-medium text-gray-900 mb-2 flex items-center">
                <FileText className="w-4 h-4 mr-2 text-gray-600" />
                Document Details
              </h4>
              <div className="space-y-1">
                <p className="text-sm text-gray-700">
                  Pages:{" "}
                  <span className="font-medium">{document.TotalPages}</span>
                </p>
                <p className="text-sm text-gray-700">
                  ID:{" "}
                  <span className="font-mono text-xs">
                    {document.DocumentID}
                  </span>
                </p>
              </div>
            </div>
          </div>

          <div className="bg-gray-50 rounded-lg p-4">
            <h4 className="text-sm font-medium text-gray-900 mb-3 flex items-center">
              <Users className="w-4 h-4 mr-2 text-gray-600" />
              Signees ({document.Signees.length})
            </h4>
            <div
              className={`space-y-2 ${
                document.Signees.length > 5 ? "max-h-40 overflow-y-auto" : ""
              }`}
            >
              {document.Signees.map((signee, index) => {
                const hasSigned = document.AlreadySigned.some(
                  (signed) => signed.email === signee.email
                );
                return (
                  <div
                    key={index}
                    className="flex items-center justify-between p-2 bg-white rounded border"
                  >
                    <div className="flex items-center space-x-3">
                      <div
                        className={`w-2 h-2 rounded-full ${
                          hasSigned ? "bg-green-500" : "bg-yellow-500"
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
                    <span
                      className={`text-xs px-2 py-1 rounded-full font-medium ${
                        hasSigned
                          ? "bg-green-100 text-green-800"
                          : "bg-yellow-100 text-yellow-800"
                      }`}
                    >
                      {hasSigned ? "Signed" : "Pending"}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="bg-gray-50 rounded-lg p-4">
            <h4 className="text-sm font-medium text-gray-900 mb-3 flex items-center">
              <Clock4 className="w-4 h-4 mr-2 text-gray-600" />
              Timeline
            </h4>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Date Added</span>
                <span className="text-sm font-medium text-gray-900">
                  {format(new Date(document.DateAdded), "MMM d, yyyy")}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Last Modified</span>
                <span className="text-sm font-medium text-gray-900">
                  {format(
                    new Date(document.LastChangedDate),
                    "MMM d, yyyy 'at' h:mm a"
                  )}
                </span>
              </div>
            </div>
          </div>
        </div>

        <div className="flex justify-end p-6 border-t border-gray-200 bg-gray-50 rounded-b-xl">
          <button
            onClick={() => setIsOpen(false)}
            className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-CloudbyzBlue focus:ring-offset-2"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default DocumentPreview;