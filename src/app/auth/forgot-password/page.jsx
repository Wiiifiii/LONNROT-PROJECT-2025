'use client'

import React, { useState } from 'react'
import { useRouter } from 'next/navigation'
import Button from '@/app/components/UI/Button'
import FloatingInput from '@/app/components/UI/FloatingInput'
import Notification from '@/app/components/UI/Notification'
import BackgroundWrapper from '@/app/components/Layout/BackgroundWrapper'

export default function ForgotPasswordPage() {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)
  const [notification, setNotification] = useState(null)

  const handleSubmit = async e => {
    e.preventDefault()
    setNotification(null)
    setLoading(true)

    const res = await fetch('/api/forgot-password', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email }),
    })
    const data = await res.json()

    if (res.ok) {
      setNotification({
        type: 'success',
        message: 'If that email exists, a reset link has been sent.',
      })
      // Optionally redirect back to login after a pause
      setTimeout(() => router.push('/auth/login'), 2000)
    } else {
      setNotification({
        type: 'error',
        message: data.error || 'Failed to send reset email.',
      })
    }
    setLoading(false)
  }

  return (
    <>
      {notification && (
        <Notification
          type={notification.type}
          message={notification.message}
          onClose={() => setNotification(null)}
          duration={4000}
        />
      )}

      <BackgroundWrapper>
      <div className="flex h-full items-center justify-center">
          <div className="w-full max-w-md bg-[#111827]  p-8 rounded-lg shadow-lg space-y-6">
            <h2 className="text-2xl text-white text-center">Forgotten Rune</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <FloatingInput
                id="email"
                label="Email"
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
              />
              <Button
                type="submit"
                text={loading ? 'Sending…' : 'Send Reset Link'}
                className="w-full justify-center"
                disabled={loading}
              />
            </form>
            <div className="text-center">
              <Button
                onClick={() => router.push('/auth/login')}
                text="Back to Login"
                className="w-full justify-center bg-gray-700 hover:bg-gray-600"
              />
            </div>
          </div>
        </div>
      </BackgroundWrapper>
    </>
  )
}
