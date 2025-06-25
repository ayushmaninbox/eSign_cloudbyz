import React, { useState } from 'react';
import { X, Type, Save } from 'lucide-react';

const TextModal = ({ isOpen, onClose, onSave, placeholder = "Enter text" }) => {
  const [text, setText] = useState('');

  const handleSave = () => {
    if (text.trim()) {
      onSave({
        type: 'text',
        data: text.trim()
      });
      handleClose();
    }
  };

  const handleClose = () => {
    setText('');
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden">
        <div className="bg-gradient-to-r from-CloudbyzBlue/10 to-CloudbyzBlue/5 px-6 py-4 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold text-gray-800 flex items-center">
              <Type className="w-5 h-5 mr-2" />
              Add Text
            </h2>
            <button
              onClick={handleClose}
              className="p-2 hover:bg-red-100 rounded-full transition-colors"
            >
              <X className="w-5 h-5 text-red-500" />
            </button>
          </div>
        </div>

        <div className="p-6">
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-3">
              Enter your text
            </label>
            <textarea
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder={placeholder}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-CloudbyzBlue focus:border-CloudbyzBlue resize-none"
              rows={4}
              maxLength={500}
            />
            <div className="text-xs text-gray-500 mt-1 text-right">
              {text.length}/500 characters
            </div>
          </div>

          <div className="flex justify-end space-x-3">
            <button
              onClick={handleClose}
              className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleSave}
              disabled={!text.trim()}
              className={`flex items-center space-x-2 px-6 py-2 rounded-lg font-semibold transition-colors ${
                !text.trim()
                  ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                  : 'bg-CloudbyzBlue text-white hover:bg-CloudbyzBlue/90'
              }`}
            >
              <Save className="w-4 h-4" />
              <span>Save Text</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TextModal;