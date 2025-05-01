// src/app/community/rules/page.jsx
import Link from 'next/link';

export const metadata = {
  title: 'Community Discussion Rules',
};

export default function CommunityRulesPage() {
  return (
    <div className="mx-auto max-w-3xl p-6 space-y-6">
      <Link
        href="/community"
        className="text-blue-400 hover:underline"
      >
        ← Back to Community
      </Link>

      <h1 className="text-3xl font-semibold">Community Discussion Rules</h1>

      <ul className="list-disc list-inside space-y-2 text-gray-200">
        <li>Be respectful and kind—no personal attacks or hate speech.</li>
        <li>Stay on topic—keep each thread focused on its subject.</li>
        <li>No spam, self-promotion, or off-site links without context.</li>
        <li>Use clear, descriptive titles for new topics.</li>
        <li>Report rule violations to the moderators.</li>
        {/* …add or modify rules to taste… */}
      </ul>
    </div>
  );
}
