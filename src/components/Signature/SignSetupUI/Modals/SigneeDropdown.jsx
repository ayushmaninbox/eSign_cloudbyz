import React, { useState } from 'react';
import { ChevronDown, User } from 'lucide-react';

const SigneeDropdown = ({ signees, selectedSignee, onSigneeChange, signInOrder }) => {
  const [isOpen, setIsOpen] = useState(false);

  const recipientColors = [
    "#009edb",
    "#10B981", 
    "#F97316",
    "#8B5CF6",
    "#EC4899",
    "#14B8A6",
    "#EF4444",
  ];

  // Sort signees based on sign in order preference
  const sortedSignees = signInOrder 
    ? signees // Keep original order if sign in order is enabled
    : [...signees].sort((a, b) => a.name.localeCompare(b.name)); // Alphabetical if not

  const getSigneeColor = (index) => {
    return recipientColors[index % recipientColors.length];
  };

  const selectedSigneeIndex = signees.findIndex(s => s.name === selectedSignee?.name);
  const selectedColor = selectedSigneeIndex >= 0 ? getSigneeColor(selectedSigneeIndex) : recipientColors[0];

  const truncateName = (name, maxLength = 20) => {
    if (name.length <= maxLength) return name;
    return name.substring(0, maxLength) + '...';
  };

  return (
    <div className="relative">
      <div
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between px-3 py-2.5 bg-white border border-gray-200 rounded-lg hover:border-gray-300 focus:border-CloudbyzBlue focus:ring-1 focus:ring-CloudbyzBlue transition-all duration-200 cursor-pointer"
      >
        <div className="flex items-center gap-3 min-w-0 flex-1">
          <div 
            className="w-4 h-4 rounded-full border-2 border-white shadow-sm flex-shrink-0"
            style={{ backgroundColor: selectedColor }}
          />
          <div className="text-left min-w-0 flex-1">
            <div className="text-sm font-medium text-gray-800 truncate">
              {selectedSignee ? truncateName(selectedSignee.name) : 'Select Signee'}
            </div>
            {selectedSignee && (
              <div className="text-xs text-gray-500 truncate">{selectedSignee.email}</div>
            )}
          </div>
        </div>
        <ChevronDown className={`w-4 h-4 text-gray-500 transition-transform duration-200 flex-shrink-0 ml-2 ${isOpen ? 'rotate-180' : ''}`} />
      </div>

      {isOpen && (
        <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-200 rounded-lg shadow-lg z-50 max-h-64 overflow-y-auto">
          {sortedSignees.map((signee, index) => {
            const originalIndex = signees.findIndex(s => s.name === signee.name);
            const color = getSigneeColor(originalIndex);
            
            return (
              <button
                key={signee.name}
                onClick={() => {
                  onSigneeChange(signee);
                  setIsOpen(false);
                }}
                className={`w-full flex items-center gap-3 px-4 py-3 text-left hover:bg-gray-50 transition-colors ${
                  selectedSignee?.name === signee.name ? 'bg-blue-50' : ''
                }`}
              >
                <div 
                  className="w-4 h-4 rounded-full border-2 border-white shadow-sm flex-shrink-0"
                  style={{ backgroundColor: color }}
                />
                <div className="min-w-0 flex-1">
                  <div className="text-sm font-medium text-gray-800 truncate">{signee.name}</div>
                  <div className="text-xs text-gray-500 truncate">{signee.email}</div>
                </div>
                {signInOrder && (
                  <div className="text-xs text-gray-400 bg-gray-100 px-2 py-1 rounded-full flex-shrink-0">
                    #{originalIndex + 1}
                  </div>
                )}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default SigneeDropdown;