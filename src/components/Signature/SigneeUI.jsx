import React, { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import {
  User,
  Settings,
  LogOut,
  UserCircle,
  PenTool,
  Type,
  FileSignature,
  X,
  Upload,
  Palette,
  Bold,
  Italic,
  Underline,
} from "lucide-react";
import Loader from "../ui/Loader";
import Error404 from "../ui/404error";

const ProfileModal = ({ isOpen, onClose }) => {
  const navigate = useNavigate();

  if (!isOpen) return null;

  const handleLogout = () => {
    localStorage.removeItem("username");
    localStorage.removeItem("useremail");
    navigate("/");
  };

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-end pt-16 pr-6">
      <div className="absolute inset-0" onClick={onClose}></div>
      <div className="bg-white rounded-xl shadow-2xl border border-gray-200 w-64 mt-2 relative z-10 overflow-hidden">
        <div className="py-2">
          <button className="w-full px-4 py-3 text-left hover:bg-gray-50 flex items-center space-x-3 transition-colors">
            <UserCircle className="w-5 h-5 text-gray-500" />
            <span className="text-gray-700">Profile</span>
          </button>
          <button className="w-full px-4 py-3 text-left hover:bg-gray-50 flex items-center space-x-3 transition-colors">
            <Settings className="w-5 h-5 text-gray-500" />
            <span className="text-gray-700">Account Settings</span>
          </button>
          <hr className="my-2 border-gray-100" />
          <button
            onClick={handleLogout}
            className="w-full px-4 py-3 text-left hover:bg-red-50 flex items-center space-x-3 transition-colors text-red-600"
          >
            <LogOut className="w-5 h-5" />
            <span>Logout</span>
          </button>
        </div>
      </div>
    </div>
  );
};

const Navbar = () => {
  const navigate = useNavigate();
  const [showProfileModal, setShowProfileModal] = useState(false);

  const handleLogoClick = () => {
    const username = localStorage.getItem("username");
    if (username) {
      navigate("/home");
    } else {
      navigate("/");
    }
  };

  return (
    <>
      <nav className="fixed top-0 left-0 right-0 bg-white shadow-lg z-30 h-16 px-6 flex justify-between items-center border-b-2 border-CloudbyzBlue/10">
        <div className="flex items-center space-x-8">
          <img
            src="/images/cloudbyz.png"
            alt="Cloudbyz Logo"
            className="h-10 object-contain cursor-pointer hover:scale-105 transition-transform"
            onClick={handleLogoClick}
          />
        </div>

        <div className="flex items-center space-x-4">
          <span className="text-sm text-gray-600">John Doe</span>
          <button
            onClick={() => setShowProfileModal(!showProfileModal)}
            className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 flex items-center justify-center transition-colors"
          >
            <User className="w-5 h-5 text-slate-600" />
          </button>
        </div>
      </nav>

      <ProfileModal
        isOpen={showProfileModal}
        onClose={() => setShowProfileModal(false)}
      />
    </>
  );
};

const ColorPicker = ({ selectedColor, onColorChange, className = "" }) => {
  const colors = [
    '#000000', '#FF0000', '#00FF00', '#0000FF', '#FFFF00', '#FF00FF', '#00FFFF',
    '#800000', '#008000', '#000080', '#808000', '#800080', '#008080', '#C0C0C0',
    '#808080', '#FF9999', '#99FF99', '#9999FF', '#FFFF99', '#FF99FF', '#99FFFF',
    '#FFB366', '#B366FF', '#66FFB3', '#FFD700', '#FF6347', '#40E0D0', '#EE82EE'
  ];

  return (
    <div className={`grid grid-cols-7 gap-2 ${className}`}>
      {colors.map((color) => (
        <button
          key={color}
          onClick={() => onColorChange(color)}
          className={`w-6 h-6 rounded-full border-2 transition-all duration-200 hover:scale-110 ${
            selectedColor === color ? 'border-gray-800 shadow-lg' : 'border-gray-300'
          }`}
          style={{ backgroundColor: color }}
          title={color}
        />
      ))}
    </div>
  );
};

