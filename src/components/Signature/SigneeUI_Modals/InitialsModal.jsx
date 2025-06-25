import React, { useState, useEffect } from 'react';
import { X } from 'lucide-react';

const InitialsModal = ({ isOpen, onClose, onSave }) => {
  const [selectedColor, setSelectedColor] = useState("#000000");
  const [selectedStyle, setSelectedStyle] = useState("normal");
  const [initialsText, setInitialsText] = useState("JD");

  const colors = ["#000000", "#FF0000", "#00FF00", "#0000FF"];
  const styles = [
    { value: "normal", label: "Normal", style: "font-normal" },
    { value: "bold", label: "Bold", style: "font-bold" },
    { value: "italic", label: "Italic", style: "italic" },
    { value: "bold-italic", label: "Bold Italic", style: "font-bold italic" },
  ];

  // Load saved initials from session storage when modal opens
  useEffect(() => {
    if (isOpen) {
      const savedInitials = sessionStorage.getItem("sessionInitials");
      if (savedInitials) {
        const initialsData = JSON.parse(savedInitials);
        setInitialsText(initialsData.text || "JD");
        setSelectedColor(initialsData.color || "#000000");
        setSelectedStyle(initialsData.style || "normal");
      }
    }
  }, [isOpen]);

  const handleSave = () => {
    const initialsData = {
      text: initialsText,
      color: selectedColor,
      style: selectedStyle,
    };

    // Save initials to session storage (persists until browser tab is closed)
    sessionStorage.setItem("sessionInitials", JSON.stringify(initialsData));

    onSave(initialsData);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-hidden">
        <div className="bg-gradient-to-r from-CloudbyzBlue/10 to-CloudbyzBlue/5 border-b border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold text-gray-800">
              Create Your Initials
            </h2>
            <button
              onClick={onClose}
              className="w-8 h-8 rounded-full bg-red-100 hover:bg-red-200 flex items-center justify-center transition-colors group"
            >
              <X className="w-4 h-4 text-red-600 group-hover:text-red-700" />
            </button>
          </div>
        </div>

        <div className="p-6">
          {/* Initials Text */}
          <div className="mb-4">
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Initials Text
            </label>
            <input
              type="text"
              value={initialsText}
              onChange={(e) =>
                setInitialsText(e.target.value.toUpperCase().slice(0, 3))
              }
              className="w-full border border-gray-300 rounded-lg focus:border-CloudbyzBlue focus:ring-2 focus:ring-CloudbyzBlue/20 transition-all p-3 text-sm"
              placeholder="Enter initials"
              maxLength={3}
            />
          </div>

          {/* Style Selection */}
          <div className="mb-4">
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Text Style
            </label>
            <div className="grid grid-cols-2 gap-2">
              {styles.map((style) => (
                <button
                  key={style.value}
                  onClick={() => setSelectedStyle(style.value)}
                  className={`border rounded-lg transition-all p-3 text-sm ${
                    selectedStyle === style.value
                      ? "border-CloudbyzBlue bg-CloudbyzBlue/10 text-CloudbyzBlue"
                      : "border-gray-300 hover:border-gray-400"
                  }`}
                >
                  <span className={style.style}>{style.label}</span>
                </button>
              ))}
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
          <div className="mb-6">
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Preview
            </label>
            <div className="border border-gray-200 rounded-lg bg-gray-50 text-center p-4">
              <span
                className={`${
                  styles.find((s) => s.value === selectedStyle)?.style
                } text-2xl`}
                style={{ color: selectedColor }}
              >
                {initialsText}
              </span>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex justify-end gap-3">
            <button
              onClick={handleSave}
              className="bg-CloudbyzBlue text-white rounded-lg hover:bg-CloudbyzBlue/90 transition-colors px-6 py-3 text-sm"
            >
              Save Initials
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default InitialsModal;