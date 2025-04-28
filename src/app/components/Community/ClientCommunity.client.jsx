
"use client";

import { useState } from "react";
import NewTopicForm from "./NewTopicForm.client";
import TopicList    from "./TopicList.client";

export default function ClientCommunity() {
  const [refresh, setRefresh] = useState(0);
  return (
    <>
      <NewTopicForm onSuccess={() => setRefresh(r => r + 1)} />
      <TopicList key={refresh} />
    </>
  );
}
