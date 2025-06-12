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

  // Calculate visible states (3 at a time with rolling motion)
  const getVisibleStates = () => {
    const visibleCount = 3;
    const states = [];
    
    for (let i = 0; i < visibleCount; i++) {
      const index = (currentState - visibleCount + 1 + i + loadingStates.length) % loadingStates.length;
      states.push({
        ...loadingStates[index],
        originalIndex: index,
        displayIndex: i,
        isActive: i === visibleCount - 1
      });
    }
    
    return states;
  };

  const visibleStates = getVisibleStates();

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-white">
      <div className="max-w-md mx-auto p-8">
        <div className="flex flex-col items-center">
          {/* Dot Spinner */}
          <div className="relative w-12 h-12 mb-8">
            {[...Array(8)].map((_, i) => (
              <div
                key={i}
                className="absolute w-3 h-3 bg-CloudbyzBlue rounded-full opacity-50 animate-pulse"
                style={{
                  top: '50%',
                  left: '50%',
                  transform: `rotate(${i * 45}deg) translateY(-18px)`,
                  transformOrigin: '0 0',
                  animationDelay: `${i * 0.125}s`,
                  animationDuration: '1s'
                }}
              />
            ))}
          </div>
          
          {/* Loading States with Rolling Animation */}
          <div className="relative w-full max-w-sm h-32 overflow-hidden">
            <div className="absolute inset-0 flex flex-col justify-center">
              {visibleStates.map((state, index) => (
                <div
                  key={`${state.originalIndex}-${currentState}`}
                  className={`flex items-center space-x-3 py-2 transition-all duration-500 ease-in-out transform ${
                    state.isActive 
                      ? 'translate-y-0 opacity-100 scale-100' 
                      : index === 0 
                      ? '-translate-y-2 opacity-60 scale-95'
                      : 'translate-y-2 opacity-60 scale-95'
                  }`}
                  style={{
                    transform: `translateY(${(index - 1) * 40}px) scale(${state.isActive ? 1 : 0.95})`,
                    opacity: state.isActive ? 1 : 0.6
                  }}
                >
                  <div className={`w-5 h-5 rounded border-2 flex items-center justify-center transition-all duration-300 ${
                    completedStates.has(state.originalIndex) 
                      ? 'bg-CloudbyzBlue border-CloudbyzBlue' 
                      : state.isActive 
                      ? 'border-CloudbyzBlue animate-pulse' 
                      : 'border-gray-300'
                  }`}>
                    {completedStates.has(state.originalIndex) && (
                      <CheckCircle2 className="w-3 h-3 text-white" />
                    )}
                  </div>
                  <span className={`text-sm font-medium transition-colors duration-300 ${
                    state.isActive 
                      ? 'text-CloudbyzBlue' 
                      : completedStates.has(state.originalIndex)
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
      </div>
    </div>
  );
};

export default Loader;