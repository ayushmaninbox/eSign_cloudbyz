import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { User, Settings, LogOut, UserCircle, CheckCircle2 } from 'lucide-react';

const DotSpinnerLoader = ({ loadingStates, loading, duration = 3000 }) => {
  const [currentState, setCurrentState] = useState(0);
  const [completedStates, setCompletedStates] = useState(new Set());

  useEffect(() => {
    if (!loading) {
      setCurrentState(0);
      setCompletedStates(new Set());
      return;
    }

    const interval = setInterval(() => {
      setCurrentState((prevState) => {
        const nextState = prevState + 1;
        if (nextState < loadingStates.length) {
          setCompletedStates(prev => new Set([...prev, prevState]));
          return nextState;
        } else {
          // Reset and loop
          setCompletedStates(new Set());
          return 0;
        }
      });
    }, duration / loadingStates.length);

    return () => clearInterval(interval);
  }, [loading, loadingStates.length, duration]);

  if (!loading) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-white">
      <div className="max-w-md mx-auto p-8">
        <div className="flex flex-col items-center">
          {/* Dot Spinner */}
          <div className="dot-spinner mb-8">
            <div className="dot-spinner__dot" />
            <div className="dot-spinner__dot" />
            <div className="dot-spinner__dot" />
            <div className="dot-spinner__dot" />
            <div className="dot-spinner__dot" />
            <div className="dot-spinner__dot" />
            <div className="dot-spinner__dot" />
            <div className="dot-spinner__dot" />
          </div>
          
          {/* Loading States with Checkboxes */}
          <div className="space-y-4 w-full max-w-sm">
            {loadingStates.map((state, index) => (
              <div key={index} className="flex items-center space-x-3">
                <div className={`w-5 h-5 rounded border-2 flex items-center justify-center transition-all duration-300 ${
                  completedStates.has(index) 
                    ? 'bg-CloudbyzBlue border-CloudbyzBlue' 
                    : index === currentState 
                    ? 'border-CloudbyzBlue animate-pulse' 
                    : 'border-gray-300'
                }`}>
                  {completedStates.has(index) && (
                    <CheckCircle2 className="w-3 h-3 text-white" />
                  )}
                </div>
                <span className={`text-sm font-medium transition-colors duration-300 ${
                  index === currentState 
                    ? 'text-CloudbyzBlue' 
                    : completedStates.has(index)
                    ? 'text-gray-600'
                    : 'text-gray-400'
                }`}>
                  {state.text}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
      
      <style jsx>{`
        .dot-spinner {
          --uib-size: 2.8rem;
          --uib-speed: .9s;
          --uib-color: #009edb;
          position: relative;
          display: flex;
          align-items: center;
          justify-content: flex-start;
          height: var(--uib-size);
          width: var(--uib-size);
        }

        .dot-spinner__dot {
          position: absolute;
          top: 0;
          left: 0;
          display: flex;
          align-items: center;
          justify-content: flex-start;
          height: 100%;
          width: 100%;
        }

        .dot-spinner__dot::before {
          content: '';
          height: 20%;
          width: 20%;
          border-radius: 50%;
          background-color: var(--uib-color);
          transform: scale(0);
          opacity: 0.5;
          animation: pulse0112 calc(var(--uib-speed) * 1.111) ease-in-out infinite;
          box-shadow: 0 0 20px rgba(0, 158, 219, 0.3);
        }

        .dot-spinner__dot:nth-child(2) {
          transform: rotate(45deg);
        }

        .dot-spinner__dot:nth-child(2)::before {
          animation-delay: calc(var(--uib-speed) * -0.875);
        }

        .dot-spinner__dot:nth-child(3) {
          transform: rotate(90deg);
        }

        .dot-spinner__dot:nth-child(3)::before {
          animation-delay: calc(var(--uib-speed) * -0.75);
        }

        .dot-spinner__dot:nth-child(4) {
          transform: rotate(135deg);
        }

        .dot-spinner__dot:nth-child(4)::before {
          animation-delay: calc(var(--uib-speed) * -0.625);
        }

        .dot-spinner__dot:nth-child(5) {
          transform: rotate(180deg);
        }

        .dot-spinner__dot:nth-child(5)::before {
          animation-delay: calc(var(--uib-speed) * -0.5);
        }

        .dot-spinner__dot:nth-child(6) {
          transform: rotate(225deg);
        }

        .dot-spinner__dot:nth-child(6)::before {
          animation-delay: calc(var(--uib-speed) * -0.375);
        }

        .dot-spinner__dot:nth-child(7) {
          transform: rotate(270deg);
        }

        .dot-spinner__dot:nth-child(7)::before {
          animation-delay: calc(var(--uib-speed) * -0.25);
        }

        .dot-spinner__dot:nth-child(8) {
          transform: rotate(315deg);
        }

        .dot-spinner__dot:nth-child(8)::before {
          animation-delay: calc(var(--uib-speed) * -0.125);
        }

        @keyframes pulse0112 {
          0%,
          100% {
            transform: scale(0);
            opacity: 0.5;
          }

          50% {
            transform: scale(1);
            opacity: 1;
          }
        }
      `}</style>
    </div>
  );
};

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
    navigate('/manage');
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

const SigneeUI = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);
  const [isNavigating, setIsNavigating] = useState(false);

  const loadingStates = [
    { text: 'Loading document for signing...' },
    { text: 'Preparing signature interface...' },
    { text: 'Checking document status...' },
    { text: 'Setting up signing tools...' }
  ];

  const navigatingStates = [
    { text: 'Processing signature...' },
    { text: 'Validating document...' },
    { text: 'Finalizing changes...' },
    { text: 'Redirecting to dashboard...' }
  ];

  useEffect(() => {
    // Simulate loading time
    setTimeout(() => {
      setIsLoading(false);
    }, 3000);
  }, []);

  const handleBack = () => {
    navigate('/manage');
  };

  const handleNext = async () => {
    setIsNavigating(true);
    
    // Simulate processing time
    await new Promise(resolve => setTimeout(resolve, 3000));
    
    navigate('/signpreview', { state: { from: '/signeeui' } });
  };

  const handleFinish = async () => {
    setIsNavigating(true);
    
    // Simulate processing time
    await new Promise(resolve => setTimeout(resolve, 3000));
    
    navigate('/home');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-CloudbyzBlue/10 via-indigo-50 to-purple-50 pt-14">
      <DotSpinnerLoader loadingStates={loadingStates} loading={isLoading} duration={3000} />
      <DotSpinnerLoader loadingStates={navigatingStates} loading={isNavigating} duration={3000} />
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
          <h1 className="text-xl font-semibold text-CloudbyzBlue">Sign Document</h1>
        </div>
        <div className="w-1/3 flex justify-end space-x-3">
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

export default SigneeUI;