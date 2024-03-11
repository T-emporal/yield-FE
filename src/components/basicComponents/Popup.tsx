import React, { useEffect } from 'react';

interface PopupProps {
  message: string;
  duration?: number;
  isVisible: boolean;
  onClose: () => void;
  color?: string; // Optional color prop for background customization
}

const Popup: React.FC<PopupProps> = ({
  message,
  duration = 3000,
  isVisible,
  onClose,
  color = 'bg-temporal', // Default color is green for success messages
}) => {
  useEffect(() => {
    if (!isVisible) return;

    const timer = setTimeout(() => onClose(), duration);

    return () => clearTimeout(timer);
  }, [isVisible, duration, onClose]);

  if (!isVisible) return null;

  return (
    <div className="fixed inset-0 flex justify-center items-start pt-10 z-50">
      <div className={`${color} text-white p-4 rounded-lg shadow-lg z-50`}>
        {message}
      </div>
    </div>
  );
};

export default Popup;