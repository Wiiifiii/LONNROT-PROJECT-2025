"use client";

import React from "react";
import { FiAlertTriangle } from "react-icons/fi";
import Button from "./Button";

export default function ConfirmDialog({
  isOpen,
  title = "Please confirm",
  message,
  confirmText = "Yes",
  cancelText  = "No",
  onConfirm,
  onCancel
}) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-60">
      <div className="bg-[#111827]  bg-opacity-80 backdrop-blur-sm rounded-lg p-6 w-full max-w-sm space-y-4 shadow-lg">
        <div className="flex items-center space-x-2">
          <FiAlertTriangle className="text-2xl text-yellow-400" />
          <h3 className="text-xl font-semibold text-white">{title}</h3>
        </div>
        <p className="text-gray-300">{message}</p>
        <div className="flex justify-end space-x-2">
          <Button
            text={cancelText}
            onClick={onCancel}
            className="bg-gray-600 hover:bg-gray-500"
          />
          <Button
            text={confirmText}
            onClick={onConfirm}
            className="bg-red-600 hover:bg-red-500"
          />
        </div>
      </div>
    </div>
  );
}
