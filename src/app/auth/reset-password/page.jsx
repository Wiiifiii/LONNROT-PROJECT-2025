'use client';
import { useState } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import Button from '@/app/components/Button';

export default function ResetPasswordPage() {
  const params = useSearchParams();
  const token  = params.get('token') ?? '';
  const router = useRouter();

  const [pw, setPw]         = useState('');
  const [confirm, setConfirm] = useState('');
  const [error, setError]     = useState('');
  const [done, setDone]       = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (pw !== confirm) {
      setError('Passwords do not match');
      return;
    }
    const res = await fetch('/api/reset-password', {
      method:  'POST',
      headers: { 'Content-Type': 'application/json' },
      body:    JSON.stringify({ token, newPassword: pw }),
    });
    const data = await res.json();
    if (data.ok) {
      setDone(true);
      setTimeout(() => router.push('/auth/login'), 2000);
    } else {
      setError(data.error);
    }
  };

  if (done) {
    return <p className="text-green-400">Password reset! Redirecting…</p>;
  }

  return (
    <form onSubmit={handleSubmit} className="max-w-md mx-auto p-6 space-y-4">
      <h2 className="text-xl text-white">Set a new password</h2>
      {error && <p className="text-red-500">{error}</p>}
      <input
        type="password"
        required
        placeholder="New password"
        value={pw}
        onChange={(e) => setPw(e.target.value)}
        className="w-full p-3 rounded bg-gray-700 text-white"
      />
      <input
        type="password"
        required
        placeholder="Confirm password"
        value={confirm}
        onChange={(e) => setConfirm(e.target.value)}
        className="w-full p-3 rounded bg-gray-700 text-white"
      />
      <Button type="submit" text="Reset password" className="w-full" />
    </form>
  );
}
