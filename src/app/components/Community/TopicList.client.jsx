"use client";

import { FiEdit2, FiTrash2 } from "react-icons/fi";
import Button                 from "@/app/components/UI/Button";
import ConfirmDialog          from "@/app/components/UI/ConfirmDialog.client";

export default function TopicList({
  topics = [],
  session,
  onSelect,
  onEdit,
  onDelete,
}) {
  return (
    <ul className="space-y-4">
      {topics.map((topic) => {
        const isAuthor = session?.user?.email === topic.author.email;
        return (
          <li
            key={topic.id}
            className="p-4 bg-gray-800 rounded flex justify-between items-center"
          >
            <div className="flex-1">
              <button
                onClick={() => onSelect(topic.id)}
                className="w-full text-left text-xl font-semibold text-white hover:underline"
              >
                {topic.title}
              </button>
              <p className="text-sm text-gray-400">
                by {topic.author.username} ·{" "}
                {topic._count?.comments ?? topic.comments.length} comments
              </p>
            </div>

            {isAuthor && (
              <div className="flex items-center space-x-2">
                <Button
                  icon={FiEdit2}
                  tooltip="Edit topic"
                  onClick={() => onEdit(topic.id)}
                />
                <ConfirmDialog
                  title="Delete topic?"
                  description="This cannot be undone."
                  onConfirm={() => onDelete(topic.id)}
                >
                  <Button icon={FiTrash2} tooltip="Delete topic" />
                </ConfirmDialog>
              </div>
            )}
          </li>
        );
      })}
    </ul>
  );
}
