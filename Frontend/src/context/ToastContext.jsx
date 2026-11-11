import React, { createContext, useContext, useState, useCallback } from 'react';

const ToastContext = createContext(null);

let toastId = 0;

/**
 * ToastProvider — lightweight toast/notification system.
 *
 * Provides a `showToast(message, type)` function that renders a small
 * notification at the top of the screen for a few seconds.
 * Types: 'info' | 'success' | 'error'
 */
export const ToastProvider = ({ children }) => {
  const [toasts, setToasts] = useState([]);

  const showToast = useCallback((message, type = 'info', duration = 3500) => {
    const id = ++toastId;
    setToasts((prev) => [...prev, { id, message, type }]);

    // Auto-dismiss after duration
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, duration);
  }, []);

  const dismissToast = useCallback((id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}

      {/* Toast Container */}
      <div className="fixed top-24 left-1/2 -translate-x-1/2 z-[100] flex flex-col items-center gap-2 px-4 pointer-events-none">
        {toasts.map((toast) => (
          <div
            key={toast.id}
            onClick={() => dismissToast(toast.id)}
            className={`pointer-events-auto max-w-md w-full cursor-pointer px-5 py-3 rounded-xl shadow-2xl text-sm font-medium text-white backdrop-blur-md border transition-all animate-[slideDown_0.3s_ease-out] ${
              toast.type === 'error'
                ? 'bg-red-600/95 border-red-400/50'
                : toast.type === 'success'
                ? 'bg-green-600/95 border-green-400/50'
                : 'bg-purple-700/95 border-purple-400/50'
            }`}
          >
            {toast.message}
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
};

export const useToast = () => useContext(ToastContext);