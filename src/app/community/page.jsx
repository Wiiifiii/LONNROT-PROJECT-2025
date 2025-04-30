import ClientCommunity from "@/app/components/Community/ClientCommunity.client";
import { getServerSession }    from "next-auth";
import { authOptions }         from "@/lib/authOptions";

export default async function CommunityPage() {
  // fetch the current user session
  const session = await getServerSession(authOptions);

  return <ClientCommunity session={session} />;
}
