import { getServerSession } from 'next-auth/next';
import { authOptions }      from '@/lib/authOptions';
import BackgroundWrapper    from '@/app/components/BackgroundWrapper';
import Navbar               from '@/app/components/Navbar';
import BookTextViewer       from '@/app/components/BookTextViewer';

export default async function ReadPage({ params: paramsPromise }) {
    // await params before destructuring
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
      ])
      const metaJson = await metaRes.json()
      if (!metaRes.ok || !metaJson.success) {
        throw new Error(metaJson.error || 'Failed to load book metadata')
      }
    
     // unwrap exactly the book object
      const { book, otherBooks, reviews } = metaJson.data
     const text = await textRes.text()

  return (
    <BackgroundWrapper>
      <Navbar />
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
