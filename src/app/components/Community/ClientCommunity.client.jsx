"use client";

import { useState, useEffect, useContext } from "react";
import Link from "next/link";
import NewTopicForm from "./NewTopicForm.client";
import TopicList from "./TopicList.client";
import CommentList from "./CommentList.client";
import NewCommentForm from "./NewCommentForm.client";
import Button from "@/app/components/UI/Button";
import ConfirmDialog from "@/app/components/UI/ConfirmDialog.client";
import { NotificationContext } from "@/app/components/Layout/NotificationProvider.client";

export default function ClientCommunity({ session }) {
  const [topics, setTopics] = useState([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [selectedId, setSelectedId] = useState(null);
  const [topicData, setTopicData] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const notify = useContext(NotificationContext).showNotification;
  const [commentsKey, setCommentsKey] = useState(0);

  // fetch topic list
  useEffect(() => {
    async function load() {
      try {
        const res = await fetch(`/api/community/topics?page=${page}&limit=5`);
        if (!res.ok) throw new Error("Failed to load topics");
        const json = await res.json();
        setTopics(json.topics);
        setTotal(json.total);
      } catch (e) {
        notify("error", e.message);
      }
    }
    load();
  }, [page, commentsKey]);

  // fetch single topic
  useEffect(() => {
    if (!selectedId) return;
    async function loadOne() {
      try {
        const res = await fetch(`/api/community/topics/${selectedId}`);
        if (!res.ok) throw new Error("Topic not found");
        const json = await res.json();
        setTopicData(json);
        setTitle(json.title);
        setBody(json.body);
      } catch (e) {
        notify("error", e.message);
      }
    }
    loadOne();
  }, [selectedId, commentsKey]);

  async function createSuccess() {
    setPage(1);
    setSelectedId(null);
    setCommentsKey((k) => k + 1);
  }

  async function deleteTopic(id) {
    try {
      const res = await fetch(`/api/community/topics/${id}`, { method: "DELETE" });
      if (!res.ok) throw new Error("Delete failed");
      notify("success", "Topic deleted");
      createSuccess();
    } catch (e) {
      notify("error", e.message);
    }
  }

  async function saveEdit() {
    try {
      const res = await fetch(`/api/community/topics/${selectedId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title, body }),
      });
      if (!res.ok) throw new Error("Update failed");
      notify("success", "Topic updated");
      setIsEditing(false);
      setCommentsKey((k) => k + 1);
    } catch (e) {
      notify("error", e.message);
    }
  }

  return (
    <div className="flex flex-col md:flex-row mt-16 px-4 md:px-8
                    space-y-6 md:space-y-0 md:space-x-6">
      {/*Sidebar*/}
      <div className="w-full md:w-1/3 bg-[#0b1c2c]/75 backdrop-blur-sm rounded-lg p-4 md:p-6 space-y-6">
        <div className="text-right">
          <Link
            href="/community/rules"
            className="text-sm text-blue-300 hover:text-blue-100 transition"
          >
            Saga’s Rune Code
          </Link>
        </div>
        <h2 className="text-xl font-bold text-white">Chant a New Verse</h2>
        <NewTopicForm onSuccess={createSuccess} />

        <h2 className="text-xl font-bold text-white mt-8">Bards’ Chants</h2>
        <TopicList
          topics={topics}
          session={session}
          onSelect={(id) => { setSelectedId(id); setIsEditing(false); }}
          onEdit={(id) => { setSelectedId(id); setIsEditing(true); }}
          onDelete={deleteTopic}
        />

        <div className="flex justify-between items-center mt-4">
          <Button
            text="‹ Prev"
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            disabled={page === 1}
          />
          <span className="text-white">
            Page {page} of {Math.ceil(total / 5) || 1}
          </span>
          <Button
            text="Next ›"
            onClick={() => setPage((p) => p + 1)}
            disabled={page * 5 >= total}
          />
        </div>
      </div>

      {/*Main Panel*/}
      <div className="w-full md:w-2/3 bg-[#0b1c2c]/75 backdrop-blur-sm rounded-lg p-4 md:p-6 space-y-6">        {!topicData ? (
        <p className="text-gray-300 text-center mt-12">
          Choose a chant to unveil its rune...
        </p>
      ) : (
        <>
          {isEditing ? (
            <>
              <input
                className="w-full p-2 bg-[#1f2937] text-white rounded mb-4"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
              />
              <textarea
                className="w-full p-2 bg-[#1f2937] text-white rounded mb-4"
                value={body}
                onChange={(e) => setBody(e.target.value)}
              />
              <div className="flex space-x-2">
                <Button text="Save" onClick={saveEdit} />
                <Button text="Cancel" onClick={() => setIsEditing(false)} />
              </div>
            </>
          ) : (
            <>
              <h2 className="text-2xl font-semibold text-white">
                {topicData.title}
              </h2>
              <p className="text-gray-200 mt-2">{topicData.body}</p>
              {session?.user?.email === topicData.author.email && (
                <div className="flex space-x-2 mt-4">
                  <Button text="Edit" onClick={() => setIsEditing(true)} />
                  <ConfirmDialog
                    title="Delete topic?"
                    description="This cannot be undone."
                    onConfirm={() => deleteTopic(selectedId)}
                  >
                    <Button text="Delete" />
                  </ConfirmDialog>
                </div>
              )}
            </>
          )}

          {/*Comments*/}
          <h3 className="text-lg font-semibold text-white mt-8">
            Comments
          </h3>
          <CommentList
            key={commentsKey}
            topicId={selectedId}
            session={session}
            onCommentDeleted={() => setCommentsKey((k) => k + 1)}
          />
          <NewCommentForm
            topicId={selectedId}
            onSuccess={() => setCommentsKey((k) => k + 1)}
          />
        </>
      )}
      </div>
    </div>
  );
}
