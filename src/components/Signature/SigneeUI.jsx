import React, { useState, useEffect, useCallback, useRef } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { User, Settings, LogOut, UserCircle, X, ChevronDown, PenTool, Type, FileText, Bold, Italic, Underline } from 'lucide-react';
import Loader from '../ui/Loader';
import Error404 from '../ui/404error';

const ProfileModal = ({ isOpen, onClose }) => {
  const navigate = useNavigate();

  if (!isOpen) return null;

  const handleLogout = () => {
    localStorage.removeItem('username');
    localStorage.removeItem('useremail');
    navigate('/');
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
    const username = localStorage.getItem('username');
    if (username) {
      navigate('/home');
    } else {
      navigate('/');
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

const SignatureModal = ({ isOpen, onClose, onSave }) => {
  const canvasRef = useRef(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [selectedColor, setSelectedColor] = useState('#000000');
  const [selectedReason, setSelectedReason] = useState('');
  const [showReasonDropdown, setShowReasonDropdown] = useState(false);
  const [signatureReasons, setSignatureReasons] = useState([]);

  const colors = ['#000000', '#FF0000', '#00FF00', '#0000FF']; // Black, Red, Green, Blue

  useEffect(() => {
    if (isOpen) {
      // Fetch signature reasons
      fetch('http://localhost:5000/api/data')
        .then(response => response.json())
        .then(data => {
          setSignatureReasons(data.signatureReasons || []);
        })
        .catch(error => console.error('Error fetching reasons:', error));
    }
  }, [isOpen]);

  const startDrawing = (e) => {
    setIsDrawing(true);
    const canvas = canvasRef.current;
    const rect = canvas.getBoundingClientRect();
    const ctx = canvas.getContext('2d');
    ctx.strokeStyle = selectedColor;
    ctx.lineWidth = 2;
    ctx.lineCap = 'round';
    ctx.beginPath();
    ctx.moveTo(e.clientX - rect.left, e.clientY - rect.top);
  };

  const draw = (e) => {
    if (!isDrawing) return;
    const canvas = canvasRef.current;
    const rect = canvas.getBoundingClientRect();
    const ctx = canvas.getContext('2d');
    ctx.lineTo(e.clientX - rect.left, e.clientY - rect.top);
    ctx.stroke();
  };

  const stopDrawing = () => {
    setIsDrawing(false);
  };

  const clearCanvas = () => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    ctx.clearRect(0, 0, canvas.width, canvas.height);
  };

  const handleSave = () => {
    if (!selectedReason) {
      alert('Please select a reason to sign');
      return;
    }
    
    const canvas = canvasRef.current;
    const signatureData = canvas.toDataURL();
    onSave(signatureData, selectedReason);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl overflow-hidden">
        <div className="bg-gradient-to-r from-CloudbyzBlue/10 to-CloudbyzBlue/5 px-6 py-4 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold text-gray-800">Create Your Signature</h2>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 rounded-full transition-colors"
            >
              <X className="w-5 h-5 text-gray-500" />
            </button>
          </div>
        </div>

        <div className="p-6">
          {/* Reason Selection */}
          <div className="mb-6">
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Reason to Sign *
            </label>
            <div className="relative">
              <button
                onClick={() => setShowReasonDropdown(!showReasonDropdown)}
                className="w-full flex items-center justify-between px-4 py-3 bg-white border border-gray-300 rounded-lg hover:border-gray-400 focus:border-CloudbyzBlue focus:ring-2 focus:ring-CloudbyzBlue/20 transition-all"
              >
                <span className={selectedReason ? 'text-gray-800' : 'text-gray-500'}>
                  {selectedReason || 'Select a reason to sign'}
                </span>
                <ChevronDown className={`w-4 h-4 text-gray-500 transition-transform ${showReasonDropdown ? 'rotate-180' : ''}`} />
              </button>
              
              {showReasonDropdown && (
                <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-200 rounded-lg shadow-lg z-10 max-h-48 overflow-y-auto">
                  {signatureReasons.map((reason, index) => (
                    <button
                      key={index}
                      onClick={() => {
                        setSelectedReason(reason);
                        setShowReasonDropdown(false);
                      }}
                      className="w-full px-4 py-3 text-left hover:bg-gray-50 transition-colors"
                    >
                      {reason}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Color Selection */}
          <div className="mb-4">
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Signature Color
            </label>
            <div className="flex space-x-3">
              {colors.map((color) => (
                <button
                  key={color}
                  onClick={() => setSelectedColor(color)}
                  className={`w-8 h-8 rounded-full border-2 transition-all ${
                    selectedColor === color ? 'border-gray-800 scale-110' : 'border-gray-300'
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
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 bg-gray-50">
              <canvas
                ref={canvasRef}
                width={500}
                height={200}
                className="w-full h-48 bg-white border border-gray-200 rounded cursor-crosshair"
                onMouseDown={startDrawing}
                onMouseMove={draw}
                onMouseUp={stopDrawing}
                onMouseLeave={stopDrawing}
              />
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex justify-between">
            <button
              onClick={clearCanvas}
              className="px-4 py-2 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
            >
              Clear
            </button>
            <div className="flex space-x-3">
              <button
                onClick={onClose}
                className="px-6 py-2 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleSave}
                className="px-6 py-2 bg-CloudbyzBlue text-white rounded-lg hover:bg-CloudbyzBlue/90 transition-colors"
              >
                Save Signature
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const InitialsModal = ({ isOpen, onClose, onSave }) => {
  const [selectedColor, setSelectedColor] = useState('#000000');
  const [selectedStyle, setSelectedStyle] = useState('normal');
  const [selectedReason, setSelectedReason] = useState('');
  const [showReasonDropdown, setShowReasonDropdown] = useState(false);
  const [signatureReasons, setSignatureReasons] = useState([]);
  const [initialsText, setInitialsText] = useState('JD');

  const colors = ['#000000', '#FF0000', '#00FF00', '#0000FF']; // Black, Red, Green, Blue
  const styles = [
    { value: 'normal', label: 'Normal', style: 'font-normal' },
    { value: 'bold', label: 'Bold', style: 'font-bold' },
    { value: 'italic', label: 'Italic', style: 'italic' },
    { value: 'bold-italic', label: 'Bold Italic', style: 'font-bold italic' }
  ];

  useEffect(() => {
    if (isOpen) {
      // Fetch signature reasons
      fetch('http://localhost:5000/api/data')
        .then(response => response.json())
        .then(data => {
          setSignatureReasons(data.signatureReasons || []);
        })
        .catch(error => console.error('Error fetching reasons:', error));
    }
  }, [isOpen]);

  const handleSave = () => {
    if (!selectedReason) {
      alert('Please select a reason to sign');
      return;
    }
    
    onSave({
      text: initialsText,
      color: selectedColor,
      style: selectedStyle,
      reason: selectedReason
    });
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden">
        <div className="bg-gradient-to-r from-CloudbyzBlue/10 to-CloudbyzBlue/5 px-6 py-4 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold text-gray-800">Create Your Initials</h2>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 rounded-full transition-colors"
            >
              <X className="w-5 h-5 text-gray-500" />
            </button>
          </div>
        </div>

        <div className="p-6">
          {/* Reason Selection */}
          <div className="mb-6">
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Reason to Sign *
            </label>
            <div className="relative">
              <button
                onClick={() => setShowReasonDropdown(!showReasonDropdown)}
                className="w-full flex items-center justify-between px-4 py-3 bg-white border border-gray-300 rounded-lg hover:border-gray-400 focus:border-CloudbyzBlue focus:ring-2 focus:ring-CloudbyzBlue/20 transition-all"
              >
                <span className={selectedReason ? 'text-gray-800' : 'text-gray-500'}>
                  {selectedReason || 'Select a reason to sign'}
                </span>
                <ChevronDown className={`w-4 h-4 text-gray-500 transition-transform ${showReasonDropdown ? 'rotate-180' : ''}`} />
              </button>
              
              {showReasonDropdown && (
                <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-200 rounded-lg shadow-lg z-10 max-h-48 overflow-y-auto">
                  {signatureReasons.map((reason, index) => (
                    <button
                      key={index}
                      onClick={() => {
                        setSelectedReason(reason);
                        setShowReasonDropdown(false);
                      }}
                      className="w-full px-4 py-3 text-left hover:bg-gray-50 transition-colors"
                    >
                      {reason}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Initials Text */}
          <div className="mb-4">
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Initials Text
            </label>
            <input
              type="text"
              value={initialsText}
              onChange={(e) => setInitialsText(e.target.value.toUpperCase().slice(0, 3))}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:border-CloudbyzBlue focus:ring-2 focus:ring-CloudbyzBlue/20 transition-all"
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
                  className={`p-3 border rounded-lg transition-all ${
                    selectedStyle === style.value 
                      ? 'border-CloudbyzBlue bg-CloudbyzBlue/10 text-CloudbyzBlue' 
                      : 'border-gray-300 hover:border-gray-400'
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
            <div className="flex space-x-3">
              {colors.map((color) => (
                <button
                  key={color}
                  onClick={() => setSelectedColor(color)}
                  className={`w-8 h-8 rounded-full border-2 transition-all ${
                    selectedColor === color ? 'border-gray-800 scale-110' : 'border-gray-300'
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
            <div className="border border-gray-200 rounded-lg p-4 bg-gray-50 text-center">
              <span 
                className={`text-2xl ${styles.find(s => s.value === selectedStyle)?.style}`}
                style={{ color: selectedColor }}
              >
                {initialsText}
              </span>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex justify-end space-x-3">
            <button
              onClick={onClose}
              className="px-6 py-2 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleSave}
              className="px-6 py-2 bg-CloudbyzBlue text-white rounded-lg hover:bg-CloudbyzBlue/90 transition-colors"
            >
              Save Initials
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

const TextModal = ({ isOpen, onClose, onSave }) => {
  const [text, setText] = useState('');
  const [selectedColor, setSelectedColor] = useState('#000000');
  const [isBold, setIsBold] = useState(false);
  const [isItalic, setIsItalic] = useState(false);
  const [isUnderline, setIsUnderline] = useState(false);

  const colors = ['#000000', '#FF0000', '#00FF00', '#0000FF']; // Black, Red, Green, Blue

  const handleSave = () => {
    if (!text.trim()) {
      alert('Please enter some text');
      return;
    }
    
    onSave({
      text: text.trim(),
      color: selectedColor,
      bold: isBold,
      italic: isItalic,
      underline: isUnderline
    });
  };

  const getPreviewStyle = () => {
    let style = { color: selectedColor };
    let className = '';
    
    if (isBold) className += 'font-bold ';
    if (isItalic) className += 'italic ';
    if (isUnderline) style.textDecoration = 'underline';
    
    return { style, className };
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden">
        <div className="bg-gradient-to-r from-CloudbyzBlue/10 to-CloudbyzBlue/5 px-6 py-4 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold text-gray-800">Add Text</h2>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 rounded-full transition-colors"
            >
              <X className="w-5 h-5 text-gray-500" />
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
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:border-CloudbyzBlue focus:ring-2 focus:ring-CloudbyzBlue/20 transition-all resize-none"
              placeholder="Enter your text here..."
              rows={3}
              maxLength={100}
            />
            <div className="text-right text-xs text-gray-500 mt-1">
              {text.length}/100 characters
            </div>
          </div>

          {/* Text Formatting */}
          <div className="mb-4">
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Text Formatting
            </label>
            <div className="flex space-x-2">
              <button
                onClick={() => setIsBold(!isBold)}
                className={`p-2 border rounded-lg transition-all ${
                  isBold 
                    ? 'border-CloudbyzBlue bg-CloudbyzBlue/10 text-CloudbyzBlue' 
                    : 'border-gray-300 hover:border-gray-400'
                }`}
                title="Bold"
              >
                <Bold className="w-4 h-4" />
              </button>
              <button
                onClick={() => setIsItalic(!isItalic)}
                className={`p-2 border rounded-lg transition-all ${
                  isItalic 
                    ? 'border-CloudbyzBlue bg-CloudbyzBlue/10 text-CloudbyzBlue' 
                    : 'border-gray-300 hover:border-gray-400'
                }`}
                title="Italic"
              >
                <Italic className="w-4 h-4" />
              </button>
              <button
                onClick={() => setIsUnderline(!isUnderline)}
                className={`p-2 border rounded-lg transition-all ${
                  isUnderline 
                    ? 'border-CloudbyzBlue bg-CloudbyzBlue/10 text-CloudbyzBlue' 
                    : 'border-gray-300 hover:border-gray-400'
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
            <div className="flex space-x-3">
              {colors.map((color) => (
                <button
                  key={color}
                  onClick={() => setSelectedColor(color)}
                  className={`w-8 h-8 rounded-full border-2 transition-all ${
                    selectedColor === color ? 'border-gray-800 scale-110' : 'border-gray-300'
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
              <div className="border border-gray-200 rounded-lg p-4 bg-gray-50 min-h-[60px] flex items-center">
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
          <div className="flex justify-end space-x-3">
            <button
              onClick={onClose}
              className="px-6 py-2 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleSave}
              className="px-6 py-2 bg-CloudbyzBlue text-white rounded-lg hover:bg-CloudbyzBlue/90 transition-colors"
            >
              Add Text
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

const ReasonModal = ({ isOpen, onClose, onSave, type }) => {
  const [selectedReason, setSelectedReason] = useState('');
  const [showReasonDropdown, setShowReasonDropdown] = useState(false);
  const [signatureReasons, setSignatureReasons] = useState([]);

  useEffect(() => {
    if (isOpen) {
      // Fetch signature reasons
      fetch('http://localhost:5000/api/data')
        .then(response => response.json())
        .then(data => {
          setSignatureReasons(data.signatureReasons || []);
        })
        .catch(error => console.error('Error fetching reasons:', error));
    }
  }, [isOpen]);

  const handleSave = () => {
    if (!selectedReason) {
      alert('Please select a reason to sign');
      return;
    }
    
    onSave(selectedReason);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden">
        <div className="bg-gradient-to-r from-CloudbyzBlue/10 to-CloudbyzBlue/5 px-6 py-4 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold text-gray-800">
              {type === 'signature' ? 'Add Signature' : type === 'initials' ? 'Add Initials' : 'Add Field'}
            </h2>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 rounded-full transition-colors"
            >
              <X className="w-5 h-5 text-gray-500" />
            </button>
          </div>
        </div>

        <div className="p-6">
          {/* Reason Selection */}
          <div className="mb-6">
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Reason to Sign *
            </label>
            <div className="relative">
              <button
                onClick={() => setShowReasonDropdown(!showReasonDropdown)}
                className="w-full flex items-center justify-between px-4 py-3 bg-white border border-gray-300 rounded-lg hover:border-gray-400 focus:border-CloudbyzBlue focus:ring-2 focus:ring-CloudbyzBlue/20 transition-all"
              >
                <span className={selectedReason ? 'text-gray-800' : 'text-gray-500'}>
                  {selectedReason || 'Select a reason to sign'}
                </span>
                <ChevronDown className={`w-4 h-4 text-gray-500 transition-transform ${showReasonDropdown ? 'rotate-180' : ''}`} />
              </button>
              
              {showReasonDropdown && (
                <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-200 rounded-lg shadow-lg z-10 max-h-48 overflow-y-auto">
                  {signatureReasons.map((reason, index) => (
                    <button
                      key={index}
                      onClick={() => {
                        setSelectedReason(reason);
                        setShowReasonDropdown(false);
                      }}
                      className="w-full px-4 py-3 text-left hover:bg-gray-50 transition-colors"
                    >
                      {reason}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex justify-end space-x-3">
            <button
              onClick={onClose}
              className="px-6 py-2 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleSave}
              className="px-6 py-2 bg-CloudbyzBlue text-white rounded-lg hover:bg-CloudbyzBlue/90 transition-colors"
            >
              Continue
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

const AuthModal = ({ isOpen, onClose, onSuccess }) => {
  const [email, setEmail] = useState('john.doe@cloudbyz.com');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    // Simulate authentication
    setTimeout(() => {
      if (email === 'john.doe@cloudbyz.com' && password === 'password') {
        setIsLoading(false);
        onSuccess();
      } else {
        setError('Invalid email or password');
        setIsLoading(false);
      }
    }, 1000);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden">
        <div className="bg-gradient-to-r from-CloudbyzBlue/10 to-CloudbyzBlue/5 px-6 py-4 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold text-gray-800">Authenticate to Sign</h2>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 rounded-full transition-colors"
            >
              <X className="w-5 h-5 text-gray-500" />
            </button>
          </div>
        </div>

        <div className="p-6">
          <div className="text-center mb-6">
            <img src="/images/cloudbyz.png" alt="Cloudbyz Logo" className="w-32 mx-auto mb-4" />
            <p className="text-gray-600">Please verify your identity to complete the signature</p>
          </div>

          {error && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Email
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:border-CloudbyzBlue focus:ring-2 focus:ring-CloudbyzBlue/20 transition-all"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Password
              </label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:border-CloudbyzBlue focus:ring-2 focus:ring-CloudbyzBlue/20 transition-all pr-12"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
                >
                  {showPassword ? '👁️' : '👁️‍🗨️'}
                </button>
              </div>
            </div>

            <div className="flex justify-end space-x-3 pt-4">
              <button
                type="button"
                onClick={onClose}
                className="px-6 py-2 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isLoading}
                className="px-6 py-2 bg-CloudbyzBlue text-white rounded-lg hover:bg-CloudbyzBlue/90 transition-colors disabled:opacity-50"
              >
                {isLoading ? 'Authenticating...' : 'Sign In'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

const SigneeUI = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [pageUrls, setPageUrls] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageInput, setPageInput] = useState('1');
  const [canvasDimensions, setCanvasDimensions] = useState({});
  const [signatureElements, setSignatureElements] = useState([]);
  const [savedSignature, setSavedSignature] = useState(null);
  const [savedInitials, setSavedInitials] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isNavigating, setIsNavigating] = useState(false);
  const [serverError, setServerError] = useState(false);
  const [hasStarted, setHasStarted] = useState(false);
  const [currentElementIndex, setCurrentElementIndex] = useState(0);

  // Modal states
  const [showSignatureModal, setShowSignatureModal] = useState(false);
  const [showInitialsModal, setShowInitialsModal] = useState(false);
  const [showTextModal, setShowTextModal] = useState(false);
  const [showReasonModal, setShowReasonModal] = useState(false);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [currentElementId, setCurrentElementId] = useState(null);
  const [currentElementType, setCurrentElementType] = useState(null);
  const [pendingSignatureData, setPendingSignatureData] = useState(null);
  const [pendingReason, setPendingReason] = useState('');

  const numPages = pageUrls.length;

  const loadingStates = [
    { text: 'Loading document for signing...' },
    { text: 'Preparing signature fields...' },
    { text: 'Setting up authentication...' },
    { text: 'Ready to sign...' }
  ];

  const navigatingStates = [
    { text: 'Saving signatures...' },
    { text: 'Finalizing document...' },
    { text: 'Processing completion...' },
    { text: 'Redirecting...' }
  ];

  const drawImageOnCanvas = useCallback((canvas, imageUrl, pageIndex) => {
    const ctx = canvas.getContext('2d');
    const img = new Image();
    img.crossOrigin = "anonymous";
    
    img.onload = () => {
      const container = canvas.parentElement;
      const containerWidth = container.clientWidth;
      
      canvas.width = containerWidth;
      const aspectRatio = img.height / img.width;
      canvas.height = containerWidth * aspectRatio;
      
      setCanvasDimensions(prev => ({
        ...prev,
        [pageIndex]: {
          width: canvas.width,
          height: canvas.height
        }
      }));
      
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
    };
    
    img.src = imageUrl;
  }, []);

  useEffect(() => {
    const username = localStorage.getItem('username');
    if (!username) {
      navigate('/signin');
      return;
    }

    const fetchData = async () => {
      try {
        const response = await fetch('http://localhost:5000/api/images');
        if (!response.ok) {
          throw new Error('Server connection failed');
        }
        
        const data = await response.json();
        setPageUrls(data.images);

        // Initialize signature elements as per requirements:
        // 1 signature field in page 3, 5 and 6 each
        // 1 initials field in page 7
        // 1 text field in page 8
        const elements = [
          // Page 3 (index 2)
          {
            id: 'sig-page3-1',
            type: 'signature',
            page: 2,
            x: 150,
            y: 400,
            width: 200,
            height: 80,
            signed: false,
            order: 0
          },
          // Page 5 (index 4)
          {
            id: 'sig-page5-1',
            type: 'signature',
            page: 4,
            x: 150,
            y: 300,
            width: 200,
            height: 80,
            signed: false,
            order: 1
          },
          // Page 6 (index 5)
          {
            id: 'sig-page6-1',
            type: 'signature',
            page: 5,
            x: 150,
            y: 200,
            width: 200,
            height: 80,
            signed: false,
            order: 2
          },
          // Page 7 (index 6)
          {
            id: 'init-page7-1',
            type: 'initials',
            page: 6,
            x: 150,
            y: 300,
            width: 80,
            height: 40,
            signed: false,
            order: 3
          },
          // Page 8 (index 7)
          {
            id: 'text-page8-1',
            type: 'text',
            page: 7,
            x: 150,
            y: 250,
            width: 250,
            height: 60,
            signed: false,
            order: 4
          }
        ];
        
        setSignatureElements(elements);
      } catch (error) {
        console.error('Error fetching data:', error);
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

    window.addEventListener('resize', handleResize);
    return () => {
      window.removeEventListener('resize', handleResize);
      clearTimeout(window.resizeTimeout);
    };
  }, [drawImageOnCanvas, pageUrls]);

  const handleStart = () => {
    setHasStarted(true);
    // Navigate to the first signature element (page 3)
    scrollToPage(3);
  };

  const handleNext = () => {
    const nextIndex = currentElementIndex + 1;
    if (nextIndex < signatureElements.length) {
      setCurrentElementIndex(nextIndex);
      const nextElement = signatureElements[nextIndex];
      scrollToPage(nextElement.page + 1);
    }
  };

  const handleElementClick = (elementId, elementType) => {
    const element = signatureElements.find(el => el.id === elementId);
    if (!element || element.signed) return;

    // Check if this is the current element in order
    if (element.order !== currentElementIndex) {
      alert('Please complete the fields in order');
      return;
    }

    setCurrentElementId(elementId);
    setCurrentElementType(elementType);

    if (elementType === 'signature') {
      if (!savedSignature) {
        // First time signing - show signature modal
        setShowSignatureModal(true);
      } else {
        // Already have signature - show reason modal
        setShowReasonModal(true);
      }
    } else if (elementType === 'initials') {
      if (!savedInitials) {
        // First time initials - show initials modal
        setShowInitialsModal(true);
      } else {
        // Already have initials - show reason modal
        setShowReasonModal(true);
      }
    } else if (elementType === 'text') {
      // Text elements show text modal (no auth required)
      setShowTextModal(true);
    }
  };

  const handleSignatureSave = (signatureData, reason) => {
    setPendingSignatureData(signatureData);
    setPendingReason(reason);
    setShowSignatureModal(false);
    setShowAuthModal(true);
  };

  const handleInitialsSave = (initialsData) => {
    setPendingSignatureData(initialsData);
    setPendingReason(initialsData.reason);
    setShowInitialsModal(false);
    setShowAuthModal(true);
  };

  const handleTextSave = (textData) => {
    // Text doesn't require auth - directly save
    setSignatureElements(prev => 
      prev.map(el => 
        el.id === currentElementId 
          ? { 
              ...el, 
              signed: true, 
              signedAt: new Date().toISOString(),
              textData: textData
            }
          : el
      )
    );

    setShowTextModal(false);
    setCurrentElementId(null);
    setCurrentElementType(null);

    // Move to next element
    setCurrentElementIndex(prev => prev + 1);
  };

  const handleReasonSave = (reason) => {
    setPendingReason(reason);
    setShowReasonModal(false);
    setShowAuthModal(true);
  };

  const handleAuthSuccess = () => {
    if (currentElementType === 'signature') {
      if (!savedSignature && pendingSignatureData) {
        // Save the signature for future use
        setSavedSignature(pendingSignatureData);
      }
      
      // Mark the element as signed
      setSignatureElements(prev => 
        prev.map(el => 
          el.id === currentElementId 
            ? { 
                ...el, 
                signed: true, 
                signedAt: new Date().toISOString(),
                reason: pendingReason,
                signatureData: savedSignature || pendingSignatureData
              }
            : el
        )
      );
    } else if (currentElementType === 'initials') {
      if (!savedInitials && pendingSignatureData) {
        // Save the initials for future use
        setSavedInitials(pendingSignatureData);
      }
      
      // Mark the element as signed
      setSignatureElements(prev => 
        prev.map(el => 
          el.id === currentElementId 
            ? { 
                ...el, 
                signed: true, 
                signedAt: new Date().toISOString(),
                reason: pendingReason,
                initialsData: savedInitials || pendingSignatureData
              }
            : el
        )
      );
    }

    // Reset states
    setShowAuthModal(false);
    setCurrentElementId(null);
    setCurrentElementType(null);
    setPendingSignatureData(null);
    setPendingReason('');

    // Move to next element
    setCurrentElementIndex(prev => prev + 1);
  };

  const scrollToPage = useCallback((pageNum) => {
    const newPageNum = Math.max(1, Math.min(pageNum, numPages));
    const pageElement = document.getElementById(`page-container-${newPageNum}`);
    if (pageElement) {
      pageElement.scrollIntoView({
        behavior: 'smooth',
        block: 'start',
      });
      setCurrentPage(newPageNum);
    }
  }, [numPages]);

  useEffect(() => {
    setPageInput(String(currentPage));
  }, [currentPage]);

  const handlePageInputChange = (e) => {
    setPageInput(e.target.value);
  };

  const handlePageInputSubmit = (e) => {
    if (e.type === 'blur' || (e.type === 'keydown' && e.key === 'Enter')) {
      const newPage = parseInt(pageInput, 10);
      if (!isNaN(newPage) && newPage >= 1 && newPage <= numPages) {
        scrollToPage(newPage);
        if (e.key === 'Enter' && document.activeElement) {
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
      const response = await fetch('http://localhost:5000/api/stats');
      if (!response.ok) {
        throw new Error('Server connection failed');
      }
      
      await new Promise(resolve => setTimeout(resolve, 3000));
      
      navigate('/home', { state: { from: '/signeeui' } });
    } catch (error) {
      console.error('Server error:', error);
      setServerError(true);
    } finally {
      setIsNavigating(false);
    }
  };

  const renderSignatureElement = (element) => {
    if (!canvasDimensions[element.page]) return null;

    const canvasWidth = canvasDimensions[element.page].width;
    const canvasHeight = canvasDimensions[element.page].height;
    
    // Calculate responsive position and size
    const actualX = (element.x / 600) * canvasWidth; // Assuming original canvas width of 600
    const actualY = (element.y / 800) * canvasHeight; // Assuming original canvas height of 800
    const actualWidth = (element.width / 600) * canvasWidth;
    const actualHeight = (element.height / 800) * canvasHeight;

    const getElementContent = () => {
      if (element.signed) {
        if (element.type === 'signature' && element.signatureData) {
          return (
            <img 
              src={element.signatureData} 
              alt="Signature" 
              className="w-full h-full object-contain"
            />
          );
        } else if (element.type === 'initials' && element.initialsData) {
          const { text, color, style } = element.initialsData;
          const styleClasses = {
            'normal': 'font-normal',
            'bold': 'font-bold',
            'italic': 'italic',
            'bold-italic': 'font-bold italic'
          };
          
          return (
            <span 
              className={`text-lg ${styleClasses[style] || 'font-normal'}`}
              style={{ color }}
            >
              {text}
            </span>
          );
        } else if (element.type === 'text' && element.textData) {
          const { text, color, bold, italic, underline } = element.textData;
          let className = 'text-sm ';
          if (bold) className += 'font-bold ';
          if (italic) className += 'italic ';
          
          const style = { 
            color,
            textDecoration: underline ? 'underline' : 'none',
            wordWrap: 'break-word',
            overflowWrap: 'break-word',
            hyphens: 'auto'
          };
          
          return (
            <div 
              className={className}
              style={style}
            >
              {text}
            </div>
          );
        }
      }

      // Placeholder content
      const icons = {
        signature: <PenTool className="w-4 h-4" />,
        initials: <Type className="w-4 h-4" />,
        text: <FileText className="w-4 h-4" />
      };

      const labels = {
        signature: 'Click to Sign',
        initials: 'Click for Initials',
        text: 'Click to Fill'
      };

      return (
        <div className="flex items-center justify-center space-x-2 text-gray-600">
          {icons[element.type]}
          <span className="text-xs">{labels[element.type]}</span>
        </div>
      );
    };

    const isCurrentElement = element.order === currentElementIndex;
    const isClickable = hasStarted && isCurrentElement && !element.signed;

    return (
      <div
        key={element.id}
        className={`absolute border-2 rounded-lg transition-all duration-200 ${
          element.signed 
            ? 'border-green-400 bg-green-50' 
            : isCurrentElement
            ? 'border-blue-500 bg-blue-100 cursor-pointer hover:bg-blue-200'
            : 'border-gray-300 bg-gray-100'
        } ${isClickable ? 'animate-pulse' : ''}`}
        style={{
          left: actualX,
          top: actualY,
          width: actualWidth,
          height: actualHeight,
          zIndex: 10,
        }}
        onClick={() => isClickable && handleElementClick(element.id, element.type)}
      >
        <div className="w-full h-full flex items-center justify-center p-2">
          {getElementContent()}
        </div>
        {isCurrentElement && !element.signed && (
          <div className="absolute -top-2 -right-2 w-4 h-4 bg-blue-500 rounded-full animate-ping"></div>
        )}
      </div>
    );
  };

  // Check if current element is signed to enable Next button
  const currentElementSigned = signatureElements[currentElementIndex]?.signed || false;
  const allElementsSigned = signatureElements.every(el => el.signed);
  const canProceedNext = hasStarted && currentElementSigned && currentElementIndex < signatureElements.length - 1;

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
        <p className="text-2xl font-semibold text-slate-600">Loading document...</p>
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
              <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18" />
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
            <span className="text-xl text-slate-600 transform -translate-y-[1px]">‹</span>
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
            <span className="text-xl text-slate-600 transform -translate-y-[1px]">›</span>
          </button>
        </div>

        <div className="w-1/3 flex justify-end">
          <button
            onClick={handleFinish}
            disabled={!allElementsSigned}
            className={`px-6 py-2 rounded-lg font-semibold shadow-lg transition-all duration-300 flex items-center space-x-2 ${
              allElementsSigned
                ? 'bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white hover:shadow-xl hover:scale-105'
                : 'bg-gray-300 text-gray-500 cursor-not-allowed'
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
              <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
            </svg>
          </button>
        </div>
      </header>

      <div className="flex flex-row flex-grow pt-30 relative">
        {/* Left sidebar with Start/Next button */}
        <div className="w-[15%] bg-white border-r border-gray-200 shadow-sm flex flex-col items-center justify-center" style={{ marginTop: '120px' }}>
          <div className="p-6">
            {!hasStarted ? (
              <button
                onClick={handleStart}
                className="bg-gradient-to-r from-CloudbyzBlue to-CloudbyzBlue/80 hover:from-CloudbyzBlue/90 hover:to-CloudbyzBlue/70 text-white px-8 py-4 rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all duration-300 flex items-center space-x-2 hover:scale-105"
              >
                <span>Start</span>
                <svg 
                  xmlns="http://www.w3.org/2000/svg" 
                  fill="none" 
                  viewBox="0 0 24 24" 
                  strokeWidth={2} 
                  stroke="currentColor" 
                  className="w-5 h-5"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" d="M5.25 5.653c0-.856.917-1.398 1.667-.986l11.54 6.348a1.125 1.125 0 010 1.971l-11.54 6.347a1.125 1.125 0 01-1.667-.985V5.653z" />
                </svg>
              </button>
            ) : (
              <button
                onClick={handleNext}
                disabled={!canProceedNext}
                className={`px-8 py-4 rounded-xl font-semibold shadow-lg transition-all duration-300 flex items-center space-x-2 ${
                  canProceedNext
                    ? 'bg-gradient-to-r from-CloudbyzBlue to-CloudbyzBlue/80 hover:from-CloudbyzBlue/90 hover:to-CloudbyzBlue/70 text-white hover:shadow-xl hover:scale-105'
                    : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                }`}
              >
                <span>Next</span>
                <svg 
                  xmlns="http://www.w3.org/2000/svg" 
                  fill="none" 
                  viewBox="0 0 24 24" 
                  strokeWidth={2} 
                  stroke="currentColor" 
                  className="w-5 h-5"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
                </svg>
              </button>
            )}
            
            {hasStarted && (
              <div className="mt-6 text-center">
                <div className="text-sm text-gray-600 mb-2">Progress</div>
                <div className="text-lg font-bold text-CloudbyzBlue">
                  {signatureElements.filter(el => el.signed).length} / {signatureElements.length}
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
                  <div 
                    className="bg-CloudbyzBlue h-2 rounded-full transition-all duration-300"
                    style={{ 
                      width: `${(signatureElements.filter(el => el.signed).length / signatureElements.length) * 100}%` 
                    }}
                  ></div>
                </div>
              </div>
            )}
          </div>
        </div>

        <main
          id="main-container"
          className="w-[70%] h-full overflow-y-auto bg-slate-200 transition-all duration-300 ease-in-out"
          style={{ maxHeight: 'calc(100vh - 120px)', marginTop: '120px' }}
        >
          {pageUrls.map((url, index) => (
            <div 
              id={`page-container-${index + 1}`}
              key={`page-container-${index + 1}`} 
              className="mb-6 relative"
              style={{ 
                width: '100%',
                transition: 'all 0.3s ease-in-out',
              }}
            >
              <div className="w-full relative">
                <canvas
                  id={`page-${index}`}
                  data-page-number={index + 1}
                  className="w-full h-auto shadow-xl cursor-default"
                  style={{ 
                    display: 'block',
                    width: '100%',
                    height: 'auto',
                  }}
                />
                
                {/* Render signature elements for this page */}
                {signatureElements
                  .filter(element => element.page === index)
                  .map(element => renderSignatureElement(element))}
              </div>
            </div>
          ))}
        </main>

        <div className="w-[15%]" style={{ marginTop: '120px' }}></div>
      </div>

      {/* Modals */}
      <SignatureModal
        isOpen={showSignatureModal}
        onClose={() => setShowSignatureModal(false)}
        onSave={handleSignatureSave}
      />

      <InitialsModal
        isOpen={showInitialsModal}
        onClose={() => setShowInitialsModal(false)}
        onSave={handleInitialsSave}
      />

      <TextModal
        isOpen={showTextModal}
        onClose={() => setShowTextModal(false)}
        onSave={handleTextSave}
      />

      <ReasonModal
        isOpen={showReasonModal}
        onClose={() => setShowReasonModal(false)}
        onSave={handleReasonSave}
        type={currentElementType}
      />

      <AuthModal
        isOpen={showAuthModal}
        onClose={() => setShowAuthModal(false)}
        onSuccess={handleAuthSuccess}
      />
    </div>
  );
};

export default SigneeUI;