import React, { useEffect } from 'react';

interface SuccessPopupProps {
  message: string;
  duration?: number;
  isVisible: boolean;
  onClose: () => void;
}

const SuccessPopup: React.FC<SuccessPopupProps> = ({ message, duration = 3000, isVisible, onClose }) => {
  useEffect(() => {
    if (!isVisible) return;

    const timer = setTimeout(() => onClose(), duration);

    return () => clearTimeout(timer);
  }, [isVisible, duration, onClose]);

  if (!isVisible) return null;

  return (
    <div className="fixed inset-0 flex justify-center items-start pt-10">
      <div className="bg-temporal text-white p-4 rounded-lg shadow-lg z-50">
        {message}
      </div>
    </div>
  );
};

export default SuccessPopup;