const TextModal = ({ isOpen, onClose, onSave, initialText = "" }) => {
  const [text, setText] = useState(initialText);
  const [textColor, setTextColor] = useState('#000000');
  const [isBold, setIsBold] = useState(false);
  const [isItalic, setIsItalic] = useState(false);
  const [isUnderline, setIsUnderline] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setText(initialText);
      setTextColor('#000000');
      setIsBold(false);
      setIsItalic(false);
      setIsUnderline(false);
    }
  }, [isOpen, initialText]);

  const handleSave = () => {
    if (text.trim()) {
      const textData = {
        type: 'text',
        content: text.trim(),
        color: textColor,
        bold: isBold,
        italic: isItalic,
        underline: isUnderline
      };
      onSave(textData);
      onClose();
    }
  };

  if (!isOpen) return null;

  const getTextStyle = () => ({
    color: textColor,
    fontWeight: isBold ? 'bold' : 'normal',
    fontStyle: isItalic ? 'italic' : 'normal',
    textDecoration: isUnderline ? 'underline' : 'none',
  });

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md max-h-[90vh] flex flex-col overflow-hidden">
        <div className="flex items-center justify-between p-6 border-b border-gray-200 bg-gradient-to-r from-CloudbyzBlue/5 to-CloudbyzBlue/10">
          <h2 className="text-xl font-bold text-gray-800">Add Text</h2>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center transition-colors"
          >
            <X className="w-5 h-5 text-gray-600" />
          </button>
        </div>

        <div className="flex-1 p-6 space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-3">
              Enter Text (max 100 characters)
            </label>
            <textarea
              value={text}
              onChange={(e) => setText(e.target.value)}
              maxLength={100}
              rows={3}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-CloudbyzBlue focus:border-CloudbyzBlue outline-none transition-all resize-none"
              placeholder="Enter your text here..."
            />
            <div className="text-xs text-gray-500 mt-1">
              {text.length}/100 characters
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-3">
              Text Color
            </label>
            <ColorPicker
              selectedColor={textColor}
              onColorChange={setTextColor}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-3">
              Text Style
            </label>
            <div className="flex gap-2">
              <button
                onClick={() => setIsBold(!isBold)}
                className={`p-2 rounded-lg border-2 transition-all ${
                  isBold
                    ? 'border-CloudbyzBlue bg-CloudbyzBlue/10 text-CloudbyzBlue'
                    : 'border-gray-300 hover:border-gray-400'
                }`}
              >
                <Bold className="w-4 h-4" />
              </button>
              <button
                onClick={() => setIsItalic(!isItalic)}
                className={`p-2 rounded-lg border-2 transition-all ${
                  isItalic
                    ? 'border-CloudbyzBlue bg-CloudbyzBlue/10 text-CloudbyzBlue'
                    : 'border-gray-300 hover:border-gray-400'
                }`}
              >
                <Italic className="w-4 h-4" />
              </button>
              <button
                onClick={() => setIsUnderline(!isUnderline)}
                className={`p-2 rounded-lg border-2 transition-all ${
                  isUnderline
                    ? 'border-CloudbyzBlue bg-CloudbyzBlue/10 text-CloudbyzBlue'
                    : 'border-gray-300 hover:border-gray-400'
                }`}
              >
                <Underline className="w-4 h-4" />
              </button>
            </div>
          </div>

          <div className="bg-gray-50 rounded-lg p-4">
            <div className="text-sm text-gray-600 mb-2">Preview:</div>
            <div
              className="text-lg break-words"
              style={getTextStyle()}
            >
              {text || "Your text will appear here..."}
            </div>
          </div>
        </div>

        <div className="flex items-center justify-end gap-3 p-6 border-t border-gray-200 bg-gray-50">
          <button
            onClick={onClose}
            className="px-6 py-2 text-gray-600 hover:text-gray-800 hover:bg-gray-200 rounded-lg transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            disabled={!text.trim()}
            className={`px-6 py-2 rounded-lg font-medium transition-colors ${
              text.trim()
                ? 'bg-CloudbyzBlue hover:bg-CloudbyzBlue/90 text-white'
                : 'bg-gray-300 text-gray-500 cursor-not-allowed'
            }`}
          >
            Save Text
          </button>
        </div>
      </div>
    </div>
  );
};

