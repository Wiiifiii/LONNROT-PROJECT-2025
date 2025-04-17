// src/app/components/Notification.jsx
"use client";

import React, { useEffect } from "react";
import { FiCheckCircle, FiInfo, FiAlertCircle, FiX } from "react-icons/fi";

/**
 * @param { "info" | "success" | "error" } type
 * @param { string } message
 * @param { () => void } onClose
 * @param { number } duration  auto‑dismiss after ms
 */
export default function Notification({
  type = "info",
  message,
  onClose,
  duration = 3000,
}) {
  useEffect(() => {
    const t = setTimeout(onClose, duration);
    return () => clearTimeout(t);
  }, [duration, onClose]);

  const icons = {
    info: <FiInfo className="text-xl" />,
    success: <FiCheckCircle className="text-xl" />,
    error: <FiAlertCircle className="text-xl" />,
  };
  const bgColors = {
    info: "bg-blue-600",
    success: "bg-green-600",
    error: "bg-red-600",
  };

  return (
    <div
      className={`
        fixed top-4 right-4 flex items-center space-x-2
        ${bgColors[type]} text-white px-4 py-2 rounded shadow-lg z-50
      `}
    >
      {icons[type]}
      <span className="flex-1">{message}</span>
      <button onClick={onClose} className="p-1 hover:opacity-80">
        <FiX />
      </button>
    </div>
  );
}
