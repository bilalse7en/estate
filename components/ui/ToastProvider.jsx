'use client';

import React, { createContext, useContext, useState, useCallback } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { X, CheckCircle, AlertCircle, Loader2 } from 'lucide-react';

const ToastContext = createContext(null);

export const useToast = () => {
  const context = useContext(ToastContext);
  if (!context) throw new Error('useToast must be used within a ToastProvider');
  return context;
};

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([]);

  const addToast = useCallback((message, type = 'success', duration = 5000) => {
    const id = Date.now();
    setToasts((prev) => [...prev, { id, message, type, duration }]);
    
    if (duration !== Infinity) {
      setTimeout(() => removeToast(id), duration);
    }
    return id;
  }, []);

  const removeToast = useCallback((id) => {
    setToasts((prev) => prev.filter((toast) => toast.id !== id));
  }, []);

  return (
    <ToastContext.Provider value={{ addToast, removeToast }}>
      {children}
      <div className="fixed top-6 left-1/2 -translate-x-1/2 z-[9999] flex flex-col items-center space-y-3 w-full max-w-md px-6">
        <AnimatePresence>
          {toasts.map((toast) => (
            <Toast key={toast.id} toast={toast} onClose={() => removeToast(toast.id)} />
          ))}
        </AnimatePresence>
      </div>
    </ToastContext.Provider>
  );
}

function Toast({ toast, onClose }) {
  const icons = {
    success: <CheckCircle className="w-5 h-5 text-green-500" />,
    error: <AlertCircle className="w-5 h-5 text-red-500" />,
    fail: <AlertCircle className="w-5 h-5 text-red-500" />,
    waiting: <Loader2 className="w-5 h-5 text-yellow-500 animate-spin" />
  };

  const bgClasses = {
    success: 'border-green-500/20 shadow-green-500/10',
    error: 'border-red-500/20 shadow-red-500/10',
    fail: 'border-red-500/20 shadow-red-500/10',
    waiting: 'border-yellow-500/20 shadow-yellow-500/10'
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: -20, scale: 0.9 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, scale: 0.9, transition: { duration: 0.2 } }}
      className={`glass-light dark:bg-[var(--bg-secondary)] w-full p-4 rounded-2xl border-2 flex items-center justify-between shadow-2xl backdrop-blur-xl ${bgClasses[toast.type]}`}
    >
      <div className="flex items-center space-x-3">
        <div className="flex-shrink-0">{icons[toast.type]}</div>
        <p className={`text-sm font-semibold ${
          toast.type === 'error' || toast.type === 'fail' ? 'text-red-700 dark:text-red-400' :
          toast.type === 'waiting' ? 'text-yellow-700 dark:text-yellow-400' :
          'text-[var(--text-main)]'
        }`}>
          {toast.message}
        </p>
      </div>
      <button 
        onClick={onClose}
        className="ml-4 p-1 hover:bg-black/5 dark:hover:bg-white/5 rounded-lg transition-colors text-[var(--text-muted)]"
      >
        <X className="w-4 h-4" />
      </button>
    </motion.div>
  );
}
