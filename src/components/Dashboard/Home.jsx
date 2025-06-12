import React, { useState, useEffect } from 'react';
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
  UserCircle
} from 'lucide-react';

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

const Navbar = ({ activeTab, setActiveTab }) => {
  const navigate = useNavigate();
  const [showProfileModal, setShowProfileModal] = useState(false);

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

  const loadingStates = [
    { text: 'Loading your dashboard...' },
    { text: 'Fetching documents...' },
    { text: 'Checking server status...' },
    { text: 'Preparing your workspace...' }
  ];

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [statsResponse, documentsResponse] = await Promise.all([
          fetch('http://localhost:5000/api/stats'),
          fetch('http://localhost:5000/api/documents')
        ]);
        
        const statsData = await statsResponse.json();
        const documentsData = await documentsResponse.json();
        
        setStats(statsData);
        setDocuments(documentsData.documents);
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

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

  return (
    <div className="min-h-screen bg-gradient-to-br from-CloudbyzBlue/5 via-white to-CloudbyzBlue/10 font-sans">
      <DotSpinnerLoader loadingStates={loadingStates} loading={loading} duration={3000} />
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
              <div className="bg-white/15 backdrop-blur-sm rounded-2xl p-6 text-center hover:bg-white/25 transition-all duration-300 hover:scale-105 border border-white/20">
                <AlertCircle className="h-8 w-8 text-white mx-auto mb-3" />
                <div className="text-3xl font-bold text-white mb-2">{stats.actionRequired}</div>
                <div className="text-white/80 text-sm font-medium">Action Required</div>
              </div>
              <div className="bg-white/15 backdrop-blur-sm rounded-2xl p-6 text-center hover:bg-white/25 transition-all duration-300 hover:scale-105 border border-white/20">
                <Clock className="h-8 w-8 text-white mx-auto mb-3" />
                <div className="text-3xl font-bold text-white mb-2">{stats.waitingForOthers}</div>
                <div className="text-white/80 text-sm font-medium">Waiting for Others</div>
              </div>
              <div className="bg-white/15 backdrop-blur-sm rounded-2xl p-6 text-center hover:bg-white/25 transition-all duration-300 hover:scale-105 border border-white/20">
                <PenTool className="h-8 w-8 text-white mx-auto mb-3" />
                <div className="text-3xl font-bold text-white mb-2">{stats.expiringSoon}</div>
                <div className="text-white/80 text-sm font-medium">Drafts</div>
              </div>
              <div className="bg-white/15 backdrop-blur-sm rounded-2xl p-6 text-center hover:bg-white/25 transition-all duration-300 hover:scale-105 border border-white/20">
                <CheckCircle2 className="h-8 w-8 text-white mx-auto mb-3" />
                <div className="text-3xl font-bold text-white mb-2">{stats.completed}</div>
                <div className="text-white/80 text-sm font-medium">Completed</div>
              </div>
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