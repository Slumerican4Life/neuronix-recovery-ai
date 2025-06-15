
import React from 'react';

export const EnhancedBackgroundOverlay: React.FC = () => {
  return (
    <>
      {/* Enhanced marble texture overlay */}
      <div className="absolute inset-0 opacity-30" style={{
        backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 100 100' xmlns='http://www.w3.org/2000/svg'%3E%3Cdefs%3E%3CradialGradient id='marble' cx='50%25' cy='50%25' r='50%25'%3E%3Cstop offset='0%25' style='stop-color:%234c1d95;stop-opacity:0.8'/%3E%3Cstop offset='50%25' style='stop-color:%231e3a8a;stop-opacity:0.6'/%3E%3Cstop offset='100%25' style='stop-color:%23701a75;stop-opacity:0.4'/%3E%3C/radialGradient%3E%3C/defs%3E%3Crect width='100' height='100' fill='url(%23marble)'/%3E%3C/svg%3E")`,
        backgroundSize: '300px 300px',
        animation: 'float 20s ease-in-out infinite'
      }}></div>
      
      {/* Enhanced neural network pattern */}
      <div className="absolute inset-0 opacity-20" style={{
        backgroundImage: `url("data:image/svg+xml,%3Csvg width='80' height='80' viewBox='0 0 80 80' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23a855f7' fill-opacity='0.3'%3E%3Ccircle cx='40' cy='40' r='3'/%3E%3Ccircle cx='20' cy='20' r='2'/%3E%3Ccircle cx='60' cy='20' r='2'/%3E%3Ccircle cx='20' cy='60' r='2'/%3E%3Ccircle cx='60' cy='60' r='2'/%3E%3Cpath d='M40,10 L40,30 M40,50 L40,70 M10,40 L30,40 M50,40 L70,40 M25,25 L35,35 M45,45 L55,55 M25,55 L35,45 M45,35 L55,25' stroke='%23a855f7' stroke-width='0.8' stroke-opacity='0.5'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
        animation: 'pulse 8s ease-in-out infinite'
      }}></div>

      {/* Floating particles */}
      <div className="absolute inset-0 overflow-hidden">
        {Array.from({ length: 20 }, (_, i) => (
          <div
            key={i}
            className="absolute w-1 h-1 bg-purple-400 rounded-full opacity-60"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animation: `float ${3 + Math.random() * 4}s ease-in-out infinite ${Math.random() * 2}s`
            }}
          />
        ))}
      </div>

      {/* Gradient overlays for depth */}
      <div className="absolute inset-0 bg-gradient-to-br from-purple-900/10 via-transparent to-blue-900/10"></div>
      <div className="absolute inset-0 bg-gradient-to-tl from-pink-900/10 via-transparent to-purple-900/10"></div>

      <style>
        {`
          @keyframes float {
            0%, 100% { transform: translateY(0px) rotate(0deg); }
            50% { transform: translateY(-20px) rotate(180deg); }
          }
        `}
      </style>
    </>
  );
};
