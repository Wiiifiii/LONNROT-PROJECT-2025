import { getServerSession } from 'next-auth/next'
import { authOptions }      from '@/lib/authOptions'
import BackgroundWrapper    from '@/app/components/BackgroundWrapper'
import Navbar               from '@/app/components/Navbar'
import BookTextViewer       from '@/app/components/BookTextViewer'

export default async function ReadPage({ params }) {
  const { bookId } = await params
  const session    = await getServerSession(authOptions)

  // (optional) redirect if not signed in
  if (!session) {
    // redirect logic...
  }

  const [metaRes, textRes] = await Promise.all([
    fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/books/${bookId}`,      { cache: 'no-store' }),
    fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/books/${bookId}/download?format=txt`, { cache: 'no-store' })
  ])
  if (!metaRes.ok) throw new Error('Failed to load book metadata')

  const book = await metaRes.json()
  const text = await textRes.text()

  return (
    <BackgroundWrapper>
      <Navbar />
      {/* push content below the fixed navbar (4rem = 64px) */}
      <main className="mt-16 min-h-screen pb-12">
        <div className="container mx-auto py-12 px-4">
          <h1 className="text-2xl font-bold text-primary-dark dark:text-primary mb-6 flex items-center gap-2">
            <span>📖</span>You are reading&nbsp;
            <span className="underline">{book.title}</span>&nbsp;
            <span className="text-secondary-dark dark:text-secondary">— {book.author}</span>
          </h1>

          <BookTextViewer
            bookId={bookId}
            bookTitle={book.title}
            bookAuthor={book.author}
            initialText={text}
          />
        </div>
      </main>
    </BackgroundWrapper>
  )
}
