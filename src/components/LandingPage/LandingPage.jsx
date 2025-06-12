import React from 'react';
import { useNavigate } from 'react-router-dom';
import { User, ArrowRight } from 'lucide-react';

const Navbar = () => {
  const navigate = useNavigate();

  const handleGetStarted = () => {
    navigate('/signin');
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
    <nav className="fixed top-0 left-0 right-0 bg-white shadow-lg z-30 h-16 px-6 flex justify-between items-center border-b-2 border-CloudbyzBlue/10">
      <div className="flex items-center space-x-8">
        <img 
          src="/images/cloudbyz.png" 
          alt="Cloudbyz Logo" 
          className="h-10 object-contain cursor-pointer hover:scale-105 transition-transform" 
          onClick={handleLogoClick}
        />
      </div>
      
      <button 
        onClick={handleGetStarted}
        className="bg-gradient-to-r from-CloudbyzBlue to-CloudbyzBlue/80 hover:from-CloudbyzBlue/90 hover:to-CloudbyzBlue/70 text-white px-8 py-3 rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all duration-300 flex items-center space-x-2 hover:scale-105 transform"
      >
        <span>Let's Get Started</span>
        <ArrowRight className="w-5 h-5" />
      </button>
    </nav>
  );
};

const LandingPage = () => {
  const navigate = useNavigate();

  const handleGetStarted = () => {
    navigate('/signin');
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