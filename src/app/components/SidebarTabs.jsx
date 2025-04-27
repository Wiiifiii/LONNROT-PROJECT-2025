"use client";

import React from "react";
import { FaEdit, FaTrash } from "react-icons/fa";
import Tooltip from "./Tooltip";

export default function SidebarTabs({
  lists,
  activeId,
  onChange,
  onRename,
  onDeleteRequested,
}) {
  return (
    <aside className="w-full md:w-1/4 bg-[#111827]  bg-opacity-50 backdrop-blur-sm p-4 rounded-lg">
      <h2 className="mb-4 text-white font-semibold text-lg">Your Saga Lists</h2>
      <nav className="flex flex-col space-y-2 overflow-auto">
        {lists.length === 0 ? (
          <p className="text-gray-400 italic">No lists yet.</p>
        ) : (
          lists.map((list) => (
            <div
              key={list.id}
              className="flex items-center justify-between bg-gray-900 hover:bg-gray-700 rounded"
            >
              <button
                onClick={() => onChange(list.id)}
                className={`flex-1 text-left px-4 py-2 rounded-l
                  ${activeId === list.id
                    ? "bg-gray-700 text-white"
                    : "text-gray-400"}`
                }
              >
                {list.name}
              </button>
              <div className="flex items-center space-x-1 px-2">
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
                <Tooltip content="Delete list">
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
