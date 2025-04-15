"use client";
import React, { useRef, useState, useEffect } from "react";
import { Rnd } from "react-rnd";
import { FaTimes, FaWindowMinimize, FaWindowRestore, FaBookmark } from "react-icons/fa";

const PopupPdf = ({ pdfUrl, bookName, author, onClose, userId }) => {
  const [minimized, setMinimized] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const iframeRef = useRef(null);

  useEffect(() => {
    // Set mobile flag based on window width (for example, less than 768px)
    if (typeof window !== "undefined") {
      setIsMobile(window.innerWidth < 768);
    }
  }, []);

  // Toggle minimize/restore
  const toggleMinimize = () => setMinimized((prev) => !prev);

  // Handle marking the current reading position (placeholder logic)
  const handleMarkPage = async () => {
    const position = 1; // Placeholder value – replace with actual logic if available.
    try {
      const res = await fetch("/api/reading-positions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          bookId: 123, // TODO: replace with the actual book id.
          userId: userId || 1,
          position,
        }),
      });
      const data = await res.json();
      if (data.success) {
        alert(`Reading position (page ${position}) saved successfully!`);
      } else {
        alert(`Error saving reading position: ${data.error}`);
      }
    } catch (error) {
      alert("Error: " + error.message);
    }
  };

  const handleIframePointerEvents = (enable) => {
    if (iframeRef.current) {
      iframeRef.current.style.pointerEvents = enable ? "auto" : "none";
    }
  };

  const containerStyle = {
    background: "#1f2937",
    height: minimized ? "40px" : "100%",
    border: "1px solid #374151",
    borderRadius: "0.5rem",
    position: "relative",
    boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
    display: "flex",
    flexDirection: "column",
  };

  // Responsive defaults: adjust x, y, width, and height for mobile vs. desktop.
  const defaultX = isMobile ? 10 : 100;
  const defaultY = isMobile ? 10 : 100;
  const defaultWidth = isMobile ? 320 : 800;
  const defaultHeight = minimized ? 40 : isMobile ? 400 : 600;

  return (
    <Rnd
      default={{ x: defaultX, y: defaultY, width: defaultWidth, height: defaultHeight }}
      minWidth={300}
      minHeight={minimized ? 40 : 200}
      style={{ zIndex: 10000 }}
      bounds="window"
      dragHandleClassName="drag-handle"
      onDragStart={() => handleIframePointerEvents(false)}
      onDragStop={() => handleIframePointerEvents(true)}
      onResizeStart={() => handleIframePointerEvents(false)}
      onResizeStop={() => handleIframePointerEvents(true)}
      disableDragging={isMobile} // Disable dragging on mobile for better usability.
    >
      <div style={containerStyle}>
        {/* Header (drag area) */}
        <div
          className="drag-handle"
          style={{
            height: "40px",
            background: "#374151",
            borderTopLeftRadius: "0.5rem",
            borderTopRightRadius: "0.5rem",
            cursor: isMobile ? "default" : "move",
            display: "flex",
            alignItems: "center",
            padding: "0 8px",
          }}
        >
          <span style={{ color: "#fff", fontSize: "14px" }}>
            {bookName || "Unknown Book"} by {author || "Unknown Author"}
          </span>
          <div style={{ marginLeft: "auto", display: "flex", gap: "4px" }}>
            {/* Mark Page button */}
            <button
              onClick={handleMarkPage}
              style={{
                background: "#374151",
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
              onMouseEnter={(e) => (e.target.style.background = "#1f2937")}
              onMouseLeave={(e) => (e.target.style.background = "#374151")}
              title="Mark Current Page"
            >
              <FaBookmark size={16} />
            </button>
            {/* Minimize/Restore button */}
            <button
              onClick={toggleMinimize}
              style={{
                background: "#374151",
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
              title={minimized ? "Restore" : "Minimize"}
              onMouseEnter={(e) => (e.target.style.background = "#1f2937")}
              onMouseLeave={(e) => (e.target.style.background = "#374151")}
            >
              {minimized ? <FaWindowRestore size={16} /> : <FaWindowMinimize size={16} />}
            </button>
            {/* Close button */}
            <button
              onClick={onClose}
              style={{
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
          </div>
        </div>
        {/* PDF Iframe area - only shown when not minimized */}
        {!minimized && (
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
