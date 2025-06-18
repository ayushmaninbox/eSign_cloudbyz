import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  FileText, 
  Clock, 
  AlertCircle, 
  CheckCircle2, 
  Upload, 
  ChevronDown,
  Bell,
  HelpCircle,
  User,
  PenTool,
  Send,
  Users,
  TrendingUp,
  Calendar,
  Shield,
  Settings,
  LogOut,
  UserCircle,
  FileEdit,
  Download
} from 'lucide-react';
import { format } from 'date-fns';
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

const Navbar = ({ activeTab, setActiveTab }) => {
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

  useEffect(() => {
    fetch("http://localhost:5000/api/notifications")
      .then((response) => response.json())
      .then((data) => {
        const sortedNotifications = data.new.sort(
          (a, b) => new Date(b.timestamp) - new Date(a.timestamp)
        );
        setNotifications(sortedNotifications);
      })
      .catch((error) => console.error("Error loading notifications:", error));
  }, []);

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

const PDFModal = ({ isOpen, onClose, pdfUrl }) => {
  const navigate = useNavigate();

  if (!isOpen) return null;

  const handleNext = () => {
    navigate('/recipientselection');
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

const Home = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('home');
  const [stats, setStats] = useState({
    actionRequired: 0,
    waitingForOthers: 0,
    expiringSoon: 0,
    completed: 0
  });
  const [documents, setDocuments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showPDFModal, setShowPDFModal] = useState(false);
  const [selectedPDF, setSelectedPDF] = useState(null);
  const [serverError, setServerError] = useState(false);

  const loadingStates = [
    { text: 'Loading your dashboard...' },
    { text: 'Fetching documents...' },
    { text: 'Checking server status...' },
    { text: 'Preparing your workspace...' }
  ];

  useEffect(() => {
    // Check authentication
    const username = localStorage.getItem('username');
    if (!username) {
      navigate('/signin');
      return;
    }

    const fetchData = async () => {
      try {
        const [statsResponse, documentsResponse] = await Promise.all([
          fetch('http://localhost:5000/api/stats'),
          fetch('http://localhost:5000/api/documents')
        ]);
        
        if (!statsResponse.ok || !documentsResponse.ok) {
          throw new Error('Server connection failed');
        }
        
        const statsData = await statsResponse.json();
        const documentsData = await documentsResponse.json();
        
        setStats(statsData);
        setDocuments(documentsData.documents);
      } catch (error) {
        console.error('Error fetching data:', error);
        setServerError(true);
      } finally {
        setTimeout(() => setLoading(false), 3000);
      }
    };

    fetchData();
  }, [navigate]);

  const handleFileUpload = (event) => {
    const file = event.target.files[0];
    if (file && file.type === 'application/pdf') {
      const fileURL = URL.createObjectURL(file);
      setSelectedPDF(fileURL);
      setShowPDFModal(true);
    } else if (file) {
      alert('Please select a PDF file');
    }
  };

  const handleDrop = (event) => {
    event.preventDefault();
    const file = event.dataTransfer.files[0];
    if (file && file.type === 'application/pdf') {
      const fileURL = URL.createObjectURL(file);
      setSelectedPDF(fileURL);
      setShowPDFModal(true);
    } else {
      alert('Please drop a PDF file');
    }
  };

  const handleDragOver = (event) => {
    event.preventDefault();
  };

  const handleUploadAreaClick = () => {
    document.getElementById('file-upload').click();
  };

  const closePDFModal = () => {
    setShowPDFModal(false);
    if (selectedPDF) {
      URL.revokeObjectURL(selectedPDF);
      setSelectedPDF(null);
    }
    // Reset the file input value to allow uploading the same file again
    const fileInput = document.getElementById('file-upload');
    if (fileInput) {
      fileInput.value = '';
    }
  };

  const handleStatCardClick = (statType) => {
    let quickView = '';
    switch (statType) {
      case 'actionRequired':
        quickView = 'actionRequired';
        break;
      case 'waitingForOthers':
        quickView = 'waitingForOthers';
        break;
      case 'expiringSoon':
        quickView = 'drafts';
        break;
      case 'completed':
        quickView = 'completed';
        break;
      default:
        return;
    }
    
    navigate('/manage', { state: { quickView } });
  };

  if (serverError) {
    return <Error404 />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-CloudbyzBlue/5 via-white to-CloudbyzBlue/10 font-sans">
      <Loader loading={loading}>
        {loadingStates}
      </Loader>
      <Navbar activeTab={activeTab} setActiveTab={setActiveTab} />

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 pt-24">
        {/* Welcome Banner */}
        <div className="bg-gradient-to-r from-CloudbyzBlue to-CloudbyzBlue/80 rounded-3xl shadow-2xl mb-8 overflow-hidden relative">
          <div className="absolute inset-0 bg-gradient-to-r from-transparent to-white/10"></div>
          <div className="relative px-8 py-12">
            <div className="flex items-center justify-between mb-8">
              <div className="flex items-center space-x-6">
                <div className="w-24 h-24 bg-white/20 rounded-2xl flex items-center justify-center backdrop-blur-sm border border-white/30">
                  <User className="h-12 w-12 text-white" />
                </div>
                <div>
                  <div className="text-white/80 text-sm mb-2 font-medium">Welcome back,</div>
                  <div className="text-white text-3xl font-bold mb-1">John Doe</div>
                  <div className="text-white/70 text-base">john.doe@cloudbyz.com</div>
                </div>
              </div>
              <div className="text-right">
                <div className="text-white/80 text-sm font-medium">Dashboard Overview</div>
                <div className="text-white/60 text-sm">Last 6 Months</div>
              </div>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              <button
                onClick={() => handleStatCardClick('actionRequired')}
                className="bg-white/15 backdrop-blur-sm rounded-2xl p-6 text-center hover:bg-white/25 transition-all duration-300 hover:scale-105 border border-white/20 cursor-pointer"
              >
                <AlertCircle className="h-8 w-8 text-white mx-auto mb-3" />
                <div className="text-3xl font-bold text-white mb-2">{stats.actionRequired}</div>
                <div className="text-white/80 text-sm font-medium">Action Required</div>
              </button>
              <button
                onClick={() => handleStatCardClick('waitingForOthers')}
                className="bg-white/15 backdrop-blur-sm rounded-2xl p-6 text-center hover:bg-white/25 transition-all duration-300 hover:scale-105 border border-white/20 cursor-pointer"
              >
                <Clock className="h-8 w-8 text-white mx-auto mb-3" />
                <div className="text-3xl font-bold text-white mb-2">{stats.waitingForOthers}</div>
                <div className="text-white/80 text-sm font-medium">Waiting for Others</div>
              </button>
              <button
                onClick={() => handleStatCardClick('expiringSoon')}
                className="bg-white/15 backdrop-blur-sm rounded-2xl p-6 text-center hover:bg-white/25 transition-all duration-300 hover:scale-105 border border-white/20 cursor-pointer"
              >
                <PenTool className="h-8 w-8 text-white mx-auto mb-3" />
                <div className="text-3xl font-bold text-white mb-2">{stats.expiringSoon}</div>
                <div className="text-white/80 text-sm font-medium">Drafts</div>
              </button>
              <button
                onClick={() => handleStatCardClick('completed')}
                className="bg-white/15 backdrop-blur-sm rounded-2xl p-6 text-center hover:bg-white/25 transition-all duration-300 hover:scale-105 border border-white/20 cursor-pointer"
              >
                <CheckCircle2 className="h-8 w-8 text-white mx-auto mb-3" />
                <div className="text-3xl font-bold text-white mb-2">{stats.completed}</div>
                <div className="text-white/80 text-sm font-medium">Completed</div>
              </button>
            </div>
          </div>
        </div>

        {/* Upload Section */}
        <div className="bg-white rounded-3xl shadow-xl overflow-hidden border border-CloudbyzBlue/10">
          <div className="bg-gradient-to-r from-CloudbyzBlue/5 to-CloudbyzBlue/10 px-8 py-6 border-b border-CloudbyzBlue/10">
            <h2 className="text-2xl font-bold text-gray-800 mb-2">Upload Documents</h2>
            <p className="text-gray-600">Drag and drop your PDF documents or click to browse</p>
          </div>
          <div className="p-8">
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
                type="file"
                accept=".pdf"
                onChange={handleFileUpload}
                className="hidden"
                id="file-upload"
              />
            </div>
          </div>
        </div>
      </main>

      {/* PDF Modal */}
      <PDFModal 
        isOpen={showPDFModal} 
        onClose={closePDFModal} 
        pdfUrl={selectedPDF} 
      />
    </div>
  );
};

export default Home;