"use client";

import { useEffect, useState } from 'react';
import { XMarkIcon, CheckCircleIcon, ExclamationCircleIcon, InformationCircleIcon, ExclamationTriangleIcon } from '@heroicons/react/24/outline';

const toastIcons = {
  success: CheckCircleIcon,
  error: ExclamationCircleIcon,
  warning: ExclamationTriangleIcon,
  info: InformationCircleIcon,
};

const toastStyles = {
  success: {
    bg: 'bg-green-50',
    border: 'border-green-200',
    icon: 'text-green-600',
    text: 'text-green-900',
    progress: 'bg-green-500',
  },
  error: {
    bg: 'bg-red-50',
    border: 'border-red-200',
    icon: 'text-red-600',
    text: 'text-red-900',
    progress: 'bg-red-500',
  },
  warning: {
    bg: 'bg-yellow-50',
    border: 'border-yellow-200',
    icon: 'text-yellow-600',
    text: 'text-yellow-900',
    progress: 'bg-yellow-500',
  },
  info: {
    bg: 'bg-blue-50',
    border: 'border-blue-200',
    icon: 'text-blue-600',
    text: 'text-blue-900',
    progress: 'bg-blue-500',
  },
};

function ToastItem({ toast, onRemove }) {
  const [isExiting, setIsExiting] = useState(false);
  const [progress, setProgress] = useState(100);

  const Icon = toastIcons[toast.type] || InformationCircleIcon;
  const styles = toastStyles[toast.type] || toastStyles.info;

  useEffect(() => {
    if (toast.duration > 0) {
      const startTime = Date.now();
      const interval = setInterval(() => {
        const elapsed = Date.now() - startTime;
        const remaining = Math.max(0, 100 - (elapsed / toast.duration) * 100);
        setProgress(remaining);

        if (remaining === 0) {
          clearInterval(interval);
        }
      }, 50);

      return () => clearInterval(interval);
    }
  }, [toast.duration]);

  const handleRemove = () => {
    setIsExiting(true);
    setTimeout(() => {
      onRemove(toast.id);
    }, 300);
  };

  return (
    <div
      className={`
        relative overflow-hidden rounded-lg border shadow-lg
        ${styles.bg} ${styles.border}
        transform transition-all duration-300 ease-in-out
        ${isExiting ? 'translate-x-full opacity-0' : 'translate-x-0 opacity-100'}
        max-w-sm w-full pointer-events-auto
      `}
      role="alert"
      aria-live="assertive"
      aria-atomic="true"
    >
      <div className="p-4">
        <div className="flex items-start gap-3">
          {/* Icon */}
          <div className="flex-shrink-0">
            <Icon className={`w-6 h-6 ${styles.icon}`} aria-hidden="true" />
          </div>

          {/* Content */}
          <div className="flex-1 min-w-0">
            {toast.title && (
              <p className={`text-sm font-semibold ${styles.text} mb-1`}>
                {toast.title}
              </p>
            )}
            <p className={`text-sm ${styles.text}`}>
              {toast.message}
            </p>
            {toast.action && (
              <button
                onClick={() => {
                  toast.action.onClick();
                  handleRemove();
                }}
                className={`mt-2 text-sm font-medium ${styles.icon} hover:underline focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-${toast.type}-500 rounded`}
              >
                {toast.action.label}
              </button>
            )}
          </div>

          {/* Close Button */}
          {toast.dismissible && (
            <button
              onClick={handleRemove}
              className={`flex-shrink-0 rounded-md p-1 hover:bg-black/5 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-${toast.type}-500 transition-colors`}
              aria-label="Dismiss notification"
            >
              <XMarkIcon className={`w-5 h-5 ${styles.icon}`} aria-hidden="true" />
            </button>
          )}
        </div>
      </div>

      {/* Progress Bar */}
      {toast.duration > 0 && (
        <div className="h-1 bg-black/5">
          <div
            className={`h-full transition-all ease-linear ${styles.progress}`}
            style={{ width: `${progress}%` }}
            aria-hidden="true"
          />
        </div>
      )}
    </div>
  );
}

export function Toast({ toasts, onRemove }) {
  return (
    <div
      className="fixed top-4 right-4 z-notification flex flex-col gap-3 pointer-events-none"
      aria-live="polite"
      aria-atomic="false"
    >
      {toasts.map((toast) => (
        <ToastItem key={toast.id} toast={toast} onRemove={onRemove} />
      ))}
    </div>
  );
}

export default Toast;