const SignatureModal = ({ isOpen, onClose, fieldType, onSave }) => {
  const [activeTab, setActiveTab] = useState("draw");
  const [textSignature, setTextSignature] = useState("John Doe");
  const [textInitials, setTextInitials] = useState("JD");
  const [textColor, setTextColor] = useState('#000000');
  const [selectedFont, setSelectedFont] = useState("cursive");
  const [isDrawing, setIsDrawing] = useState(false);
  const [canvasRef, setCanvasRef] = useState(null);
  const [uploadedImage, setUploadedImage] = useState(null);
  const [brushThickness, setBrushThickness] = useState(2);
  const [brushColor, setBrushColor] = useState('#000000');
  const [paths, setPaths] = useState([]);
  const [currentPath, setCurrentPath] = useState([]);

  const fonts = [
    { name: "Cursive", value: "cursive", style: { fontFamily: "cursive" } },
    { name: "Serif", value: "serif", style: { fontFamily: "serif" } },
    {
      name: "Sans-serif",
      value: "sans-serif",
      style: { fontFamily: "sans-serif" },
    },
    {
      name: "Monospace",
      value: "monospace",
      style: { fontFamily: "monospace" },
    },
  ];

  useEffect(() => {
    if (isOpen) {
      setActiveTab("draw");
      setTextSignature("John Doe");
      setTextInitials("JD");
      setTextColor('#000000');
      setSelectedFont("cursive");
      setUploadedImage(null);
      setBrushThickness(2);
      setBrushColor('#000000');
      setPaths([]);
      setCurrentPath([]);
    }
  }, [isOpen]);

  const redrawCanvas = useCallback(() => {
    if (!canvasRef) return;
    
    const ctx = canvasRef.getContext("2d");
    ctx.clearRect(0, 0, canvasRef.width, canvasRef.height);
    
    paths.forEach(path => {
      if (path.points.length > 1) {
        ctx.beginPath();
        ctx.strokeStyle = path.color;
        ctx.lineWidth = path.thickness;
        ctx.lineCap = "round";
        ctx.lineJoin = "round";
        
        ctx.moveTo(path.points[0].x, path.points[0].y);
        for (let i = 1; i < path.points.length; i++) {
          ctx.lineTo(path.points[i].x, path.points[i].y);
        }
        ctx.stroke();
      }
    });
  }, [canvasRef, paths]);

  useEffect(() => {
    redrawCanvas();
  }, [redrawCanvas]);

  const getMousePos = (e) => {
    const rect = canvasRef.getBoundingClientRect();
    const scaleX = canvasRef.width / rect.width;
    const scaleY = canvasRef.height / rect.height;
    
    return {
      x: (e.clientX - rect.left) * scaleX,
      y: (e.clientY - rect.top) * scaleY
    };
  };

  const handleCanvasMouseDown = (e) => {
    if (!canvasRef) return;
    setIsDrawing(true);
    const pos = getMousePos(e);
    setCurrentPath([pos]);
  };

  const handleCanvasMouseMove = (e) => {
    if (!isDrawing || !canvasRef) return;

    const pos = getMousePos(e);
    const newPath = [...currentPath, pos];
    setCurrentPath(newPath);

    // Draw current stroke
    const ctx = canvasRef.getContext("2d");
    redrawCanvas();
    
    if (newPath.length > 1) {
      ctx.beginPath();
      ctx.strokeStyle = brushColor;
      ctx.lineWidth = brushThickness;
      ctx.lineCap = "round";
      ctx.lineJoin = "round";
      
      ctx.moveTo(newPath[0].x, newPath[0].y);
      for (let i = 1; i < newPath.length; i++) {
        ctx.lineTo(newPath[i].x, newPath[i].y);
      }
      ctx.stroke();
    }
  };

  const handleCanvasMouseUp = () => {
    if (isDrawing && currentPath.length > 0) {
      setPaths(prev => [...prev, {
        points: currentPath,
        color: brushColor,
        thickness: brushThickness
      }]);
      setCurrentPath([]);
    }
    setIsDrawing(false);
  };

  const clearCanvas = () => {
    setPaths([]);
    setCurrentPath([]);
    if (canvasRef) {
      const ctx = canvasRef.getContext("2d");
      ctx.clearRect(0, 0, canvasRef.width, canvasRef.height);
    }
  };

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (file && file.type.startsWith("image/")) {
      const reader = new FileReader();
      reader.onload = (event) => {
        setUploadedImage(event.target.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSave = () => {
    let signatureData = null;

    if (activeTab === "text") {
      signatureData = {
        type: "text",
        content: fieldType === "initials" ? textInitials : textSignature,
        font: selectedFont,
        color: textColor,
      };
    } else if (activeTab === "draw") {
      if (canvasRef && paths.length > 0) {
        signatureData = {
          type: "draw",
          content: canvasRef.toDataURL(),
        };
      }
    } else if (activeTab === "upload") {
      if (uploadedImage) {
        signatureData = {
          type: "upload",
          content: uploadedImage,
        };
      }
    }

    if (signatureData) {
      onSave(signatureData);
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-3xl max-h-[90vh] flex flex-col overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200 bg-gradient-to-r from-CloudbyzBlue/5 to-CloudbyzBlue/10">
          <h2 className="text-xl font-bold text-gray-800">
            {fieldType === "initials" ? "Add Initials" : "Add Signature"}
          </h2>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center transition-colors"
          >
            <X className="w-5 h-5 text-gray-600" />
          </button>
        </div>

        {/* Tabs */}
        <div className="flex border-b border-gray-200">
          <button
            onClick={() => setActiveTab("draw")}
            className={`flex-1 px-6 py-4 text-sm font-medium transition-colors ${
              activeTab === "draw"
                ? "text-CloudbyzBlue border-b-2 border-CloudbyzBlue bg-CloudbyzBlue/5"
                : "text-gray-600 hover:text-gray-900 hover:bg-gray-50"
            }`}
          >
            <Palette className="w-4 h-4 inline mr-2" />
            Draw
          </button>
          <button
            onClick={() => setActiveTab("upload")}
            className={`flex-1 px-6 py-4 text-sm font-medium transition-colors ${
              activeTab === "upload"
                ? "text-CloudbyzBlue border-b-2 border-CloudbyzBlue bg-CloudbyzBlue/5"
                : "text-gray-600 hover:text-gray-900 hover:bg-gray-50"
            }`}
          >
            <Upload className="w-4 h-4 inline mr-2" />
            Upload
          </button>
          <button
            onClick={() => setActiveTab("text")}
            className={`flex-1 px-6 py-4 text-sm font-medium transition-colors ${
              activeTab === "text"
                ? "text-CloudbyzBlue border-b-2 border-CloudbyzBlue bg-CloudbyzBlue/5"
                : "text-gray-600 hover:text-gray-900 hover:bg-gray-50"
            }`}
          >
            <Type className="w-4 h-4 inline mr-2" />
            Text
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 p-6 overflow-y-auto">
          {activeTab === "draw" && (
            <div className="space-y-6">
              <div className="flex gap-6 mb-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Brush Thickness
                  </label>
                  <input
                    type="range"
                    min="1"
                    max="10"
                    value={brushThickness}
                    onChange={(e) => setBrushThickness(parseInt(e.target.value))}
                    className="w-32"
                  />
                  <div className="text-xs text-gray-500 mt-1">{brushThickness}px</div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Brush Color
                  </label>
                  <ColorPicker
                    selectedColor={brushColor}
                    onColorChange={setBrushColor}
                  />
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-3">
                  Draw your {fieldType === "initials" ? "initials" : "signature"}
                </label>
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-4">
                  <canvas
                    ref={setCanvasRef}
                    width={600}
                    height={200}
                    className="w-full h-48 border border-gray-200 rounded cursor-crosshair bg-white"
                    onMouseDown={handleCanvasMouseDown}
                    onMouseMove={handleCanvasMouseMove}
                    onMouseUp={handleCanvasMouseUp}
                    onMouseLeave={handleCanvasMouseUp}
                  />
                </div>
                <div className="flex justify-end mt-3">
                  <button
                    onClick={clearCanvas}
                    className="px-4 py-2 text-sm text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-lg transition-colors"
                  >
                    Clear
                  </button>
                </div>
              </div>
            </div>
          )}

          {activeTab === "upload" && (
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-3">
                  Upload an image of your{" "}
                  {fieldType === "initials" ? "initials" : "signature"}
                </label>
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleFileUpload}
                    className="hidden"
                    id="signature-upload"
                  />
                  <label
                    htmlFor="signature-upload"
                    className="cursor-pointer flex flex-col items-center"
                  >
                    <Upload className="w-12 h-12 text-gray-400 mb-4" />
                    <div className="text-lg font-medium text-gray-700 mb-2">
                      Click to upload an image
                    </div>
                    <div className="text-sm text-gray-500">
                      PNG, JPG, GIF up to 10MB
                    </div>
                  </label>
                </div>

                {uploadedImage && (
                  <div className="mt-4">
                    <div className="text-sm font-medium text-gray-700 mb-2">
                      Preview:
                    </div>
                    <div className="border border-gray-200 rounded-lg p-4 bg-gray-50">
                      <img
                        src={uploadedImage}
                        alt="Uploaded signature"
                        className="max-w-full max-h-32 mx-auto"
                      />
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          {activeTab === "text" && (
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-3">
                  {fieldType === "initials" ? "Your Initials" : "Your Name"}
                </label>
                <input
                  type="text"
                  value={
                    fieldType === "initials" ? textInitials : textSignature
                  }
                  onChange={(e) =>
                    fieldType === "initials"
                      ? setTextInitials(e.target.value)
                      : setTextSignature(e.target.value)
                  }
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-CloudbyzBlue focus:border-CloudbyzBlue outline-none transition-all"
                  placeholder={
                    fieldType === "initials"
                      ? "Enter your initials"
                      : "Enter your full name"
                  }
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-3">
                  Text Color
                </label>
                <ColorPicker
                  selectedColor={textColor}
                  onColorChange={setTextColor}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-3">
                  Choose Font Style
                </label>
                <div className="grid grid-cols-2 gap-3">
                  {fonts.map((font) => (
                    <button
                      key={font.value}
                      onClick={() => setSelectedFont(font.value)}
                      className={`p-4 border-2 rounded-lg transition-all ${
                        selectedFont === font.value
                          ? "border-CloudbyzBlue bg-CloudbyzBlue/5"
                          : "border-gray-200 hover:border-gray-300"
                      }`}
                    >
                      <div className="text-sm font-medium text-gray-700 mb-2">
                        {font.name}
                      </div>
                      <div 
                        className="text-lg text-gray-800" 
                        style={{ ...font.style, color: textColor }}
                      >
                        {fieldType === "initials"
                          ? textInitials
                          : textSignature}
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              <div className="bg-gray-50 rounded-lg p-6 text-center">
                <div className="text-sm text-gray-600 mb-3">Preview:</div>
                <div
                  className="text-2xl text-gray-800 font-medium"
                  style={{ fontFamily: selectedFont, color: textColor }}
                >
                  {fieldType === "initials" ? textInitials : textSignature}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end gap-3 p-6 border-t border-gray-200 bg-gray-50">
          <button
            onClick={onClose}
            className="px-6 py-2 text-gray-600 hover:text-gray-800 hover:bg-gray-200 rounded-lg transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            className="px-6 py-2 bg-CloudbyzBlue hover:bg-CloudbyzBlue/90 text-white rounded-lg font-medium transition-colors"
          >
            Save {fieldType === "initials" ? "Initials" : "Signature"}
          </button>
        </div>
      </div>
    </div>
  );
};

const SignatureField = ({
  field,
  onFieldClick,
  canvasWidth,
  canvasHeight,
  signeeColor,
  isCompleted,
}) => {
  const getFieldIcon = () => {
    switch (field.type) {
      case "signature":
        return <PenTool className="w-4 h-4 text-gray-600" />;
      case "initials":
        return <Type className="w-4 h-4 text-gray-600" />;
      case "title":
        return <FileSignature className="w-4 h-4 text-gray-600" />;
      case "prefilled":
        return <User className="w-4 h-4 text-gray-600" />;
      default:
        return <PenTool className="w-4 h-4 text-gray-600" />;
    }
  };

  const getFieldDisplayName = () => {
    switch (field.type) {
      case "signature":
        return "Signature";
      case "initials":
        return "Initials";
      case "title":
        return "Text";
      case "prefilled":
        return "Pre-filled Info";
      default:
        return "Signature";
    }
  };

  const truncateName = (name, maxLength = 15) => {
    if (name.length <= maxLength) return name;
    return name.substring(0, maxLength) + "...";
  };

  // Calculate text dimensions for pre-filled fields
  const calculateTextDimensions = () => {
    if (field.type !== "prefilled") return null;

    const lines = [
      `Name: ${field.assignee}`,
      `Email: ${field.email || "N/A"}`,
      `Reason to sign: ${field.reason || "N/A"}`,
    ];

    const charWidth = 7;
    const lineHeight = 16;
    const padding = 16;
    const assigneeNameHeight = 28;
    const maxLineLength = Math.max(...lines.map((line) => line.length));
    const width = Math.max(200, maxLineLength * charWidth + padding);
    const height = lines.length * lineHeight + padding + assigneeNameHeight;

    return { width, height };
  };

  // Calculate actual position and size
  let actualX, actualY, actualWidth, actualHeight;

  if (field.type === "prefilled") {
    const textDimensions = calculateTextDimensions();
    if (textDimensions) {
      actualX = (field.xPercent / 100) * canvasWidth;
      actualY = (field.yPercent / 100) * canvasHeight;
      actualWidth = textDimensions.width;
      actualHeight = textDimensions.height;
    } else {
      actualX = (field.xPercent / 100) * canvasWidth;
      actualY = (field.yPercent / 100) * canvasHeight;
      actualWidth = (field.widthPercent / 100) * canvasWidth;
      actualHeight = (field.heightPercent / 100) * canvasHeight;
    }
  } else {
    actualX = (field.xPercent / 100) * canvasWidth;
    actualY = (field.yPercent / 100) * canvasHeight;
    actualWidth = (field.widthPercent / 100) * canvasWidth;
    actualHeight = (field.heightPercent / 100) * canvasHeight;
  }

  const renderFieldContent = () => {
    if (field.type === "prefilled") {
      const lines = [
        { label: "Name:", value: field.assignee },
        { label: "Email:", value: field.email || "N/A" },
        { label: "Reason to sign:", value: field.reason || "N/A" },
      ];

      return (
        <div
          className="flex flex-col justify-center h-full px-2 py-2 text-xs leading-tight"
          style={{ paddingTop: "32px" }}
        >
          {lines.map((line, index) => (
            <div
              key={index}
              className="text-gray-700 break-words text-left mb-1"
            >
              <span className="font-bold">{line.label}</span> {line.value}
            </div>
          ))}
        </div>
      );
    }

    if (isCompleted && field.signatureData) {
      // Show the actual signature
      if (field.signatureData.type === "text") {
        const textStyle = {
          fontFamily: field.signatureData.font,
          color: field.signatureData.color || '#000000',
          fontWeight: field.signatureData.bold ? 'bold' : 'normal',
          fontStyle: field.signatureData.italic ? 'italic' : 'normal',
          textDecoration: field.signatureData.underline ? 'underline' : 'none',
        };
        
        return (
          <div className="flex items-center justify-center h-full">
            <div
              className="text-lg font-medium break-words text-center"
              style={textStyle}
            >
              {field.signatureData.content}
            </div>
          </div>
        );
      } else if (
        field.signatureData.type === "draw" ||
        field.signatureData.type === "upload"
      ) {
        return (
          <div className="flex items-center justify-center h-full p-2">
            <img
              src={field.signatureData.content}
              alt="Signature"
              className="max-w-full max-h-full object-contain"
            />
          </div>
        );
      }
    }

    return (
      <div className="flex items-center justify-center h-full">
        <div className="flex items-center space-x-2 bg-white/90 px-3 py-1.5 rounded-lg shadow-sm">
          {getFieldIcon()}
          <span className="text-sm font-medium text-gray-700">
            {getFieldDisplayName()}
          </span>
        </div>
      </div>
    );
  };

  const handleClick = () => {
    if (field.type !== "prefilled" && !isCompleted) {
      onFieldClick(field);
    }
  };

  return (
    <div
      className={`absolute rounded-lg select-none shadow-lg backdrop-blur-sm transition-all duration-300 ${
        field.type === "prefilled"
          ? "bg-blue-100/80 border-2 border-blue-400"
          : isCompleted
          ? "bg-green-100/80 border-2 border-green-400"
          : "bg-yellow-100/80 border-2 border-yellow-400 cursor-pointer hover:bg-yellow-200/80"
      }`}
      style={{
        left: actualX,
        top: actualY,
        width: actualWidth,
        height: actualHeight,
        zIndex: 20,
      }}
      onClick={handleClick}
    >
      {/* Assignee name */}
      <div
        className="absolute top-1 left-1 px-2 py-1 rounded text-xs font-medium text-white flex items-center shadow-sm z-10"
        style={{
          background: `linear-gradient(135deg, ${signeeColor}, ${signeeColor}dd)`,
        }}
      >
        <User className="w-3 h-3 mr-1" />
        {truncateName(field.assignee)}
      </div>

      {/* Field content */}
      {renderFieldContent()}
    </div>
  );
};

const SigneeUI = () => {
  const navigate = useNavigate();
  const [pageUrls, setPageUrls] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageInput, setPageInput] = useState("1");
  const [signatureFields, setSignatureFields] = useState([]);
  const [canvasDimensions, setCanvasDimensions] = useState({});
  const [isLoading, setIsLoading] = useState(true);
  const [isNavigating, setIsNavigating] = useState(false);
  const [serverError, setServerError] = useState(false);
  const [currentFieldIndex, setCurrentFieldIndex] = useState(0);
  const [buttonState, setButtonState] = useState("start"); // 'start', 'next', 'finish'
  const [showSignatureModal, setShowSignatureModal] = useState(false);
  const [showTextModal, setShowTextModal] = useState(false);
  const [selectedField, setSelectedField] = useState(null);
  const [completedFields, setCompletedFields] = useState(new Set());

  const loadingStates = [
    { text: "Loading document for signing..." },
    { text: "Preparing signature interface..." },
    { text: "Checking document status..." },
    { text: "Setting up signing tools..." },
  ];

  const navigatingStates = [
    { text: "Processing signature..." },
    { text: "Validating document..." },
    { text: "Finalizing changes..." },
    { text: "Redirecting to dashboard..." },
  ];

  const numPages = pageUrls.length;

  // Mock signature fields for John Doe on pages 3, 5, and 8
  const mockSignatureFields = [
    {
      id: 1,
      type: "signature",
      xPercent: 20,
      yPercent: 70,
      widthPercent: 30,
      heightPercent: 15,
      page: 2, // Page 3 (0-indexed)
      assignee: "John Doe",
      email: "john.doe@cloudbyz.com",
      reason: "I approve this document",
    },
    {
      id: 2,
      type: "initials",
      xPercent: 60,
      yPercent: 80,
      widthPercent: 15,
      heightPercent: 12,
      page: 4, // Page 5 (0-indexed)
      assignee: "John Doe",
      email: "john.doe@cloudbyz.com",
      reason: "I approve this document",
    },
    {
      id: 3,
      type: "title",
      xPercent: 30,
      yPercent: 60,
      widthPercent: 35,
      heightPercent: 18,
      page: 7, // Page 8 (0-indexed)
      assignee: "John Doe",
      email: "john.doe@cloudbyz.com",
      reason: "I approve this document",
    },
  ];

  const drawImageOnCanvas = useCallback((canvas, imageUrl, pageIndex) => {
    const ctx = canvas.getContext("2d");
    const img = new Image();
    img.crossOrigin = "anonymous";

    img.onload = () => {
      const container = canvas.parentElement;
      const containerWidth = container.clientWidth;

      canvas.width = containerWidth;
      const aspectRatio = img.height / img.width;
      canvas.height = containerWidth * aspectRatio;

      setCanvasDimensions((prev) => ({
        ...prev,
        [pageIndex]: {
          width: canvas.width,
          height: canvas.height,
        },
      }));

      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
    };

    img.src = imageUrl;
  }, []);

  useEffect(() => {
    const username = localStorage.getItem("username");
    if (!username) {
      navigate("/signin");
      return;
    }

    const fetchData = async () => {
      try {
        const response = await fetch("http://localhost:5000/api/images");
        if (!response.ok) {
          throw new Error("Server connection failed");
        }

        const data = await response.json();
        setPageUrls(data.images);
        setSignatureFields(mockSignatureFields);
      } catch (error) {
        console.error("Error fetching data:", error);
        setServerError(true);
      } finally {
        setTimeout(() => setIsLoading(false), 3000);
      }
    };

    fetchData();
  }, [navigate]);

  useEffect(() => {
    const initializeCanvases = () => {
      pageUrls.forEach((url, index) => {
        const pageCanvas = document.getElementById(`page-${index}`);
        if (pageCanvas) drawImageOnCanvas(pageCanvas, url, index);
      });
    };

    if (pageUrls.length > 0) {
      setTimeout(initializeCanvases, 100);
    }

    const handleResize = () => {
      clearTimeout(window.resizeTimeout);
      window.resizeTimeout = setTimeout(initializeCanvases, 150);
    };

    window.addEventListener("resize", handleResize);
    return () => {
      window.removeEventListener("resize", handleResize);
      clearTimeout(window.resizeTimeout);
    };
  }, [drawImageOnCanvas, pageUrls]);

  // Update current page based on scroll position
  useEffect(() => {
    const handleScroll = () => {
      const mainContainer = document.getElementById("main-container");
      if (!mainContainer) return;

      const containerRect = mainContainer.getBoundingClientRect();
      const containerTop = containerRect.top;
      const containerHeight = containerRect.height;
      const centerY = containerTop + containerHeight / 2;

      let closestPage = 1;
      let closestDistance = Infinity;

      for (let i = 1; i <= numPages; i++) {
        const pageElement = document.getElementById(`page-container-${i}`);
        if (pageElement) {
          const pageRect = pageElement.getBoundingClientRect();
          const pageCenter = pageRect.top + pageRect.height / 2;
          const distance = Math.abs(pageCenter - centerY);

          if (distance < closestDistance) {
            closestDistance = distance;
            closestPage = i;
          }
        }
      }

      if (closestPage !== currentPage) {
        setCurrentPage(closestPage);
      }
    };

    const mainContainer = document.getElementById("main-container");
    if (mainContainer) {
      mainContainer.addEventListener("scroll", handleScroll);
      return () => mainContainer.removeEventListener("scroll", handleScroll);
    }
  }, [currentPage, numPages]);

  const scrollToPage = useCallback(
    (pageNum) => {
      const newPageNum = Math.max(1, Math.min(pageNum, numPages));
      const pageElement = document.getElementById(
        `page-container-${newPageNum}`
      );
      if (pageElement) {
        pageElement.scrollIntoView({
          behavior: "smooth",
          block: "start",
        });
        setCurrentPage(newPageNum);
      }
    },
    [numPages]
  );

  const scrollToField = (fieldIndex) => {
    const field = signatureFields[fieldIndex];
    if (!field) return;

    const pageElement = document.getElementById(
      `page-container-${field.page + 1}`
    );
    const canvas = document.getElementById(`page-${field.page}`);

    if (pageElement && canvas && canvasDimensions[field.page]) {
      const canvasRect = canvas.getBoundingClientRect();
      const canvasWidth = canvasDimensions[field.page].width;
      const canvasHeight = canvasDimensions[field.page].height;

      const fieldX = (field.xPercent / 100) * canvasWidth;
      const fieldY = (field.yPercent / 100) * canvasHeight;
      const fieldWidth = (field.widthPercent / 100) * canvasWidth;
      const fieldHeight = (field.heightPercent / 100) * canvasHeight;

      const fieldCenterY = fieldY + fieldHeight / 2;

      const mainContainer = document.getElementById("main-container");
      if (mainContainer) {
        const containerHeight = mainContainer.clientHeight;
        const pageRect = pageElement.getBoundingClientRect();
        const mainContainerRect = mainContainer.getBoundingClientRect();

        const targetScrollTop =
          mainContainer.scrollTop +
          (pageRect.top - mainContainerRect.top) +
          fieldCenterY -
          containerHeight / 2;

        mainContainer.scrollTo({
          top: targetScrollTop,
          behavior: "smooth",
        });
      }
    }
  };

  useEffect(() => {
    setPageInput(String(currentPage));
  }, [currentPage]);

  const handlePageInputChange = (e) => {
    setPageInput(e.target.value);
  };

  const handlePageInputSubmit = (e) => {
    if (e.type === "blur" || (e.type === "keydown" && e.key === "Enter")) {
      const newPage = parseInt(pageInput, 10);
      if (!isNaN(newPage) && newPage >= 1 && newPage <= numPages) {
        scrollToPage(newPage);
        if (e.key === "Enter" && document.activeElement) {
          document.activeElement.blur();
        }
      } else {
        setPageInput(String(currentPage));
      }
    }
  };

  const navigatePage = (direction) => {
    let newPage = currentPage + direction;
    newPage = Math.max(1, Math.min(newPage, numPages));
    scrollToPage(newPage);
  };

  const handleBack = () => {
    navigate("/manage");
  };

  const handleButtonClick = () => {
    if (buttonState === "start") {
      // Navigate to first signature field
      setCurrentFieldIndex(0);
      scrollToField(0);
      setButtonState("next");
    } else if (buttonState === "next") {
      // Check if current field is signed before proceeding
      const currentField = signatureFields[currentFieldIndex];
      if (currentField && !completedFields.has(currentField.id)) {
        // Current field is not signed, don't proceed
        return;
      }

      // Navigate to next signature field
      const nextIndex = currentFieldIndex + 1;
      if (nextIndex < signatureFields.length) {
        setCurrentFieldIndex(nextIndex);
        scrollToField(nextIndex);
      } else {
        // All fields visited, check if all are signed
        if (completedFields.size === signatureFields.length) {
          setButtonState("finish");
        }
      }
    }
  };

  const handleFinish = async () => {
    setIsNavigating(true);

    try {
      const response = await fetch("http://localhost:5000/api/stats");
      if (!response.ok) {
        throw new Error("Server connection failed");
      }

      await new Promise((resolve) => setTimeout(resolve, 3000));

      navigate("/home");
    } catch (error) {
      console.error("Server error:", error);
      setServerError(true);
    } finally {
      setIsNavigating(false);
    }
  };

  const handleFieldClick = (field) => {
    setSelectedField(field);
    if (field.type === "title") {
      setShowTextModal(true);
    } else {
      setShowSignatureModal(true);
    }
  };

  const handleSignatureSave = (signatureData) => {
    if (selectedField) {
      // Update the field with signature data
      setSignatureFields((fields) =>
        fields.map((field) =>
          field.id === selectedField.id ? { ...field, signatureData } : field
        )
      );

      // Mark field as completed
      setCompletedFields((prev) => new Set([...prev, selectedField.id]));

      // Check if all fields are completed
      const newCompletedFields = new Set([
        ...completedFields,
        selectedField.id,
      ]);
      if (newCompletedFields.size === signatureFields.length) {
        setButtonState("finish");
      }
    }
  };

  const handleTextSave = (textData) => {
    if (selectedField) {
      // Update the field with text data
      setSignatureFields((fields) =>
        fields.map((field) =>
          field.id === selectedField.id ? { ...field, signatureData: textData } : field
        )
      );

      // Mark field as completed
      setCompletedFields((prev) => new Set([...prev, selectedField.id]));

      // Check if all fields are completed
      const newCompletedFields = new Set([
        ...completedFields,
        selectedField.id,
      ]);
      if (newCompletedFields.size === signatureFields.length) {
        setButtonState("finish");
      }
    }
  };

  const getButtonText = () => {
    switch (buttonState) {
      case "start":
        return "Start";
      case "next":
        return "Next";
      case "finish":
        return "Finish";
      default:
        return "Start";
    }
  };

  const isButtonDisabled = () => {
    if (buttonState === "next") {
      // Check if current field is signed
      const currentField = signatureFields[currentFieldIndex];
      if (currentField && !completedFields.has(currentField.id)) {
        return true;
      }
      // Check if we've reached the last field and not all are completed
      return currentFieldIndex >= signatureFields.length - 1 && completedFields.size < signatureFields.length;
    }
    return false;
  };

  const isFinishButtonDisabled = () => {
    return completedFields.size < signatureFields.length;
  };

  if (serverError) {
    return <Error404 />;
  }

  if (numPages === 0) {
    return (
      <div className="flex flex-col h-screen bg-slate-100 text-slate-800 font-sans items-center justify-center">
        <Loader loading={isLoading}>
          {loadingStates}
        </Loader>
        <Navbar />
        <p className="text-2xl font-semibold text-slate-600">
          Loading document...
        </p>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-screen bg-slate-100 text-slate-800 font-sans min-w-[768px]">
      <Loader loading={isLoading}>
        {loadingStates}
      </Loader>
      <Loader loading={isNavigating}>
        {navigatingStates}
      </Loader>

      <Navbar />

      <header className="bg-gradient-to-r from-CloudbyzBlue/10 via-white/70 to-CloudbyzBlue/10 backdrop-blur-sm shadow-sm px-6 py-3 flex items-center fixed top-16 left-0 right-0 z-20">
        <div className="flex items-center w-1/3">
          <button
            onClick={handleBack}
            className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-slate-700 hover:text-slate-900 bg-slate-100 hover:bg-slate-200 rounded-lg transition-all duration-200 group"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={2}
              stroke="currentColor"
              className="w-4 h-4 transition-transform duration-200 group-hover:-translate-x-1"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18"
              />
            </svg>
            Back
          </button>
        </div>

        <div className="flex items-center gap-4 justify-center w-1/3">
          <button
            onClick={() => navigatePage(-1)}
            disabled={currentPage <= 1}
            className="w-8 h-8 flex items-center justify-center rounded-full bg-white border border-slate-200 hover:bg-slate-50 hover:border-slate-300 disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:bg-white disabled:hover:border-slate-200 transition-all duration-200"
            title="Previous Page"
          >
            <span className="text-xl text-slate-600 transform -translate-y-[1px]">
              ‹
            </span>
          </button>
          <input
            type="text"
            value={pageInput}
            onChange={handlePageInputChange}
            onBlur={handlePageInputSubmit}
            onKeyDown={handlePageInputSubmit}
            className="w-12 text-center text-sm bg-white text-slate-700 border border-slate-300 rounded-md py-1.5 focus:outline-none focus:ring-2 focus:ring-CloudbyzBlue focus:border-CloudbyzBlue transition-shadow"
          />
          <span className="px-1 text-sm text-slate-500">of {numPages}</span>
          <button
            onClick={() => navigatePage(1)}
            disabled={currentPage >= numPages}
            className="w-8 h-8 flex items-center justify-center rounded-full bg-white border border-slate-200 hover:bg-slate-50 hover:border-slate-300 disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:bg-white disabled:hover:border-slate-200 transition-all duration-200"
            title="Next Page"
          >
            <span className="text-xl text-slate-600 transform -translate-y-[1px]">
              ›
            </span>
          </button>
        </div>

        <div className="w-1/3 flex justify-end">
          <button
            onClick={handleFinish}
            disabled={isFinishButtonDisabled()}
            className={`px-6 py-2 rounded-lg font-semibold shadow-lg transition-all duration-300 flex items-center space-x-2 ${
              isFinishButtonDisabled()
                ? "bg-gray-300 text-gray-500 cursor-not-allowed opacity-60"
                : "bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white hover:shadow-xl hover:scale-105"
            }`}
          >
            <span>Finish</span>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={2}
              stroke="currentColor"
              className="w-4 h-4"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M4.5 12.75l6 6 9-13.5"
              />
            </svg>
          </button>
        </div>
      </header>

      <div className="flex flex-row flex-grow pt-30 relative">
        {/* Left spacing with Start/Next button - 12.5% */}
        <div className="w-[12.5%] flex items-center justify-center" style={{ marginTop: "120px" }}>
          {buttonState !== "finish" && (
            <button
              onClick={handleButtonClick}
              disabled={isButtonDisabled()}
              className={`px-6 py-3 rounded-lg font-semibold shadow-lg transition-all duration-300 flex items-center space-x-2 ${
                isButtonDisabled()
                  ? "bg-gray-300 text-gray-500 cursor-not-allowed opacity-60"
                  : "bg-gradient-to-r from-CloudbyzBlue to-CloudbyzBlue/80 hover:from-CloudbyzBlue/90 hover:to-CloudbyzBlue/70 text-white hover:scale-105"
              }`}
            >
              <span>{getButtonText()}</span>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={2}
                stroke="currentColor"
                className="w-4 h-4"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3"
                />
              </svg>
            </button>
          )}
        </div>

        {/* Main PDF area - 75% */}
        <main
          id="main-container"
          className="w-[75%] h-full overflow-y-auto bg-slate-200 transition-all duration-300 ease-in-out"
          style={{ maxHeight: "calc(100vh - 120px)", marginTop: "120px" }}
        >
          {pageUrls.map((url, index) => (
            <div
              id={`page-container-${index + 1}`}
              key={`page-container-${index + 1}`}
              className="mb-6 relative"
              style={{
                width: "100%",
                transition: "all 0.3s ease-in-out",
              }}
            >
              <div className="w-full relative">
                <canvas
                  id={`page-${index}`}
                  data-page-number={index + 1}
                  className="w-full h-auto shadow-xl cursor-default"
                  style={{
                    display: "block",
                    width: "100%",
                    height: "auto",
                  }}
                />

                {/* Render signature fields for this page */}
                {signatureFields
                  .filter((field) => field.page === index)
                  .map((field) => (
                    <SignatureField
                      key={field.id}
                      field={field}
                      onFieldClick={handleFieldClick}
                      canvasWidth={canvasDimensions[index]?.width || 0}
                      canvasHeight={canvasDimensions[index]?.height || 0}
                      signeeColor="#009edb"
                      isCompleted={completedFields.has(field.id)}
                    />
                  ))}
              </div>
            </div>
          ))}
        </main>

        {/* Right spacing - 12.5% */}
        <div className="w-[12.5%]" style={{ marginTop: "120px" }}></div>
      </div>

      {/* Signature Modal */}
      <SignatureModal
        isOpen={showSignatureModal}
        onClose={() => setShowSignatureModal(false)}
        fieldType={selectedField?.type}
        onSave={handleSignatureSave}
      />

      {/* Text Modal */}
      <TextModal
        isOpen={showTextModal}
        onClose={() => setShowTextModal(false)}
        onSave={handleTextSave}
        initialText=""
      />
    </div>
  );
};

export default SigneeUI;