'use client';
import Navbar from '@/app/components/Navbar';
import { useState } from 'react';
import Button from '@/app/components/Button';
import { FaPaperPlane } from 'react-icons/fa';

export default function ContactPage() {
  const [status, setStatus] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus('sending');

    const res = await fetch("https://formspree.io/f/mvgagzwz", {
      method: "POST",
      headers: {
        Accept: "application/json",
      },
      body: new FormData(e.target),
    });

    const result = await res.json();
    if (result.ok) {
      setStatus('sent');
    } else {
      setStatus('error');
    }
  };

  return (
    <div className="min-h-screen bg-cover bg-center flex flex-col pt-16" style={{ backgroundImage: "url('/images/baseImage.png')" }}>
      <Navbar />
      <main className="flex-grow p-6 max-w-4xl mx-auto text-white">
        <h1 className="text-4xl font-extrabold mb-6 text-center">Contact & Feedback</h1>

        <p className="text-lg mb-8 text-center">
          <strong>Lönnrot Library</strong> is not just a website — it’s a mission.
          Together, we are building a free, open digital library to preserve Finland's rich literary history for the next generations. 🕊️✨
          <br /><br />
          This project is still growing and your help matters. If you find a book with a wrong title, missing author, wrong information — or if you have a better original cover image for a book — please send it! 
          Let’s work together to save and protect the heritage of Finland 🇫🇮📖.
        </p>

        <form onSubmit={handleSubmit} className="bg-gray-900 p-6 rounded-lg space-y-4 text-lg">
          <label className="block">
            <span>Your Name</span>
            <input name="name" required className="mt-1 w-full p-2 bg-gray-800 rounded text-white" />
          </label>
          <label className="block">
            <span>Your Email</span>
            <input type="email" name="email" required className="mt-1 w-full p-2 bg-gray-800 rounded text-white" />
          </label>
          <label className="block">
            <span>Your Message</span>
            <textarea name="message" required rows="5" className="mt-1 w-full p-2 bg-gray-800 rounded text-white"></textarea>
          </label>

          <Button
            type="submit"
            disabled={status === 'sending'}
            icon={FaPaperPlane}
            text={status === 'sending' ? 'Sending...' : 'Send Message'}
            className="w-full px-4 py-2 bg-blue-600 hover:bg-blue-700 transition"
          />

          {status === 'sent' && <p className="text-green-400 text-center">✅ Message sent successfully! Thank you!</p>}
          {status === 'error' && <p className="text-red-400 text-center">❌ Something went wrong. Please try again later.</p>}
        </form>

        <p className="mt-8 text-center text-sm text-gray-400">
          Thank you for being part of this journey. Together, we preserve history. 🌍📚
        </p>
      </main>
    </div>
  );
}
