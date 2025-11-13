import React from 'react';

const Card = ({ children, className = '' }) => {
  return (
    <div className={`bg-slate-800/60 backdrop-blur-md p-5 rounded-xl shadow-lg border border-slate-700/50 h-full ${className}`}>
      {children}
    </div>
  );
};

export default Card;
