import React from 'react';
import { useNavigate } from 'react-router-dom';

export default function Error404() {
  const navigate = useNavigate();

  const handleGoHome = () => {
    const username = localStorage.getItem('username');
    if (username) {
      navigate('/home');
    } else {
      navigate('/');
    }
  };

  const handleContactSupport = () => {
    // You can implement contact support functionality here
    console.log('Contact support clicked');
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-white px-6 py-24 sm:py-32 lg:px-8">
      <div className="text-center">
        <p className="text-8xl font-bold text-CloudbyzBlue mb-4">404</p>
        <h1 className="mt-4 text-5xl font-semibold tracking-tight text-balance text-gray-900 sm:text-7xl">
          Page not found
        </h1>
        <p className="mt-6 text-lg font-medium text-pretty text-gray-500 sm:text-xl/8">
          Sorry, we couldn't find the page you're looking for.
        </p>
        <div className="mt-10 flex items-center justify-center gap-x-6">
          <button
            onClick={handleGoHome}
            className="rounded-md bg-CloudbyzBlue px-3.5 py-2.5 text-sm font-semibold text-white shadow-xs hover:bg-CloudbyzBlue/90 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-CloudbyzBlue transition-all duration-200"
          >
            Go back home
          </button>
          <button 
            onClick={handleContactSupport}
            className="text-sm font-semibold text-gray-900 hover:text-CloudbyzBlue transition-colors duration-200"
          >
            Contact support <span aria-hidden="true">&rarr;</span>
          </button>
        </div>
      </div>
    </div>
  );
}