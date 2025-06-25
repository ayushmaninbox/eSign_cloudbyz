import React, { useState } from 'react';
import { X, Type, Bold, Italic, Underline, Palette } from 'lucide-react';

const PrefilledTextModal = ({ isOpen, onClose, onSave, selectedSignee }) => {
  const [text, setText] = useState('');
  const [color, setColor] = useState('black');
  const [isBold, setIsBold] = useState(false);
  const [isItalic, setIsItalic] = useState(false);
  const [isUnderline, setIsUnderline] = useState(false);

  const colors = [
    { name: 'Black', value: 'black', hex: '#000000' },
    { name: 'Red', value: 'red', hex: '#DC2626' },
    { name: 'Green', value: 'green', hex: '#16A34A' },
    { name: 'Blue', value: 'blue', hex: '#2563EB' }
  ];

  const handleSave = () => {
    if (!text.trim()) return;
    
    const customTextData = {
      text: text.trim(),
      color,
      isBold,
      isItalic,
      isUnderline
    };
    
    onSave(customTextData);
    handleClose();
  };

  const handleClose = () => {
    setText('');
    setColor('black');
    setIsBold(false);
    setIsItalic(false);
    setIsUnderline(false);
    onClose();
  };

  const getPreviewStyle = () => {
    return {
      color: colors.find(c => c.value === color)?.hex || '#000000',
      fontWeight: isBold ? 'bold' : 'normal',
      fontStyle: isItalic ? 'italic' : 'normal',
      textDecoration: isUnderline ? 'underline' : 'none'
    };
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden">
        <div className="bg-gradient-to-r from-CloudbyzBlue/10 to-CloudbyzBlue/5 px-6 py-4 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold text-gray-800">Pre-filled Text</h2>
            <button
              onClick={handleClose}
              className="p-2 hover:bg-red-100 rounded-full transition-colors"
            >
              <X className="w-5 h-5 text-red-500" />
            </button>
          </div>
          {selectedSignee && (
            <p className="text-sm text-gray-600 mt-2">
              Adding text for: <span className="font-medium">{selectedSignee.name}</span>
            </p>
          )}
        </div>

        <div className="p-6 space-y-6">
          {/* Text Input */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-3">
              Enter your text (max 100 characters)
            </label>
            <textarea
              value={text}
              onChange={(e) => setText(e.target.value.slice(0, 100))}
              placeholder="Type your custom text here..."
              className="w-full px-3 py-3 border border-gray-300 rounded-lg focus:border-CloudbyzBlue focus:ring-1 focus:ring-CloudbyzBlue resize-none text-sm"
              rows={3}
              maxLength={100}
            />
            <div className="text-xs text-gray-500 mt-1 text-right">
              {text.length}/100 characters
            </div>
          </div>

          {/* Color Selection */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-3">
              Text Color
            </label>
            <div className="flex gap-3">
              {colors.map((colorOption) => (
                <button
                  key={colorOption.value}
                  onClick={() => setColor(colorOption.value)}
                  className={`flex items-center gap-2 px-3 py-2 rounded-lg border-2 transition-all ${
                    color === colorOption.value
                      ? 'border-CloudbyzBlue bg-CloudbyzBlue/10'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <div
                    className="w-4 h-4 rounded-full border border-gray-300"
                    style={{ backgroundColor: colorOption.hex }}
                  />
                  <span className="text-sm">{colorOption.name}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Formatting Options */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-3">
              Text Formatting
            </label>
            <div className="flex gap-2">
              <button
                onClick={() => setIsBold(!isBold)}
                className={`p-2 rounded-lg border-2 transition-all ${
                  isBold
                    ? 'border-CloudbyzBlue bg-CloudbyzBlue/10 text-CloudbyzBlue'
                    : 'border-gray-200 hover:border-gray-300 text-gray-600'
                }`}
                title="Bold"
              >
                <Bold className="w-4 h-4" />
              </button>
              <button
                onClick={() => setIsItalic(!isItalic)}
                className={`p-2 rounded-lg border-2 transition-all ${
                  isItalic
                    ? 'border-CloudbyzBlue bg-CloudbyzBlue/10 text-CloudbyzBlue'
                    : 'border-gray-200 hover:border-gray-300 text-gray-600'
                }`}
                title="Italic"
              >
                <Italic className="w-4 h-4" />
              </button>
              <button
                onClick={() => setIsUnderline(!isUnderline)}
                className={`p-2 rounded-lg border-2 transition-all ${
                  isUnderline
                    ? 'border-CloudbyzBlue bg-CloudbyzBlue/10 text-CloudbyzBlue'
                    : 'border-gray-200 hover:border-gray-300 text-gray-600'
                }`}
                title="Underline"
              >
                <Underline className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Preview */}
          {text && (
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-3">
                Preview
              </label>
              <div className="p-4 bg-gray-50 rounded-lg border">
                <p style={getPreviewStyle()} className="text-base">
                  {text}
                </p>
              </div>
            </div>
          )}
        </div>

        <div className="bg-gray-50 px-6 py-4 border-t border-gray-200 flex justify-end gap-3">
          <button
            onClick={handleSave}
            disabled={!text.trim()}
            className={`px-6 py-2 rounded-lg font-semibold transition-colors ${
              text.trim()
                ? 'bg-CloudbyzBlue text-white hover:bg-CloudbyzBlue/90'
                : 'bg-gray-300 text-gray-500 cursor-not-allowed'
            }`}
          >
            Add Text
          </button>
        </div>
      </div>
    </div>
  );
};

export default PrefilledTextModal;