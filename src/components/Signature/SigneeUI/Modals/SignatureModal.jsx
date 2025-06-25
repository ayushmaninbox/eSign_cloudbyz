import React, { useState, useRef, useEffect } from 'react';
import { X, PenTool, Type, Upload, RotateCcw, Check } from 'lucide-react';

const SignatureModal = ({ isOpen, onClose, onSave, fieldType = 'signature' }) => {
  const [activeTab, setActiveTab] = useState('draw');
  const [drawnSignature, setDrawnSignature] = useState(null);
  const [typedText, setTypedText] = useState('');
  const [selectedFont, setSelectedFont] = useState('cursive');
  const [uploadedImage, setUploadedImage] = useState(null);
  const [isDrawing, setIsDrawing] = useState(false);
  
  const canvasRef = useRef(null);
  const fileInputRef = useRef(null);

  const fonts = [
    { name: 'Cursive', value: 'cursive', style: { fontFamily: 'cursive' } },
    { name: 'Elegant', value: 'serif', style: { fontFamily: 'serif', fontStyle: 'italic' } },
    { name: 'Modern', value: 'sans-serif', style: { fontFamily: 'sans-serif', fontWeight: 'bold' } },
    { name: 'Classic', value: 'monospace', style: { fontFamily: 'monospace' } }
  ];

  useEffect(() => {
    if (isOpen && canvasRef.current) {
      const canvas = canvasRef.current;
      const ctx = canvas.getContext('2d');
      ctx.strokeStyle = '#000';
      ctx.lineWidth = 2;
      ctx.lineCap = 'round';
      ctx.lineJoin = 'round';
    }
  }, [isOpen]);

  const startDrawing = (e) => {
    setIsDrawing(true);
    const canvas = canvasRef.current;
    const rect = canvas.getBoundingClientRect();
    const ctx = canvas.getContext('2d');
    
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    ctx.beginPath();
    ctx.moveTo(x, y);
  };

  const draw = (e) => {
    if (!isDrawing) return;
    
    const canvas = canvasRef.current;
    const rect = canvas.getBoundingClientRect();
    const ctx = canvas.getContext('2d');
    
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    ctx.lineTo(x, y);
    ctx.stroke();
  };

  const stopDrawing = () => {
    if (isDrawing) {
      setIsDrawing(false);
      const canvas = canvasRef.current;
      setDrawnSignature(canvas.toDataURL());
    }
  };

  const clearCanvas = () => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    setDrawnSignature(null);
  };

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (file && file.type.startsWith('image/')) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setUploadedImage(e.target.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSave = () => {
    let signatureData = null;
    
    switch (activeTab) {
      case 'draw':
        if (drawnSignature) {
          signatureData = {
            type: 'drawn',
            data: drawnSignature
          };
        }
        break;
      case 'type':
        if (typedText.trim()) {
          signatureData = {
            type: 'typed',
            data: typedText.trim(),
            font: selectedFont
          };
        }
        break;
      case 'upload':
        if (uploadedImage) {
          signatureData = {
            type: 'uploaded',
            data: uploadedImage
          };
        }
        break;
    }
    
    if (signatureData) {
      onSave(signatureData);
      handleClose();
    }
  };

  const handleClose = () => {
    setActiveTab('draw');
    setDrawnSignature(null);
    setTypedText('');
    setUploadedImage(null);
    clearCanvas();
    onClose();
  };

  const getTitle = () => {
    switch (fieldType) {
      case 'initials':
        return 'Add Your Initials';
      case 'signature':
      default:
        return 'Add Your Signature';
    }
  };

  const getPlaceholder = () => {
    switch (fieldType) {
      case 'initials':
        return 'Type your initials';
      case 'signature':
      default:
        return 'Type your full name';
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl overflow-hidden">
        <div className="bg-gradient-to-r from-CloudbyzBlue/10 to-CloudbyzBlue/5 px-6 py-4 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold text-gray-800">{getTitle()}</h2>
            <button
              onClick={handleClose}
              className="p-2 hover:bg-red-100 rounded-full transition-colors"
            >
              <X className="w-5 h-5 text-red-500" />
            </button>
          </div>
        </div>

        <div className="p-6">
          {/* Tabs */}
          <div className="flex space-x-1 mb-6 bg-gray-100 rounded-lg p-1">
            <button
              onClick={() => setActiveTab('draw')}
              className={`flex-1 flex items-center justify-center space-x-2 py-2 px-4 rounded-md transition-colors ${
                activeTab === 'draw'
                  ? 'bg-white text-CloudbyzBlue shadow-sm'
                  : 'text-gray-600 hover:text-gray-800'
              }`}
            >
              <PenTool className="w-4 h-4" />
              <span>Draw</span>
            </button>
            <button
              onClick={() => setActiveTab('type')}
              className={`flex-1 flex items-center justify-center space-x-2 py-2 px-4 rounded-md transition-colors ${
                activeTab === 'type'
                  ? 'bg-white text-CloudbyzBlue shadow-sm'
                  : 'text-gray-600 hover:text-gray-800'
              }`}
            >
              <Type className="w-4 h-4" />
              <span>Type</span>
            </button>
            <button
              onClick={() => setActiveTab('upload')}
              className={`flex-1 flex items-center justify-center space-x-2 py-2 px-4 rounded-md transition-colors ${
                activeTab === 'upload'
                  ? 'bg-white text-CloudbyzBlue shadow-sm'
                  : 'text-gray-600 hover:text-gray-800'
              }`}
            >
              <Upload className="w-4 h-4" />
              <span>Upload</span>
            </button>
          </div>

          {/* Tab Content */}
          <div className="mb-6">
            {activeTab === 'draw' && (
              <div>
                <div className="border-2 border-gray-200 rounded-lg p-4 bg-gray-50">
                  <canvas
                    ref={canvasRef}
                    width={500}
                    height={200}
                    className="w-full h-48 bg-white rounded border cursor-crosshair"
                    onMouseDown={startDrawing}
                    onMouseMove={draw}
                    onMouseUp={stopDrawing}
                    onMouseLeave={stopDrawing}
                  />
                </div>
                <div className="flex justify-between items-center mt-4">
                  <p className="text-sm text-gray-600">Draw your signature in the box above</p>
                  <button
                    onClick={clearCanvas}
                    className="flex items-center space-x-2 px-3 py-1 text-sm text-gray-600 hover:text-gray-800 border border-gray-300 rounded-md hover:bg-gray-50 transition-colors"
                  >
                    <RotateCcw className="w-4 h-4" />
                    <span>Clear</span>
                  </button>
                </div>
              </div>
            )}

            {activeTab === 'type' && (
              <div>
                <input
                  type="text"
                  value={typedText}
                  onChange={(e) => setTypedText(e.target.value)}
                  placeholder={getPlaceholder()}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-CloudbyzBlue focus:border-CloudbyzBlue mb-4"
                />
                
                <div className="space-y-3">
                  <p className="text-sm font-medium text-gray-700">Choose a font style:</p>
                  {fonts.map((font) => (
                    <button
                      key={font.value}
                      onClick={() => setSelectedFont(font.value)}
                      className={`w-full p-4 text-left border-2 rounded-lg transition-colors ${
                        selectedFont === font.value
                          ? 'border-CloudbyzBlue bg-CloudbyzBlue/5'
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span
                          style={{ ...font.style, fontSize: '24px' }}
                          className="text-gray-800"
                        >
                          {typedText || font.name}
                        </span>
                        {selectedFont === font.value && (
                          <Check className="w-5 h-5 text-CloudbyzBlue" />
                        )}
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {activeTab === 'upload' && (
              <div>
                <div
                  onClick={() => fileInputRef.current?.click()}
                  className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-CloudbyzBlue hover:bg-CloudbyzBlue/5 transition-colors cursor-pointer"
                >
                  {uploadedImage ? (
                    <div>
                      <img
                        src={uploadedImage}
                        alt="Uploaded signature"
                        className="max-h-32 mx-auto mb-4"
                      />
                      <p className="text-sm text-gray-600">Click to change image</p>
                    </div>
                  ) : (
                    <div>
                      <Upload className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                      <p className="text-gray-600 mb-2">Click to upload an image</p>
                      <p className="text-sm text-gray-500">PNG, JPG up to 5MB</p>
                    </div>
                  )}
                </div>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleFileUpload}
                  className="hidden"
                />
              </div>
            )}
          </div>

          {/* Actions */}
          <div className="flex justify-end space-x-3">
            <button
              onClick={handleClose}
              className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleSave}
              disabled={
                (activeTab === 'draw' && !drawnSignature) ||
                (activeTab === 'type' && !typedText.trim()) ||
                (activeTab === 'upload' && !uploadedImage)
              }
              className={`px-6 py-2 rounded-lg font-semibold transition-colors ${
                (activeTab === 'draw' && !drawnSignature) ||
                (activeTab === 'type' && !typedText.trim()) ||
                (activeTab === 'upload' && !uploadedImage)
                  ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                  : 'bg-CloudbyzBlue text-white hover:bg-CloudbyzBlue/90'
              }`}
            >
              Save {fieldType === 'initials' ? 'Initials' : 'Signature'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SignatureModal;