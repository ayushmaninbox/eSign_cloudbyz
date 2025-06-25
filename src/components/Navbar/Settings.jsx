import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  UserCircle,
  HelpCircle,
  ChevronRight,
} from 'lucide-react';
import Navbar from './Navbar';
import ProfileSettings from './Settings_Modals/ProfileSettings';
import HelpAndSupport from './Settings_Modals/HelpAndSupport';

const Sidebar = ({ activeSection, setActiveSection }) => {
  const sidebarItems = [
    { id: 'profile', label: 'Profile Settings', icon: UserCircle },
    { id: 'help', label: 'Help & Support', icon: HelpCircle },
  ];

  return (
    <div className="w-64 bg-white border-r border-gray-200 h-full">
      <div className="p-6 border-b border-gray-200">
        <h2 className="text-xl font-bold text-gray-800">Settings</h2>
        <p className="text-sm text-gray-600 mt-1">Manage your account preferences</p>
      </div>
      
      <nav className="p-4">
        <ul className="space-y-2">
          {sidebarItems.map((item) => {
            const Icon = item.icon;
            return (
              <li key={item.id}>
                <button
                  onClick={() => setActiveSection(item.id)}
                  className={`w-full flex items-center justify-between px-4 py-3 rounded-lg text-left transition-all duration-200 group ${
                    activeSection === item.id
                      ? 'bg-CloudbyzBlue text-white shadow-md'
                      : 'text-gray-700 hover:bg-gray-50 hover:text-CloudbyzBlue'
                  }`}
                >
                  <div className="flex items-center space-x-3">
                    <Icon className={`w-5 h-5 ${
                      activeSection === item.id ? 'text-white' : 'text-gray-500 group-hover:text-CloudbyzBlue'
                    }`} />
                    <span className="font-medium">{item.label}</span>
                  </div>
                  <ChevronRight className={`w-4 h-4 transition-transform ${
                    activeSection === item.id ? 'text-white rotate-90' : 'text-gray-400 group-hover:text-CloudbyzBlue'
                  }`} />
                </button>
              </li>
            );
          })}
        </ul>
      </nav>
    </div>
  );
};

const Settings = () => {
  const navigate = useNavigate();
  const [activeSection, setActiveSection] = useState('profile');

  useEffect(() => {
    // Check authentication
    const username = localStorage.getItem('username');
    if (!username) {
      navigate('/signin');
      return;
    }
  }, [navigate]);

  const handleBack = () => {
    // Check if we have a referrer in session storage or default to home
    const referrer = sessionStorage.getItem('settingsReferrer') || '/home';
    sessionStorage.removeItem('settingsReferrer'); // Clean up
    navigate(referrer);
  };

  const renderContent = () => {
    switch (activeSection) {
      case 'profile':
        return <ProfileSettings />;
      case 'help':
        return <HelpAndSupport />;
      default:
        return <ProfileSettings />;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-CloudbyzBlue/5 via-white to-CloudbyzBlue/10">
      <Navbar showTabs={false} />
      
      {/* Header with back button */}
      <header className="bg-white shadow-sm px-6 py-3 flex items-center fixed top-16 left-0 right-0 z-20 border-b border-gray-200">
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
        
        <div className="flex-1 text-center">
          <h1 className="text-xl font-semibold text-CloudbyzBlue">Settings</h1>
        </div>
        
        <div className="w-1/3"></div>
      </header>
      
      <div className="flex pt-32 h-screen">
        <Sidebar activeSection={activeSection} setActiveSection={setActiveSection} />
        
        <div className="flex-1 overflow-y-auto">
          <div className="py-8">
            {renderContent()}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Settings;