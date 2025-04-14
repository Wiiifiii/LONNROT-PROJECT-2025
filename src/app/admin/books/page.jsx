"use client";
import React, { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import Navbar from "../../components/Navbar";
import { FiEdit, FiTrash2, FiPlus, FiX, FiArrowLeft } from "react-icons/fi";
import Link from "next/link";

export default function ManageBooksPage() {
  const { data: session } = useSession();
  const [books, setBooks] = useState([]);
  const [error, setError] = useState("");
  const [modalVisible, setModalVisible] = useState(false);
  const [editingBook, setEditingBook] = useState(null);
  const [bookForm, setBookForm] = useState({
    title: "",
    author: "",
    description: "",
    file_name: "",
    file_url: "",
    cover_url: "",
    metadata: "",
    isDeleted: false,
  });

  useEffect(() => {
    if (!session || session.user.role !== "admin") return;
    async function fetchBooks() {
      try {
        const res = await fetch("/api/books");
        const data = await res.json();
        if (!res.ok) throw new Error(data.error || "Failed to fetch books");
        setBooks(data.data);
      } catch (err) {
        setError(err.message);
      }
    }
    fetchBooks();
  }, [session]);

  function openAddBookModal() {
    setEditingBook(null);
    setBookForm({
      title: "",
      author: "",
      description: "",
      file_name: "",
      file_url: "",
      cover_url: "",
      metadata: "",
      isDeleted: false,
    });
    setModalVisible(true);
  }

  function openEditModal(book) {
    setEditingBook(book);
    setBookForm({
      title: book.title,
      author: book.author,
      description: book.description || "",
      file_name: book.file_name || "",
      file_url: book.file_url || "",
      cover_url: book.cover_url || "",
      metadata: book.metadata || "",
      isDeleted: book.isDeleted,
    });
    setModalVisible(true);
  }

  function closeModal() {
    setModalVisible(false);
    setEditingBook(null);
  }

  function handleFormChange(e) {
    const { name, value } = e.target;
    setBookForm((prev) => ({ ...prev, [name]: value }));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    const payload = bookForm;
    try {
      let res, data;
      if (editingBook) {
        res = await fetch(`/api/books/${editingBook.id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
        data = await res.json();
        if (!res.ok) throw new Error(data.error || "Failed to update book");
        setBooks((prevBooks) =>
          prevBooks.map((book) => (book.id === editingBook.id ? data.data : book))
        );
      } else {
        res = await fetch("/api/books", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
        data = await res.json();
        if (!res.ok) throw new Error(data.error || "Failed to create book");
        setBooks((prev) => [...prev, data.data]);
      }
      setBookForm({
        title: "",
        author: "",
        description: "",
        file_name: "",
        file_url: "",
        cover_url: "",
        metadata: "",
        isDeleted: false,
      });
      closeModal();
    } catch (err) {
      setError(err.message);
    }
  }

  async function handleDeleteBook(bookId) {
    if (!confirm("Are you sure you want to delete this book?")) return;
    try {
      const res = await fetch(`/api/books/${bookId}`, { method: "DELETE" });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to delete book");
      setBooks((prevBooks) => prevBooks.filter((book) => book.id !== bookId));
    } catch (err) {
      setError(err.message);
    }
  }

  if (!session)
    return <p className="text-red-500 text-2xl text-center mt-15">Please log in.</p>;
  if (session.user.role !== "admin")
    return <p className="text-red-500 text-2xl text-center mt-15">403 Forbidden: Admins only.</p>;

  return (
    <div className="bg-gray-900 text-white min-h-screen px-4 py-8">
      <div className="relative z-10 container mt-20 mx-auto px-12">
        <Navbar />
      </div>
      {error && <p className="text-red-500 text-center mb-4">{error}</p>}
      <div className="flex justify-between mb-6">
        <Link
          href="/admin"
          className="inline-flex items-center px-6 py-3 bg-[#374151] hover:bg-[#111827] rounded-full transition duration-300 text-white font-semibold text-sm"
        >
          <FiArrowLeft className="mr-2" size={18} />
          Back to Admin Dashboard
        </Link>
        <button
          onClick={openAddBookModal}
          className="inline-flex items-center px-6 py-3 bg-[#374151] hover:bg-[#111827] rounded-full transition duration-300 text-white font-semibold text-sm"
        >
          <FiPlus className="mr-2" size={18} />
          Add New Book
        </button>
      </div>
      <div className="mt-8 bg-gray-800 p-6 rounded-lg shadow-md">
        <h2 className="text-3xl font-semibold text-white mb-4">Existing Books</h2>
        {books.length === 0 ? (
          <p className="text-gray-300">No books found.</p>
        ) : (
          <ul className="space-y-4">
            {books.map((book) => (
              <li
                key={book.id}
                className="flex justify-between items-center bg-gray-700 p-4 rounded-lg"
              >
                <div>
                  <p className="text-white font-semibold">{book.title}</p>
                  <p className="text-gray-400">{book.author}</p>
                </div>
                <div className="flex space-x-2">
                  <button
                    onClick={() => openEditModal(book)}
                    className="flex items-center bg-[#374151] hover:bg-[#111827] text-white py-1 px-3 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                  >
                    <FiEdit className="mr-1" size={16} />
                    Edit
                  </button>
                  <button
                    onClick={() => handleDeleteBook(book.id)}
                    className="flex items-center bg-[#374151] hover:bg-[#111827] text-white py-1 px-3 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                  >
                    <FiTrash2 className="mr-1" size={16} />
                    Delete
                  </button>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
      {modalVisible && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div
            className="absolute inset-0 bg-black opacity-50"
            onClick={closeModal}
          ></div>
          <div className="relative bg-gray-800 p-8 rounded-lg shadow-lg z-10 w-full max-w-2xl">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-2xl font-bold">
                {editingBook ? "Edit Book" : "Add New Book"}
              </h3>
              <button
                onClick={closeModal}
                className="text-white hover:text-gray-300 focus:outline-none text-sm"
              >
                <FiX size={24} />
              </button>
            </div>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div>
                  <label className="block text-white mb-2">Title:</label>
                  <input
                    type="text"
                    name="title"
                    value={bookForm.title}
                    onChange={handleFormChange}
                    className="w-full p-3 bg-gray-700 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>
                <div>
                  <label className="block text-white mb-2">Author:</label>
                  <input
                    type="text"
                    name="author"
                    value={bookForm.author}
                    onChange={handleFormChange}
                    className="w-full p-3 bg-gray-700 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>
              </div>
              <div>
                <label className="block text-white mb-2">Description:</label>
                <textarea
                  name="description"
                  value={bookForm.description}
                  onChange={handleFormChange}
                  className="w-full p-3 bg-gray-700 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div>
                  <label className="block text-white mb-2">File Name:</label>
                  <input
                    type="text"
                    name="file_name"
                    value={bookForm.file_name}
                    onChange={handleFormChange}
                    className="w-full p-3 bg-gray-700 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-white mb-2">File URL:</label>
                  <input
                    type="text"
                    name="file_url"
                    value={bookForm.file_url}
                    onChange={handleFormChange}
                    className="w-full p-3 bg-gray-700 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div>
                  <label className="block text-white mb-2">Cover URL:</label>
                  <input
                    type="text"
                    name="cover_url"
                    value={bookForm.cover_url}
                    onChange={handleFormChange}
                    className="w-full p-3 bg-gray-700 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-white mb-2">Metadata (JSON):</label>
                  <input
                    type="text"
                    name="metadata"
                    value={bookForm.metadata}
                    onChange={handleFormChange}
                    className="w-full p-3 bg-gray-700 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>
              <div className="flex justify-end space-x-4">
                <button
                  type="button"
                  onClick={closeModal}
                  className="bg-[#374151] hover:bg-[#111827] text-white py-2 px-6 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="bg-[#374151] hover:bg-[#111827] text-white py-2 px-6 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                >
                  {editingBook ? "Update Book" : "Add Book"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
