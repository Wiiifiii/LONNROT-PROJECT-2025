import { getServerSession } from 'next-auth/next';
import { authOptions }      from '@/lib/authOptions';
import BackgroundWrapper    from '@/app/components/Layout/BackgroundWrapper';
import Navbar               from '@/app/components/Layout/Navbar';
import BookTextViewer       from '@/app/components/Books/BookTextViewer';
import ReadStartLogger      from '@/app/components/Books/ReadStartLogger.client'; // Added new import

export default async function ReadPage({ params: paramsPromise }) {
  const { bookId } = await paramsPromise;

  const session = await getServerSession(authOptions);
  if (!session) {
    // redirect to login, etc.
  }

  const [metaRes, textRes] = await Promise.all([
    fetch(
      `${process.env.NEXT_PUBLIC_BASE_URL}/api/books/${bookId}`,
      { cache: 'no-store' }
    ),
    fetch(
      `${process.env.NEXT_PUBLIC_BASE_URL}/api/books/${bookId}/download?format=txt`,
      { cache: 'no-store' }
    )
  ]);

  const metaJson = await metaRes.json();
  if (!metaRes.ok || !metaJson.success) {
    throw new Error(metaJson.error || 'Failed to load book metadata');
  }

  const { book, otherBooks, reviews } = metaJson.data;
  const text = await textRes.text();

  return (
    <BackgroundWrapper>
      <Navbar />

      {/* logs read-start exactly once, client-side */}
      <ReadStartLogger bookId={bookId} />

      <main className="mt-16 min-h-screen pb-12">
        <div className="container mx-auto py-12 px-4">
          <BookTextViewer
            bookId={bookId}
            bookTitle={book.title}
            bookAuthor={book.author}
            initialText={text}
          />
        </div>
      </main>
    </BackgroundWrapper>
  );
}
