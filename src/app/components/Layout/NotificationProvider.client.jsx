"use client";

import React, { createContext, useState } from "react";
import Notification from "@/app/components/UI/Notification";

export const NotificationContext = createContext({
  showNotification: (type, message) => {},
});

export default function NotificationProvider({ children }) {
  const [notification, setNotification] = useState(null);

  const showNotification = (type, message) => {
    setNotification({ type, message });
  };

  const handleClose = () => {
    setNotification(null);
  };

  return (
    <NotificationContext.Provider value={{ showNotification }}>
      {children}
      {notification && (
        <Notification
          type={notification.type}
          message={notification.message}
          onClose={handleClose}
        />
      )}
    </NotificationContext.Provider>
  );
}
