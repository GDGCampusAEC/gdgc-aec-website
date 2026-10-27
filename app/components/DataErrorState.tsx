"use client";

import { AlertTriangle, RefreshCw } from "lucide-react";

interface DataErrorStateProps {
  title?: string;
  message?: string;
  onRetry?: () => void;
  className?: string;
}

export default function DataErrorState({
  title = "Unable to load data",
  message = "A network or server error occurred. Please check your connection and try again.",
  onRetry,
  className = "",
}: DataErrorStateProps) {
  return (
    <div
      className={`w-full p-8 rounded-2xl border-2 border-dashed border-red-200 bg-red-50/50 flex flex-col items-center justify-center text-center ${className}`}
      role="alert"
    >
      <div className="w-12 h-12 rounded-full bg-red-100 flex items-center justify-center text-red-600 mb-3 shadow-inner">
        <AlertTriangle size={24} />
      </div>
      <h3 className="text-lg font-bold text-gray-900 mb-1">{title}</h3>
      <p className="text-sm text-gray-600 max-w-md mb-5">{message}</p>
      {onRetry && (
        <button
          onClick={onRetry}
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-gray-900 text-white text-sm font-semibold hover:bg-gray-800 transition-transform active:scale-95 shadow-md"
        >
          <RefreshCw size={14} />
          Try Again
        </button>
      )}
    </div>
  );
}
