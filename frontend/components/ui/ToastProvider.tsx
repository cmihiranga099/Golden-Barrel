'use client';

import { createContext, useCallback, useContext, useState } from 'react';

type Toast = { id: string; message: string };

const ToastContext = createContext({
  push: (_message: string) => {},
});

export function useToast() {
  return useContext(ToastContext);
}

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const push = useCallback((message: string) => {
    const toast = { id: Math.random().toString(36).slice(2), message };
    setToasts((prev) => [...prev, toast]);
    setTimeout(() => setToasts((prev) => prev.filter((t) => t.id !== toast.id)), 3000);
  }, []);

  return (
    <ToastContext.Provider value={{ push }}>
      {children}
      <div className="fixed bottom-6 right-6 z-50 space-y-3">
        {toasts.map((toast) => (
          <div key={toast.id} className="glass rounded-xl px-4 py-3 text-sm shadow-glow">
            {toast.message}
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
}