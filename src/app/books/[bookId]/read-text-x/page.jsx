// import { getServerSession } from 'next-auth/next';
// import { authOptions } from '@/lib/authOptions';
// import BackgroundWrapper from '@/app/components/BackgroundWrapper';
// import Navbar from '@/app/components/Navbar';
// import BookTextViewer from '@/app/components/BookTextViewer';

// export default async function ReadTextPage({ params }) {
//   const { bookId } = await params;
//   const session = await getServerSession(authOptions);

//   // Optional: redirect to login if no session
//   if (!session) {
//     // redirect logic…
//   }

//   // Fetch metadata + text in parallel
//   const [metaRes, textRes] = await Promise.all([
//     fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/books/${bookId}`, { cache: 'no-store' }),
//     fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/books/${bookId}/download?format=txt`, { cache: 'no-store' }),
//   ]);

//   if (!metaRes.ok) {
//     throw new Error('Failed to load book metadata');
//   }

//   const book = await metaRes.json();
//   const text = await textRes.text();

//   return (
//     <BackgroundWrapper>
//       <Navbar />
//       <div className="container mx-auto py-12 px-4">

//         <h1 className="text-2xl font-bold text-white mb-6 flex items-center gap-2">
//           <span>📖</span> You are reading&nbsp;
//           <span className="underline">{book.title}</span>&nbsp;
//           <span className="text-gray-400">— {book.author}</span>
//         </h1>

//         <BookTextViewer
//           bookId={bookId}
//           bookTitle={book.title}
//           bookAuthor={book.author}
//           initialText={text}
//         />
//       </div>
//     </BackgroundWrapper>
//   );
// }


// // import React from "react";
// // import Navbar from "@/app/components/Navbar";
// // import BookViewer from "@/app/components/BookViewer";
// // import prisma from "@/lib/prisma";

// // export const dynamic = "force-dynamic";

// // export default async function ReaderPage({ params }) {
// //   // params is a Promise<{ bookId: string }>
// //   const { bookId } = await params;

// //   const book = await prisma.book.findUnique({ where: { id: +bookId } });
// //   if (!book) {
// //     return (
// //       <div className="min-h-screen flex items-center justify-center text-red-500">
// //         Error loading book.
// //       </div>
// //     );
// //   }

// //   return (
// //     <div className="flex flex-col h-screen bg-gray-900">
// //       <Navbar />
// //       <div className="flex-1 pt-16">
// //         <BookViewer bookId={bookId} pdfUrl={book.pdf_url} book={book} />
// //       </div>
// //     </div>
// //   );
// // }
