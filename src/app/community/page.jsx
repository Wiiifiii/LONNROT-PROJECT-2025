// app/community/page.jsx
import ClientCommunity      from "@/app/components/Community/ClientCommunity.client";
import NotificationProvider from "@/app/components/Layout/NotificationProvider.client";
import { getServerSession } from "next-auth";
import { authOptions }      from "@/lib/authOptions";
import Link               from 'next/link'

export default async function CommunityPage() {
  const session = await getServerSession(authOptions);
  return (
    <NotificationProvider>
      <ClientCommunity session={session} />
    </NotificationProvider>
  );
}
