import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Icon } from '@iconify/react/dist/iconify.js';

interface BackToHomeButtonProps {
  className?: string;
  children?: React.ReactNode;
}

export const BackToHomeButton: React.FC<BackToHomeButtonProps> = ({ className = '', children }) => {
  const navigate = useNavigate();
  return (
    <button
      className={`self-start mb-4 ml-2 px-4 py-2 rounded-lg bg-indigo-100 text-indigo-700 font-semibold hover:bg-indigo-200 transition flex items-center gap-2 ${className}`}
      onClick={() => navigate("/")}
      type="button"
      title="Go to Home"
    >
      <Icon icon="mdi:arrow-left" className="w-4 h-4 inline-block" />
      {children || 'Back to Home'}
    </button>
  );
}; 