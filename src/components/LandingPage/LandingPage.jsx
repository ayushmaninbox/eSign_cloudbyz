import React from 'react';
import { useNavigate } from 'react-router-dom';
import { User } from 'lucide-react';

const Navbar = () => {
  const navigate = useNavigate();

  const handleBack = () => {
    navigate('/recipientselection');
  };

  return (
    <nav className="fixed top-0 left-0 right-0 bg-white shadow-lg z-30 h-16 px-6 flex justify-between items-center border-b-2 border-CloudbyzBlue/10">
      <div className="flex items-center space-x-8">
        <img src="/images/cloudbyz.png" alt="Cloudbyz Logo" className="h-10 object-contain" />
      </div>
      
     
        <button 
          onClick={handleBack}
          className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 flex items-center justify-center transition-colors"
        >
          Let's Get Started
        </button>
    </nav>
  );
};

const LandingPage = () => {
  const navigate = useNavigate();

  const handleBack = () => {
    navigate('/recipientselection');
  };

  const handleNext = () => {
    navigate('/signpreview', { state: { from: '/landingpage' } });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-CloudbyzBlue/10 via-indigo-50 to-purple-50 pt-14">
      <Navbar />
      
      

      <main className="container mx-auto px-4 py-24 max-w-5xl">
        {/* Empty content area */}
      </main>
    </div>
  );
};

export default LandingPage;