"use client";

import { useEffect, useState } from "react";
import Link                   from "next/link";
import { FiEdit2, FiTrash2 }  from "react-icons/fi";
import Button                 from "@/app/components/UI/Button";
import ConfirmDialog          from "@/app/components/UI/ConfirmDialog.client";

export default function TopicList({ session, onDelete, onEdit }) {
  const [topics, setTopics] = useState([]);

  useEffect(() => {
    fetch("/api/community/topics")
      .then((r) => r.json())
      .then(setTopics);
  }, []);

  return (
    <ul className="space-y-4">
      {topics.map((topic) => {
        const isAuthor = session?.user?.email === topic.author.email;
        return (
          <li
            key={topic.id}
            className="p-4 bg-gray-800 rounded flex justify-between items-center"
          >
            <div>
              {/*
                🚨 Next.js 13+ Link no longer wants
                you to nest a plain <a> inside. You can
                pass your classes & text directly to Link.
              */}
              <Link
                href={`/community/${topic.id}`}
                className="text-xl font-semibold hover:underline"
              >
                {topic.title}
              </Link>

              <p className="text-sm text-gray-400">
                by {topic.author.username} · {topic.comments.length} comments
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
  message="This cannot be undone."
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
