import Link from 'next/link';

export const metadata = {
  title: 'Saga’s Rune Code',
};

export default function CommunityRulesPage() {
  return (
    <div className="mx-auto max-w-3xl p-6 space-y-6">
      <Link
        href="/community"
        className="text-blue-400 hover:underline"
      >
        ← Return to Kalevala Kantele
      </Link>

      <h1 className="text-3xl font-semibold">Code of the Rune Circle</h1>

      <ul className="list-disc list-inside space-y-2 text-gray-200">
        <li>Whisper with honor, shun dark curses.</li>
        <li>Weave sagas true, stray not from runes.</li>
        <li>Seal no false echoes, share with wisdom.</li>
        <li>Carve runes clear, sing tales with purpose.</li>
        <li>Call the bards to mend the broken song.</li>
        <li>Seek not to echo sung runes anew.</li>
        <li>Guard the lore, veil the hidden names.</li>
        <li>Join the chant, let voices rise as one.</li>
        {/* …add or modify rules to taste… */}
      </ul>
    </div>
  );
}