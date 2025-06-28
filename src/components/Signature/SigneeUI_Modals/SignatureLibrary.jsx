import React from 'react';
import { Trash2, Check, PenTool, Upload, Type, Library, Calendar } from 'lucide-react';

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
      case "drawn": return "bg-blue-500";
      case "uploaded": return "bg-green-500";
      case "typed": return "bg-purple-500";
      default: return "bg-gray-500";
    }
  };

  return (
    <div className="w-72 bg-white border-l border-gray-200 flex flex-col h-full">
      {/* Header */}
      <div className="p-4 border-b border-gray-200 bg-gray-50">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Library className="w-5 h-5 text-CloudbyzBlue" />
            <h3 className="font-semibold text-gray-800">Signature Library</h3>
          </div>
          <span className="bg-CloudbyzBlue text-white text-xs px-2 py-1 rounded-full font-medium">
            {savedSignatures.length}
          </span>
        </div>
        <p className="text-xs text-gray-500 mt-1">Your saved signatures</p>
      </div>
      
      {/* Content */}
      <div className="flex-1 overflow-y-auto p-3">
        {savedSignatures.length === 0 ? (
          <div className="text-center py-8">
            <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-3">
              <PenTool className="w-6 h-6 text-gray-400" />
            </div>
            <p className="text-sm text-gray-500 mb-1">No signatures yet</p>
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
                      ? 'border-CloudbyzBlue bg-blue-50 shadow-sm'
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
                    <div className="flex items-center space-x-2">
                      <div className={`w-4 h-4 rounded ${getTypeColor(signature.type)} flex items-center justify-center`}>
                        <Icon className="w-2.5 h-2.5 text-white" />
                      </div>
                      <span className="text-xs font-medium text-gray-700 capitalize">
                        {signature.type}
                      </span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <Calendar className="w-3 h-3 text-gray-400" />
                      <span className="text-xs text-gray-400">
                        {new Date(signature.createdAt).toLocaleDateString('en-US', { 
                          month: 'short', 
                          day: 'numeric' 
                        })}
                      </span>
                    </div>
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
                    <div className="absolute -top-1 -right-1 w-5 h-5 bg-CloudbyzBlue rounded-full flex items-center justify-center">
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