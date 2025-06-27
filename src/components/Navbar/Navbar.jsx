import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Bell,
  LogOut,
  UserCircle,
  FileEdit,
  Download
} from 'lucide-react';
import { format } from 'date-fns';

const ProfileModal = ({ isOpen, onClose }) => {
  const navigate = useNavigate();

  if (!isOpen) return null;

  const handleLogout = () => {
    localStorage.removeItem('username');
    localStorage.removeItem('useremail');
    localStorage.removeItem('userPhoto');
    navigate('/');
  };

  const handleProfileClick = () => {
    // Store current page as referrer for settings
    sessionStorage.setItem('settingsReferrer', window.location.pathname);
    navigate('/settings');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-end pt-16 pr-6">
      <div className="absolute inset-0" onClick={onClose}></div>
      <div className="bg-white rounded-xl shadow-2xl border border-gray-200 w-64 mt-2 relative z-10 overflow-hidden">
        <div className="py-2">
          <button 
            onClick={handleProfileClick}
            className="w-full px-4 py-3 text-left hover:bg-gray-50 flex items-center space-x-3 transition-colors"
          >
            <UserCircle className="w-5 h-5 text-gray-500" />
            <span className="text-gray-700">Profile</span>
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

const Navbar = ({ activeTab, setActiveTab, showTabs = true, title = null, onBack = null }) => {
  const navigate = useNavigate();
  const [showNotifications, setShowNotifications] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [seenNotificationIds, setSeenNotificationIds] = useState(new Set());
  const [showProfileModal, setShowProfileModal] = useState(false);
  const [userPhoto, setUserPhoto] = useState(null);
  const [userName, setUserName] = useState('');
  const notificationRef = useRef(null);

  // Determine if notifications should be shown based on current page
  const shouldShowNotifications = showTabs && (activeTab === 'home' || activeTab === 'manage');

  const handleTabChange = (tab) => {
    if (setActiveTab) {
      setActiveTab(tab);
    }
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
    const updateUserInfo = () => {
      const photo = localStorage.getItem('userPhoto');
      const name = localStorage.getItem('username') || 'John Doe';
      setUserPhoto(photo);
      setUserName(name);
    };

    updateUserInfo();

    // Listen for profile updates
    const handleProfileUpdate = () => {
      updateUserInfo();
    };

    window.addEventListener('userProfileUpdated', handleProfileUpdate);
    return () => window.removeEventListener('userProfileUpdated', handleProfileUpdate);
  }, []);

  useEffect(() => {
    // Only fetch notifications if they should be shown
    if (!shouldShowNotifications) return;

    fetch("http://localhost:5000/api/notifications")
      .then((response) => response.json())
      .then((data) => {
        const sortedNotifications = data.new.sort(
          (a, b) => new Date(b.timestamp) - new Date(a.timestamp)
        );
        setNotifications(sortedNotifications);
      })
      .catch((error) => console.error("Error loading notifications:", error));
  }, [shouldShowNotifications]);

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
      console.log('Navigating to sign document:', {
        documentID,
        documentName,
        timestamp: new Date().toISOString()
      });
      // Navigate to SigneeUI with document ID
      navigate('/signeeui', { state: { documentId: documentID } });
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

  const getInitials = (name) => {
    if (!name) return 'JD';
    const names = name.split(' ');
    if (names.length >= 2) {
      return (names[0][0] + names[names.length - 1][0]).toUpperCase();
    }
    return name.substring(0, 2).toUpperCase();
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
          
          {/* Navigation Tabs - only show if showTabs is true */}
          {showTabs && (
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
          )}

          {/* Back button and title for non-tab pages */}
          {!showTabs && onBack && (
            <div className="flex items-center space-x-4">
              <button
                onClick={onBack}
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
              {title && (
                <h1 className="text-xl font-semibold text-CloudbyzBlue">
                  {title}
                </h1>
              )}
            </div>
          )}
        </div>
        
        <div className="flex items-center space-x-4">
          {/* Notifications - only show on Home and Manage pages */}
          {shouldShowNotifications && (
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
          )}
          
          <div className="flex items-center space-x-2">
            <span className="text-sm text-gray-600">{userName}</span>
            <button 
              onClick={() => setShowProfileModal(!showProfileModal)}
              className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 flex items-center justify-center transition-colors overflow-hidden"
            >
              {userPhoto ? (
                <img
                  src={userPhoto}
                  alt="Profile"
                  className="w-full h-full object-cover rounded-full"
                />
              ) : (
                <div className="w-full h-full bg-CloudbyzBlue text-white flex items-center justify-center text-xs font-medium">
                  {getInitials(userName)}
                </div>
              )}
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

export default Navbar;