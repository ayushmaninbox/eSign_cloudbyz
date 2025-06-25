import React, { useState } from 'react';
import { X, Bold, Italic, Underline } from 'lucide-react';

const TextModal = ({ isOpen, onClose, onSave }) => {
  const [text, setText] = useState("");
  const [selectedColor, setSelectedColor] = useState("#000000");
  const [isBold, setIsBold] = useState(false);
  const [isItalic, setIsItalic] = useState(false);
  const [isUnderline, setIsUnderline] = useState(false);

  const colors = ["#000000", "#FF0000", "#00FF00", "#0000FF"];

  const handleSave = () => {
    if (!text.trim()) {
      alert("Please enter some text");
      return;
    }

    onSave({
      text: text.trim(),
      color: selectedColor,
      bold: isBold,
      italic: isItalic,
      underline: isUnderline,
    });
  };

  const getPreviewStyle = () => {
    let style = { color: selectedColor };
    let className = "";

    if (isBold) className += "font-bold ";
    if (isItalic) className += "italic ";
    if (isUnderline) style.textDecoration = "underline";

    return { style, className };
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-hidden">
        <div className="bg-gradient-to-r from-CloudbyzBlue/10 to-CloudbyzBlue/5 border-b border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold text-gray-800">Add Text</h2>
            <button
              onClick={onClose}
              className="w-8 h-8 rounded-full bg-red-100 hover:bg-red-200 flex items-center justify-center transition-colors group"
            >
              <X className="w-4 h-4 text-red-600 group-hover:text-red-700" />
            </button>
          </div>
        </div>

        <div className="p-6">
          {/* Text Input */}
          <div className="mb-4">
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Text Content (Max 100 characters)
            </label>
            <textarea
              value={text}
              onChange={(e) => setText(e.target.value.slice(0, 100))}
              className="w-full border border-gray-300 rounded-lg focus:border-CloudbyzBlue focus:ring-2 focus:ring-CloudbyzBlue/20 transition-all resize-none p-3 text-sm"
              placeholder="Enter your text here..."
              rows={3}
              maxLength={100}
            />
            <div className="text-right text-gray-500 mt-1 text-xs">
              {text.length}/100 characters
            </div>
          </div>

          {/* Text Formatting */}
          <div className="mb-4">
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Text Formatting
            </label>
            <div className="flex gap-2">
              <button
                onClick={() => setIsBold(!isBold)}
                className={`border rounded-lg transition-all p-2 ${
                  isBold
                    ? "border-CloudbyzBlue bg-CloudbyzBlue/10 text-CloudbyzBlue"
                    : "border-gray-300 hover:border-gray-400"
                }`}
                title="Bold"
              >
                <Bold className="w-4 h-4" />
              </button>
              <button
                onClick={() => setIsItalic(!isItalic)}
                className={`border rounded-lg transition-all p-2 ${
                  isItalic
                    ? "border-CloudbyzBlue bg-CloudbyzBlue/10 text-CloudbyzBlue"
                    : "border-gray-300 hover:border-gray-400"
                }`}
                title="Italic"
              >
                <Italic className="w-4 h-4" />
              </button>
              <button
                onClick={() => setIsUnderline(!isUnderline)}
                className={`border rounded-lg transition-all p-2 ${
                  isUnderline
                    ? "border-CloudbyzBlue bg-CloudbyzBlue/10 text-CloudbyzBlue"
                    : "border-gray-300 hover:border-gray-400"
                }`}
                title="Underline"
              >
                <Underline className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Color Selection */}
          <div className="mb-6">
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Text Color
            </label>
            <div className="flex gap-3">
              {colors.map((color) => (
                <button
                  key={color}
                  onClick={() => setSelectedColor(color)}
                  className={`w-8 h-8 rounded-full border-2 transition-all ${
                    selectedColor === color
                      ? "border-gray-800 scale-110"
                      : "border-gray-300"
                  }`}
                  style={{ backgroundColor: color }}
                />
              ))}
            </div>
          </div>

          {/* Preview */}
          {text && (
            <div className="mb-6">
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Preview
              </label>
              <div className="border border-gray-200 rounded-lg bg-gray-50 flex items-center p-4 min-h-[60px]">
                <span
                  className={getPreviewStyle().className}
                  style={getPreviewStyle().style}
                >
                  {text}
                </span>
              </div>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex justify-end gap-3">
            <button
              onClick={handleSave}
              className="bg-CloudbyzBlue text-white rounded-lg hover:bg-CloudbyzBlue/90 transition-colors px-6 py-3 text-sm"
            >
              Add Text
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TextModal;