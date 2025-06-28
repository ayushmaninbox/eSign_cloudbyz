import React from 'react';
import { Trash2, Check, PenTool, Upload, Type } from 'lucide-react';

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
    <div className="w-80 bg-gray-50 border-l border-gray-200 flex flex-col h-full">
      {/* Header */}
      <div className="px-6 py-4 border-b border-gray-200 bg-white">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <PenTool className="w-5 h-5 text-CloudbyzBlue" />
            <h3 className="font-semibold text-gray-900">Signature Library</h3>
          </div>
          <span className="bg-CloudbyzBlue/10 text-CloudbyzBlue text-xs px-2 py-1 rounded-full font-medium">
            {savedSignatures.length}
          </span>
        </div>
        <p className="text-sm text-gray-500 mt-1">Your saved signatures</p>
      </div>
      
      {/* Content - Scrollable */}
      <div className="flex-1 overflow-y-auto p-4">
        {savedSignatures.length === 0 ? (
          <div className="text-center py-12">
            <div className="w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center mx-auto mb-4">
              <PenTool className="w-8 h-8 text-gray-400" />
            </div>
            <p className="text-sm text-gray-500 mb-2">No signatures yet</p>
            <p className="text-xs text-gray-400">Create and save signatures to build your library</p>
          </div>
        ) : (
          <div className="space-y-3">
            {savedSignatures.map((signature) => {
              const Icon = getSignatureTypeIcon(signature.type);
              const isSelected = selectedPreviewSignature?.id === signature.id;
              
              return (
                <div
                  key={signature.id}
                  className={`relative group border rounded-lg p-4 cursor-pointer transition-all duration-200 ${
                    isSelected
                      ? 'border-CloudbyzBlue bg-CloudbyzBlue/5 shadow-md'
                      : 'border-gray-200 bg-white hover:border-gray-300 hover:shadow-sm'
                  }`}
                  onClick={() => onPreviewSelect(signature)}
                >
                  {/* Signature Preview */}
                  <div className="h-16 mb-3 bg-gray-50 rounded border flex items-center justify-center overflow-hidden">
                    <img
                      src={signature.data}
                      alt="Saved signature"
                      className="max-h-full max-w-full object-contain"
                    />
                  </div>
                  
                  {/* Signature Info */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <span className={`inline-flex items-center px-2 py-1 rounded text-xs font-medium ${getTypeBadgeColor(signature.type)}`}>
                        <Icon className="w-3 h-3 mr-1" />
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
                    className="absolute top-2 right-2 w-6 h-6 bg-red-500 hover:bg-red-600 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-200"
                    title="Delete signature"
                  >
                    <Trash2 className="w-3 h-3 text-white" />
                  </button>
                  
                  {/* Selection Indicator */}
                  {isSelected && (
                    <div className="absolute -top-2 -right-2 w-6 h-6 bg-CloudbyzBlue rounded-full flex items-center justify-center">
                      <Check className="w-3 h-3 text-white" />
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