'use client';
import Navbar from '@/app/components/Layout/Navbar';

export default function TermsOfServicePage() {
  return (
    <div className="min-h-screen bg-cover bg-center flex flex-col pt-16" style={{ backgroundImage: "url('/images/baseImage.png')" }}>
      <Navbar />
      <main className="flex-grow p-6 max-w-3xl mx-auto text-white">
        <h1 className="text-3xl font-bold mb-4">Terms of Service</h1>
        <p className="mb-4">
          By using Lönnrot Library, you agree to these terms.
        </p>

        <h2 className="text-xl font-semibold mt-4">1. Service Description</h2>
        <p>Lönnrot Library provides free access to public domain literature for educational purposes.</p>

        <h2 className="text-xl font-semibold mt-4">2. Account Responsibilities</h2>
        <p>You are responsible for your account activity and keeping your password secure.</p>

        <h2 className="text-xl font-semibold mt-4">3. Termination</h2>
        <p>We reserve the right to suspend or delete accounts that abuse the service or violate these terms.</p>

        <h2 className="text-xl font-semibold mt-4">4. Changes</h2>
        <p>We may update these terms. Continued use of the site after changes means you accept the new terms.</p>

        <p className="mt-6 text-sm text-gray-400">Last updated: April 25, 2025</p>
      </main>
    </div>
  );
}
