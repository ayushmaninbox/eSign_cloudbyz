import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { 
  FileText, 
  Clock, 
  AlertCircle, 
  CheckCircle2, 
  Upload, 
  ChevronDown,
  Bell,
  User,
  PenTool,
  Send,
  Users,
  Search,
  Filter,
  MoreVertical,
  Eye,
  Download,
  Trash2,
  Edit,
  Settings,
  LogOut,
  UserCircle,
  FileEdit,
  X
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

const DocumentActionsDropdown = ({ document, onAction }) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleAction = (action) => {
    onAction(action, document);
    setIsOpen(false);
  };

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
      >
        <MoreVertical className="w-4 h-4 text-gray-500" />
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-1 w-48 bg-white rounded-lg shadow-lg border border-gray-200 z-50">
          <div className="py-1">
            <button
              onClick={() => handleAction('view')}
              className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-50 flex items-center space-x-2"
            >
              <Eye className="w-4 h-4" />
              <span>View</span>
            </button>
            <button
              onClick={() => handleAction('download')}
              className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-50 flex items-center space-x-2"
            >
              <Download className="w-4 h-4" />
              <span>Download</span>
            </button>
            {document.Status === 'Draft' && (
              <button
                onClick={() => handleAction('edit')}
                className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-50 flex items-center space-x-2"
              >
                <Edit className="w-4 h-4" />
                <span>Edit</span>
              </button>
            )}
            <button
              onClick={() => handleAction('delete')}
              className="w-full px-4 py-2 text-left text-sm text-red-600 hover:bg-red-50 flex items-center space-x-2"
            >
              <Trash2 className="w-4 h-4" />
              <span>Delete</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

const Manage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [activeTab, setActiveTab] = useState('manage');
  const [documents, setDocuments] = useState([]);
  const [filteredDocuments, setFilteredDocuments] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [loading, setLoading] = useState(true);
  const [serverError, setServerError] = useState(false);
  const [activeQuickView, setActiveQuickView] = useState('');

  const loadingStates = [
    { text: 'Loading document management...' },
    { text: 'Fetching your documents...' },
    { text: 'Organizing document data...' },
    { text: 'Preparing workspace...' }
  ];

  useEffect(() => {
    // Check authentication
    const username = localStorage.getItem('username');
    if (!username) {
      navigate('/signin');
      return;
    }

    // Check if we came from dashboard with a specific view
    if (location.state?.quickView) {
      setActiveQuickView(location.state.quickView);
    }

    const fetchDocuments = async () => {
      try {
        const response = await fetch('http://localhost:5000/api/documents/all');
        if (!response.ok) {
          throw new Error('Server connection failed');
        }
        
        const data = await response.json();
        setDocuments(data.documents);
        setFilteredDocuments(data.documents);
      } catch (error) {
        console.error('Error fetching documents:', error);
        setServerError(true);
      } finally {
        setTimeout(() => setLoading(false), 3000);
      }
    };

    fetchDocuments();
  }, [navigate, location.state]);

  // Filter documents based on search term, status filter, and quick view
  useEffect(() => {
    let filtered = documents;

    // Apply quick view filter first
    if (activeQuickView) {
      switch (activeQuickView) {
        case 'actionRequired':
          filtered = documents.filter(doc => {
            const isSignee = doc.Signees.some(signee => signee.name === 'John Doe');
            const hasAlreadySigned = doc.AlreadySigned.some(signed => signed.name === 'John Doe');
            return isSignee && !hasAlreadySigned && doc.Status === 'Sent for signature';
          });
          break;
        case 'waitingForOthers':
          filtered = documents.filter(doc => {
            const isAuthor = doc.AuthorName === 'John Doe';
            const hasJohnSigned = doc.AlreadySigned.some(signed => signed.name === 'John Doe');
            const totalSignees = doc.Signees.length;
            const totalSigned = doc.AlreadySigned.length;
            
            const johnSignedWaitingForOthers = hasJohnSigned && totalSigned < totalSignees && doc.Status !== 'Completed';
            const authorWaitingForOthers = isAuthor && totalSigned < totalSignees && doc.Status !== 'Completed' && doc.Status !== 'Draft';
            
            return johnSignedWaitingForOthers || authorWaitingForOthers;
          });
          break;
        case 'drafts':
          filtered = documents.filter(doc => doc.Status === 'Draft' && doc.AuthorName === 'John Doe');
          break;
        case 'completed':
          filtered = documents.filter(doc => doc.Status === 'Completed');
          break;
        default:
          break;
      }
    }

    // Apply status filter
    if (statusFilter !== 'All') {
      filtered = filtered.filter(doc => doc.Status === statusFilter);
    }

    // Apply search filter
    if (searchTerm) {
      filtered = filtered.filter(doc => {
        const searchLower = searchTerm.toLowerCase();
        
        // Search in document name
        const nameMatch = doc.DocumentName.toLowerCase().includes(searchLower);
        
        // Search in author name
        const authorMatch = doc.AuthorName.toLowerCase().includes(searchLower);
        
        // Search in signee names
        const signeeMatch = doc.Signees.some(signee => 
          signee.name.toLowerCase().includes(searchLower)
        );
        
        return nameMatch || authorMatch || signeeMatch;
      });
    }

    setFilteredDocuments(filtered);
  }, [documents, searchTerm, statusFilter, activeQuickView]);

  const getStatusIcon = (status) => {
    switch (status) {
      case 'Draft':
        return <PenTool className="w-4 h-4 text-gray-500" />;
      case 'Sent for signature':
        return <Send className="w-4 h-4 text-blue-500" />;
      case 'Completed':
        return <CheckCircle2 className="w-4 h-4 text-green-500" />;
      default:
        return <FileText className="w-4 h-4 text-gray-500" />;
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'Draft':
        return 'bg-gray-100 text-gray-700';
      case 'Sent for signature':
        return 'bg-blue-100 text-blue-700';
      case 'Completed':
        return 'bg-green-100 text-green-700';
      default:
        return 'bg-gray-100 text-gray-700';
    }
  };

  const handleDocumentAction = (action, document) => {
    switch (action) {
      case 'view':
        navigate('/signpreview', { state: { from: '/manage' } });
        break;
      case 'download':
        console.log('Download document:', document.DocumentName);
        break;
      case 'edit':
        navigate('/recipientselection', { state: { from: '/manage' } });
        break;
      case 'delete':
        console.log('Delete document:', document.DocumentName);
        break;
      default:
        break;
    }
  };

  const getQuickViewStats = () => {
    // Action Required - documents where John Doe hasn't signed yet
    const actionRequired = documents.filter(doc => {
      const isSignee = doc.Signees.some(signee => signee.name === 'John Doe');
      const hasAlreadySigned = doc.AlreadySigned.some(signed => signed.name === 'John Doe');
      return isSignee && !hasAlreadySigned && doc.Status === 'Sent for signature';
    }).length;
    
    // Waiting for Others - docs where John has signed and others haven't OR docs where John is author and others haven't finished signing
    const waitingForOthers = documents.filter(doc => {
      const isAuthor = doc.AuthorName === 'John Doe';
      const hasJohnSigned = doc.AlreadySigned.some(signed => signed.name === 'John Doe');
      const totalSignees = doc.Signees.length;
      const totalSigned = doc.AlreadySigned.length;
      
      const johnSignedWaitingForOthers = hasJohnSigned && totalSigned < totalSignees && doc.Status !== 'Completed';
      const authorWaitingForOthers = isAuthor && totalSigned < totalSignees && doc.Status !== 'Completed' && doc.Status !== 'Draft';
      
      return johnSignedWaitingForOthers || authorWaitingForOthers;
    }).length;
    
    // Drafts - John's draft documents
    const drafts = documents.filter(doc => 
      doc.Status === 'Draft' && doc.AuthorName === 'John Doe'
    ).length;
    
    // Completed - documents signed by everyone
    const completed = documents.filter(doc => doc.Status === 'Completed').length;
    
    return { actionRequired, waitingForOthers, drafts, completed };
  };

  const stats = getQuickViewStats();

  const clearQuickView = () => {
    setActiveQuickView('');
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
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Document Management</h1>
          <p className="text-gray-600">Manage and track all your documents in one place</p>
        </div>

        {/* Quick Views Section */}
        <div className="bg-white rounded-3xl shadow-xl overflow-hidden border border-CloudbyzBlue/10 mb-8">
          <div className="bg-gradient-to-r from-CloudbyzBlue/5 to-CloudbyzBlue/10 px-8 py-6 border-b border-CloudbyzBlue/10">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-bold text-gray-800 mb-2">Quick Views</h2>
                <p className="text-gray-600">Filter documents by status and priority</p>
              </div>
              {activeQuickView && (
                <button
                  onClick={clearQuickView}
                  className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-600 hover:text-gray-800 bg-white hover:bg-gray-50 rounded-lg transition-all duration-200 border border-gray-200"
                >
                  <X className="w-4 h-4" />
                  Clear Filter
                </button>
              )}
            </div>
          </div>
          <div className="p-8">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              <button
                onClick={() => setActiveQuickView('actionRequired')}
                className={`p-6 rounded-2xl text-center hover:shadow-xl transition-all duration-300 hover:scale-105 border-2 ${
                  activeQuickView === 'actionRequired'
                    ? 'border-red-300 bg-red-50 shadow-lg'
                    : 'border-red-200 bg-red-50/50 hover:border-red-300'
                }`}
              >
                <AlertCircle className="h-8 w-8 text-red-500 mx-auto mb-3" />
                <div className="text-3xl font-bold text-red-600 mb-2">{stats.actionRequired}</div>
                <div className="text-red-700 text-sm font-medium">Action Required</div>
              </button>
              
              <button
                onClick={() => setActiveQuickView('waitingForOthers')}
                className={`p-6 rounded-2xl text-center hover:shadow-xl transition-all duration-300 hover:scale-105 border-2 ${
                  activeQuickView === 'waitingForOthers'
                    ? 'border-blue-300 bg-blue-50 shadow-lg'
                    : 'border-blue-200 bg-blue-50/50 hover:border-blue-300'
                }`}
              >
                <Clock className="h-8 w-8 text-blue-500 mx-auto mb-3" />
                <div className="text-3xl font-bold text-blue-600 mb-2">{stats.waitingForOthers}</div>
                <div className="text-blue-700 text-sm font-medium">Waiting for Others</div>
              </button>
              
              <button
                onClick={() => setActiveQuickView('drafts')}
                className={`p-6 rounded-2xl text-center hover:shadow-xl transition-all duration-300 hover:scale-105 border-2 ${
                  activeQuickView === 'drafts'
                    ? 'border-gray-400 bg-gray-100 shadow-lg'
                    : 'border-gray-300 bg-gray-50/50 hover:border-gray-400'
                }`}
              >
                <PenTool className="h-8 w-8 text-gray-500 mx-auto mb-3" />
                <div className="text-3xl font-bold text-gray-600 mb-2">{stats.drafts}</div>
                <div className="text-gray-700 text-sm font-medium">Drafts</div>
              </button>
              
              <button
                onClick={() => setActiveQuickView('completed')}
                className={`p-6 rounded-2xl text-center hover:shadow-xl transition-all duration-300 hover:scale-105 border-2 ${
                  activeQuickView === 'completed'
                    ? 'border-green-300 bg-green-50 shadow-lg'
                    : 'border-green-200 bg-green-50/50 hover:border-green-300'
                }`}
              >
                <CheckCircle2 className="h-8 w-8 text-green-500 mx-auto mb-3" />
                <div className="text-3xl font-bold text-green-600 mb-2">{stats.completed}</div>
                <div className="text-green-700 text-sm font-medium">Completed</div>
              </button>
            </div>
          </div>
        </div>

        {/* Envelopes Section */}
        <div className="bg-white rounded-3xl shadow-xl overflow-hidden border border-CloudbyzBlue/10">
          <div className="bg-gradient-to-r from-CloudbyzBlue/5 to-CloudbyzBlue/10 px-8 py-6 border-b border-CloudbyzBlue/10">
            <h2 className="text-2xl font-bold text-gray-800 mb-2">Envelopes</h2>
            <p className="text-gray-600">All your documents and their current status</p>
          </div>
          
          {/* Search and Filter Bar */}
          <div className="p-6 border-b border-gray-200">
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  placeholder="Search by document name, author, or signee..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:border-CloudbyzBlue focus:ring-2 focus:ring-CloudbyzBlue/20 outline-none transition-all"
                />
              </div>
              <div className="relative">
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="appearance-none bg-white border border-gray-200 rounded-xl px-4 py-3 pr-10 focus:border-CloudbyzBlue focus:ring-2 focus:ring-CloudbyzBlue/20 outline-none transition-all"
                >
                  <option value="All">All Status</option>
                  <option value="Draft">Draft</option>
                  <option value="Sent for signature">Sent for signature</option>
                  <option value="Completed">Completed</option>
                </select>
                <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5 pointer-events-none" />
              </div>
            </div>
          </div>

          {/* Documents Table */}
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Document</th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Author</th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Signees</th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Last Modified</th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredDocuments.length === 0 ? (
                  <tr>
                    <td colSpan="6" className="px-6 py-12 text-center">
                      <div className="flex flex-col items-center">
                        <FileText className="w-12 h-12 text-gray-300 mb-4" />
                        <p className="text-gray-500 text-lg font-medium">No documents found</p>
                        <p className="text-gray-400 text-sm">
                          {searchTerm || statusFilter !== 'All' || activeQuickView
                            ? 'Try adjusting your search or filters'
                            : 'Upload your first document to get started'
                          }
                        </p>
                      </div>
                    </td>
                  </tr>
                ) : (
                  filteredDocuments.map((document) => (
                    <tr key={document.DocumentID} className="hover:bg-gray-50 transition-colors">
                      <td className="px-6 py-4">
                        <div className="flex items-center">
                          <FileText className="w-5 h-5 text-gray-400 mr-3" />
                          <div>
                            <div className="text-sm font-medium text-gray-900 max-w-xs truncate">
                              {document.DocumentName}
                            </div>
                            <div className="text-sm text-gray-500">
                              {document.TotalPages} page{document.TotalPages !== 1 ? 's' : ''}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(document.Status)}`}>
                          {getStatusIcon(document.Status)}
                          <span className="ml-2">{document.Status}</span>
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm text-gray-900">{document.AuthorName}</div>
                        <div className="text-sm text-gray-500">{document.AuthorEmail}</div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center space-x-2">
                          <div className="flex -space-x-2">
                            {document.Signees.slice(0, 3).map((signee, index) => (
                              <div
                                key={index}
                                className="w-8 h-8 rounded-full bg-CloudbyzBlue/20 text-CloudbyzBlue flex items-center justify-center text-xs font-medium border-2 border-white"
                                title={signee.name}
                              >
                                {signee.name.split(' ').map(n => n[0]).join('')}
                              </div>
                            ))}
                            {document.Signees.length > 3 && (
                              <div className="w-8 h-8 rounded-full bg-gray-200 text-gray-600 flex items-center justify-center text-xs font-medium border-2 border-white">
                                +{document.Signees.length - 3}
                              </div>
                            )}
                          </div>
                          <span className="text-sm text-gray-500">
                            {document.AlreadySigned.length}/{document.Signees.length} signed
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm text-gray-900">
                          {format(new Date(document.LastChangedDate), 'MMM d, yyyy')}
                        </div>
                        <div className="text-sm text-gray-500">
                          {format(new Date(document.LastChangedDate), 'h:mm a')}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <DocumentActionsDropdown
                          document={document}
                          onAction={handleDocumentAction}
                        />
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Manage;