import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { User, Settings, LogOut, UserCircle } from 'lucide-react';
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
  const [showProfileModal, setShowProfileModal] = useState(false);

  const handleBack = () => {
    navigate('/recipientselection');
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

const SignSetupUI = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);
  const [isNavigating, setIsNavigating] = useState(false);
  const [serverError, setServerError] = useState(false);

  const loadingStates = [
    { text: 'Setting up signature fields...' },
    { text: 'Loading document editor...' },
    { text: 'Preparing signature tools...' },
    { text: 'Configuring workspace...' }
  ];

  const navigatingStates = [
    { text: 'Finalizing document setup...' },
    { text: 'Saving configuration...' },
    { text: 'Preparing for completion...' },
    { text: 'Redirecting to dashboard...' }
  ];

  useEffect(() => {
    const checkServer = async () => {
      try {
        const response = await fetch('http://localhost:5000/api/stats');
        if (!response.ok) {
          throw new Error('Server connection failed');
        }
        // Simulate loading time
        setTimeout(() => {
          setIsLoading(false);
        }, 3000);
      } catch (error) {
        console.error('Server error:', error);
        setServerError(true);
        setIsLoading(false);
      }
    };

    checkServer();
  }, []);

  const handleBack = () => {
    navigate('/recipientselection');
  };

  const handleFinish = async () => {
    setIsNavigating(true);
    
    try {
      // Test server connection
      const response = await fetch('http://localhost:5000/api/stats');
      if (!response.ok) {
        throw new Error('Server connection failed');
      }
      
      // Simulate processing time
      await new Promise(resolve => setTimeout(resolve, 3000));
      
      navigate('/home');
    } catch (error) {
      console.error('Server error:', error);
      setServerError(true);
    } finally {
      setIsNavigating(false);
    }
  };

  if (serverError) {
    return <Error404 />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-CloudbyzBlue/10 via-indigo-50 to-purple-50 pt-14">
      <Loader loadingStates={loadingStates} loading={isLoading} duration={3000} />
      <Loader loadingStates={navigatingStates} loading={isNavigating} duration={3000} />
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
        <div className="flex-1 text-center">
          <h1 className="text-xl font-semibold text-CloudbyzBlue">Setup the Signature</h1>
        </div>
        <div className="w-1/3 flex justify-end">
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
              <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
            </svg>
          </button>
        </div>
      </header>

      <main className="container mx-auto px-4 py-24 max-w-5xl">
        {/* Empty content area */}
      </main>
    </div>
  );
};

export default SignSetupUI;