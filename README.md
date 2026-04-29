# ✨ Lönnrot Library
![Next.js](https://img.shields.io/badge/Next.js-000?style=for-the-badge&logo=next.js)
![React](https://img.shields.io/badge/React-20232a?style=for-the-badge&logo=react)
![TailwindCSS](https://img.shields.io/badge/TailwindCSS-06B6D4?style=for-the-badge&logo=tailwindcss)
![Prisma](https://img.shields.io/badge/Prisma-2D3748?style=for-the-badge&logo=prisma)
![Supabase](https://img.shields.io/badge/Supabase-3ECF8E?style=for-the-badge&logo=supabase)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-4169E1?style=for-the-badge&logo=postgresql)
![Node.js](https://img.shields.io/badge/Node.js-339933?style=for-the-badge&logo=node.js)
![Vercel](https://img.shields.io/badge/Vercel-000?style=for-the-badge&logo=vercel)
![Formspree](https://img.shields.io/badge/Formspree-FF4A4A?style=for-the-badge&logo=formspree)

**A free, open-source digital library to preserve Finnish literary heritage.**

---

## 🏛þ Project Mission

Lönnrot Library is an ongoing project dedicated to collecting, digitizing, and making public-domain Finnish (and Swedish-language) literary works freely available. Our mission is to save our shared history for future generations.

Whether you're a reader, researcher, or cultural enthusiast, this platform invites you to explore lost works, upload better covers, fix titles, and help expand the legacy.

> This platform is under active development — feedback is warmly welcome!

---

## 🎓 Technologies Used

- **Next.js** (App Router)
- **React** + Tailwind CSS
- **Prisma** (ORM)
- **PostgreSQL (Supabase)**
- **NextAuth** for authentication
- **Supabase Storage** for book covers and files
- **Formspree** for contact form (for now)
- **Email Notifications** via Gmail SMTP

---

## ⚙️ Features

### 📚 Book Features
- View public-domain Finnish/Swedish books
- Read books online (PDF Viewer)
- Download in TXT or PDF format
- Track views, downloads, and interactions
- Add books to personal reading lists

### 🔧 Admin Dashboard
- Manage books, users, reviews
- Book statistics & highlights
- Upload cover images

### 🌐 Public Pages
- About
- Privacy Policy
- Terms of Service
- Contact & Feedback (with working email form)

---

## 🚧 Under Development
- Upload your own books
- Community ratings & comments
- Multi-language UI
- API Documentation UI panel
---

## 🚀 Getting Started

### ᵀᵃᵇˡᵒᵃʳᵉᵃᵖ
```bash
# Clone the repository
git clone https://github.com/Wiiifiii/LONNROT-PROJECT-2025.git
cd LONNROT-PROJECT-2025

# Install dependencies
npm install

# Setup environment
cp .env.example .env
# fill in your credentials (see below)

# Run locally
npm run dev
```

---

## 🔐 Environment Variables

### `.env`
```env
DATABASE_URL=postgresql://...        # Supabase/PostgreSQL connection (pooled is OK)
DIRECT_URL=postgresql://...          # Supabase/PostgreSQL direct connection (for Prisma migrations)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASS=your-app-password
SMTP_FROM="Project Lönnrot <no-reply@lonnrotproject.live>"
NEXTAUTH_SECRET=...
NEXTAUTH_URL=http://localhost:3000
NEXT_PUBLIC_BASE_URL=http://localhost:3000
SUPABASE_URL=https://...supabase.co
SUPABASE_SERVICE_ROLE_KEY=...
NEXT_PUBLIC_SUPABASE_URL=https://...supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=...
```
---

## 📩 Notes

The site is still growing and community-driven.

---

## 🚫 License

This project is open-source under the **MIT License**. Content and uploaded books must be in the public domain.

---

## 🚡 Credits
- Built by **Wiiifii** 👤
- Named after **Elias Lönnrot**, compiler of the Kalevala

> Together, we preserve history. ✨

