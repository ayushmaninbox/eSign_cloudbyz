import React from 'react';
import { Trash2, Check, PenTool, Upload, Type, Library } from 'lucide-react';

const SignatureLibrary = ({ 
  savedSignatures, 
  selectedPreviewSignature, 
  onPreviewSelect, 
  onDeleteSignature 
}) => {
  const getSignatureTypeIcon = (type) => {
    switch (type) {
      case "drawn": return PenTool;
      case "uploaded": return Upload;
      case "typed": return Type;
      default: return PenTool;
    }
  };

  const getTypeColor = (type) => {
    switch (type) {
      case "drawn": return "text-blue-600";
      case "uploaded": return "text-green-600";
      case "typed": return "text-purple-600";
      default: return "text-gray-600";
    }
  };

  const getTypeBadgeColor = (type) => {
    switch (type) {
      case "drawn": return "bg-blue-100 text-blue-800";
      case "uploaded": return "bg-green-100 text-green-800";
      case "typed": return "bg-purple-100 text-purple-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <div className="w-64 bg-gray-50 border-l border-gray-200 flex flex-col h-full">
      {/* Header */}
      <div className="px-4 py-3 border-b border-gray-200 bg-white">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-1.5">
            <Library className="w-4 h-4 text-blue-600" />
            <h3 className="font-semibold text-gray-900 text-sm">Signature Library</h3>
          </div>
          <span className="bg-blue-100 text-blue-800 text-xs px-1.5 py-0.5 rounded-full font-medium">
            {savedSignatures.length}
          </span>
        </div>
        <p className="text-xs text-gray-500 mt-0.5">Your saved signatures</p>
      </div>
      
      {/* Content - Scrollable */}
      <div className="flex-1 overflow-y-auto p-3">
        {savedSignatures.length === 0 ? (
          <div className="text-center py-8">
            <div className="w-12 h-12 bg-gray-200 rounded-full flex items-center justify-center mx-auto mb-3">
              <PenTool className="w-6 h-6 text-gray-400" />
            </div>
            <p className="text-xs text-gray-500 mb-1">No signatures yet</p>
            <p className="text-xs text-gray-400">Create and save signatures to build your library</p>
          </div>
        ) : (
          <div className="space-y-2">
            {savedSignatures.map((signature) => {
              const Icon = getSignatureTypeIcon(signature.type);
              const isSelected = selectedPreviewSignature?.id === signature.id;
              
              return (
                <div
                  key={signature.id}
                  className={`relative group border rounded-lg p-3 cursor-pointer transition-all duration-200 ${
                    isSelected
                      ? 'border-blue-500 bg-blue-50 shadow-md'
                      : 'border-gray-200 bg-white hover:border-gray-300 hover:shadow-sm'
                  }`}
                  onClick={() => onPreviewSelect(signature)}
                >
                  {/* Signature Preview */}
                  <div className="h-12 mb-2 bg-gray-50 rounded border flex items-center justify-center overflow-hidden">
                    <img
                      src={signature.data}
                      alt="Saved signature"
                      className="max-h-full max-w-full object-contain"
                    />
                  </div>
                  
                  {/* Signature Info */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-1.5">
                      <span className={`inline-flex items-center px-1.5 py-0.5 rounded text-xs font-medium ${getTypeBadgeColor(signature.type)}`}>
                        <Icon className="w-2.5 h-2.5 mr-1" />
                        {signature.type.charAt(0).toUpperCase() + signature.type.slice(1)}
                      </span>
                    </div>
                    <span className="text-xs text-gray-400">
                      {new Date(signature.createdAt).toLocaleDateString('en-US', { 
                        month: 'short', 
                        day: 'numeric' 
                      })}
                    </span>
                  </div>
                  
                  {/* Delete Button */}
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onDeleteSignature(signature.id);
                    }}
                    className="absolute top-1.5 right-1.5 w-5 h-5 bg-red-500 hover:bg-red-600 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-200"
                    title="Delete signature"
                  >
                    <Trash2 className="w-2.5 h-2.5 text-white" />
                  </button>
                  
                  {/* Selection Indicator */}
                  {isSelected && (
                    <div className="absolute -top-1 -right-1 w-5 h-5 bg-blue-600 rounded-full flex items-center justify-center">
                      <Check className="w-2.5 h-2.5 text-white" />
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default SignatureLibrary;