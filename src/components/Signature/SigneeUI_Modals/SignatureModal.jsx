import React, { useState, useRef, useEffect } from 'react';
import { X, ChevronDown, PenTool, Upload, Type, Check, Sparkles, Palette, MousePointer, Zap } from 'lucide-react';
import SignatureLibrary from './SignatureLibrary';

const SignatureModal = ({ isOpen, onClose, onSave, defaultReason = "" }) => {
  const canvasRef = useRef(null);
  const fileInputRef = useRef(null);
  const dropdownRef = useRef(null);

  const [activeTab, setActiveTab] = useState("draw");
  const [isDrawing, setIsDrawing] = useState(false);
  const [selectedColor, setSelectedColor] = useState("#000000");
  const [uploadedImage, setUploadedImage] = useState(null);
  const [typedSignature, setTypedSignature] = useState("");
  const [selectedFont, setSelectedFont] = useState("cursive");
  const [savedSignatures, setSavedSignatures] = useState([]);
  const [selectedPreviewSignature, setSelectedPreviewSignature] = useState(null);

  // Reason selection states
  const [selectedReason, setSelectedReason] = useState("");
  const [showReasonDropdown, setShowReasonDropdown] = useState(false);
  const [signatureReasons, setSignatureReasons] = useState([]);
  const [localOtherReasons, setLocalOtherReasons] = useState([]);
  const [customReason, setCustomReason] = useState("");
  const [isCustomReason, setIsCustomReason] = useState(false);
  const [tempInputValue, setTempInputValue] = useState("");

  const colors = [
    { name: "Black", value: "#000000", bg: "bg-gray-900", ring: "ring-gray-900" },
    { name: "Blue", value: "#2563EB", bg: "bg-blue-600", ring: "ring-blue-600" },
    { name: "Green", value: "#059669", bg: "bg-emerald-600", ring: "ring-emerald-600" },
    { name: "Purple", value: "#7C3AED", bg: "bg-violet-600", ring: "ring-violet-600" },
    { name: "Red", value: "#DC2626", bg: "bg-red-600", ring: "ring-red-600" },
    { name: "Orange", value: "#EA580C", bg: "bg-orange-600", ring: "ring-orange-600" }
  ];

  const fonts = [
    { value: "cursive", label: "Elegant Script" },
    { value: "serif", label: "Classic Serif" },
    { value: "sans-serif", label: "Modern Sans" },
    { value: "monospace", label: "Typewriter" },
  ];

  // Load saved signatures from localStorage when modal opens
  useEffect(() => {
    if (isOpen) {
      const saved = localStorage.getItem('savedSignatures');
      if (saved) {
        setSavedSignatures(JSON.parse(saved));
      }
    }
  }, [isOpen]);

  // Save drawn signature to sessionStorage
  const saveDrawnSignatureToSession = () => {
    if (canvasRef.current) {
      const dataUrl = canvasRef.current.toDataURL();
      sessionStorage.setItem("drawnSignature", dataUrl);
    }
  };

  // Handle tab change with signature persistence
  const handleTabChange = (tab) => {
    if (activeTab === "draw") {
      saveDrawnSignatureToSession();
    }
    setActiveTab(tab);
    setSelectedPreviewSignature(null);
  };

  // Load saved signature from sessionStorage when modal opens or switching to draw tab
  useEffect(() => {
    if (isOpen && activeTab === "draw") {
      const savedSig = sessionStorage.getItem("drawnSignature");
      if (savedSig && canvasRef.current) {
        const ctx = canvasRef.current.getContext("2d");
        const img = new Image();
        img.onload = () => {
          ctx.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);
          ctx.drawImage(img, 0, 0, canvasRef.current.width, canvasRef.current.height);
        };
        img.src = savedSig;
      }
    }
  }, [isOpen, activeTab]);

  useEffect(() => {
    if (isOpen) {
      // Load local other reasons from localStorage
      const localReasons = localStorage.getItem("localOtherReasons");
      if (localReasons) {
        setLocalOtherReasons(JSON.parse(localReasons));
      }

      // Load signature reasons from backend
      fetch("http://localhost:5000/api/data")
        .then((response) => response.json())
        .then((data) => {
          setSignatureReasons(data.signatureReasons || []);
          if (defaultReason) {
            setSelectedReason(defaultReason);
          } else if (data.signatureReasons && data.signatureReasons.length > 0) {
            setSelectedReason(data.signatureReasons[0]);
          }
        })
        .catch((error) => console.error("Error fetching reasons:", error));

      const currentUserName = localStorage.getItem("username") || "User";
      setTypedSignature(currentUserName);
    }
  }, [isOpen, defaultReason]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowReasonDropdown(false);
      }
    };

    if (showReasonDropdown) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [showReasonDropdown]);

  const startDrawing = (e) => {
    setIsDrawing(true);
    setSelectedPreviewSignature(null);
    const canvas = canvasRef.current;
    const rect = canvas.getBoundingClientRect();
    const ctx = canvas.getContext("2d");
    ctx.strokeStyle = selectedColor;
    ctx.lineWidth = 3;
    ctx.lineCap = "round";
    ctx.lineJoin = "round";
    ctx.beginPath();
    ctx.moveTo(e.clientX - rect.left, e.clientY - rect.top);
  };

  const draw = (e) => {
    if (!isDrawing) return;
    const canvas = canvasRef.current;
    const rect = canvas.getBoundingClientRect();
    const ctx = canvas.getContext("2d");
    ctx.lineTo(e.clientX - rect.left, e.clientY - rect.top);
    ctx.stroke();
  };

  const stopDrawing = () => {
    setIsDrawing(false);
    saveDrawnSignatureToSession();
  };

  const clearCanvas = () => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    sessionStorage.removeItem("drawnSignature");
    setSelectedPreviewSignature(null);
  };

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (file && file.type.startsWith("image/")) {
      const reader = new FileReader();
      reader.onload = (event) => {
        setUploadedImage(event.target.result);
        setSelectedPreviewSignature(null);
      };
      reader.readAsDataURL(file);
    }
  };

  const generateTypedSignature = () => {
    const canvas = document.createElement("canvas");
    canvas.width = 500;
    canvas.height = 150;
    const ctx = canvas.getContext("2d");

    ctx.fillStyle = "white";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    ctx.fillStyle = selectedColor;
    ctx.font = `48px ${selectedFont}`;
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText(typedSignature, canvas.width / 2, canvas.height / 2);

    return canvas.toDataURL();
  };

  const handleReasonSelect = (reason) => {
    if (reason === "Other") {
      setIsCustomReason(true);
      setSelectedReason("");
      setCustomReason("");
      setTempInputValue("");
    } else {
      setIsCustomReason(false);
      setSelectedReason(reason);
    }
    setShowReasonDropdown(false);
  };

  const handleCustomReasonSave = () => {
    if (tempInputValue.trim()) {
      const newReason = tempInputValue.trim();
      setSelectedReason(newReason);
      setCustomReason(newReason);
      setIsCustomReason(false);

      const updatedLocalReasons = [...localOtherReasons, newReason];
      setLocalOtherReasons(updatedLocalReasons);
      localStorage.setItem("localOtherReasons", JSON.stringify(updatedLocalReasons));
    }
  };

  const handleSaveSignature = () => {
    let signatureData;
    let signatureType;

    if (activeTab === "draw") {
      signatureData = sessionStorage.getItem("drawnSignature") || canvasRef.current.toDataURL();
      signatureType = "drawn";
    } else if (activeTab === "upload") {
      if (!uploadedImage) {
        alert("Please upload an image");
        return;
      }
      signatureData = uploadedImage;
      signatureType = "uploaded";
    } else if (activeTab === "text") {
      if (!typedSignature.trim()) {
        alert("Please enter text for signature");
        return;
      }
      signatureData = generateTypedSignature();
      signatureType = "typed";
    }

    const existingIndex = savedSignatures.findIndex(sig => sig.data === signatureData);
    if (existingIndex === -1) {
      const newSignature = {
        id: Date.now(),
        data: signatureData,
        type: signatureType,
        createdAt: new Date().toISOString()
      };

      const updatedSignatures = [...savedSignatures, newSignature];
      setSavedSignatures(updatedSignatures);
      localStorage.setItem('savedSignatures', JSON.stringify(updatedSignatures));
      setSelectedPreviewSignature(newSignature);
    } else {
      setSelectedPreviewSignature(savedSignatures[existingIndex]);
    }
  };

  const handleApplySignature = () => {
    let signatureData;
    let reason;

    if (selectedPreviewSignature) {
      signatureData = selectedPreviewSignature.data;
    } else {
      if (activeTab === "draw") {
        const currentDrawn = sessionStorage.getItem("drawnSignature") || canvasRef.current.toDataURL();
        const canvas = canvasRef.current;
        const ctx = canvas.getContext("2d");
        const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
        const isEmpty = imageData.data.every(pixel => pixel === 0);
        
        if (isEmpty) {
          alert("Please draw a signature or select from previews");
          return;
        }
        
        signatureData = currentDrawn;
        
        const existingIndex = savedSignatures.findIndex(sig => sig.data === signatureData);
        if (existingIndex === -1) {
          const newSignature = {
            id: Date.now(),
            data: signatureData,
            type: "drawn",
            createdAt: new Date().toISOString()
          };
          const updatedSignatures = [...savedSignatures, newSignature];
          setSavedSignatures(updatedSignatures);
          localStorage.setItem('savedSignatures', JSON.stringify(updatedSignatures));
        }
      } else if (activeTab === "upload") {
        if (!uploadedImage) {
          alert("Please upload an image or select from previews");
          return;
        }
        signatureData = uploadedImage;
      } else if (activeTab === "text") {
        if (!typedSignature.trim()) {
          alert("Please enter text for signature or select from previews");
          return;
        }
        signatureData = generateTypedSignature();
      }
    }

    if (!selectedReason && !tempInputValue.trim()) {
      alert("Please select a reason to sign");
      return;
    }

    reason = isCustomReason ? tempInputValue.trim() : selectedReason;

    if (isCustomReason && tempInputValue.trim()) {
      const newReason = tempInputValue.trim();
      const updatedLocalReasons = [...localOtherReasons, newReason];
      setLocalOtherReasons(updatedLocalReasons);
      localStorage.setItem("localOtherReasons", JSON.stringify(updatedLocalReasons));
    }

    sessionStorage.setItem("sessionSignature", signatureData);
    onSave(signatureData, reason);
  };

  const handleDeleteSignature = (signatureId) => {
    const updatedSignatures = savedSignatures.filter(sig => sig.id !== signatureId);
    setSavedSignatures(updatedSignatures);
    localStorage.setItem('savedSignatures', JSON.stringify(updatedSignatures));
    
    if (selectedPreviewSignature && selectedPreviewSignature.id === signatureId) {
      setSelectedPreviewSignature(null);
    }
  };

  const handlePreviewSelect = (signature) => {
    setSelectedPreviewSignature(signature);
  };

  if (!isOpen) return null;

  const getTabIcon = (tab) => {
    switch (tab) {
      case "draw": return PenTool;
      case "upload": return Upload;
      case "text": return Type;
      default: return PenTool;
    }
  };

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-6xl h-[85vh] overflow-hidden border border-gray-200">
        {/* Header */}
        <div className="relative bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 text-white p-6">
          <div className="absolute inset-0 bg-gradient-to-r from-blue-600/95 to-indigo-600/95"></div>
          <div className="relative flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center backdrop-blur-sm">
                <Sparkles className="w-6 h-6 text-white" />
              </div>
              <div>
                <h2 className="text-2xl font-bold mb-1">Create Your Signature</h2>
                <p className="text-white/80">Design a professional digital signature</p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="w-10 h-10 rounded-xl bg-white/10 hover:bg-white/20 flex items-center justify-center transition-all duration-200 backdrop-blur-sm group"
            >
              <X className="w-5 h-5 text-white group-hover:scale-110 transition-transform" />
            </button>
          </div>
        </div>

        <div className="flex h-[calc(85vh-88px)]">
          {/* Left Panel - Signature Creation */}
          <div className="flex-1 flex flex-col bg-gradient-to-br from-gray-50 to-white">
            <div className="p-6 flex-1 overflow-y-auto">
              {/* Reason Selection */}
              <div ref={dropdownRef} className="mb-6">
                <label className="block text-sm font-bold text-gray-800 mb-3 flex items-center">
                  <MousePointer className="w-4 h-4 mr-2 text-blue-600" />
                  Reason to Sign
                </label>
                <div className="relative">
                  {isCustomReason ? (
                    <div className="flex gap-2">
                      <input
                        type="text"
                        value={tempInputValue}
                        onChange={(e) => setTempInputValue(e.target.value)}
                        placeholder="Enter your custom reason..."
                        className="flex-1 border-2 border-gray-200 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all p-3 text-sm bg-white"
                        maxLength={50}
                      />
                      <button
                        onClick={handleCustomReasonSave}
                        className="bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg hover:shadow-lg transition-all px-4 py-3 font-medium text-sm"
                      >
                        Save
                      </button>
                      <button
                        onClick={() => {
                          setIsCustomReason(false);
                          setTempInputValue("");
                        }}
                        className="bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-all px-4 py-3 font-medium text-sm"
                      >
                        Cancel
                      </button>
                    </div>
                  ) : (
                    <button
                      onClick={() => setShowReasonDropdown(!showReasonDropdown)}
                      className="w-full flex items-center justify-between bg-white border-2 border-gray-200 rounded-lg hover:border-blue-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all p-3 text-sm"
                    >
                      <span className={selectedReason ? "text-gray-800 font-medium" : "text-gray-500"}>
                        {selectedReason || "Select a reason to sign"}
                      </span>
                      <ChevronDown className={`w-4 h-4 text-gray-500 transition-transform duration-200 ${showReasonDropdown ? "rotate-180" : ""}`} />
                    </button>
                  )}

                  {showReasonDropdown && !isCustomReason && (
                    <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-200 rounded-lg shadow-xl z-[70] max-h-48 overflow-y-auto">
                      {signatureReasons.map((reason, index) => (
                        <button
                          key={index}
                          onClick={() => handleReasonSelect(reason)}
                          className="w-full text-left hover:bg-gray-50 transition-colors p-3 text-sm first:rounded-t-lg last:rounded-b-lg"
                        >
                          {reason}
                        </button>
                      ))}
                      {localOtherReasons.map((reason, index) => (
                        <button
                          key={`local-${index}`}
                          onClick={() => handleReasonSelect(reason)}
                          className="w-full text-left hover:bg-gray-50 transition-colors p-3 text-sm"
                        >
                          {reason}
                        </button>
                      ))}
                      <div className="border-t border-gray-200">
                        <button
                          onClick={() => handleReasonSelect("Other")}
                          className="w-full text-left hover:bg-blue-50 transition-colors text-blue-600 font-medium p-3 text-sm rounded-b-lg"
                        >
                          + Add custom reason...
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Tabs */}
              <div className="mb-6">
                <div className="flex bg-gray-100 rounded-xl p-1">
                  {["draw", "upload", "text"].map((tab) => {
                    const Icon = getTabIcon(tab);
                    return (
                      <button
                        key={tab}
                        onClick={() => handleTabChange(tab)}
                        className={`flex-1 flex items-center justify-center gap-2 py-3 px-4 rounded-lg font-medium transition-all duration-200 text-sm ${
                          activeTab === tab
                            ? "bg-white text-blue-600 shadow-sm transform scale-[1.02]"
                            : "text-gray-600 hover:text-gray-800 hover:bg-white/50"
                        }`}
                      >
                        <Icon className="w-4 h-4" />
                        <span className="capitalize">{tab}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Tab Content */}
              <div className="bg-white rounded-xl border border-gray-200 p-4 shadow-sm flex-1">
                {activeTab === "draw" && (
                  <div className="h-full flex flex-col">
                    {/* Color Selection */}
                    <div className="mb-4">
                      <label className="block text-sm font-medium text-gray-800 mb-2 flex items-center">
                        <Palette className="w-4 h-4 mr-2" />
                        Color
                      </label>
                      <div className="flex gap-2">
                        {colors.map((color) => (
                          <button
                            key={color.value}
                            onClick={() => setSelectedColor(color.value)}
                            className={`w-8 h-8 rounded-lg border-2 transition-all duration-200 ${color.bg} ${
                              selectedColor === color.value
                                ? `border-gray-800 scale-110 shadow-lg ring-2 ${color.ring}/30`
                                : "border-gray-300 hover:scale-105"
                            }`}
                            title={color.name}
                          />
                        ))}
                      </div>
                    </div>

                    {/* Drawing Canvas */}
                    <div className="flex-1 flex flex-col">
                      <label className="block text-sm font-medium text-gray-800 mb-2">
                        Draw Your Signature
                      </label>
                      <div className="flex-1 border-2 border-dashed border-gray-300 rounded-lg bg-gradient-to-br from-gray-50 to-white p-3 min-h-[200px]">
                        <canvas
                          ref={canvasRef}
                          width={600}
                          height={200}
                          className="w-full h-full bg-white border border-gray-200 rounded-lg cursor-crosshair"
                          onMouseDown={startDrawing}
                          onMouseMove={draw}
                          onMouseUp={stopDrawing}
                          onMouseLeave={stopDrawing}
                        />
                      </div>
                      <div className="flex justify-end mt-2">
                        <button
                          onClick={clearCanvas}
                          className="text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50 transition-all px-4 py-2 font-medium text-sm"
                        >
                          Clear
                        </button>
                      </div>
                    </div>
                  </div>
                )}

                {activeTab === "upload" && (
                  <div className="h-full flex flex-col">
                    <label className="block text-sm font-medium text-gray-800 mb-2">
                      Upload Signature Image
                    </label>
                    <div className="flex-1 border-2 border-dashed border-gray-300 rounded-lg text-center bg-gradient-to-br from-gray-50 to-white p-6 min-h-[200px] flex flex-col items-center justify-center">
                      {uploadedImage ? (
                        <div>
                          <img
                            src={uploadedImage}
                            alt="Uploaded signature"
                            className="mx-auto mb-4 max-h-32 rounded-lg shadow-sm"
                          />
                          <button
                            onClick={() => setUploadedImage(null)}
                            className="text-red-600 hover:text-red-800 transition-colors font-medium text-sm"
                          >
                            Remove Image
                          </button>
                        </div>
                      ) : (
                        <div>
                          <Upload className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                          <p className="text-gray-600 mb-4">
                            Drag and drop or click to upload
                          </p>
                          <input
                            ref={fileInputRef}
                            type="file"
                            accept="image/*"
                            onChange={handleFileUpload}
                            className="hidden"
                          />
                          <button
                            onClick={() => fileInputRef.current?.click()}
                            className="bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg hover:shadow-lg transition-all px-6 py-3 font-medium"
                          >
                            Choose File
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {activeTab === "text" && (
                  <div className="h-full flex flex-col">
                    <div className="grid grid-cols-2 gap-4 mb-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-800 mb-2">
                          Text
                        </label>
                        <input
                          type="text"
                          value={typedSignature}
                          onChange={(e) => setTypedSignature(e.target.value)}
                          className="w-full border-2 border-gray-200 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all p-3 text-sm"
                          placeholder="Enter your name"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-800 mb-2">
                          Font
                        </label>
                        <select
                          value={selectedFont}
                          onChange={(e) => setSelectedFont(e.target.value)}
                          className="w-full border-2 border-gray-200 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all p-3 text-sm"
                        >
                          {fonts.map((font) => (
                            <option key={font.value} value={font.value}>
                              {font.label}
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>

                    {/* Color Selection */}
                    <div className="mb-4">
                      <label className="block text-sm font-medium text-gray-800 mb-2">
                        Color
                      </label>
                      <div className="flex gap-2">
                        {colors.map((color) => (
                          <button
                            key={color.value}
                            onClick={() => setSelectedColor(color.value)}
                            className={`w-6 h-6 rounded-lg border-2 transition-all ${color.bg} ${
                              selectedColor === color.value
                                ? "border-gray-800 scale-110"
                                : "border-gray-300"
                            }`}
                          />
                        ))}
                      </div>
                    </div>

                    {/* Preview */}
                    <div className="flex-1">
                      <label className="block text-sm font-medium text-gray-800 mb-2">
                        Preview
                      </label>
                      <div className="h-full border-2 border-gray-200 rounded-lg bg-gradient-to-br from-gray-50 to-white text-center flex items-center justify-center min-h-[120px]">
                        <span
                          style={{
                            fontFamily: selectedFont,
                            color: selectedColor,
                            fontSize: '2rem',
                            fontWeight: '500'
                          }}
                        >
                          {typedSignature || "Preview"}
                        </span>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Action Buttons */}
            <div className="p-6 border-t border-gray-200 bg-gray-50">
              <div className="flex justify-end gap-3">
                <button
                  onClick={handleSaveSignature}
                  className="bg-gradient-to-r from-gray-500 to-gray-600 text-white rounded-lg hover:shadow-lg transition-all px-6 py-3 font-medium flex items-center gap-2"
                >
                  <Zap className="w-4 h-4" />
                  Save to Library
                </button>
                <button
                  onClick={handleApplySignature}
                  className="bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg hover:shadow-lg transition-all px-6 py-3 font-medium flex items-center gap-2"
                >
                  <Check className="w-4 h-4" />
                  Apply Signature
                </button>
              </div>
            </div>
          </div>

          {/* Right Panel - Signature Library */}
          <SignatureLibrary
            savedSignatures={savedSignatures}
            selectedPreviewSignature={selectedPreviewSignature}
            onPreviewSelect={handlePreviewSelect}
            onDeleteSignature={handleDeleteSignature}
          />
        </div>
      </div>
    </div>
  );
};

export default SignatureModal;