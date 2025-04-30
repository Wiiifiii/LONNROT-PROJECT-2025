"use client";

import { useState }                     from "react";
import { useSession }                   from "next-auth/react";
import NewTopicForm                     from "./NewTopicForm.client";
import TopicList                        from "./TopicList.client";

export default function ClientCommunity({ onCreateOrDelete }) {
  const { data: session } = useSession();
  const [refreshKey, setRefreshKey] = useState(0);

  // bump this key to force TopicList to remount/fetch again
  const bump = () => setRefreshKey((k) => k + 1);

  // --- topic delete handler ---
  const handleDelete = async (topicId) => {
    const res = await fetch(`/api/community/topics/${topicId}`, {
      method:      "DELETE",
      credentials: "include",
    });
    if (res.ok) bump();
  };

  // --- topic edit stub (you can wire up a modal or a page) ---
  const handleEdit = (topicId) => {
    alert("you clicked edit for topic " + topicId);
  };

  return (
    <>
      <NewTopicForm onSuccess={bump} />
      <TopicList
        key={refreshKey}
        session={session}
        onDelete={handleDelete}
        onEdit={handleEdit}
      />
    </>
  );
}
