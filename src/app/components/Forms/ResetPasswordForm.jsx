'use client'

import React, { useState, useEffect } from 'react'
import { useRouter }            from 'next/navigation'
import Button                   from '@/app/components/UI/Button'
import FloatingInput            from '@/app/components/UI/FloatingInput'
import Notification             from '@/app/components/UI/Notification'

const PASSWORD_POLICY = /^(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*]).{10,}$/

export default function ResetPasswordForm({ token }) {
  const router = useRouter()
  const [newPwd,     setNewPwd]     = useState('')
  const [confirmPwd, setConfirmPwd] = useState('')
  const [loading,    setLoading]    = useState(false)
  const [notification, setNotification] = useState(null)

  useEffect(() => {
    if (!token) {
      setNotification({ type: 'error', message: 'Reset token missing.' })
    }
  }, [token])

  const handleSubmit = async e => {
    e.preventDefault()
    setNotification(null)

    if (newPwd !== confirmPwd) {
      setNotification({ type: 'error', message: "Passwords don't match." })
      return
    }
    if (!PASSWORD_POLICY.test(newPwd)) {
      setNotification({
        type: 'error',
        message: 'Password must be ≥10 chars, include uppercase, number & special.',
      })
      return
    }

    setLoading(true)
    const res = await fetch('/api/reset-password', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ token, newPassword: newPwd }),
    })
    const data = await res.json()

    if (res.ok) {
      setNotification({ type: 'success', message: 'Password reset! Redirecting…' })
      setTimeout(() => router.push('/auth/login'), 1500)
    } else {
      setNotification({ type: 'error', message: data.error || 'Reset failed.' })
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
          duration={3000}
        />
      )}

      <div className="flex min-h-screen items-center justify-center bg-gray-900 bg-cover bg-center">
        <div className="w-full max-w-md bg-[#0b1c2c]  p-8 rounded-lg shadow-lg space-y-6">
          <h2 className="text-2xl text-white text-center">Reset Password</h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <FloatingInput
              id="new-password"
              label="New Password"
              type="password"
              value={newPwd}
              onChange={e => setNewPwd(e.target.value)}
            />
            <FloatingInput
              id="confirm-password"
              label="Confirm New Password"
              type="password"
              value={confirmPwd}
              onChange={e => setConfirmPwd(e.target.value)}
            />
            <Button
              type="submit"
              text={loading ? 'Resetting…' : 'Reset Password'}
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
    </>
  )
}
