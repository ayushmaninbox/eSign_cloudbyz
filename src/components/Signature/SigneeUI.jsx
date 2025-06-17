import React, { useState, useEffect, useCallback, useRef } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { User, Settings, LogOut, UserCircle, X, Upload, Type, PenTool, Palette, Minus, Plus } from "lucide-react";
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
  const location = useLocation();
  const [showProfileModal, setShowProfileModal] = useState(false);

  const handleBack = () => {
    if (location.state?.from === "/manage") {
      navigate("/manage");
    } else if (location.state?.from === "/signsetupui") {
      navigate("/signsetupui");
    } else {
      navigate("/home");
    }
  };

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

const DrawingCanvas = ({ onSave, color, thickness }) => {
  const canvasRef = useRef(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [lastPoint, setLastPoint] = useState(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    ctx.strokeStyle = color;
    ctx.lineWidth = thickness;
    
    // Enable smoothing
    ctx.imageSmoothingEnabled = true;
    ctx.imageSmoothingQuality = 'high';
  }, [color, thickness]);

  const getEventPos = (e) => {
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
    const pos = getEventPos(e);
    setIsDrawing(true);
    setLastPoint(pos);
    
    // Start a new path
    const ctx = canvasRef.current.getContext('2d');
    ctx.beginPath();
    ctx.moveTo(pos.x, pos.y);
  };

  const draw = (e) => {
    if (!isDrawing) return;
    
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    const pos = getEventPos(e);
    
    // Draw smooth line
    ctx.lineTo(pos.x, pos.y);
    ctx.stroke();
    
    setLastPoint(pos);
  };

  const stopDrawing = () => {
    setIsDrawing(false);
    setLastPoint(null);
  };

  const clearCanvas = () => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    ctx.clearRect(0, 0, canvas.width, canvas.height);
  };

  const saveSignature = () => {
    const canvas = canvasRef.current;
    const dataURL = canvas.toDataURL('image/png');
    onSave(dataURL);
  };

  return (
    <div className="space-y-4">
      <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 bg-gray-50">
        <canvas
          ref={canvasRef}
          width={500}
          height={200}
          className="w-full bg-white rounded border cursor-crosshair"
          style={{ height: '200px' }}
          onMouseDown={startDrawing}
          onMouseMove={draw}
          onMouseUp={stopDrawing}
          onMouseLeave={stopDrawing}
        />
      </div>
      <div className="flex justify-between">
        <button
          onClick={clearCanvas}
          className="px-4 py-2 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
        >
          Clear
        </button>
        <button
          onClick={saveSignature}
          className="px-6 py-2 bg-CloudbyzBlue text-white rounded-lg hover:bg-CloudbyzBlue/90 transition-colors"
        >
          Save Signature
        </button>
      </div>
    </div>
  );
};

const FontSelector = ({ selectedFont, onFontChange, text }) => {
  const fonts = [
    { name: 'Brush Script MT', value: 'Brush Script MT, cursive' },
    { name: 'Lucida Handwriting', value: 'Lucida Handwriting, cursive' },
    { name: 'Dancing Script', value: 'Dancing Script, cursive' },
    { name: 'Pacifico', value: 'Pacifico, cursive' },
    { name: 'Great Vibes', value: 'Great Vibes, cursive' },
    { name: 'Allura', value: 'Allura, cursive' }
  ];

  return (
    <div className="space-y-4">
      <div className="grid gap-3">
        {fonts.map((font) => (
          <button
            key={font.value}
            onClick={() => onFontChange(font.value)}
            className={`p-4 border-2 rounded-lg text-left transition-all ${
              selectedFont === font.value
                ? 'border-CloudbyzBlue bg-CloudbyzBlue/5'
                : 'border-gray-200 hover:border-gray-300'
            }`}
          >
            <div
              style={{ fontFamily: font.value, fontSize: '24px' }}
              className="text-gray-800"
            >
              {text || 'John Doe'}
            </div>
            <div className="text-sm text-gray-500 mt-1">{font.name}</div>
          </button>
        ))}
      </div>
    </div>
  );
};

