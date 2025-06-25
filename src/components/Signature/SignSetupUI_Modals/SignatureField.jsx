import React from 'react';
import { PenTool, Type, FileText, User, X } from 'lucide-react';

const SignatureField = ({ field, onRemove, canvasWidth, canvasHeight, signeeColor }) => {
  const getFieldIcon = () => {
    switch (field.type) {
      case 'signature':
        return <PenTool className="w-4 h-4 text-gray-600" />;
      case 'initials':
        return <Type className="w-4 h-4 text-gray-600" />;
      case 'title':
        return <FileText className="w-4 h-4 text-gray-600" />;
      case 'customText':
        return <Type className="w-4 h-4 text-gray-600" />;
      default:
        return <PenTool className="w-4 h-4 text-gray-600" />;
    }
  };

  const getFieldDisplayName = () => {
    switch (field.type) {
      case 'signature':
        return 'Signature';
      case 'initials':
        return 'Initials';
      case 'title':
        return 'Text';
      case 'customText':
        return 'Pre-filled Text';
      default:
        return 'Signature';
    }
  };

  const truncateName = (name, maxLength = 15) => {
    if (name.length <= maxLength) return name;
    return name.substring(0, maxLength) + '...';
  };

  // Calculate actual position and size based on canvas dimensions and stored percentages
  const actualX = (field.xPercent / 100) * canvasWidth;
  const actualY = (field.yPercent / 100) * canvasHeight;
  const actualWidth = (field.widthPercent / 100) * canvasWidth;
  const actualHeight = (field.heightPercent / 100) * canvasHeight;

  const renderFieldContent = () => {
    if (field.type === 'customText') {
      const textStyle = {
        color: field.customTextData?.color === 'black' ? '#000000' :
               field.customTextData?.color === 'red' ? '#DC2626' :
               field.customTextData?.color === 'green' ? '#16A34A' :
               field.customTextData?.color === 'blue' ? '#2563EB' : '#000000',
        fontWeight: field.customTextData?.isBold ? 'bold' : 'normal',
        fontStyle: field.customTextData?.isItalic ? 'italic' : 'normal',
        textDecoration: field.customTextData?.isUnderline ? 'underline' : 'none'
      };

      return (
        <div className="flex items-center justify-center h-full w-full px-2 py-1">
          <div 
            className="text-sm break-words text-center leading-tight w-full"
            style={textStyle}
          >
            {field.customTextData?.text || 'Pre-filled Text'}
          </div>
        </div>
      );
    }

    return (
      <div className="flex items-center justify-center h-full">
        <div className="flex items-center space-x-2">
          {getFieldIcon()}
          <span className="text-sm font-medium text-gray-700">{getFieldDisplayName()}</span>
        </div>
      </div>
    );
  };

  return (
    <div
      className="absolute bg-blue-100/80 border-2 border-blue-400 select-none shadow-lg backdrop-blur-sm transition-all duration-300"
      style={{
        left: actualX,
        top: actualY,
        width: actualWidth,
        height: actualHeight,
        zIndex: 20,
      }}
    >
      {/* Assignee name - only show for non-customText fields */}
      {field.type !== 'customText' && (
        <div 
          className="absolute px-2 py-1 text-xs font-medium text-white flex items-center shadow-sm z-10"
          style={{ 
            background: `linear-gradient(135deg, ${signeeColor}, ${signeeColor}dd)` 
          }}
        >
          <User className="w-3 h-3 mr-1" />
          {truncateName(field.assignee)}
        </div>
      )}

      {/* Close button - top right */}
      <button
        onClick={(e) => {
          e.stopPropagation();
          onRemove(field.id);
        }}
        className="absolute -top-3 -right-3 w-7 h-7 bg-red-500 hover:bg-red-600 rounded-full flex items-center justify-center transition-all duration-200 shadow-lg hover:shadow-xl hover:scale-110 z-30"
      >
        <X className="w-3.5 h-3.5 text-white" />
      </button>

      {/* Field content */}
      {renderFieldContent()}

      {/* Resize handle - bottom right (only for non-custom text fields) */}
      {field.type !== 'customText' && (
        <div className="absolute bottom-0 right-0 w-4 h-4 bg-blue-600 cursor-se-resize opacity-80 hover:opacity-100 transition-opacity">
        </div>
      )}
    </div>
  );
};

export default SignatureField;