'use client';
import Navbar from '@/app/components/Navbar';

export default function PrivacyPolicyPage() {
  return (
    <div className="min-h-screen bg-cover bg-center flex flex-col pt-16" style={{ backgroundImage: "url('/images/baseImage.png')" }}>
      <Navbar />
      <main className="flex-grow p-6 max-w-3xl mx-auto text-white">
        <h1 className="text-3xl font-bold mb-4">Privacy Policy</h1>
        <p className="mb-4">
          This Privacy Policy explains how we collect, use, and protect your information at Lönnrot Library.
        </p>

        <h2 className="text-xl font-semibold mt-4">1. Information We Collect</h2>
        <p>We collect your email, reading progress, and user-generated content like reviews and reading lists.</p>

        <h2 className="text-xl font-semibold mt-4">2. How We Use Your Information</h2>
        <p>We use your data to provide access to public-domain e-books and maintain your reading lists.</p>

        <h2 className="text-xl font-semibold mt-4">3. Your Rights</h2>
        <p>You can delete your account and associated data at any time through your profile page.</p>

        <h2 className="text-xl font-semibold mt-4">4. Contact</h2>
        <p>
          For any questions, contact us at:{" "}
          <strong>support@lonnrotproject.live</strong>
        </p>

        <p className="mt-6 text-sm text-gray-400">Last updated: April 25, 2025</p>
      </main>
    </div>
  );
}
