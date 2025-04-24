// src/app/api/users/me/avatar/route.js
export const runtime = 'nodejs';   

import { NextResponse }         from "next/server";
import { getServerSession }     from "next-auth/next";
import { authOptions }          from "@/lib/authOptions";
import { createClient }         from "@supabase/supabase-js";

const supabaseAdmin = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

export async function POST(request) {
  // 1) Auth
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const userId = session.user.id;

  // 2) Parse multipart/form-data
  const formData = await request.formData();
  const file = formData.get("file");
  if (!(file instanceof Blob)) {
    return NextResponse.json({ error: "No file uploaded" }, { status: 400 });
  }

  // 3) Build a path and upload
  const ext      = file.name.split(".").pop();
  const fileName = `${userId}.${ext}`;
  const filePath = `avatars/${fileName}`;

  const { error: uploadError } = await supabaseAdmin
    .storage
    .from("avatars")
    .upload(filePath, file, { upsert: true });

  if (uploadError) {
    console.error("Supabase upload error:", uploadError);
    return NextResponse.json({ error: "Upload failed" }, { status: 500 });
  }

  // 4) Get public URL
  const { data, error: urlError } = supabaseAdmin
    .storage
    .from("avatars")
    .getPublicUrl(filePath);

  if (urlError || !data?.publicUrl) {
    console.error("Supabase getPublicUrl error:", urlError);
    return NextResponse.json({ error: "Could not get public URL" }, { status: 500 });
  }

  // 5) Return the new URL
  return NextResponse.json({ success: true, publicUrl: data.publicUrl });
}
