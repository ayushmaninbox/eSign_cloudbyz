import React from 'react';
import { useNavigate } from 'react-router-dom';
import { User } from 'lucide-react';

const Navbar = () => {
  const navigate = useNavigate();

  const handleBack = () => {
    navigate('/signsetupui');
  };

  return (
    <nav className="fixed top-0 left-0 right-0 bg-white shadow-lg z-30 h-16 px-6 flex justify-between items-center border-b-2 border-CloudbyzBlue/10">
      <div className="flex items-center space-x-8">
        <img src="/images/cloudbyz.png" alt="Cloudbyz Logo" className="h-10 object-contain" />
      </div>
      
      <div className="flex items-center space-x-4">
        <span className="text-sm text-gray-600">John Doe</span>
        <button 
          onClick={handleBack}
          className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 flex items-center justify-center transition-colors"
        >
          <User className="w-5 h-5 text-slate-600" />
        </button>
      </div>
    </nav>
  );
};

const SignPreview = () => {
  const navigate = useNavigate();

  const handleBack = () => {
    navigate('/signsetupui');
  };

  const handleFinish = () => {
    window.open('https://google.com', '_blank');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-CloudbyzBlue/10 via-indigo-50 to-purple-50 pt-14">
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
          <div className="flex items-center justify-center space-x-4">
            <h1 className="text-xl font-semibold text-CloudbyzBlue">Document Preview</h1>
            <div className="flex items-center space-x-2 text-sm text-gray-600">
              <span className="bg-CloudbyzBlue/10 text-CloudbyzBlue px-2 py-1 rounded-full font-medium">
                Step 3 of 3
              </span>
            </div>
          </div>
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

export default SignPreview;