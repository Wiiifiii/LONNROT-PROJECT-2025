// src/app/auth/register/route.js
export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { fileSlug } from '@/lib/slugify.js';
import prisma from '@/lib/prisma.js';
import bcrypt from 'bcrypt';

// Initialize Supabase client with service-role key
const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

// Parse a Data URI into a buffer, MIME type, and extension
function parseDataUri(dataUri) {
  const [meta, b64] = dataUri.split(',');
  const mimeMatch = meta.match(/data:(.*?);/);
  if (!mimeMatch) throw new Error('Invalid data URI');
  const mime = mimeMatch[1];
  const ext = mime.split('/')[1];
  const buffer = Buffer.from(b64, 'base64');
  return { buffer, mime, ext };
}

export async function POST(request) {
  try {
    const formData = await request.json();

    // Basic validation (expand as needed)
    if (!formData.username || !formData.email || !formData.password) {
      return NextResponse.json(
        { error: 'Username, email, and password are required' },
        { status: 400 }
      );
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(formData.password, 10);

    // Create the user record (without avatar_url)
    const newUser = await prisma.user.create({
      data: {
        username: formData.username,
        email: formData.email,
        password_hash: hashedPassword,
        dateOfBirth: formData.dateOfBirth ? new Date(formData.dateOfBirth) : null,
        gender: formData.gender,
        displayName: formData.displayName || null,
        bio: formData.bio || null,
        socialMediaLinks: formData.socialMediaLinks || {},
      },
    });

    let avatarUrl = null;
    if (formData.profileImage) {
      const { buffer, mime, ext } = parseDataUri(formData.profileImage);
      const fileName = fileSlug(newUser.id, 'avatar', ext); // e.g. "17-avatar.png"
      // Upload to Supabase Storage
      const { error: uploadErr } = await supabase
        .storage
        .from('avatars')
        .upload(fileName, buffer, { contentType: mime, upsert: true });
      if (uploadErr) throw uploadErr;

      // Get the public URL
      const { data: { publicUrl } } = supabase
        .storage
        .from('avatars')
        .getPublicUrl(fileName);
      avatarUrl = publicUrl;

      // Update user with avatar_url
      await prisma.user.update({
        where: { id: newUser.id },
        data: { avatar_url: avatarUrl },
      });
    }

    // Return the created user (omit sensitive fields)
    const safeUser = {
      id: newUser.id,
      username: newUser.username,
      email: newUser.email,
      displayName: newUser.displayName,
      bio: newUser.bio,
      socialMediaLinks: newUser.socialMediaLinks,
      avatar_url: avatarUrl,
    };

    return NextResponse.json(
      { message: 'User created successfully', user: safeUser },
      { status: 201 }
    );
  } catch (err) {
    console.error('Registration error:', err);
    return NextResponse.json(
      { error: err.message || 'Internal server error' },
      { status: 500 }
    );
  }
}