const SignatureModal = ({ isOpen, onClose, onSave, fieldType, userName }) => {
  const [activeTab, setActiveTab] = useState('draw');
  const [color, setColor] = useState('#000000');
  const [thickness, setThickness] = useState(3);
  const [selectedFont, setSelectedFont] = useState('Brush Script MT, cursive');
  const [textValue, setTextValue] = useState(userName || 'John Doe');
  const fileInputRef = useRef(null);

  if (!isOpen) return null;

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (file && file.type.startsWith('image/')) {
      const reader = new FileReader();
      reader.onload = (event) => {
        onSave(event.target.result);
        onClose();
      };
      reader.readAsDataURL(file);
    }
  };

  const handleTextSave = () => {
    const canvas = document.createElement('canvas');
    canvas.width = 400;
    canvas.height = fieldType === 'initials' ? 80 : 120;
    const ctx = canvas.getContext('2d');
    
    ctx.fillStyle = 'white';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    ctx.fillStyle = color;
    ctx.font = `${fieldType === 'initials' ? '32px' : '40px'} ${selectedFont}`;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(textValue, canvas.width / 2, canvas.height / 2);
    
    const dataURL = canvas.toDataURL();
    onSave(dataURL);
    onClose();
  };

  const getModalTitle = () => {
    switch (fieldType) {
      case 'signature':
        return 'Add Signature';
      case 'initials':
        return 'Add Initials';
      case 'title':
        return 'Add Text';
      default:
        return 'Add Signature';
    }
  };

  const getPlaceholderText = () => {
    switch (fieldType) {
      case 'initials':
        return userName ? userName.split(' ').map(n => n[0]).join('') : 'JD';
      case 'title':
        return 'Enter text';
      default:
        return userName || 'John Doe';
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200 bg-gradient-to-r from-CloudbyzBlue/5 to-CloudbyzBlue/10">
          <h2 className="text-xl font-bold text-gray-800">{getModalTitle()}</h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
          >
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        {/* Tabs */}
        {fieldType === 'signature' && (
          <div className="flex border-b border-gray-200">
            <button
              onClick={() => setActiveTab('draw')}
              className={`flex-1 px-6 py-3 text-sm font-medium transition-colors ${
                activeTab === 'draw'
                  ? 'text-CloudbyzBlue border-b-2 border-CloudbyzBlue bg-CloudbyzBlue/5'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              <PenTool className="w-4 h-4 inline mr-2" />
              Draw
            </button>
            <button
              onClick={() => setActiveTab('upload')}
              className={`flex-1 px-6 py-3 text-sm font-medium transition-colors ${
                activeTab === 'upload'
                  ? 'text-CloudbyzBlue border-b-2 border-CloudbyzBlue bg-CloudbyzBlue/5'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              <Upload className="w-4 h-4 inline mr-2" />
              Upload
            </button>
            <button
              onClick={() => setActiveTab('text')}
              className={`flex-1 px-6 py-3 text-sm font-medium transition-colors ${
                activeTab === 'text'
                  ? 'text-CloudbyzBlue border-b-2 border-CloudbyzBlue bg-CloudbyzBlue/5'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              <Type className="w-4 h-4 inline mr-2" />
              Text
            </button>
          </div>
        )}

        {/* Content */}
        <div className="p-6 max-h-96 overflow-y-auto">
          {/* Drawing Tab */}
          {(activeTab === 'draw' || fieldType !== 'signature') && (fieldType === 'signature' || fieldType === 'title') && (
            <div className="space-y-6">
              {/* Controls */}
              <div className="flex items-center gap-6 p-4 bg-gray-50 rounded-lg">
                <div className="flex items-center gap-3">
                  <Palette className="w-5 h-5 text-gray-600" />
                  <label className="text-sm font-medium text-gray-700">Color:</label>
                  <input
                    type="color"
                    value={color}
                    onChange={(e) => setColor(e.target.value)}
                    className="w-10 h-10 rounded-lg border border-gray-300 cursor-pointer"
                  />
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-sm font-medium text-gray-700">Thickness:</span>
                  <button
                    onClick={() => setThickness(Math.max(1, thickness - 1))}
                    className="p-1 hover:bg-gray-200 rounded"
                  >
                    <Minus className="w-4 h-4" />
                  </button>
                  <span className="w-8 text-center text-sm">{thickness}</span>
                  <button
                    onClick={() => setThickness(Math.min(10, thickness + 1))}
                    className="p-1 hover:bg-gray-200 rounded"
                  >
                    <Plus className="w-4 h-4" />
                  </button>
                  <div className="w-12 h-6 bg-white border rounded flex items-center justify-center">
                    <div
                      className="rounded-full"
                      style={{
                        width: `${thickness * 2}px`,
                        height: `${thickness * 2}px`,
                        backgroundColor: color
                      }}
                    />
                  </div>
                </div>
              </div>
              <DrawingCanvas onSave={onSave} color={color} thickness={thickness} />
            </div>
          )}

          {/* Upload Tab */}
          {activeTab === 'upload' && fieldType === 'signature' && (
            <div className="space-y-4">
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
                <Upload className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-600 mb-4">Upload your signature image</p>
                <button
                  onClick={() => fileInputRef.current?.click()}
                  className="px-6 py-2 bg-CloudbyzBlue text-white rounded-lg hover:bg-CloudbyzBlue/90 transition-colors"
                >
                  Choose File
                </button>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleFileUpload}
                  className="hidden"
                />
              </div>
            </div>
          )}

          {/* Text Tab */}
          {(activeTab === 'text' || fieldType === 'initials') && (
            <div className="space-y-6">
              {/* Color Picker */}
              <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-lg">
                <Palette className="w-5 h-5 text-gray-600" />
                <label className="text-sm font-medium text-gray-700">Color:</label>
                <input
                  type="color"
                  value={color}
                  onChange={(e) => setColor(e.target.value)}
                  className="w-10 h-10 rounded-lg border border-gray-300 cursor-pointer"
                />
              </div>

              {/* Text Input */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {fieldType === 'initials' ? 'Initials' : 'Text'}:
                </label>
                <input
                  type="text"
                  value={textValue}
                  onChange={(e) => setTextValue(e.target.value)}
                  placeholder={getPlaceholderText()}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-CloudbyzBlue focus:border-CloudbyzBlue"
                />
              </div>

              {/* Font Selector */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-3">
                  Choose Style:
                </label>
                <FontSelector
                  selectedFont={selectedFont}
                  onFontChange={setSelectedFont}
                  text={textValue}
                />
              </div>

              <button
                onClick={handleTextSave}
                className="w-full px-6 py-3 bg-CloudbyzBlue text-white rounded-lg hover:bg-CloudbyzBlue/90 transition-colors font-medium"
              >
                Save {fieldType === 'initials' ? 'Initials' : 'Text'}
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

const SignaturePlaceholder = ({ 
  field, 
  isActive, 
  onClick, 
  onSign, 
  signeeColor, 
  isSigned 
}) => {
  const [showModal, setShowModal] = useState(false);

  const handleSign = (signatureData) => {
    onSign(field.id, signatureData);
    setShowModal(false);
  };

  const getFieldDisplayName = () => {
    switch (field.type) {
      case 'signature':
        return 'Signature';
      case 'initials':
        return 'Initials';
      case 'title':
        return 'Text';
      default:
        return 'Signature';
    }
  };

  return (
    <>
      <div
        className={`absolute rounded-lg border-2 transition-all duration-300 cursor-pointer ${
          isActive
            ? 'border-CloudbyzBlue bg-CloudbyzBlue/10 shadow-lg scale-105'
            : isSigned
            ? 'border-green-500 bg-green-50'
            : 'border-gray-400 bg-gray-100/80 hover:border-CloudbyzBlue/60 hover:bg-CloudbyzBlue/5'
        }`}
        style={{
          left: `${field.xPercent}%`,
          top: `${field.yPercent}%`,
          width: `${field.widthPercent}%`,
          height: `${field.heightPercent}%`,
          zIndex: isActive ? 30 : 20,
        }}
        onClick={onClick}
      >
        {/* Assignee name tag */}
        <div 
          className="absolute -top-8 left-0 px-3 py-1 rounded-full text-xs font-medium text-white shadow-sm"
          style={{ backgroundColor: signeeColor }}
        >
          {field.assignee}
        </div>

        {/* Content */}
        <div className="flex items-center justify-center h-full p-2">
          {isSigned ? (
            <div className="w-full h-full flex items-center justify-center">
              <img 
                src={field.signatureData} 
                alt="Signature" 
                className="max-w-full max-h-full object-contain"
              />
            </div>
          ) : (
            <div className="text-center">
              <div className={`text-sm font-medium ${
                isActive ? 'text-CloudbyzBlue' : 'text-gray-600'
              }`}>
                Click to {getFieldDisplayName()}
              </div>
              {isActive && (
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setShowModal(true);
                  }}
                  className="mt-2 px-4 py-2 bg-CloudbyzBlue text-white text-xs rounded-lg hover:bg-CloudbyzBlue/90 transition-colors"
                >
                  Start
                </button>
              )}
            </div>
          )}
        </div>
      </div>

      <SignatureModal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        onSave={handleSign}
        fieldType={field.type}
        userName={field.assignee}
      />
    </>
  );
};

function SigneeUI() {
  const navigate = useNavigate();
  const location = useLocation();
  const [pageUrls, setPageUrls] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageInput, setPageInput] = useState("1");
  const [signatureFields, setSignatureFields] = useState([]);
  const [canvasDimensions, setCanvasDimensions] = useState({});
  const [currentFieldIndex, setCurrentFieldIndex] = useState(0);
  const [signedFields, setSignedFields] = useState(new Set());
  const [hasStarted, setHasStarted] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isNavigating, setIsNavigating] = useState(false);
  const [serverError, setServerError] = useState(false);

  const recipientColors = [
    "#009edb",
    "#10B981",
    "#F97316",
    "#8B5CF6",
    "#EC4899",
    "#14B8A6",
    "#EF4444",
  ];

  const loadingStates = [
    { text: "Loading document..." },
    { text: "Preparing signature fields..." },
    { text: "Setting up signing interface..." },
    { text: "Ready to sign..." },
  ];

  const navigatingStates = [
    { text: "Saving signatures..." },
    { text: "Finalizing document..." },
    { text: "Processing completion..." },
    { text: "Redirecting..." },
  ];

  const numPages = pageUrls.length;

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

        // Mock signature fields for John Doe
        const mockFields = [
          {
            id: 1,
            type: "signature",
            xPercent: 20,
            yPercent: 70,
            widthPercent: 25,
            heightPercent: 8,
            page: 0,
            assignee: "John Doe",
            email: "john.doe@cloudbyz.com",
            reason: "I approve this document",
          },
          {
            id: 2,
            type: "initials",
            xPercent: 60,
            yPercent: 75,
            widthPercent: 10,
            heightPercent: 6,
            page: 0,
            assignee: "John Doe",
            email: "john.doe@cloudbyz.com",
            reason: "I approve this document",
          },
          {
            id: 3,
            type: "title",
            xPercent: 30,
            yPercent: 85,
            widthPercent: 20,
            heightPercent: 6,
            page: 1,
            assignee: "John Doe",
            email: "john.doe@cloudbyz.com",
            reason: "I approve this document",
          },
        ];

        setSignatureFields(mockFields);
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

  const scrollToFieldCenter = useCallback((fieldIndex) => {
    const field = signatureFields[fieldIndex];
    if (!field || !canvasDimensions[field.page]) return;

    const mainContainer = document.getElementById("main-container");
    const pageElement = document.getElementById(`page-container-${field.page + 1}`);
    const canvas = document.getElementById(`page-${field.page}`);
    
    if (mainContainer && pageElement && canvas) {
      const containerRect = mainContainer.getBoundingClientRect();
      const pageRect = pageElement.getBoundingClientRect();
      const canvasRect = canvas.getBoundingClientRect();
      
      // Calculate field position
      const fieldCenterY = (field.yPercent / 100) * canvasDimensions[field.page].height + 
                          (field.heightPercent / 100) * canvasDimensions[field.page].height / 2;
      
      // Calculate scroll position to center the field
      const targetScrollTop = mainContainer.scrollTop + 
        (pageRect.top - containerRect.top) + 
        fieldCenterY - (containerRect.height / 2);
      
      mainContainer.scrollTo({
        top: targetScrollTop,
        behavior: 'smooth'
      });
    }
  }, [signatureFields, canvasDimensions]);

  const scrollToPage = useCallback(
    (pageNum) => {
      const newPageNum = Math.max(1, Math.min(pageNum, numPages));
      const pageElement = document.getElementById(`page-container-${newPageNum}`);
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
    if (location.state?.from === "/manage") {
      navigate("/manage");
    } else if (location.state?.from === "/signsetupui") {
      navigate("/signsetupui");
    } else {
      navigate("/home");
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
      navigate("/signpreview", { state: { from: "/signeeui" } });
    } catch (error) {
      console.error("Server error:", error);
      setServerError(true);
    } finally {
      setIsNavigating(false);
    }
  };

  const handleStart = () => {
    setHasStarted(true);
    scrollToFieldCenter(0);
  };

  const handleNext = () => {
    if (currentFieldIndex < signatureFields.length - 1) {
      const nextIndex = currentFieldIndex + 1;
      setCurrentFieldIndex(nextIndex);
      scrollToFieldCenter(nextIndex);
    }
  };

  const handleFieldClick = (fieldIndex) => {
    if (fieldIndex === currentFieldIndex && hasStarted) {
      // Current field clicked - allow signing
      return;
    }
  };

  const handleFieldSign = (fieldId, signatureData) => {
    setSignatureFields(fields => 
      fields.map(field => 
        field.id === fieldId 
          ? { ...field, signatureData }
          : field
      )
    );
    setSignedFields(prev => new Set([...prev, fieldId]));
  };

  const getSigneeColor = (signeeName) => {
    return recipientColors[0]; // John Doe gets the first color
  };

  const isCurrentFieldSigned = signedFields.has(signatureFields[currentFieldIndex]?.id);
  const allFieldsSigned = signatureFields.every(field => signedFields.has(field.id));

  if (serverError) {
    return <Error404 />;
  }

  if (numPages === 0) {
    return (
      <div className="flex flex-col h-screen bg-slate-100 text-slate-800 font-sans items-center justify-center">
        <Loader loading={isLoading}>{loadingStates}</Loader>
        <Navbar />
        <p className="text-2xl font-semibold text-slate-600">
          Loading document...
        </p>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-screen bg-slate-100 text-slate-800 font-sans min-w-[768px]">
      <Loader loading={isLoading}>{loadingStates}</Loader>
      <Loader loading={isNavigating}>{navigatingStates}</Loader>
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

        <div className="w-1/3 flex justify-end gap-3">
          {!hasStarted && (
            <button
              onClick={handleStart}
              className="bg-gradient-to-r from-CloudbyzBlue to-CloudbyzBlue/80 hover:from-CloudbyzBlue/90 hover:to-CloudbyzBlue/70 text-white px-6 py-2 rounded-lg font-semibold shadow-lg hover:shadow-xl transition-all duration-300 flex items-center space-x-2 hover:scale-105"
            >
              <span>Start</span>
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
                  d="M5.25 5.653c0-.856.917-1.398 1.667-.986l11.54 6.347a1.125 1.125 0 0 1 0 1.972l-11.54 6.347a1.125 1.125 0 0 1-1.667-.986V5.653Z"
                />
              </svg>
            </button>
          )}
          
          {hasStarted && !allFieldsSigned && (
            <button
              onClick={handleNext}
              disabled={!isCurrentFieldSigned}
              className={`px-6 py-2 rounded-lg font-semibold shadow-lg transition-all duration-300 flex items-center space-x-2 ${
                isCurrentFieldSigned
                  ? 'bg-gradient-to-r from-CloudbyzBlue to-CloudbyzBlue/80 hover:from-CloudbyzBlue/90 hover:to-CloudbyzBlue/70 text-white hover:scale-105'
                  : 'bg-gray-300 text-gray-500 cursor-not-allowed opacity-60'
              }`}
            >
              <span>Next</span>
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
          
          {allFieldsSigned && (
            <button
              onClick={handleFinish}
              className="bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white px-6 py-2 rounded-lg font-semibold shadow-lg hover:shadow-xl transition-all duration-300 flex items-center space-x-2 hover:scale-105"
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
          )}
        </div>
      </header>

      <div className="flex flex-row flex-grow pt-30 relative">
        {/* Left spacing with fixed button */}
        <div className="w-[10%] relative" style={{ marginTop: "120px" }}>
          {/* Fixed button in left space */}
          <div className="fixed left-4 top-1/2 transform -translate-y-1/2 z-10">
            <div className="bg-white rounded-lg shadow-lg p-3 border border-gray-200">
              <div className="text-xs text-gray-500 mb-2">Progress</div>
              <div className="text-sm font-semibold text-gray-800">
                {signedFields.size} / {signatureFields.length}
              </div>
              <div className="w-16 h-2 bg-gray-200 rounded-full mt-2">
                <div 
                  className="h-full bg-CloudbyzBlue rounded-full transition-all duration-300"
                  style={{ width: `${(signedFields.size / signatureFields.length) * 100}%` }}
                />
              </div>
            </div>
          </div>
        </div>

        <main
          id="main-container"
          className="w-[80%] h-full overflow-y-auto bg-slate-200 transition-all duration-300 ease-in-out"
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

                {/* Render signature placeholders for this page */}
                {signatureFields
                  .filter((field) => field.page === index)
                  .map((field, fieldIndex) => {
                    const globalFieldIndex = signatureFields.findIndex(f => f.id === field.id);
                    return (
                      <SignaturePlaceholder
                        key={field.id}
                        field={field}
                        isActive={globalFieldIndex === currentFieldIndex && hasStarted}
                        onClick={() => handleFieldClick(globalFieldIndex)}
                        onSign={handleFieldSign}
                        signeeColor={getSigneeColor(field.assignee)}
                        isSigned={signedFields.has(field.id)}
                      />
                    );
                  })}
              </div>
            </div>
          ))}
        </main>

        <div className="w-[10%]" style={{ marginTop: "120px" }}></div>
      </div>
    </div>
  );
}

export default SigneeUI;