"use client";
import React, { useRef } from "react";
import { Rnd } from "react-rnd";
import { FaTimes } from "react-icons/fa";
import { FiMinus, FiMaximize } from "react-icons/fi";

const PopupPdf = ({
  pdfUrl,
  bookName,
  author,
  onClose,
  onMinimize,
  isMinimized,
  onMarkPage,
}) => {
  const iframeRef = useRef(null);

  const handleIframePointerEvents = (enable) => {
    if (iframeRef.current) {
      iframeRef.current.style.pointerEvents = enable ? "auto" : "none";
    }
  };

  return (
    <Rnd
      default={{ x: 100, y: 100, width: 800, height: isMinimized ? 40 : 600 }}
      minWidth={300}
      minHeight={isMinimized ? 40 : 200}
      style={{ zIndex: 9999 }}
      bounds="window"
      dragHandleClassName="drag-handle"
      onDragStart={() => handleIframePointerEvents(false)}
      onDragStop={() => handleIframePointerEvents(true)}
      onResizeStart={() => handleIframePointerEvents(false)}
      onResizeStop={() => handleIframePointerEvents(true)}
    >
      <div
        style={{
          background: "#1f2937",
          height: "100%",
          border: "1px solid #374151",
          borderRadius: "0.5rem",
          position: "relative",
          boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
          display: "flex",
          flexDirection: "column",
        }}
      >
        <div
          className="drag-handle flex items-center px-2"
          style={{
            height: "40px",
            background: "#374151",
            borderTopLeftRadius: "0.5rem",
            borderTopRightRadius: "0.5rem",
            cursor: "move",
          }}
        >
          <span style={{ color: "#fff", fontSize: "14px" }}>
            {bookName} by {author}
          </span>

          <button
            onClick={onMinimize}
            style={{
              marginLeft: "auto",
              background: "transparent",
              border: "none",
              color: "#fff",
              cursor: "pointer",
              padding: "4px",
            }}
            title={isMinimized ? "Restore" : "Minimize"}
          >
            {isMinimized ? <FiMaximize size={16} /> : <FiMinus size={16} />}
          </button>

          <button
            onClick={onClose}
            style={{
              marginLeft: "8px",
              background: "#ef4444",
              color: "#fff",
              border: "none",
              borderRadius: "50%",
              width: "24px",
              height: "24px",
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              transition: "background 0.2s",
            }}
            onMouseEnter={(e) => (e.target.style.background = "#dc2626")}
            onMouseLeave={(e) => (e.target.style.background = "#ef4444")}
            title="Close Popup"
          >
            <FaTimes size={16} />
          </button>

          {!isMinimized && (
            <button
              onClick={() => {
                const position =
                  iframeRef.current?.contentWindow?.document?.documentElement
                    ?.scrollTop || 0;
                onMarkPage(position);
              }}
              style={{
                marginLeft: "8px",
                background: "#10B981",
                color: "#fff",
                border: "none",
                borderRadius: "0.375rem",
                padding: "4px 8px",
                cursor: "pointer",
                fontSize: "14px",
              }}
              title="Mark Reading Position"
            >
              Mark Page
            </button>
          )}
        </div>

        {!isMinimized && (
          <div style={{ position: "relative", flex: 1 }}>
            <iframe
              ref={iframeRef}
              src={pdfUrl}
              title="Book PDF Pop Out"
              style={{
                width: "100%",
                height: "100%",
                border: "none",
                position: "absolute",
                top: 0,
                left: 0,
              }}
            />
          </div>
        )}
      </div>
    </Rnd>
  );
};

export default PopupPdf;
