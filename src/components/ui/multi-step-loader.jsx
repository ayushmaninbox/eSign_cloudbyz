import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

export const MultiStepLoader = ({ loadingStates, loading, duration = 2000 }) => {
  const [currentState, setCurrentState] = useState(0);

  useEffect(() => {
    if (!loading) {
      setCurrentState(0);
      return;
    }

    const interval = setInterval(() => {
      setCurrentState((prevState) => {
        if (prevState === loadingStates.length - 1) {
          return 0; // Loop back to start
        }
        return prevState + 1;
      });
    }, duration / loadingStates.length);

    return () => clearInterval(interval);
  }, [loading, loadingStates.length, duration]);

  return (
    <AnimatePresence mode="wait">
      {loading && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[100] flex items-center justify-center bg-black/20 backdrop-blur-md"
        >
          <div className="max-w-md mx-auto p-8">
            <div className="flex flex-col items-center">
              <div className="relative">
                <div className="w-16 h-16 border-4 border-CloudbyzBlue/20 border-t-CloudbyzBlue rounded-full animate-spin mx-auto mb-4"></div>
                <div className="absolute inset-0 w-16 h-16 border-4 border-transparent border-r-CloudbyzBlue/40 rounded-full animate-spin mx-auto" style={{ animationDirection: 'reverse', animationDuration: '1.5s' }}></div>
              </div>
              
              <div className="text-center mt-4">
                <AnimatePresence mode="wait">
                  <motion.p
                    key={currentState}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.2 }}
                    className="text-CloudbyzBlue font-medium text-lg"
                  >
                    {loadingStates[currentState]?.text}
                  </motion.p>
                </AnimatePresence>
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};