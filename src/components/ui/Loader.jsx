import React, { useState, useEffect } from 'react';
import { CheckCircle2 } from 'lucide-react';

const Loader = ({ loadingStates, loading, duration = 3000 }) => {
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

export default Loader;