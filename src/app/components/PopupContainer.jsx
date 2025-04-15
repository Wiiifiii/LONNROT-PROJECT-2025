"use client";
import React from "react";
import { usePopup } from "@/app/context/PopupContext";
import PopupPdf from "@/app/books/[bookId]/components/PopupPdf";

const PopupContainer = () => {
  const {
    popupState,
    closePopup,
    toggleMinimize,
    markReadingPosition,
  } = usePopup();

  if (!popupState.isOpen) return null;

  return (
    <PopupPdf
      pdfUrl={popupState.pdfUrl}
      bookName={popupState.bookTitle}
      author={popupState.author}
      onClose={closePopup}
      onMinimize={toggleMinimize}
      isMinimized={popupState.isMinimized}
      onMarkPage={markReadingPosition}
    />
  );
};

export default PopupContainer;
