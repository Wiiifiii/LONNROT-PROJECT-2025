// Summary: Server-rendered API documentation page that displays code examples for authentication, books, reviews, reading lists, user profiles, and activity logs using a syntax highlighter.

"use client";

export const dynamic = "force-dynamic";
import React, { useState } from 'react';
import Navbar from '../../components/Navbar';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { tomorrow } from 'react-syntax-highlighter/dist/cjs/styles/prism';

const CodeBlock = ({ language, code }) => {
  return (
    <SyntaxHighlighter language={language} style={tomorrow}>
      {code}
    </SyntaxHighlighter>
  );
};

export default function APIDocumentation() {
  const getBooksResponse = `{
  "status": "success",
  "data": [
    {
      "id": 1,
      "title": "Sample Book Title",
      "author": "Author Name",
      "upload_date": "2025-04-07T12:34:56.789Z",
      "cover_url": "https://example.com/cover.jpg"
    }
  ]
}`;
  const getBookDetailResponse = `{
  "status": "success",
  "data": {
    "id": 1,
    "title": "Sample Book Title",
    "author": "Author Name",
    "description": "A detailed description of the book.",
    "file_url": "https://example.com/file.txt",
    "cover_url": "https://example.com/cover.jpg",
    "upload_date": "2025-04-07T12:34:56.789Z"
  }
}`;
  const postBookRequest = `{
  "title": "New Book Title",
  "author": "Author Name",
  "description": "Brief description of the new book.",
  "file_url": "https://example.com/newbook.txt",
  "cover_url": "https://example.com/newcover.jpg"
}`;
  const postBookResponse = `{
  "status": "success",
  "data": {
    "id": 2,
    "title": "New Book Title",
    "author": "Author Name",
    "description": "Brief description of the new book.",
    "file_url": "https://example.com/newbook.txt",
    "cover_url": "https://example.com/newcover.jpg",
    "upload_date": "2025-04-08T08:00:00.000Z"
  }
}`;
  const putBookRequest = `{
  "title": "Updated Book Title",
  "author": "Updated Author",
  "description": "Updated description of the book.",
  "file_url": "https://example.com/updatedbook.txt",
  "cover_url": "https://example.com/updatedcover.jpg"
}`;
  const putBookResponse = `{
  "status": "success",
  "data": {
    "id": 1,
    "title": "Updated Book Title",
    "author": "Updated Author",
    "description": "Updated description of the book.",
    "file_url": "https://example.com/updatedbook.txt",
    "cover_url": "https://example.com/updatedcover.jpg",
    "upload_date": "2025-04-07T12:34:56.789Z"
  }
}`;
  const deleteBookResponse = `{
  "status": "success",
  "message": "Book deleted successfully"
}`;
  const postReviewRequest = `{
  "rating": 5,
  "comment": "Excellent book!"
}`;
  const postReviewResponse = `{
  "status": "success",
  "data": {
    "id": 1,
    "bookId": 1,
    "userId": 2,
    "rating": 5,
    "comment": "Excellent book!",
    "createdAt": "2025-04-08T09:00:00.000Z"
  }
}`;
  const postReadingListRequest = `{
  "name": "My Favorite Books"
}`;
  const postReadingListResponse = `{
  "status": "success",
  "data": {
    "id": 1,
    "name": "My Favorite Books",
    "userId": 2,
    "createdAt": "2025-04-08T09:30:00.000Z"
  }
}`;
  const getUserProfileResponse = `{
  "status": "success",
  "data": {
    "id": 2,
    "username": "johndoe",
    "email": "john@example.com",
    "role": "user",
    "created_at": "2025-04-07T10:00:00.000Z"
  }
}`;
  const getActivityLogsResponse = `{
  "status": "success",
  "data": [
    {
      "id": 1,
      "userId": 2,
      "action": "Added a review",
      "bookId": 1,
      "timestamp": "2025-04-08T10:00:00.000Z",
      "details": "User added a review for book id 1"
    }
  ]
}`;

  return (
    <div className="bg-[#1f2937] text-white">
      <Navbar />
      <div className="pt-24 container mx-auto px-4 py-8">
        <section className="mb-8">
          <h1 className="text-4xl font-extrabold mb-4">API Documentation</h1>
          <p className="mb-4">
            The Lönnrot Project API provides secure, RESTful endpoints for managing books, users, reviews, reading lists, and more. Our API integrates with lonnrot.net to fetch fresh book data which is then stored in our PostgreSQL database on Azure via Prisma ORM. All responses are delivered in JSON.
          </p>
          <p className="mb-4">
            Authentication is handled via NextAuth, and each endpoint adheres to industry-standard practices for reliability and performance.
          </p>
        </section>
        <section className="mb-12 bg-[#111827] text-white p-6 rounded">
          <h2 className="text-3xl font-semibold mb-4">Authentication Endpoints</h2>
          <h3 className="text-xl font-bold mb-2">POST /api/auth/login</h3>
          <p className="mb-2">
            Authenticates a user using their email and password.
          </p>
          <h4 className="text-lg font-semibold mb-1">Request Body:</h4>
          <CodeBlock language="json" code={`{
  "email": "user@example.com",
  "password": "securePassword123"
}`} />
          <h4 className="text-lg font-semibold mt-4 mb-1">Example Response:</h4>
          <CodeBlock language="json" code={getUserProfileResponse} />
          <h3 className="text-xl font-bold mt-6 mb-2">POST /api/auth/register</h3>
          <p className="mb-2">
            Registers a new user account.
          </p>
          <h4 className="text-lg font-semibold mb-1">Request Body:</h4>
          <CodeBlock language="json" code={`{
  "username": "johndoe",
  "email": "user@example.com",
  "password": "securePassword123"
}`} />
          <h4 className="text-lg font-semibold mt-4 mb-1">Example Response:</h4>
          <CodeBlock language="json" code={getUserProfileResponse} />
        </section>
        <section className="mb-12 bg-[#1f2937] text-white p-6 rounded">
          <h2 className="text-3xl font-semibold mb-4">Books Endpoints</h2>
          <h3 className="text-xl font-bold mb-2">GET /api/books</h3>
          <p className="mb-2">Retrieves a list of books in the digital library.</p>
          <h4 className="text-lg font-semibold mb-1">Example Response:</h4>
          <CodeBlock language="json" code={getBooksResponse} />
          <h3 className="text-xl font-bold mt-6 mb-2">GET /api/books/[bookId]</h3>
          <p className="mb-2">Retrieves detailed information for a specific book.</p>
          <h4 className="text-lg font-semibold mb-1">Example Response:</h4>
          <CodeBlock language="json" code={getBookDetailResponse} />
          <h3 className="text-xl font-bold mt-6 mb-2">POST /api/books</h3>
          <p className="mb-2">(Admin only) Adds a new book to the library.</p>
          <h4 className="text-lg font-semibold mb-1">Request Body:</h4>
          <CodeBlock language="json" code={postBookRequest} />
          <h4 className="text-lg font-semibold mt-4 mb-1">Example Response:</h4>
          <CodeBlock language="json" code={postBookResponse} />
          <h3 className="text-xl font-bold mt-6 mb-2">PUT /api/books/[bookId]</h3>
          <p className="mb-2">(Admin only) Updates an existing book's details.</p>
          <h4 className="text-lg font-semibold mb-1">Request Body:</h4>
          <CodeBlock language="json" code={putBookRequest} />
          <h4 className="text-lg font-semibold mt-4 mb-1">Example Response:</h4>
          <CodeBlock language="json" code={putBookResponse} />
          <h3 className="text-xl font-bold mt-6 mb-2">DELETE /api/books/[bookId]</h3>
          <p className="mb-2">(Admin only) Deletes a book from the library.</p>
          <h4 className="text-lg font-semibold mb-1">Example Response:</h4>
          <CodeBlock language="json" code={deleteBookResponse} />
        </section>
        <section className="mb-12 bg-[#111827] text-white p-6 rounded">
          <h2 className="text-3xl font-semibold mb-4">Reviews Endpoints</h2>
          <h3 className="text-xl font-bold mb-2">POST /api/books/[bookId]/reviews</h3>
          <p className="mb-2">Adds a review for a specific book.</p>
          <h4 className="text-lg font-semibold mb-1">Request Body:</h4>
          <CodeBlock language="json" code={postReviewRequest} />
          <h4 className="text-lg font-semibold mt-4 mb-1">Example Response:</h4>
          <CodeBlock language="json" code={postReviewResponse} />
        </section>
        <section className="mb-12 bg-[#1f2937] text-white p-6 rounded">
          <h2 className="text-3xl font-semibold mb-4">Reading Lists Endpoints</h2>
          <h3 className="text-xl font-bold mb-2">POST /api/reading-lists</h3>
          <p className="mb-2">Creates a new reading list for the registered user.</p>
          <h4 className="text-lg font-semibold mb-1">Request Body:</h4>
          <CodeBlock language="json" code={postReadingListRequest} />
          <h4 className="text-lg font-semibold mt-4 mb-1">Example Response:</h4>
          <CodeBlock language="json" code={postReadingListResponse} />
        </section>
        <section className="mb-12 bg-[#111827] text-white p-6 rounded">
          <h2 className="text-3xl font-semibold mb-4">User Endpoints</h2>
          <h3 className="text-xl font-bold mb-2">GET /api/users/[userId]</h3>
          <p className="mb-2">Retrieves profile information for a specific user.</p>
          <h4 className="text-lg font-semibold mb-1">Example Response:</h4>
          <CodeBlock language="json" code={getUserProfileResponse} />
        </section>
        <section className="mb-12 bg-[#1f2937] text-white p-6 rounded">
          <h2 className="text-3xl font-semibold mb-4">Activity Logs Endpoints</h2>
          <h3 className="text-xl font-bold mb-2">GET /api/activity-logs</h3>
          <p className="mb-2">Retrieves a list of system activity logs.</p>
          <h4 className="text-lg font-semibold mb-1">Example Response:</h4>
          <CodeBlock language="json" code={getActivityLogsResponse} />
        </section>
        <section className="mb-12 bg-[#111827] text-white p-6 rounded">
          <h2 className="text-3xl font-semibold mb-4">Conclusion</h2>
          <p>
            This API, built with Next.js, Prisma ORM, and PostgreSQL on Azure, is designed with scalability, security, and performance in mind. It provides a robust, RESTful interface for managing our digital library.
            By dynamically fetching book data from lonnrot.net and integrating various external resources, our platform ensures that the literary heritage remains accessible and up-to-date.
          </p>
        </section>
      </div>
    </div>
  );
}