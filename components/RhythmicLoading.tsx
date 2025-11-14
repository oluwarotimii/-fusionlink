import React from 'react';

const RhythmicLoading = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50">
      <div className="flex flex-col items-center">
        {/* Three bouncing dots */}
        <div className="flex space-x-2 mb-6">
          {[...Array(3)].map((_, i) => (
            <div
              key={i}
              className="w-4 h-4 bg-yellow-500 rounded-full"
              style={{
                animation: `bounce 1.2s infinite ${i * 0.2}s`,
              }}
            />
          ))}
        </div>

        <p className="text-slate-600 font-medium">Loading course...</p>
      </div>

      {/* CSS for bounce animation */}
      <style jsx>{`
        @keyframes bounce {
          0%, 100% {
            transform: translateY(0);
          }
          50% {
            transform: translateY(-10px);
          }
        }
      `}</style>
    </div>
  );
};

export default RhythmicLoading;