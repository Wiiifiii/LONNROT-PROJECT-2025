"use client";

import { useState, cloneElement, isValidElement } from "react";

export default function ConfirmDialog({
  title = "Please confirm",
  message = "",
  confirmText = "Yes",
  cancelText = "No",
  onConfirm,
  children
}) {
  const [open, setOpen] = useState(false);

  // Always render the icon/button you passed in as `children`
  // but wrap its onClick to open the modal
  const trigger = isValidElement(children)
    ? cloneElement(children, {
        onClick: () => setOpen(true),
      })
    : null;

  return (
    <>
      {trigger}

      {open && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50"
          onClick={() => setOpen(false)}
        >
          <div
            className="bg-gray-800 text-white rounded-lg p-6 max-w-sm w-full space-y-4"
            onClick={(e) => e.stopPropagation()}
          >
            <h2 className="text-xl font-bold">{title}</h2>
            <p>{message}</p>
            <div className="flex justify-end space-x-2 mt-4">
              <button
                className="px-4 py-2 bg-gray-600 rounded hover:bg-gray-500"
                onClick={() => setOpen(false)}
              >
                {cancelText}
              </button>
              <button
                className="px-4 py-2 bg-red-600 rounded hover:bg-red-500"
                onClick={() => {
                  onConfirm();
                  setOpen(false);
                }}
              >
                {confirmText}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
