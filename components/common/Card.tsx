import React from 'react';

interface CardProps {
  children: React.ReactNode;
  className?: string;
}

const Card: React.FC<CardProps> = ({ children, className = '' }) => {
  return (
    <div className={`bg-slate-800/60 backdrop-blur-md p-5 rounded-xl shadow-lg border border-slate-700/50 h-full ${className}`}>
      {children}
    </div>
  );
};

export default Card;