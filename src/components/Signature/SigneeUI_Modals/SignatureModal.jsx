import React, { useState, useRef, useEffect } from 'react';
import { X, ChevronDown, PenTool, Upload, Type } from 'lucide-react';
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

  const colors = ["#000000", "#FF0000", "#00FF00", "#0000FF"];
  const fonts = [
    { value: "cursive", label: "Cursive", style: "font-family: cursive" },
    { value: "serif", label: "Serif", style: "font-family: serif" },
    {
      value: "sans-serif",
      label: "Sans Serif",
      style: "font-family: sans-serif",
    },
    { value: "monospace", label: "Monospace", style: "font-family: monospace" },
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

  const getCanvasCoordinates = (e) => {
    const canvas = canvasRef.current;
    const rect = canvas.getBoundingClientRect();
    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;
    
    return {
      x: (e.clientX - rect.left) * scaleX,
      y: (e.clientY - rect.top) * scaleY
    };
  };

  const startDrawing = (e) => {
    setIsDrawing(true);
    setSelectedPreviewSignature(null);
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    const coords = getCanvasCoordinates(e);
    
    ctx.strokeStyle = selectedColor;
    ctx.lineWidth = 2;
    ctx.lineCap = "round";
    ctx.lineJoin = "round";
    ctx.beginPath();
    ctx.moveTo(coords.x, coords.y);
  };

  const draw = (e) => {
    if (!isDrawing) return;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    const coords = getCanvasCoordinates(e);
    
    ctx.lineTo(coords.x, coords.y);
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
    canvas.width = 400;
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
      const canvas = canvasRef.current;
      const ctx = canvas.getContext("2d");
      const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
      const isEmpty = imageData.data.every(pixel => pixel === 0);
      
      if (isEmpty) {
        alert("Please draw a signature first");
        return;
      }
      
      signatureData = canvas.toDataURL();
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

  const handleSave = () => {
    let signatureData;
    let reason;

    if (selectedPreviewSignature) {
      signatureData = selectedPreviewSignature.data;
    } else {
      if (activeTab === "draw") {
        const canvas = canvasRef.current;
        const ctx = canvas.getContext("2d");
        const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
        const isEmpty = imageData.data.every(pixel => pixel === 0);
        
        if (isEmpty) {
          alert("Please draw a signature or select from library");
          return;
        }
        
        signatureData = canvas.toDataURL();
        
        // Auto-save if not already saved
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
          alert("Please upload an image or select from library");
          return;
        }
        signatureData = uploadedImage;
      } else if (activeTab === "text") {
        if (!typedSignature.trim()) {
          alert("Please enter text for signature or select from library");
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

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-4xl h-[85vh] max-h-[600px] overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-CloudbyzBlue/10 to-CloudbyzBlue/5 border-b border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold text-gray-800">
              Create Your Signature
            </h2>
            <button
              onClick={onClose}
              className="w-8 h-8 rounded-full bg-red-100 hover:bg-red-200 flex items-center justify-center transition-colors group"
            >
              <X className="w-4 h-4 text-red-600 group-hover:text-red-700" />
            </button>
          </div>
        </div>

        <div className="flex h-[calc(85vh-88px)] max-h-[512px]">
          {/* Left Panel - Signature Creation */}
          <div className="flex-1 flex flex-col p-6">
            {/* Reason Selection */}
            <div ref={dropdownRef} className="mb-6">
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Reason to Sign *
              </label>
              <div className="relative">
                {isCustomReason ? (
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={tempInputValue}
                      onChange={(e) => setTempInputValue(e.target.value)}
                      placeholder="Enter custom reason"
                      className="flex-1 border border-gray-300 rounded-lg focus:border-CloudbyzBlue focus:ring-2 focus:ring-CloudbyzBlue/20 transition-all p-3 text-sm"
                      maxLength={50}
                    />
                    <button
                      onClick={handleCustomReasonSave}
                      className="bg-CloudbyzBlue text-white rounded-lg hover:bg-CloudbyzBlue/90 transition-colors px-4 py-3 text-sm"
                    >
                      Save
                    </button>
                    <button
                      onClick={() => {
                        setIsCustomReason(false);
                        setTempInputValue("");
                      }}
                      className="bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400 transition-colors px-4 py-3 text-sm"
                    >
                      Cancel
                    </button>
                  </div>
                ) : (
                  <button
                    onClick={() => setShowReasonDropdown(!showReasonDropdown)}
                    className="w-full flex items-center justify-between bg-white border border-gray-300 rounded-lg hover:border-gray-400 focus:border-CloudbyzBlue focus:ring-2 focus:ring-CloudbyzBlue/20 transition-all p-3 text-sm"
                  >
                    <span
                      className={
                        selectedReason ? "text-gray-800" : "text-gray-500"
                      }
                    >
                      {selectedReason || "Select a reason to sign"}
                    </span>
                    <ChevronDown
                      className={`w-4 h-4 text-gray-500 transition-transform ${
                        showReasonDropdown ? "rotate-180" : ""
                      }`}
                    />
                  </button>
                )}

                {showReasonDropdown && !isCustomReason && (
                  <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-200 rounded-lg shadow-lg z-[70] max-h-48 overflow-y-auto">
                    {signatureReasons.map((reason, index) => (
                      <button
                        key={index}
                        onClick={() => handleReasonSelect(reason)}
                        className="w-full text-left hover:bg-gray-50 transition-colors p-3 text-sm"
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
                        className="w-full text-left hover:bg-gray-50 transition-colors text-CloudbyzBlue font-medium p-3 text-sm"
                      >
                        Other reason...
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Tabs */}
            <div className="mb-6">
              <div className="flex border-b border-gray-200">
                <button
                  onClick={() => handleTabChange("draw")}
                  className={`font-medium transition-colors px-6 py-3 text-sm ${
                    activeTab === "draw"
                      ? "text-CloudbyzBlue border-b-2 border-CloudbyzBlue"
                      : "text-gray-600 hover:text-gray-800"
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <PenTool className="w-4 h-4" />
                    <span>Draw</span>
                  </div>
                </button>
                <button
                  onClick={() => handleTabChange("upload")}
                  className={`font-medium transition-colors px-6 py-3 text-sm ${
                    activeTab === "upload"
                      ? "text-CloudbyzBlue border-b-2 border-CloudbyzBlue"
                      : "text-gray-600 hover:text-gray-800"
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <Upload className="w-4 h-4" />
                    <span>Upload</span>
                  </div>
                </button>
                <button
                  onClick={() => handleTabChange("text")}
                  className={`font-medium transition-colors px-6 py-3 text-sm ${
                    activeTab === "text"
                      ? "text-CloudbyzBlue border-b-2 border-CloudbyzBlue"
                      : "text-gray-600 hover:text-gray-800"
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <Type className="w-4 h-4" />
                    <span>Text</span>
                  </div>
                </button>
              </div>
            </div>

            {/* Tab Content */}
            <div className="flex-1 overflow-hidden">
              {activeTab === "draw" && (
                <div>
                  {/* Color Selection */}
                  <div className="mb-4">
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Signature Color
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

                  {/* Drawing Canvas */}
                  <div className="mb-6">
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Draw Your Signature
                    </label>
                    <div className="border-2 border-dashed border-gray-300 rounded-lg bg-gray-50 p-4">
                      <canvas
                        ref={canvasRef}
                        width={400}
                        height={150}
                        className="w-full bg-white border border-gray-200 rounded cursor-crosshair h-32"
                        onMouseDown={startDrawing}
                        onMouseMove={draw}
                        onMouseUp={stopDrawing}
                        onMouseLeave={stopDrawing}
                      />
                    </div>
                    <div className="flex justify-between mt-2">
                      <button
                        onClick={clearCanvas}
                        className="text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors px-4 py-2 text-sm"
                      >
                        Clear
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {activeTab === "upload" && (
                <div className="mb-6">
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Upload Signature Image
                  </label>
                  <div className="border-2 border-dashed border-gray-300 rounded-lg text-center bg-gray-50 p-8">
                    {uploadedImage ? (
                      <div>
                        <img
                          src={uploadedImage}
                          alt="Uploaded signature"
                          className="mx-auto mb-4 max-h-32"
                        />
                        <button
                          onClick={() => setUploadedImage(null)}
                          className="text-red-600 hover:text-red-800 transition-colors text-sm"
                        >
                          Remove Image
                        </button>
                      </div>
                    ) : (
                      <div>
                        <Upload className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                        <p className="text-gray-600 mb-4 text-sm">
                          Click to upload or drag and drop
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
                          className="bg-CloudbyzBlue text-white rounded-lg hover:bg-CloudbyzBlue/90 transition-colors px-6 py-3 text-sm"
                        >
                          Choose File
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {activeTab === "text" && (
                <div className="mb-6">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Signature Text
                      </label>
                      <input
                        type="text"
                        value={typedSignature}
                        onChange={(e) => setTypedSignature(e.target.value)}
                        className="w-full border border-gray-300 rounded-lg focus:border-CloudbyzBlue focus:ring-2 focus:ring-CloudbyzBlue/20 transition-all p-3 text-sm"
                        placeholder="Enter your name"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Font Style
                      </label>
                      <select
                        value={selectedFont}
                        onChange={(e) => setSelectedFont(e.target.value)}
                        className="w-full border border-gray-300 rounded-lg focus:border-CloudbyzBlue focus:ring-2 focus:ring-CloudbyzBlue/20 transition-all p-3 text-sm"
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
                  <div className="mb-4">
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Preview
                    </label>
                    <div className="border border-gray-200 rounded-lg bg-gray-50 text-center flex items-center justify-center p-6 min-h-[100px]">
                      <span
                        style={{
                          fontFamily: selectedFont,
                          color: selectedColor,
                          fontSize: '1.875rem',
                        }}
                      >
                        {typedSignature || "Your signature will appear here"}
                      </span>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Action Buttons */}
            <div className="flex justify-end gap-3">
              <button
                onClick={handleSave}
                className="bg-CloudbyzBlue text-white rounded-lg hover:bg-CloudbyzBlue/90 transition-colors px-6 py-3 text-sm"
              >
                Save Signature
              </button>
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