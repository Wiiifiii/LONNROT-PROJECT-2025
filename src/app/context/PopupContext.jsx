"use client";
import React, { createContext, useContext, useState } from "react";

const PopupContext = createContext();

export const PopupProvider = ({ children }) => {
  const [popupState, setPopupState] = useState({
    isOpen: false,
    isMinimized: false,
    pdfUrl: null,
    bookTitle: "",
    author: "",
    bookId: null,
    readingPosition: 0,
  });

  // openPopup is called from the read page
  const openPopup = (pdfUrl, bookTitle, author, bookId) => {
    setPopupState({
      isOpen: true,
      isMinimized: false,
      pdfUrl,
      bookTitle,
      author,
      bookId,
      readingPosition: 0,
    });
  };

  const closePopup = () => {
    if (popupState.pdfUrl) {
      URL.revokeObjectURL(popupState.pdfUrl);
    }
    setPopupState({
      isOpen: false,
      isMinimized: false,
      pdfUrl: null,
      bookTitle: "",
      author: "",
      bookId: null,
      readingPosition: 0,
    });
  };

  const toggleMinimize = () => {
    setPopupState((prev) => ({
      ...prev,
      isMinimized: !prev.isMinimized,
    }));
  };

  // example reading position saver (just logs to console or posts to API)
  const markReadingPosition = async (position) => {
    setPopupState((prev) => ({ ...prev, readingPosition: position }));
    console.log("Marking reading position =>", position);
    // Example: you might do an API call to store the reading position
    // e.g. POST /api/reading-position
    
    try {
      await fetch("/api/reading-position", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ bookId: popupState.bookId, position }),
      });
    } catch (err) {
      console.error("Failed to save reading position:", err);
    }
    
  };

  return (
    <PopupContext.Provider
      value={{
        popupState,
        openPopup,
        closePopup,
        toggleMinimize,
        markReadingPosition,
      }}
    >
      {children}
    </PopupContext.Provider>
  );
};

export const usePopup = () => {
  const context = useContext(PopupContext);
  if (!context) {
    throw new Error("usePopup must be used within a PopupProvider");
  }
  return context;
};
