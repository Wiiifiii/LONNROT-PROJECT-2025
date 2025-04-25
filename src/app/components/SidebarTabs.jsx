// src/app/components/SidebarTabs.jsx
"use client";

import React from "react";
import { FaEdit, FaTrash } from "react-icons/fa";
import Tooltip from "./Tooltip";

export default function SidebarTabs({
  lists,
  activeId,
  onChange,
  onRename,
  onDeleteRequested 
}) {
  return (
    <aside className="w-full md:w-1/4 bg-gray-800 bg-opacity-50 backdrop-blur-sm p-4">
      <h2 className="mb-4 text-white font-semibold">Your Lists</h2>
      <nav className="flex md:flex-col space-x-2 md:space-x-0 md:space-y-2 overflow-auto">
        {lists.length === 0 ? (
          <p className="text-gray-400 italic">No lists yet.</p>
        ) : (
          lists.map(list => (
            <div key={list.id} className="flex items-center justify-between">
              <button
                onClick={() => onChange(list.id)}
                className={`
                  flex-1 text-left px-3 py-2 rounded
                  ${activeId === list.id
                    ? "bg-gray-700 text-white"
                    : "bg-gray-900 text-gray-400 hover:bg-gray-700 hover:text-white"}
                `}
              >
                {list.name}
              </button>
              <div className="flex space-x-1 ml-2">
                {/* rename icon */}
                <Tooltip content="Rename list">
                  <button
                    onClick={() => {
                      const newName = prompt("New list name:", list.name);
                      if (newName && newName !== list.name) {
                        onRename(list.id, newName);
                      }
                    }}
                    className="p-1 text-gray-400 hover:text-white"
                  >
                    <FaEdit />
                  </button>
                </Tooltip>

                {/* delete icon */}
                <Tooltip content="Unsing the Rune list">
                  <button
                    onClick={() => onDeleteRequested(list.id, list.name)}
                    className="p-1 text-red-500 hover:text-red-700"
                  >
                    <FaTrash />
                  </button>
                </Tooltip>
              </div>
            </div>
          ))
        )}
      </nav>
    </aside>
  );
}
