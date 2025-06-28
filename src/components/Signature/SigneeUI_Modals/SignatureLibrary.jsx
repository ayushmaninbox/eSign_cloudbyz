import React from 'react';
import { Trash2, Check, PenTool, Upload, Type, Sparkles, Calendar } from 'lucide-react';

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
      case "drawn": return "text-blue-600 bg-blue-50";
      case "uploaded": return "text-green-600 bg-green-50";
      case "typed": return "text-purple-600 bg-purple-50";
      default: return "text-gray-600 bg-gray-50";
    }
  };

  return (
    <div className="w-80 border-l border-gray-200/50 bg-gradient-to-br from-slate-50 via-white to-blue-50/30 flex flex-col h-full">
      {/* Header */}
      <div className="p-6 border-b border-gray-200/50 bg-gradient-to-r from-white to-blue-50/50">
        <div className="flex items-center justify-between mb-2">
          <h3 className="text-lg font-bold text-gray-800 flex items-center">
            <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center mr-3">
              <Sparkles className="w-4 h-4 text-white" />
            </div>
            Signature Library
          </h3>
          <div className="px-3 py-1 bg-gradient-to-r from-blue-500 to-purple-600 text-white text-xs font-bold rounded-full shadow-sm">
            {savedSignatures.length}
          </div>
        </div>
        <p className="text-sm text-gray-500">Your saved signatures</p>
      </div>
      
      {/* Content */}
      <div className="flex-1 overflow-y-auto p-4">
        {savedSignatures.length === 0 ? (
          <div className="text-center py-8">
            <div className="w-16 h-16 bg-gradient-to-br from-blue-100 to-purple-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <PenTool className="w-8 h-8 text-blue-500" />
            </div>
            <h4 className="text-base font-semibold text-gray-700 mb-2">No signatures yet</h4>
            <p className="text-sm text-gray-500 leading-relaxed px-4">
              Create and save signatures to build your personal library
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {savedSignatures.map((signature) => {
              const Icon = getSignatureTypeIcon(signature.type);
              const isSelected = selectedPreviewSignature?.id === signature.id;
              
              return (
                <div
                  key={signature.id}
                  className={`relative group border-2 rounded-xl p-3 cursor-pointer transition-all duration-300 ${
                    isSelected
                      ? 'border-blue-400 bg-gradient-to-br from-blue-50 to-purple-50 shadow-lg transform scale-[1.02]'
                      : 'border-gray-200 bg-white hover:border-blue-300 hover:shadow-md hover:transform hover:scale-[1.01]'
                  }`}
                  onClick={() => onPreviewSelect(signature)}
                >
                  {/* Signature Preview */}
                  <div className="h-16 mb-3 bg-gradient-to-br from-gray-50 to-gray-100 rounded-lg flex items-center justify-center overflow-hidden">
                    <img
                      src={signature.data}
                      alt="Saved signature"
                      className="max-h-full max-w-full object-contain"
                    />
                  </div>
                  
                  {/* Signature Info */}
                  <div className="flex items-center justify-between mb-2">
                    <div className={`flex items-center gap-2 px-2 py-1 rounded-lg ${getTypeColor(signature.type)}`}>
                      <Icon className="w-3 h-3" />
                      <span className="text-xs font-medium capitalize">
                        {signature.type}
                      </span>
                    </div>
                    <div className="flex items-center gap-1 text-xs text-gray-400">
                      <Calendar className="w-3 h-3" />
                      {new Date(signature.createdAt).toLocaleDateString('en-US', { 
                        month: 'short', 
                        day: 'numeric' 
                      })}
                    </div>
                  </div>
                  
                  {/* Action Buttons */}
                  <div className="flex items-center justify-end gap-1">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onDeleteSignature(signature.id);
                      }}
                      className="w-7 h-7 bg-red-500 hover:bg-red-600 rounded-lg flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-200 shadow-sm hover:shadow-md transform hover:scale-110"
                      title="Delete signature"
                    >
                      <Trash2 className="w-3 h-3 text-white" />
                    </button>
                  </div>
                  
                  {/* Selection Indicator */}
                  {isSelected && (
                    <div className="absolute -top-1 -right-1 w-6 h-6 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center shadow-lg">
                      <Check className="w-3 h-3 text-white" />
                    </div>
                  )}
                  
                  {/* Glow Effect for Selected */}
                  {isSelected && (
                    <div className="absolute inset-0 rounded-xl bg-gradient-to-br from-blue-400/20 to-purple-400/20 pointer-events-none"></div>
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