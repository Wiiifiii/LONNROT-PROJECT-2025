// src/app/contact/page.jsx
'use client';
import Navbar from '@/app/components/Layout/Navbar';
import { useState } from 'react';
import Button from '@/app/components/UI/Button';
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
    <div
      className={`
        min-h-screen flex flex-col pt-16
        bg-[url('/images/baseImage.png')]
        bg-cover bg-center
      `}
    >
      <Navbar />

      <main className="flex-grow px-4 py-8">
        <div className="max-w-4xl mx-auto space-y-8 text-white">
          {/* Hero block with original intro text */}
          <div className="bg-gray-900 bg-opacity-75 backdrop-blur-sm rounded-lg p-6">
            <h1 className="text-4xl font-extrabold mb-6 text-center">
              Contact & Feedback
            </h1>

            <p className="text-lg mb-8 text-center">
              <strong>Lönnrot Library</strong> is not just a website — it’s a mission.
              Together, we are building a free, open digital library to preserve Finland's rich literary history for the next generations. 🕊️✨
              <br /><br />
              This project is still growing and your help matters. If you find a book with a wrong title, missing author, wrong information — or if you have a better original cover image for a book — please send it! 
              Let’s work together to save and protect the heritage of Finland 🇫🇮📖.
            </p>
          </div>

          {/* Form panel */}
          <div className="bg-gray-900 bg-opacity-75 backdrop-blur-sm rounded-lg p-6 space-y-4 text-lg">
            <form onSubmit={handleSubmit} className="space-y-4">
              <label className="block">
                <span>Your Name</span>
                <input
                  name="name"
                  required
                  className="mt-1 w-full p-2 bg-[#1f2937] rounded text-white"
                />
              </label>
              <label className="block">
                <span>Your Email</span>
                <input
                  type="email"
                  name="email"
                  required
                  className="mt-1 w-full p-2 bg-[#1f2937] rounded text-white"
                />
              </label>
              <label className="block">
                <span>Your Message</span>
                <textarea
                  name="message"
                  required
                  rows="5"
                  className="mt-1 w-full p-2 bg-[#1f2937] rounded text-white"
                />
              </label>

              <Button
                type="submit"
                disabled={status === 'sending'}
                icon={FaPaperPlane}
                text={status === 'sending' ? 'Sending...' : 'Send Message'}
                className="w-full px-4 py-2 transition"
              />

              {status === 'sent' && (
                <p className="text-green-400 text-center">
                  ✅ Message sent successfully! Thank you!
                </p>
              )}
              {status === 'error' && (
                <p className="text-red-400 text-center">
                  ❌ Something went wrong. Please try again later.
                </p>
              )}
            </form>
          </div>

          {/* Footer note, unchanged text */}
          <p className="mt-8 text-center text-sm text-gray-400">
            Thank you for being part of this journey. Together, we preserve history. 🌍📚
          </p>
        </div>
      </main>
    </div>
  );
}
