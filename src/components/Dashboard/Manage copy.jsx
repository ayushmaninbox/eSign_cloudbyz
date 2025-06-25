import React, { useState, useRef, Fragment, useEffect } from "react";
import { Menu, Transition, Dialog } from "@headlessui/react";
import { format } from "date-fns";
import { useNavigate, useLocation } from 'react-router-dom';
import {
  User,
  Search,
  ChevronDown,
  Check,
  Clock,
  AlertTriangle,
  Download,
  RefreshCw,
  Eye,
  FileText,
  ChevronLeft,
  ChevronRight,
  PenTool,
  Bell,
  Plus,
  Upload,
  Inbox,
  Send,
  FileEdit,
  Archive,
  X,
  Calendar,
  Users,
  Building2,
  Shield,
  Clock4,
  ExternalLink,
  Mail,
  CheckCircle2,
  AlertCircle,
  UserCheck,
  DownloadCloudIcon,
  Settings,
  LogOut,
  UserCircle,
  Layers
} from "lucide-react";
import Error404 from '../ui/404error';
import Loader from '../ui/Loader';

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

const Navbar = ({ activeTab, setActiveTab, onNotificationUpdate }) => {
  const navigate = useNavigate();
  const [showNotifications, setShowNotifications] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [seenNotificationIds, setSeenNotificationIds] = useState(new Set());
  const [showProfileModal, setShowProfileModal] = useState(false);
  const notificationRef = useRef(null);

  const handleTabChange = (tab) => {
    setActiveTab(tab);
    navigate(`/${tab}`);
  };

  const handleLogoClick = () => {
    const username = localStorage.getItem('username');
    if (username) {
      navigate('/home');
    } else {
      navigate('/');
    }
  };

  const fetchNotifications = async () => {
    try {
      const response = await fetch("http://localhost:5000/api/notifications");
      const data = await response.json();
      const sortedNotifications = data.new.sort(
        (a, b) => new Date(b.timestamp) - new Date(a.timestamp)
      );
      setNotifications(sortedNotifications);
    } catch (error) {
      console.error("Error loading notifications:", error);
    }
  };

  useEffect(() => {
    fetchNotifications();
  }, []);

  // Listen for notification updates from parent component
  useEffect(() => {
    if (onNotificationUpdate) {
      fetchNotifications();
    }
  }, [onNotificationUpdate]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (notificationRef.current && !notificationRef.current.contains(event.target)) {
        setShowNotifications(false);
      }
    };

    if (showNotifications) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [showNotifications]);

  const handleActionClick = (type, documentName, documentID, notificationId) => {
    if (type === "signature_required") {
      console.log([documentID, documentName]);
      navigate('/signeeui');
    } else if (type === "signature_complete") {
      console.log("Download document:", documentName);
    }
    markNotificationAsSeen(notificationId);
  };

  const markNotificationAsSeen = async (notificationId) => {
    try {
      // Optimistic UI update
      setSeenNotificationIds(prev => new Set([...prev, notificationId]));
      
      const response = await fetch('http://localhost:5000/api/notifications/mark-seen', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: notificationId }),
      });

      if (!response.ok) {
        // Rollback if API fails
        setSeenNotificationIds(prev => {
          const updated = new Set(prev);
          updated.delete(notificationId);
          return updated;
        });
      } else {
        // Remove from local state immediately
        setNotifications(prev => prev.filter(n => n.id !== notificationId));
      }
    } catch (error) {
      console.error("Error marking notification as seen:", error);
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
          
          {/* Navigation Tabs */}
          <div className="flex space-x-1">
            <button
              onClick={() => handleTabChange('home')}
              className={`px-6 py-2 rounded-lg font-medium transition-all duration-300 ${
                activeTab === 'home'
                  ? 'bg-CloudbyzBlue text-white shadow-md'
                  : 'text-gray-600 hover:text-CloudbyzBlue hover:bg-CloudbyzBlue/5'
              }`}
            >
              Home
            </button>
            <button
              onClick={() => handleTabChange('manage')}
              className={`px-6 py-2 rounded-lg font-medium transition-all duration-300 ${
                activeTab === 'manage'
                  ? 'bg-CloudbyzBlue text-white shadow-md'
                  : 'text-gray-600 hover:text-CloudbyzBlue hover:bg-CloudbyzBlue/5'
              }`}
            >
              Manage
            </button>
          </div>
        </div>
        
        <div className="flex items-center space-x-4">
          <div className="relative" ref={notificationRef}>
            <button
              onClick={() => setShowNotifications(!showNotifications)}
              className="relative p-2 text-gray-600 hover:text-gray-800 transition-colors"
            >
              <Bell className="w-5 h-5" />
              {notifications.length > 0 && (
                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center font-medium">
                  {notifications.filter(n => !seenNotificationIds.has(n.id)).length}
                </span>
              )}
            </button>

            {showNotifications && (
              <div className="absolute right-0 mt-2 w-[650px] bg-white rounded-lg shadow-lg border border-gray-200 z-50">
                <div className="p-4 border-b border-gray-200">
                  <h3 className="text-lg font-semibold text-gray-900">Notifications</h3>
                </div>
                <div className="max-h-96 overflow-y-auto">
                  {notifications.length === 0 ? (
                    <div className="p-4 text-center text-gray-500">
                      No new notifications
                    </div>
                  ) : (
                    notifications.map((notification) => (
                      <div
                        key={notification.id}
                        className={`p-4 border-b border-gray-100 flex items-start justify-between transition-colors ${
                          seenNotificationIds.has(notification.id)
                            ? 'bg-gray-100 opacity-75'
                            : 'hover:bg-gray-50'
                        }`}
                      >
                        <div className="flex-1 min-w-0">
                          <p className="text-sm text-gray-800 mb-1 leading-relaxed break-words whitespace-normal">
                            {notification.message}{" "}
                            <span className="font-bold break-all">
                              {notification.documentName}
                            </span>
                          </p>
                          <span className="text-xs text-gray-500">
                            {format(
                              new Date(notification.timestamp),
                              "MMM d, yyyy 'at' h:mm a"
                            )}
                          </span>
                        </div>
                        <div className="ml-4 flex-shrink-0">
                          <button
                            onClick={() =>
                              handleActionClick(
                                notification.type,
                                notification.documentName,
                                notification.documentID,
                                notification.id
                              )
                            }
                            className={`inline-flex items-center justify-center px-4 py-1.5 text-sm font-medium border rounded-md hover:bg-opacity-80 transition-colors w-32 h-10 ${
                              notification.type === "signature_required"
                                ? "text-CloudbyzBlue bg-blue-50 border-blue-200 hover:bg-blue-100"
                                : "text-green-600 bg-green-50 border-green-200 hover:bg-green-100"
                            }`}
                          >
                            {notification.type === "signature_required" ? (
                              <>
                                <FileEdit className="w-4 h-4 mr-1" />
                                <span>Sign</span>
                              </>
                            ) : (
                              <>
                                <Download className="w-4 h-4 mr-1" />
                                <span>Download</span>
                              </>
                            )}
                          </button>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            )}
          </div>
          <div className="flex items-center space-x-2">
            <span className="text-sm text-gray-600">John Doe</span>
            <button 
              onClick={() => setShowProfileModal(!showProfileModal)}
              className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 flex items-center justify-center transition-colors"
            >
              <User className="w-5 h-5 text-slate-600" />
            </button>
          </div>
        </div>
      </nav>
      
      <ProfileModal 
        isOpen={showProfileModal} 
        onClose={() => setShowProfileModal(false)} 
      />
    </>
  );
};

const Sidebar = ({ activeSection, setActiveSection, setShowUploadModal }) => {
  const menuItems = [
    { id: "inbox", label: "Inbox", icon: Inbox },
    { id: "sent", label: "Sent", icon: Send },
    { id: "received", label: "Received", icon: Download },
    { id: "drafts", label: "Drafts", icon: FileEdit },
  ];

  const quickViews = [
    { id: "actionRequired", label: "Action Required", icon: AlertCircle },
    { id: "waitingForOthers", label: "Waiting for Others", icon: Clock },
    { id: "completed", label: "Completed", icon: Check }
  ];

  return (
    <div className="fixed left-0 top-16 bottom-0 w-64 bg-white shadow-sm border-r border-gray-200 z-20">
      <div className="p-4">
        <button
          onClick={() => setShowUploadModal(true)}
          className="w-full bg-CloudbyzBlue hover:bg-blue-600 text-white px-4 py-2.5 rounded-lg flex items-center justify-center space-x-2 transition-all duration-200 shadow-md hover:shadow-lg font-medium"
        >
          <Plus className="w-4 h-4" />
          <span className="font-semibold tracking-wide">NEW DOCUMENT</span>
        </button>
      </div>

      <div className="px-4">
        <div className="mb-6">
          <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">
            ENVELOPES
          </h3>
          <nav className="space-y-1">
            {menuItems.map((item) => (
              <button
                key={item.id}
                onClick={() => setActiveSection(item.id)}
                className={`w-full flex items-center space-x-3 px-3 py-2 text-sm rounded-lg transition-colors ${
                  activeSection === item.id
                    ? "bg-blue-50 text-CloudbyzBlue border-r-2 border-CloudbyzBlue"
                    : "text-gray-700 hover:bg-gray-50"
                }`}
              >
                <item.icon className="w-4 h-4" />
                <span>{item.label}</span>
              </button>
            ))}
          </nav>
        </div>

        <div>
          <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">
            QUICK VIEWS
          </h3>
          <nav className="space-y-1">
            {quickViews.map((item) => (
              <button
                key={item.id}
                onClick={() => setActiveSection(item.id)}
                className={`w-full flex items-center space-x-3 px-3 py-2 text-sm rounded-lg transition-colors ${
                  activeSection === item.id
                    ? "bg-blue-50 text-CloudbyzBlue border-r-2 border-CloudbyzBlue"
                    : "text-gray-700 hover:bg-gray-50"
                }`}
              >
                <item.icon className="w-4 h-4" />
                <span>{item.label}</span>
              </button>
            ))}
          </nav>
        </div>
      </div>
    </div>
  );
};

const StatusIcon = ({ status }) => {
  switch (status) {
    case "Completed":
      return <Check className="w-5 h-5 text-green-500" />;
    case "Sent for signature":
      return <Clock className="w-5 h-5 text-amber-500" />;
    case "Draft":
      return <PenTool className="w-5 h-5 text-blue-500" />;
    default:
      return null;
  }
};

const StatusBar = ({ document }) => {
  const totalSignees = document.Signees.length;
  const signedCount = document.AlreadySigned.length;
  const percentage = totalSignees > 0 ? (signedCount / totalSignees) * 100 : 0;

  return (
    <div className="flex items-center space-x-2">
      <div className="w-16 h-2 bg-gray-200 rounded-full overflow-hidden">
        <div
          className="h-full bg-green-500 transition-all duration-300"
          style={{ width: `${percentage}%` }}
        />
      </div>
      <span className="text-xs text-gray-600">
        {signedCount}/{totalSignees} signed
      </span>
    </div>
  );
};

const AnimatedText = ({ text, maxWidth = "150px" }) => {
  const [shouldAnimate, setShouldAnimate] = useState(false);
  const textRef = useRef(null);
  const containerRef = useRef(null);

  useEffect(() => {
    if (textRef.current && containerRef.current) {
      const textWidth = textRef.current.scrollWidth;
      const containerWidth = containerRef.current.clientWidth;
      setShouldAnimate(textWidth > containerWidth);
    }
  }, [text]);

  return (
    <div ref={containerRef} className="overflow-hidden" style={{ maxWidth }}>
      <div
        ref={textRef}
        className={`whitespace-nowrap ${
          shouldAnimate ? "animate-marquee hover:animation-paused" : ""
        }`}
      >
        {text}
      </div>
    </div>
  );
};

const SigneesList = ({ signees, maxVisible = 2 }) => {
  const [showTooltip, setShowTooltip] = useState(false);

  if (signees.length === 0)
    return <span className="text-xs text-gray-500">No signees</span>;

  const visibleSignees = signees.slice(0, maxVisible);
  const remainingCount = signees.length - maxVisible;

  return (
    <div className="flex items-center space-x-1">
      <span className="text-xs text-gray-600">
        {visibleSignees.map((s) => s.name.split(" ")[0]).join(", ")}
        {remainingCount > 0 && (
          <span
            className="relative cursor-pointer text-CloudbyzBlue hover:text-blue-800"
            onMouseEnter={() => setShowTooltip(true)}
            onMouseLeave={() => setShowTooltip(false)}
          >
            {` + ${remainingCount} more`}
            {showTooltip && (
              <div className="absolute bottom-full left-0 mb-2 p-2 bg-black text-white text-xs rounded shadow-lg whitespace-nowrap z-50 max-w-xs">
                {signees
                  .slice(maxVisible, maxVisible + 2)
                  .map((s) => s.name.split(" ")[0])
                  .join(", ")}
                {remainingCount > 2 && "..."}
              </div>
            )}
          </span>
        )}
      </span>
    </div>
  );
};

const PDFModal = ({ isOpen, onClose, pdfUrl }) => {
  const navigate = useNavigate();

  if (!isOpen) return null;

  const handleNext = () => {
    navigate('/recipientselection', { state: { from: '/manage' } });
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full h-full max-w-6xl max-h-[90vh] flex flex-col overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200 bg-gradient-to-r from-CloudbyzBlue/5 to-CloudbyzBlue/10">
          <div className="flex items-center w-1/3">
            <button
              onClick={onClose}
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
          
          <h2 className="text-xl font-bold text-gray-800 text-center flex-1">Document Preview</h2>
          
          <div className="flex items-center justify-end w-1/3">
            <button
              onClick={handleNext}
              className="bg-gradient-to-r from-CloudbyzBlue to-CloudbyzBlue/80 hover:from-CloudbyzBlue/90 hover:to-CloudbyzBlue/70 text-white px-6 py-2 rounded-lg font-semibold shadow-lg hover:shadow-xl transition-all duration-300 flex items-center space-x-2 hover:scale-105"
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
                <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
              </svg>
            </button>
          </div>
        </div>

        {/* PDF Viewer */}
        <div className="flex-1 overflow-hidden">
          <iframe
            src={pdfUrl}
            className="w-full h-full border-0"
            title="PDF Viewer"
            style={{ minHeight: '600px' }}
          />
        </div>
      </div>
    </div>
  );
};

const UploadModal = ({ isOpen, setIsOpen }) => {
  const [selectedPDF, setSelectedPDF] = useState(null);
  const fileInputRef = useRef(null);

  const handleFileSelect = (e) => {
    const file = e.target.files[0];
    if (file && file.type === "application/pdf") {
      const fileURL = URL.createObjectURL(file);
      setSelectedPDF(fileURL);
      setIsOpen(false);
    } else if (file) {
      alert("Please select a PDF file");
    }
  };

  const handleDrop = (event) => {
    event.preventDefault();
    const file = event.dataTransfer.files[0];
    if (file && file.type === 'application/pdf') {
      const fileURL = URL.createObjectURL(file);
      setSelectedPDF(fileURL);
      setIsOpen(false);
    } else {
      alert('Please drop a PDF file');
    }
  };

  const handleDragOver = (event) => {
    event.preventDefault();
  };

  const handleUploadAreaClick = () => {
    fileInputRef.current?.click();
  };

  const closePDFModal = () => {
    if (selectedPDF) {
      URL.revokeObjectURL(selectedPDF);
      setSelectedPDF(null);
    }
    // Reset the file input value to allow uploading the same file again
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  // Auto-open PDF modal when file is selected
  useEffect(() => {
    if (selectedPDF) {
      // Small delay to ensure modal closes first
      setTimeout(() => {
        // This will trigger the PDF modal to open
      }, 100);
    }
  }, [selectedPDF]);

  return (
    <>
      <Dialog
        open={isOpen}
        onClose={() => setIsOpen(false)}
        className="relative z-50"
      >
        <div className="fixed inset-0 bg-black/30" aria-hidden="true" />
        <div className="fixed inset-0 flex items-center justify-center p-4">
          <Dialog.Panel className="mx-auto max-w-md w-full rounded-lg bg-white p-6">
            <div className="flex justify-between items-center mb-4">
              <Dialog.Title className="text-lg font-medium">
                Upload Document
              </Dialog.Title>
              <button onClick={() => setIsOpen(false)}>
                <X className="w-5 h-5 text-gray-400 hover:text-gray-600" />
              </button>
            </div>

            <div className="space-y-4">
              <div
                className="border-2 border-dashed border-CloudbyzBlue/30 rounded-2xl p-16 text-center hover:border-CloudbyzBlue/50 hover:bg-CloudbyzBlue/5 transition-all duration-300 group cursor-pointer"
                onDrop={handleDrop}
                onDragOver={handleDragOver}
                onClick={handleUploadAreaClick}
              >
                <div className="w-20 h-20 bg-CloudbyzBlue/10 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:bg-CloudbyzBlue/20 transition-colors duration-300">
                  <Upload className="h-10 w-10 text-CloudbyzBlue" />
                </div>
                <h3 className="text-xl font-semibold text-gray-800 mb-3">Drop PDF documents here to get started</h3>
                <p className="text-gray-600 mb-6">Supports PDF files up to 25MB</p>
                <p className="text-CloudbyzBlue font-medium">Click anywhere in this area to browse files</p>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept=".pdf"
                  onChange={handleFileSelect}
                  className="hidden"
                />
              </div>
            </div>
          </Dialog.Panel>
        </div>
      </Dialog>

      {/* PDF Modal */}
      <PDFModal 
        isOpen={!!selectedPDF} 
        onClose={closePDFModal} 
        pdfUrl={selectedPDF} 
      />
    </>
  );
};

const ResendModal = ({ isOpen, setIsOpen, document, onDocumentUpdate }) => {
  const [selectedSignees, setSelectedSignees] = useState([]);

  useEffect(() => {
    if (document && isOpen) {
      const unsignedSignees = document.Signees.filter(
        (signee) =>
          !document.AlreadySigned.some(
            (signed) => signed.email === signee.email
          )
      );
      setSelectedSignees(unsignedSignees.map((s) => s.email));
    }
  }, [document, isOpen]);

  const handleSigneeToggle = (email) => {
    setSelectedSignees((prev) =>
      prev.includes(email) ? prev.filter((e) => e !== email) : [...prev, email]
    );
  };

  const handleSelectAllPending = (checked) => {
    if (checked) {
      const unsignedSignees = document.Signees.filter(
        (signee) =>
          !document.AlreadySigned.some(
            (signed) => signed.email === signee.email
          )
      );
      setSelectedSignees((prev) => {
        const signedSelected = prev.filter((email) =>
          document.AlreadySigned.some((signed) => signed.email === email)
        );
        return [...signedSelected, ...unsignedSignees.map((s) => s.email)];
      });
    } else {
      setSelectedSignees((prev) =>
        prev.filter((email) =>
          document.AlreadySigned.some((signed) => signed.email === email)
        )
      );
    }
  };

  const handleResend = () => {
    console.log("Resending to:", selectedSignees);
    
    // Simulate signing completion for demo purposes
    if (selectedSignees.length > 0) {
      const updatedDocument = {
        ...document,
        AlreadySigned: [...document.AlreadySigned, ...document.Signees.filter(s => selectedSignees.includes(s.email))]
      };
      
      // Check if all signees have signed
      if (updatedDocument.AlreadySigned.length === updatedDocument.Signees.length) {
        updatedDocument.Status = "Completed";
      }
      
      // Call the update function to refresh the document list
      if (onDocumentUpdate) {
        onDocumentUpdate(updatedDocument);
      }
    }
    
    setIsOpen(false);
  };

  if (!document) return null;

  const totalSignees = document.Signees.length;
  const signedCount = document.AlreadySigned.length;
  const percentage = totalSignees > 0 ? (signedCount / totalSignees) * 100 : 0;
  const allSigned = signedCount === totalSignees && totalSignees > 0;

  const unsignedSignees = document.Signees.filter(
    (signee) =>
      !document.AlreadySigned.some((signed) => signed.email === signee.email)
  );

  const allPendingSelected = unsignedSignees.every((signee) =>
    selectedSignees.includes(signee.email)
  );

  return (
    <Dialog
      open={isOpen}
      onClose={() => setIsOpen(false)}
      className="relative z-50"
    >
      <div className="fixed inset-0 bg-black/30" aria-hidden="true" />
      <div className="fixed inset-0 flex items-center justify-center p-4">
        <Dialog.Panel className="mx-auto max-w-lg w-full rounded-xl bg-white shadow-2xl">
          <div className="flex justify-between items-center p-6 border-b border-gray-200">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-CloudbyzBlue/10 rounded-lg">
                <Mail className="w-6 h-6 text-CloudbyzBlue" />
              </div>
              <div>
                <Dialog.Title className="text-xl font-semibold text-gray-900">
                  Resend Document
                </Dialog.Title>
                <p className="text-sm text-gray-500 mt-1">
                  {document.DocumentName}
                </p>
              </div>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <X className="w-5 h-5 text-gray-400" />
            </button>
          </div>

          <div className="p-6 space-y-6 max-h-96 overflow-y-auto">
            <div className="bg-gradient-to-r from-CloudbyzBlue/10 to-blue-50 rounded-lg p-4">
              <div className="flex items-center justify-between mb-3">
                <h4 className="font-semibold text-gray-900 flex items-center">
                  <UserCheck className="w-5 h-5 mr-2 text-CloudbyzBlue" />
                  Signature Progress
                </h4>
                {allSigned && (
                  <div className="flex items-center text-green-600">
                    <CheckCircle2 className="w-4 h-4 mr-1" />
                    <span className="text-sm font-medium">Complete</span>
                  </div>
                )}
              </div>

              <div className="flex items-center space-x-3">
                <div className="flex-1 bg-white rounded-full h-3 overflow-hidden shadow-inner">
                  <div
                    className="h-full bg-gradient-to-r from-CloudbyzBlue to-blue-500 transition-all duration-500"
                    style={{ width: `${percentage}%` }}
                  />
                </div>
                <span className="text-sm font-semibold text-gray-700 min-w-fit">
                  {signedCount}/{totalSignees} signed
                </span>
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-4">
                <h4 className="font-semibold text-gray-900">
                  Select Recipients
                </h4>
                {unsignedSignees.length > 0 && (
                  <div className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      checked={allPendingSelected && unsignedSignees.length > 0}
                      onChange={(e) => handleSelectAllPending(e.target.checked)}
                      className="h-4 w-4 rounded border-gray-300 text-CloudbyzBlue focus:ring-CloudbyzBlue"
                    />
                    <span className="text-sm text-gray-600">
                      Select all pending
                    </span>
                  </div>
                )}
              </div>

              <div className="space-y-2 max-h-48 overflow-y-auto">
                {document.Signees.map((signee) => {
                  const hasSigned = document.AlreadySigned.some(
                    (signed) => signed.email === signee.email
                  );
                  const isSelected = selectedSignees.includes(signee.email);

                  return (
                    <div
                      key={signee.email}
                      className={`flex items-center justify-between p-3 rounded-lg border transition-all ${
                        isSelected
                          ? "bg-CloudbyzBlue/5 border-CloudbyzBlue/30"
                          : "bg-gray-50 border-gray-200 hover:bg-gray-100"
                      }`}
                    >
                      <div className="flex items-center space-x-3">
                        <input
                          type="checkbox"
                          checked={isSelected}
                          onChange={() => handleSigneeToggle(signee.email)}
                          className="h-4 w-4 rounded border-gray-300 text-CloudbyzBlue focus:ring-CloudbyzBlue"
                        />
                        <div className="flex items-center space-x-3">
                          <div
                            className={`w-2 h-2 rounded-full ${
                              hasSigned ? "bg-green-500" : "bg-amber-500"
                            }`}
                          ></div>
                          <div>
                            <p className="text-sm font-medium text-gray-900">
                              {signee.name}
                            </p>
                            <p className="text-xs text-gray-500">
                              {signee.email}
                            </p>
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center space-x-2">
                        {hasSigned ? (
                          <div className="flex items-center text-green-600">
                            <CheckCircle2 className="w-4 h-4 mr-1" />
                            <span className="text-xs font-medium">Signed</span>
                          </div>
                        ) : (
                          <div className="flex items-center text-amber-600">
                            <AlertCircle className="w-4 h-4 mr-1" />
                            <span className="text-xs font-medium">Pending</span>
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {allSigned && (
              <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                <div className="flex items-center">
                  <CheckCircle2 className="w-5 h-5 text-green-500 mr-2" />
                  <p className="text-sm text-green-800">
                    All signees have completed signing this document.
                  </p>
                </div>
              </div>
            )}
          </div>

          <div className="flex justify-between items-center p-6 border-t border-gray-200 bg-gray-50 rounded-b-xl">
            <div className="text-sm text-gray-600">
              {selectedSignees.length} recipient
              {selectedSignees.length !== 1 ? "s" : ""} selected
            </div>
            <div className="flex space-x-3">
              <button
                onClick={() => setIsOpen(false)}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-CloudbyzBlue focus:ring-offset-2"
              >
                Cancel
              </button>
              <button
                onClick={handleResend}
                disabled={selectedSignees.length === 0}
                className="px-4 py-2 text-sm font-medium text-white bg-CloudbyzBlue rounded-md hover:bg-blue-600 disabled:bg-gray-300 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-CloudbyzBlue focus:ring-offset-2"
              >
                Resend ({selectedSignees.length})
              </button>
            </div>
          </div>
        </Dialog.Panel>
      </div>
    </Dialog>
  );
};

const DocumentPreview = ({ isOpen, setIsOpen, document }) => {
  const navigate = useNavigate();

  if (!document) return null;

  const getStatusColor = (status) => {
    switch (status) {
      case "Completed":
        return "bg-green-100 text-green-800 border-green-200";
      case "Sent for signature":
        return "bg-amber-100 text-amber-800 border-amber-200";
      case "Draft":
        return "bg-blue-100 text-blue-800 border-blue-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  const handleOpenPDF = () => {
    navigate('/signpreview', { state: { from: '/manage' } });
  };

  return (
    <Dialog
      open={isOpen}
      onClose={() => setIsOpen(false)}
      className="relative z-50"
    >
      <div className="fixed inset-0 bg-black/30" aria-hidden="true" />
      <div className="fixed inset-0 flex items-center justify-center p-4">
        <Dialog.Panel className="mx-auto max-w-2xl w-full rounded-xl bg-white shadow-2xl">
          <div className="flex justify-between items-center p-6 border-b border-gray-200">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-blue-100 rounded-lg">
                <FileText className="w-6 h-6 text-blue-600" />
              </div>
              <div>
                <Dialog.Title className="text-xl font-semibold text-gray-900">
                  {document.DocumentName}
                </Dialog.Title>
                <p className="text-sm text-gray-500">Document Preview</p>
              </div>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <X className="w-5 h-5 text-gray-400" />
            </button>
          </div>

          <div className="p-6 space-y-6 max-h-96 overflow-y-auto">
            <div className="bg-gray-50 rounded-lg p-4">
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-sm font-medium text-gray-900 flex items-center">
                  <Shield className="w-4 h-4 mr-2 text-gray-600" />
                  Document Status
                </h3>
                <div className="flex items-center space-x-3">
                  <div
                    className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium border ${getStatusColor(
                      document.Status
                    )}`}
                  >
                    <StatusIcon status={document.Status} />
                    <span className="ml-2">{document.Status}</span>
                  </div>
                  <button
                    onClick={handleOpenPDF}
                    className="inline-flex items-center px-3 py-1 text-sm font-medium text-CloudbyzBlue bg-blue-50 border border-blue-200 rounded-md hover:bg-blue-100 transition-colors"
                  >
                    <ExternalLink className="w-4 h-4 mr-1" />
                    Open PDF
                  </button>
                </div>
              </div>
              {document.Status === "Sent for signature" && (
                <StatusBar document={document} />
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-gray-50 rounded-lg p-4">
                <h4 className="text-sm font-medium text-gray-900 mb-2 flex items-center">
                  <Building2 className="w-4 h-4 mr-2 text-gray-600" />
                  Author Information
                </h4>
                <div className="space-y-1">
                  <p className="text-sm text-gray-700 font-medium">
                    {document.AuthorName}
                  </p>
                  <p className="text-xs text-gray-500">
                    {document.AuthorEmail}
                  </p>
                </div>
              </div>

              <div className="bg-gray-50 rounded-lg p-4">
                <h4 className="text-sm font-medium text-gray-900 mb-2 flex items-center">
                  <FileText className="w-4 h-4 mr-2 text-gray-600" />
                  Document Details
                </h4>
                <div className="space-y-1">
                  <p className="text-sm text-gray-700">
                    Pages:{" "}
                    <span className="font-medium">{document.TotalPages}</span>
                  </p>
                  <p className="text-sm text-gray-700">
                    ID:{" "}
                    <span className="font-mono text-xs">
                      {document.DocumentID}
                    </span>
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-gray-50 rounded-lg p-4">
              <h4 className="text-sm font-medium text-gray-900 mb-3 flex items-center">
                <Users className="w-4 h-4 mr-2 text-gray-600" />
                Signees ({document.Signees.length})
              </h4>
              <div
                className={`space-y-2 ${
                  document.Signees.length > 5 ? "max-h-40 overflow-y-auto" : ""
                }`}
              >
                {document.Signees.map((signee, index) => {
                  const hasSigned = document.AlreadySigned.some(
                    (signed) => signed.email === signee.email
                  );
                  return (
                    <div
                      key={index}
                      className="flex items-center justify-between p-2 bg-white rounded border"
                    >
                      <div className="flex items-center space-x-3">
                        <div
                          className={`w-2 h-2 rounded-full ${
                            hasSigned ? "bg-green-500" : "bg-yellow-500"
                          }`}
                        ></div>
                        <div>
                          <p className="text-sm font-medium text-gray-900">
                            {signee.name}
                          </p>
                          <p className="text-xs text-gray-500">
                            {signee.email}
                          </p>
                        </div>
                      </div>
                      <span
                        className={`text-xs px-2 py-1 rounded-full font-medium ${
                          hasSigned
                            ? "bg-green-100 text-green-800"
                            : "bg-yellow-100 text-yellow-800"
                        }`}
                      >
                        {hasSigned ? "Signed" : "Pending"}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="bg-gray-50 rounded-lg p-4">
              <h4 className="text-sm font-medium text-gray-900 mb-3 flex items-center">
                <Clock4 className="w-4 h-4 mr-2 text-gray-600" />
                Timeline
              </h4>
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Date Added</span>
                  <span className="text-sm font-medium text-gray-900">
                    {format(new Date(document.DateAdded), "MMM d, yyyy")}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Last Modified</span>
                  <span className="text-sm font-medium text-gray-900">
                    {format(
                      new Date(document.LastChangedDate),
                      "MMM d, yyyy 'at' h:mm a"
                    )}
                  </span>
                </div>
              </div>
            </div>
          </div>

          <div className="flex justify-end p-6 border-t border-gray-200 bg-gray-50 rounded-b-xl">
            <button
              onClick={() => setIsOpen(false)}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-CloudbyzBlue focus:ring-offset-2"
            >
              Close
            </button>
          </div>
        </Dialog.Panel>
      </div>
    </Dialog>
  );
};

const Manage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [activeTab, setActiveTab] = useState('manage');
  const [documents, setDocuments] = useState([]);
  const [selectedDocuments, setSelectedDocuments] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [sortField, setSortField] = useState("DateAdded");
  const [sortDirection, setSortDirection] = useState("desc");
  const [currentPage, setCurrentPage] = useState(1);
  const [previewDocument, setPreviewDocument] = useState(null);
  const [activeSection, setActiveSection] = useState("inbox");
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [showResendModal, setShowResendModal] = useState(false);
  const [resendDocument, setResendDocument] = useState(null);
  const [isDownloading, setIsDownloading] = useState(false);
  const [loading, setLoading] = useState(true);
  const [serverError, setServerError] = useState(false);
  const [notificationUpdate, setNotificationUpdate] = useState(0);
  const itemsPerPage = 10;

  const loadingStates = [
    { text: 'Loading document management...' },
    { text: 'Fetching your documents...' },
    { text: 'Organizing document data...' },
    { text: 'Preparing workspace...' }
  ];

  const currentUser = {
    email: "john.doe@cloudbyz.com",
    id: "us1122334456",
  };

  useEffect(() => {
    // Check authentication
    const username = localStorage.getItem('username');
    if (!username) {
      navigate('/signin');
      return;
    }

    // Check if we came from dashboard with a specific view
    if (location.state?.quickView) {
      setActiveSection(location.state.quickView);
    }

    fetchDocuments();
  }, [navigate, location.state]);

  const fetchDocuments = async () => {
    try {
      const response = await fetch("http://localhost:5000/api/documents/all");
      
      if (!response.ok) {
        throw new Error('Server connection failed');
      }
      
      const data = await response.json();

      const processedDocuments = data.documents.map((doc) => {
        if (doc.Status === "Sent for signature") {
          const totalSignees = doc.Signees.length;
          const signedCount = doc.AlreadySigned.length;

          if (totalSignees > 0 && signedCount === totalSignees) {
            return { ...doc, Status: "Completed" };
          }
        }
        return doc;
      });

      setDocuments(processedDocuments);
    } catch (error) {
      console.error("Error fetching documents:", error);
      setServerError(true);
    } finally {
      setTimeout(() => setLoading(false), 3000);
    }
  };

  const handleDocumentUpdate = (updatedDocument) => {
    setDocuments(prevDocs => 
      prevDocs.map(doc => 
        doc.DocumentID === updatedDocument.DocumentID ? updatedDocument : doc
      )
    );
  };

  const handlePreviewClick = (doc) => {
    const isAuthor =
      doc.AuthorEmail === currentUser.email && doc.AuthorID === currentUser.id;

    if (isAuthor) {
      setPreviewDocument(doc);
    } else {
      alert("Only the author of the document can access the preview.");
    }
  };

  const getAvailableActions = (document) => {
    const isAuthor =
      document.AuthorEmail === currentUser.email &&
      document.AuthorID === currentUser.id;
    const isSignee = document.Signees.some(
      (signee) => signee.email === currentUser.email
    );
    const hasUserSigned = document.AlreadySigned.some(
      (signed) => signed.email === currentUser.email
    );

    const actions = [];

    if (document.Status === "Draft" && isAuthor) {
      actions.push("Setup Sign");
    } else if (document.Status === "Sent for signature") {
      if (isAuthor) {
        actions.push("Resend");
      }
      if (isSignee && !hasUserSigned) {
        actions.push("Sign");
      }
    } else if (document.Status === "Completed" && (isAuthor || isSignee)) {
      actions.push("Download");
    }

    if (isAuthor) {
      actions.push("Preview");
    }

    return actions;
  };

  const handleSelectDocument = (docId) => {
    if (selectedDocuments.includes(docId)) {
      setSelectedDocuments(selectedDocuments.filter((id) => id !== docId));
    } else {
      setSelectedDocuments([...selectedDocuments, docId]);
    }
  };

  const handleSort = (field) => {
    if (sortField === field) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortDirection("asc");
    }
    setCurrentPage(1);
  };

  const removeNotificationForDocument = async (documentID) => {
    try {
      // Find and remove notification for this document
      const response = await fetch('http://localhost:5000/api/notifications/remove-by-document', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ documentID }),
      });

      if (response.ok) {
        // Trigger notification update in navbar
        setNotificationUpdate(prev => prev + 1);
      }
    } catch (error) {
      console.error("Error removing notification:", error);
    }
  };

  const handleActionClick = (action, document) => {
    if (action === "Setup Sign") {
      navigate('/recipientselection', { state: { from: '/manage' } });
    } else if (action === "Resend") {
      setResendDocument(document);
      setShowResendModal(true);
    } else if (action === "Download") {
      console.log([document.DocumentID, document.DocumentName]);
    } else if (action === "Preview") {
      handlePreviewClick(document);
    } else if (action === "Sign") {
      // Remove the notification for this document when signing
      removeNotificationForDocument(document.DocumentID);
      navigate('/signeeui');
    } else {
      console.log(`Performing ${action} on document:`, document);
    }
  };

  const getFilteredDocuments = () => {
    return documents.filter((doc) => {
      const isAuthor =
        doc.AuthorEmail === currentUser.email &&
        doc.AuthorID === currentUser.id;
      const isSignee = doc.Signees.some(
        (signee) => signee.email === currentUser.email
      );

      if (!isAuthor && !isSignee) {
        return false;
      }

      // Enhanced search to include signee names
      const matchesSearch =
        doc.DocumentName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        doc.AuthorName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        doc.Signees.some(signee => 
          signee.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          signee.email.toLowerCase().includes(searchQuery.toLowerCase())
        );

      switch (activeSection) {
        case "inbox":
          return matchesSearch;
        case "sent":
          return matchesSearch && isAuthor;
        case "received":
          return matchesSearch && isSignee;
        case "drafts":
          return matchesSearch && doc.Status === "Draft";
        case "actionRequired":
          const needsUserSignature = isSignee && !doc.AlreadySigned.some(signed => signed.email === currentUser.email) && doc.Status === 'Sent for signature';
          return matchesSearch && needsUserSignature;
        case "waitingForOthers":
          const isAuthorWaiting = isAuthor && doc.AlreadySigned.length < doc.Signees.length && doc.Status !== 'Completed' && doc.Status !== 'Draft';
          const hasUserSignedWaiting = doc.AlreadySigned.some(signed => signed.email === currentUser.email) && doc.AlreadySigned.length < doc.Signees.length && doc.Status !== 'Completed';
          return matchesSearch && (isAuthorWaiting || hasUserSignedWaiting);
        case "completed":
          return matchesSearch && doc.Status === "Completed";
        default:
          return matchesSearch;
      }
    });
  };

  const filteredAndSortedDocuments = getFilteredDocuments().sort((a, b) => {
    let comparison = 0;
    if (sortField === "LastChangedDate" || sortField === "DateAdded") {
      const dateA = new Date(a[sortField]);
      const dateB = new Date(b[sortField]);
      comparison = dateA.getTime() - dateB.getTime();
    } else if (sortField === "DocumentName") {
      comparison = a.DocumentName.localeCompare(b.DocumentName);
    } else if (sortField === "Status") {
      comparison = a.Status.localeCompare(b.Status);
    }
    return sortDirection === "asc" ? comparison : -comparison;
  });

  const totalPages = Math.ceil(
    filteredAndSortedDocuments.length / itemsPerPage
  );
  const paginatedDocuments = filteredAndSortedDocuments.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const getSectionTitle = () => {
    switch (activeSection) {
      case "inbox":
        return "Inbox";
      case "sent":
        return "Sent";
      case "received":
        return "Received";
      case "drafts":
        return "Drafts";
      case "actionRequired":
        return "Action Required";
      case "waitingForOthers":
        return "Waiting for Others";
      case "completed":
        return "Completed";
      default:
        return "Documents";
    }
  };

  const clearQuickView = () => {
    setActiveSection('inbox');
  };

  if (serverError) {
    return <Error404 />;
  }

  return (
    <div className="bg-gray-50 min-h-screen pt-16">
      <Loader loading={loading}>
        {loadingStates}
      </Loader>
      <Navbar 
        activeTab={activeTab} 
        setActiveTab={setActiveTab} 
        onNotificationUpdate={notificationUpdate}
      />
      <Sidebar
        activeSection={activeSection}
        setActiveSection={setActiveSection}
        setShowUploadModal={setShowUploadModal}
      />

      <div className="ml-64 px-6 py-6">
        <div className="bg-white rounded-lg shadow-sm overflow-hidden">
          <div className="border-b border-gray-200 p-4 flex justify-between items-center">
            <div className="flex items-center space-x-4">
              <h1 className="text-xl font-semibold text-gray-900">
                {getSectionTitle()}
              </h1>
              <span className="text-sm text-gray-500">
                ({filteredAndSortedDocuments.length} documents)
              </span>
            </div>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                type="text"
                placeholder="Search documents, authors, or signees..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 pr-4 py-2 border border-gray-300 rounded-md w-80 text-sm focus:outline-none focus:ring-1 focus:ring-CloudbyzBlue focus:border-CloudbyzBlue"
              />
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th scope="col" className="w-12 px-3 py-3"></th>
                  <th scope="col" className="w-12 px-3 py-3"></th>
                  <th
                    scope="col"
                    className="w-80 px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                    onClick={() => handleSort("DocumentName")}
                  >
                    Document Name
                    <ChevronDown
                      className={`inline-block ml-1 w-3 h-3 transform ${
                        sortField === "DocumentName" && sortDirection === "desc"
                          ? "rotate-180"
                          : ""
                      }`}
                    />
                  </th>
                  <th
                    scope="col"
                    className="w-32 px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                    onClick={() => handleSort("Status")}
                  >
                    Status
                    <ChevronDown
                      className={`inline-block ml-1 w-3 h-3 transform ${
                        sortField === "Status" && sortDirection === "desc"
                          ? "rotate-180"
                          : ""
                      }`}
                    />
                  </th>
                  <th
                    scope="col"
                    className="w-40 px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Author
                  </th>
                  <th
                    scope="col"
                    className="w-32 px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                    onClick={() => handleSort("LastChangedDate")}
                  >
                    Last Change
                    <ChevronDown
                      className={`inline-block ml-1 w-3 h-3 transform ${
                        sortField === "LastChangedDate" &&
                        sortDirection === "desc"
                          ? "rotate-180"
                          : ""
                      }`}
                    />
                  </th>
                  <th
                    scope="col"
                    className="w-32 px-3 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider text-center"
                  >
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {paginatedDocuments.length === 0 ? (
                  <tr>
                    <td colSpan="7" className="px-6 py-12 text-center">
                      <div className="flex flex-col items-center">
                        <FileText className="w-12 h-12 text-gray-300 mb-4" />
                        <p className="text-gray-500 text-lg font-medium">No documents found</p>
                        <p className="text-gray-400 text-sm">
                          {searchQuery || activeSection !== 'inbox'
                            ? 'Try adjusting your search or filters'
                            : 'Upload your first document to get started'
                          }
                        </p>
                      </div>
                    </td>
                  </tr>
                ) : (
                  paginatedDocuments.map((doc) => (
                    <tr key={doc.DocumentID} className="hover:bg-gray-50">
                      <td className="px-3 py-4 whitespace-nowrap">
                        <input
                          type="checkbox"
                          className="h-4 w-4 rounded border-gray-300 text-CloudbyzBlue focus:ring-CloudbyzBlue"
                          checked={selectedDocuments.includes(doc.DocumentID)}
                          onChange={() => handleSelectDocument(doc.DocumentID)}
                        />
                      </td>
                      <td className="px-3 py-4 whitespace-nowrap">
                        <StatusIcon status={doc.Status} />
                      </td>
                      <td className="px-3 py-4">
                        <div className="text-sm font-medium text-gray-900">
                          <AnimatedText
                            text={doc.DocumentName}
                            maxWidth="300px"
                          />
                        </div>
                        <div className="mt-1">
                          <SigneesList signees={doc.Signees} />
                        </div>
                      </td>
                      <td className="px-3 py-4 whitespace-nowrap">
                        <div>
                          <span
                            className={`inline-flex text-xs ${
                              doc.Status === "Completed"
                                ? "text-green-800"
                                : doc.Status === "Sent for signature"
                                ? "text-amber-800"
                                : "text-blue-800"
                            }`}
                          >
                            {doc.Status}
                          </span>
                          {doc.Status === "Sent for signature" && (
                            <div className="mt-1">
                              <StatusBar document={doc} />
                            </div>
                          )}
                        </div>
                      </td>
                      <td className="px-3 py-4 whitespace-nowrap text-sm text-gray-500">
                        <AnimatedText text={doc.AuthorName} maxWidth="150px" />
                      </td>
                      <td className="px-3 py-4 whitespace-nowrap text-xs text-gray-500">
                        <div>
                          <div>
                            {format(new Date(doc.LastChangedDate), "MMM d, yyyy")}
                          </div>
                          <div className="text-gray-400">
                            {format(new Date(doc.LastChangedDate), "h:mm a")}
                          </div>
                        </div>
                      </td>
                      <td className="px-3 py-4 whitespace-nowrap text-right text-sm font-medium text-center">
                        <div
                          className={`flex items-center justify-center space-x-2 ${
                            isDownloading ? "opacity-50 pointer-events-none" : ""
                          }`}
                        >
                          <Menu as="div" className="relative">
                            <Menu.Button className="text-sm font-medium text-gray-800 border border-gray-300 rounded px-3 py-1.5 flex items-center">
                              Actions <ChevronDown className="ml-1 w-4 h-4" />
                            </Menu.Button>
                            <Transition
                              as={Fragment}
                              enter="transition ease-out duration-100"
                              enterFrom="transform opacity-0 scale-95"
                              enterTo="transform opacity-100 scale-100"
                              leave="transition ease-in duration-75"
                              leaveFrom="transform opacity-100 scale-100"
                              leaveTo="transform opacity-0 scale-95"
                            >
                              <Menu.Items className="absolute right-0 mt-2 w-48 origin-top-right bg-white rounded-md shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none z-10">
                                {getAvailableActions(doc).map((action) => (
                                  <Menu.Item key={action}>
                                    {({ active }) => (
                                      <button
                                        className={`${
                                          active ? "bg-gray-100" : ""
                                        } block px-4 py-2 text-sm text-gray-700 w-full text-left`}
                                        onClick={() =>
                                          handleActionClick(action, doc)
                                        }
                                      >
                                        {action}
                                      </button>
                                    )}
                                  </Menu.Item>
                                ))}
                              </Menu.Items>
                            </Transition>
                          </Menu>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          {paginatedDocuments.length > 0 && (
            <div className="bg-gray-50 px-4 py-3 flex items-center justify-between border-t border-gray-200">
              <div className="flex-1 flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-700">
                    Showing{" "}
                    <span className="font-medium">
                      {(currentPage - 1) * itemsPerPage + 1}
                    </span>{" "}
                    to{" "}
                    <span className="font-medium">
                      {Math.min(
                        currentPage * itemsPerPage,
                        filteredAndSortedDocuments.length
                      )}
                    </span>{" "}
                    of{" "}
                    <span className="font-medium">
                      {filteredAndSortedDocuments.length}
                    </span>{" "}
                    results
                  </p>
                </div>
                <div className="flex space-x-2">
                  <button
                    onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                    disabled={currentPage === 1}
                    className={`relative inline-flex items-center px-2 py-2 rounded-md border ${
                      currentPage === 1
                        ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                        : "bg-white text-gray-500 hover:bg-gray-50"
                    } text-sm font-medium`}
                  >
                    <ChevronLeft className="w-5 h-5" />
                  </button>
                  <button
                    onClick={() =>
                      setCurrentPage(Math.min(totalPages, currentPage + 1))
                    }
                    disabled={currentPage === totalPages}
                    className={`relative inline-flex items-center px-2 py-2 rounded-md border ${
                      currentPage === totalPages
                        ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                        : "bg-white text-gray-500 hover:bg-gray-50"
                    } text-sm font-medium`}
                  >
                    <ChevronRight className="w-5 h-5" />
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      <UploadModal isOpen={showUploadModal} setIsOpen={setShowUploadModal} />
      <ResendModal
        isOpen={showResendModal}
        setIsOpen={setShowResendModal}
        document={resendDocument}
        onDocumentUpdate={handleDocumentUpdate}
      />
      {previewDocument && (
        <DocumentPreview
          isOpen={!!previewDocument}
          setIsOpen={(isOpen) => !isOpen && setPreviewDocument(null)}
          document={previewDocument}
        />
      )}
    </div>
  );
};

export default Manage;