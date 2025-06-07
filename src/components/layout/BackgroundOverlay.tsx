
import React from 'react';

export const BackgroundOverlay: React.FC = () => {
  return (
    <>
      {/* Marble texture overlay */}
      <div className="absolute inset-0 opacity-20" style={{
        backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 100 100' xmlns='http://www.w3.org/2000/svg'%3E%3Cdefs%3E%3ClinearGradient id='marble' x1='0%25' y1='0%25' x2='100%25' y2='100%25'%3E%3Cstop offset='0%25' style='stop-color:%23330033;stop-opacity:0.8'/%3E%3Cstop offset='50%25' style='stop-color:%23660066;stop-opacity:0.6'/%3E%3Cstop offset='100%25' style='stop-color:%23990099;stop-opacity:0.4'/%3E%3C/linearGradient%3E%3C/defs%3E%3Crect width='100' height='100' fill='url(%23marble)'/%3E%3C/svg%3E")`,
        backgroundSize: '200px 200px'
      }}></div>
      
      {/* Neural network pattern */}
      <div className="absolute inset-0 opacity-10" style={{
        backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23a855f7' fill-opacity='0.2'%3E%3Ccircle cx='30' cy='30' r='2'/%3E%3Cpath d='M30,10 L30,20 M30,40 L30,50 M10,30 L20,30 M40,30 L50,30' stroke='%23a855f7' stroke-width='0.5'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`
      }}></div>
    </>
  );
};
