"use client";

import React from "react";
import { FaPlus } from "react-icons/fa";
import Button from "./Button";
import Tooltip from "../Tooltip";

export default function NewListForm({ value, onChange, onSubmit, loading }) {
  return (
    <form onSubmit={onSubmit} className="flex mb-6">
      <input
        type="text"
        value={value}
        onChange={e => onChange(e.target.value)}
        placeholder="Forge a New Scroll"
        disabled={loading}
        className="flex-1 px-4 py-2 bg-[#111827]  text-white rounded-l-md focus:outline-none"
      />
      <Tooltip content="Create a new Saga list">
        <Button
          type="submit"
          icon={FaPlus}
          disabled={loading}
          className="rounded-r-md"
        />
      </Tooltip>
    </form>
  );
}
