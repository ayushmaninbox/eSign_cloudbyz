import React, { useState, useRef, useEffect } from 'react';
import { X, ChevronDown, PenTool, Upload, Type, Trash2, Check, Sparkles, Palette, MousePointer } from 'lucide-react';

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
    { name: "Black", value: "#000000", bg: "bg-gray-900" },
    { name: "Blue", value: "#2563EB", bg: "bg-blue-600" },
    { name: "Green", value: "#059669", bg: "bg-emerald-600" },
    { name: "Purple", value: "#7C3AED", bg: "bg-violet-600" },
    { name: "Red", value: "#DC2626", bg: "bg-red-600" },
    { name: "Orange", value: "#EA580C", bg: "bg-orange-600" }
  ];

  const fonts = [
    { value: "cursive", label: "Elegant Script", preview: "font-serif italic" },
    { value: "serif", label: "Classic Serif", preview: "font-serif" },
    { value: "sans-serif", label: "Modern Sans", preview: "font-sans" },
    { value: "monospace", label: "Typewriter", preview: "font-mono" },
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
    canvas.height = 180;
    const ctx = canvas.getContext("2d");

    ctx.fillStyle = "white";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    ctx.fillStyle = selectedColor;
    ctx.font = `60px ${selectedFont}`;
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

  const getSignatureTypeIcon = (type) => {
    switch (type) {
      case "drawn": return PenTool;
      case "uploaded": return Upload;
      case "typed": return Type;
      default: return PenTool;
    }
  };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-md z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl shadow-2xl w-full max-w-7xl max-h-[95vh] overflow-hidden border border-gray-100">
        {/* Header */}
        <div className="relative bg-gradient-to-r from-CloudbyzBlue via-blue-600 to-indigo-600 text-white p-8">
          <div className="absolute inset-0 bg-gradient-to-r from-CloudbyzBlue/90 to-indigo-600/90"></div>
          <div className="relative flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="w-14 h-14 bg-white/20 rounded-2xl flex items-center justify-center backdrop-blur-sm">
                <Sparkles className="w-8 h-8 text-white" />
              </div>
              <div>
                <h2 className="text-3xl font-bold mb-1">Create Your Signature</h2>
                <p className="text-white/80 text-lg">Design a professional digital signature</p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="w-12 h-12 rounded-2xl bg-white/10 hover:bg-white/20 flex items-center justify-center transition-all duration-200 backdrop-blur-sm group"
            >
              <X className="w-6 h-6 text-white group-hover:scale-110 transition-transform" />
            </button>
          </div>
        </div>

        <div className="flex h-[calc(95vh-140px)]">
          {/* Left Panel - Signature Creation */}
          <div className="flex-1 overflow-y-auto bg-gradient-to-br from-gray-50 to-white">
            <div className="p-8">
              {/* Reason Selection */}
              <div ref={dropdownRef} className="mb-8">
                <label className="block text-lg font-bold text-gray-800 mb-4 flex items-center">
                  <MousePointer className="w-5 h-5 mr-2 text-CloudbyzBlue" />
                  Reason to Sign
                </label>
                <div className="relative">
                  {isCustomReason ? (
                    <div className="flex gap-3">
                      <input
                        type="text"
                        value={tempInputValue}
                        onChange={(e) => setTempInputValue(e.target.value)}
                        placeholder="Enter your custom reason..."
                        className="flex-1 border-2 border-gray-200 rounded-xl focus:border-CloudbyzBlue focus:ring-4 focus:ring-CloudbyzBlue/10 transition-all p-4 text-base bg-white shadow-sm"
                        maxLength={50}
                      />
                      <button
                        onClick={handleCustomReasonSave}
                        className="bg-gradient-to-r from-CloudbyzBlue to-blue-600 text-white rounded-xl hover:shadow-lg transition-all px-6 py-4 font-semibold"
                      >
                        Save
                      </button>
                      <button
                        onClick={() => {
                          setIsCustomReason(false);
                          setTempInputValue("");
                        }}
                        className="bg-gray-100 text-gray-700 rounded-xl hover:bg-gray-200 transition-all px-6 py-4 font-semibold"
                      >
                        Cancel
                      </button>
                    </div>
                  ) : (
                    <button
                      onClick={() => setShowReasonDropdown(!showReasonDropdown)}
                      className="w-full flex items-center justify-between bg-white border-2 border-gray-200 rounded-xl hover:border-CloudbyzBlue focus:border-CloudbyzBlue focus:ring-4 focus:ring-CloudbyzBlue/10 transition-all p-4 text-base shadow-sm"
                    >
                      <span className={selectedReason ? "text-gray-800 font-medium" : "text-gray-500"}>
                        {selectedReason || "Select a reason to sign"}
                      </span>
                      <ChevronDown className={`w-5 h-5 text-gray-500 transition-transform duration-200 ${showReasonDropdown ? "rotate-180" : ""}`} />
                    </button>
                  )}

                  {showReasonDropdown && !isCustomReason && (
                    <div className="absolute top-full left-0 right-0 mt-2 bg-white border border-gray-200 rounded-xl shadow-xl z-[70] max-h-64 overflow-y-auto">
                      {signatureReasons.map((reason, index) => (
                        <button
                          key={index}
                          onClick={() => handleReasonSelect(reason)}
                          className="w-full text-left hover:bg-gray-50 transition-colors p-4 text-base first:rounded-t-xl last:rounded-b-xl"
                        >
                          {reason}
                        </button>
                      ))}
                      {localOtherReasons.map((reason, index) => (
                        <button
                          key={`local-${index}`}
                          onClick={() => handleReasonSelect(reason)}
                          className="w-full text-left hover:bg-gray-50 transition-colors p-4 text-base"
                        >
                          {reason}
                        </button>
                      ))}
                      <div className="border-t border-gray-200">
                        <button
                          onClick={() => handleReasonSelect("Other")}
                          className="w-full text-left hover:bg-blue-50 transition-colors text-CloudbyzBlue font-semibold p-4 text-base rounded-b-xl"
                        >
                          + Add custom reason...
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Tabs */}
              <div className="mb-8">
                <div className="flex bg-gray-100 rounded-2xl p-2">
                  {["draw", "upload", "text"].map((tab) => {
                    const Icon = getTabIcon(tab);
                    return (
                      <button
                        key={tab}
                        onClick={() => handleTabChange(tab)}
                        className={`flex-1 flex items-center justify-center gap-3 py-4 px-6 rounded-xl font-semibold transition-all duration-200 ${
                          activeTab === tab
                            ? "bg-white text-CloudbyzBlue shadow-lg transform scale-105"
                            : "text-gray-600 hover:text-gray-800 hover:bg-white/50"
                        }`}
                      >
                        <Icon className="w-5 h-5" />
                        <span className="capitalize">{tab}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Tab Content */}
              <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm">
                {activeTab === "draw" && (
                  <div>
                    {/* Color Selection */}
                    <div className="mb-6">
                      <label className="block text-base font-semibold text-gray-800 mb-4 flex items-center">
                        <Palette className="w-4 h-4 mr-2" />
                        Signature Color
                      </label>
                      <div className="flex gap-3">
                        {colors.map((color) => (
                          <button
                            key={color.value}
                            onClick={() => setSelectedColor(color.value)}
                            className={`w-12 h-12 rounded-xl border-3 transition-all duration-200 ${color.bg} ${
                              selectedColor === color.value
                                ? "border-gray-800 scale-110 shadow-lg"
                                : "border-gray-300 hover:scale-105"
                            }`}
                            title={color.name}
                          />
                        ))}
                      </div>
                    </div>

                    {/* Drawing Canvas */}
                    <div>
                      <label className="block text-base font-semibold text-gray-800 mb-4">
                        Draw Your Signature
                      </label>
                      <div className="border-2 border-dashed border-gray-300 rounded-2xl bg-gradient-to-br from-gray-50 to-white p-6">
                        <canvas
                          ref={canvasRef}
                          width={700}
                          height={250}
                          className="w-full bg-white border-2 border-gray-200 rounded-xl cursor-crosshair shadow-inner"
                          onMouseDown={startDrawing}
                          onMouseMove={draw}
                          onMouseUp={stopDrawing}
                          onMouseLeave={stopDrawing}
                        />
                      </div>
                      <div className="flex justify-end mt-4">
                        <button
                          onClick={clearCanvas}
                          className="text-gray-600 border-2 border-gray-300 rounded-xl hover:bg-gray-50 transition-all px-6 py-3 font-semibold"
                        >
                          Clear Canvas
                        </button>
                      </div>
                    </div>
                  </div>
                )}

                {activeTab === "upload" && (
                  <div>
                    <label className="block text-base font-semibold text-gray-800 mb-4">
                      Upload Signature Image
                    </label>
                    <div className="border-2 border-dashed border-gray-300 rounded-2xl text-center bg-gradient-to-br from-gray-50 to-white p-12">
                      {uploadedImage ? (
                        <div>
                          <img
                            src={uploadedImage}
                            alt="Uploaded signature"
                            className="mx-auto mb-6 max-h-40 rounded-xl shadow-lg"
                          />
                          <button
                            onClick={() => setUploadedImage(null)}
                            className="text-red-600 hover:text-red-800 transition-colors font-semibold"
                          >
                            Remove Image
                          </button>
                        </div>
                      ) : (
                        <div>
                          <Upload className="w-16 h-16 text-gray-400 mx-auto mb-6" />
                          <p className="text-gray-600 mb-6 text-lg">
                            Drag and drop your signature image here
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
                            className="bg-gradient-to-r from-CloudbyzBlue to-blue-600 text-white rounded-xl hover:shadow-lg transition-all px-8 py-4 font-semibold text-lg"
                          >
                            Choose File
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {activeTab === "text" && (
                  <div>
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
                      <div>
                        <label className="block text-base font-semibold text-gray-800 mb-3">
                          Signature Text
                        </label>
                        <input
                          type="text"
                          value={typedSignature}
                          onChange={(e) => setTypedSignature(e.target.value)}
                          className="w-full border-2 border-gray-200 rounded-xl focus:border-CloudbyzBlue focus:ring-4 focus:ring-CloudbyzBlue/10 transition-all p-4 text-base"
                          placeholder="Enter your name"
                        />
                      </div>
                      <div>
                        <label className="block text-base font-semibold text-gray-800 mb-3">
                          Font Style
                        </label>
                        <select
                          value={selectedFont}
                          onChange={(e) => setSelectedFont(e.target.value)}
                          className="w-full border-2 border-gray-200 rounded-xl focus:border-CloudbyzBlue focus:ring-4 focus:ring-CloudbyzBlue/10 transition-all p-4 text-base"
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
                    <div className="mb-6">
                      <label className="block text-base font-semibold text-gray-800 mb-3">
                        Text Color
                      </label>
                      <div className="flex gap-3">
                        {colors.map((color) => (
                          <button
                            key={color.value}
                            onClick={() => setSelectedColor(color.value)}
                            className={`w-10 h-10 rounded-lg border-2 transition-all ${color.bg} ${
                              selectedColor === color.value
                                ? "border-gray-800 scale-110"
                                : "border-gray-300"
                            }`}
                          />
                        ))}
                      </div>
                    </div>

                    {/* Preview */}
                    <div>
                      <label className="block text-base font-semibold text-gray-800 mb-3">
                        Preview
                      </label>
                      <div className="border-2 border-gray-200 rounded-xl bg-gradient-to-br from-gray-50 to-white text-center flex items-center justify-center p-8 min-h-[120px]">
                        <span
                          style={{
                            fontFamily: selectedFont,
                            color: selectedColor,
                            fontSize: '2.5rem',
                            fontWeight: '500'
                          }}
                        >
                          {typedSignature || "Your signature preview"}
                        </span>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Action Buttons */}
              <div className="flex justify-end gap-4 mt-8">
                <button
                  onClick={handleSaveSignature}
                  className="bg-gradient-to-r from-gray-500 to-gray-600 text-white rounded-xl hover:shadow-lg transition-all px-8 py-4 font-semibold text-lg"
                >
                  Save to Library
                </button>
                <button
                  onClick={handleApplySignature}
                  className="bg-gradient-to-r from-CloudbyzBlue to-blue-600 text-white rounded-xl hover:shadow-lg transition-all px-8 py-4 font-semibold text-lg flex items-center gap-2"
                >
                  <Check className="w-5 h-5" />
                  Apply Signature
                </button>
              </div>
            </div>
          </div>

          {/* Right Panel - Sign Previews */}
          <div className="w-96 border-l border-gray-200 bg-gradient-to-b from-gray-50 to-gray-100 overflow-y-auto">
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-bold text-gray-800 flex items-center">
                  <Sparkles className="w-5 h-5 mr-2 text-CloudbyzBlue" />
                  Signature Library
                </h3>
                <div className="text-sm text-gray-500 bg-white px-3 py-1 rounded-full">
                  {savedSignatures.length} saved
                </div>
              </div>
              
              {savedSignatures.length === 0 ? (
                <div className="text-center py-12">
                  <div className="w-20 h-20 bg-gradient-to-br from-CloudbyzBlue/10 to-blue-100 rounded-3xl flex items-center justify-center mx-auto mb-6">
                    <PenTool className="w-10 h-10 text-CloudbyzBlue" />
                  </div>
                  <h4 className="text-lg font-semibold text-gray-800 mb-2">No signatures yet</h4>
                  <p className="text-gray-500 text-sm leading-relaxed">
                    Create and save your signatures to build your personal library
                  </p>
                </div>
              ) : (
                <div className="space-y-4">
                  {savedSignatures.map((signature) => {
                    const Icon = getSignatureTypeIcon(signature.type);
                    return (
                      <div
                        key={signature.id}
                        className={`relative group border-2 rounded-2xl p-4 cursor-pointer transition-all duration-200 ${
                          selectedPreviewSignature?.id === signature.id
                            ? 'border-CloudbyzBlue bg-blue-50 shadow-lg scale-105'
                            : 'border-gray-200 bg-white hover:border-gray-300 hover:shadow-md'
                        }`}
                        onClick={() => handlePreviewSelect(signature)}
                      >
                        <div className="flex items-center justify-center h-20 mb-3 bg-gray-50 rounded-xl">
                          <img
                            src={signature.data}
                            alt="Saved signature"
                            className="max-h-full max-w-full object-contain"
                          />
                        </div>
                        
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <Icon className="w-4 h-4 text-gray-500" />
                            <span className="text-sm font-medium text-gray-700 capitalize">
                              {signature.type}
                            </span>
                          </div>
                          <div className="text-xs text-gray-400">
                            {new Date(signature.createdAt).toLocaleDateString()}
                          </div>
                        </div>
                        
                        {/* Delete button */}
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDeleteSignature(signature.id);
                          }}
                          className="absolute top-2 right-2 w-8 h-8 bg-red-500 hover:bg-red-600 rounded-xl flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-200 shadow-lg"
                        >
                          <Trash2 className="w-4 h-4 text-white" />
                        </button>
                        
                        {/* Selection indicator */}
                        {selectedPreviewSignature?.id === signature.id && (
                          <div className="absolute top-2 left-2 w-8 h-8 bg-CloudbyzBlue rounded-xl flex items-center justify-center shadow-lg">
                            <Check className="w-4 h-4 text-white" />
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SignatureModal;