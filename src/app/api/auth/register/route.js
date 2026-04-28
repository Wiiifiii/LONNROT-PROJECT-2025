export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

import { NextResponse }    from 'next/server';
import { createClient }    from '@supabase/supabase-js';
import { fileSlug }        from '@/lib/slugify.js';
import prisma              from '@/lib/prisma.js';
import bcrypt              from 'bcrypt';

// Initialize Supabase client at request time to avoid build-time env requirements

// Parse Data URI → { buffer, mime, ext }
function parseDataUri(dataUri) {
  const [meta, b64] = dataUri.split(',');
  const mimeMatch  = meta.match(/data:(.*?);/);
  if (!mimeMatch) throw new Error('Invalid data URI');
  const mime   = mimeMatch[1];
  const ext    = mime.split('/')[1];
  const buffer = Buffer.from(b64, 'base64');
  return { buffer, mime, ext };
}

export async function POST(request) {
  try {
    const supabase = createClient(
      process.env.SUPABASE_URL,
      process.env.SUPABASE_SERVICE_ROLE_KEY
    );
    const formData = await request.json();

    // 1) Required fields
    const { 
      username, email, password, confirmPassword,
      dateOfBirth, gender, displayName, bio, profileImage 
    } = formData;

    if (!username || !email || !password || !confirmPassword) {
      return NextResponse.json(
        { error: 'Username, email, password and confirmation are required' },
        { status: 400 }
      );
    }
    if (password !== confirmPassword) {
      return NextResponse.json(
        { error: 'Passwords do not match' },
        { status: 400 }
      );
    }

    // 2) Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // 3) Create user record
    const newUser = await prisma.user.create({
      data: {
        username,
        email,
        password_hash: hashedPassword,
        dateOfBirth:    dateOfBirth ? new Date(dateOfBirth) : null,
        gender:         gender || null,
        displayName:    displayName || null,
        bio:            bio || null,
        socialMediaLinks: {}            // you can populate later
      },
    });

    // 4) If front-end sent a base64 avatar, upload it
    let avatarUrl = null;
    if (profileImage) {
      const { buffer, mime, ext } = parseDataUri(profileImage);
      const fileName = fileSlug(newUser.id, 'avatar', ext);
      const { error: uploadErr } = await supabase
        .storage
        .from('avatars')
        .upload(fileName, buffer, { contentType: mime, upsert: true });
      if (uploadErr) throw uploadErr;

      const { data: { publicUrl } } = supabase
        .storage
        .from('avatars')
        .getPublicUrl(fileName);
      avatarUrl = publicUrl;

      await prisma.user.update({
        where: { id: newUser.id },
        data:  { avatar_url: avatarUrl },
      });
    }

    // 5) Return safe user
    const safeUser = {
      id:               newUser.id,
      username:         newUser.username,
      email:            newUser.email,
      displayName:      newUser.displayName,
      dateOfBirth:      newUser.dateOfBirth,
      gender:           newUser.gender,
      bio:              newUser.bio,
      socialMediaLinks: newUser.socialMediaLinks,
      avatar_url:       avatarUrl,
      profileImage:     avatarUrl,
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
