// src/app/auth/register/page.jsx
'use client'

import React, { useState } from 'react'
import { useRouter }    from 'next/navigation'
import Button           from '@/app/components/Button'
import Notification     from '@/app/components/Notification'
import {
  FiEye,
  FiEyeOff,
  FiUserPlus,
  FiBookOpen
}                      from 'react-icons/fi'

export default function RegisterPage() {
  const router = useRouter()
  const [notification, setNotification] = useState(null)

  // form fields
  const [username,        setUsername]        = useState('')
  const [email,           setEmail]           = useState('')
  const [password,        setPassword]        = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [displayName,     setDisplayName]     = useState('')
  const [dateOfBirth,     setDateOfBirth]     = useState('')
  const [gender,          setGender]          = useState('')
  const [bio,             setBio]             = useState('')
  const [profileImage,    setProfileImage]    = useState(null)
  const [showPw,          setShowPw]          = useState(false)

  // read file to base64
  const handleFile = e => {
    const file = e.target.files[0]
    if (!file) return
    const reader = new FileReader()
    reader.onloadend = () => setProfileImage(reader.result)
    reader.readAsDataURL(file)
  }

  const handleSubmit = async e => {
    e.preventDefault()
    setNotification(null)

    // 1) confirm passwords match
    if (password !== confirmPassword) {
      setNotification({
        type: 'error',
        message: "Passwords don't match."
      })
      return
    }

    // 2) enforce strength: min 8 chars, uppercase, lowercase, number
    const pwRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/
    if (!pwRegex.test(password)) {
      setNotification({
        type: 'error',
        message:
          'Password must be at least 8 characters, include uppercase, lowercase & a number.'
      })
      return
    }

    // 3) submit to server
    const res = await fetch('/api/auth/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        username,
        email,
        password,
        confirmPassword,
        displayName,
        dateOfBirth,
        gender,
        bio,
        profileImage
      })
    })
    const payload = await res.json()

    if (!res.ok) {
      setNotification({
        type: 'error',
        message: payload.error || 'Registration failed'
      })
      return
    }

    setNotification({
      type: 'success',
      message: 'Account created successfully!'
    })
    setTimeout(() => router.push('/auth/login'), 1500)
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

      <div
        className="flex min-h-screen bg-gray-900 bg-cover bg-center"
        style={{ backgroundImage: "url('/images/baseImage.png')" }}
      >
        <div className="flex flex-1 items-center justify-center p-8 bg-black bg-opacity-50">
          <div className="w-full max-w-2xl bg-[#111827]  rounded-2xl shadow-lg p-8 space-y-6">
            <h2 className="text-3xl font-bold text-center text-white">
              Forge Your Saga’s Account 🖋️
            </h2>

            <form onSubmit={handleSubmit} className="space-y-4">
              <FloatingInput
                id="username"
                label="Username"
                value={username}
                onChange={e => setUsername(e.target.value)}
              />

              <FloatingInput
                id="email"
                label="Email"
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
              />

              <FloatingInput
                id="password"
                label="Password"
                type={showPw ? 'text' : 'password'}
                value={password}
                onChange={e => setPassword(e.target.value)}
                trailingIcon={
                  <button
                    type="button"
                    onClick={() => setShowPw(v => !v)}
                    className="text-gray-400"
                  >
                    {showPw ? <FiEyeOff /> : <FiEye />}
                  </button>
                }
              />

              <FloatingInput
                id="confirmPassword"
                label="Confirm Password"
                type="password"
                value={confirmPassword}
                onChange={e => setConfirmPassword(e.target.value)}
              />

              <FloatingInput
                id="displayName"
                label="Display Name"
                value={displayName}
                onChange={e => setDisplayName(e.target.value)}
              />

              <div>
                <label className="block text-sm text-gray-200 mb-1">
                  Date of Birth
                </label>
                <input
                  type="date"
                  value={dateOfBirth}
                  onChange={e => setDateOfBirth(e.target.value)}
                  className="w-full px-4 py-2 bg-gray-700 text-white rounded-lg"
                />
              </div>

              <div>
                <label className="block text-sm text-gray-200 mb-1">
                  Gender
                </label>
                <select
                  value={gender}
                  onChange={e => setGender(e.target.value)}
                  className="w-full px-4 py-2 bg-gray-700 text-white rounded-lg"
                >
                  <option value="">Select gender</option>
                  <option value="MALE">Male</option>
                  <option value="FEMALE">Female</option>
                  <option value="OTHER">Other</option>
                </select>
              </div>

              <div>
                <label className="block text-sm text-gray-200 mb-1">Bio</label>
                <textarea
                  value={bio}
                  onChange={e => setBio(e.target.value)}
                  rows={3}
                  className="w-full px-4 py-2 bg-gray-700 text-white rounded-lg"
                  placeholder="Tell us a bit about yourself…"
                />
              </div>

              <div>
                <label className="block text-sm text-gray-200 mb-1">
                  Avatar
                </label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleFile}
                  className="w-full text-gray-200"
                />
              </div>

              <Button
                type="submit"
                icon={FiUserPlus}
                text="Create Account"
                className="w-full justify-center"
              />
            </form>

            <div className="text-center mt-4">
              <Button
                onClick={() => router.push('/auth/login')}
                icon={FiBookOpen}
                text="Return to Login"
                className="w-full justify-center bg-gray-700 hover:bg-gray-600"
              />
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

/**
 * FloatingInput: floating-label wrapper for inputs
 */
function FloatingInput({
  id,
  label,
  type = 'text',
  value,
  onChange,
  trailingIcon = null
}) {
  return (
    <div className="relative">
      <input
        id={id}
        type={type}
        value={value}
        onChange={onChange}
        required
        className="w-full px-4 pt-6 pb-2 bg-gray-700 text-white rounded-lg border border-gray-600 peer"
        placeholder=" "
      />
      <label
        htmlFor={id}
        className="absolute left-4 top-2 text-gray-400 text-sm transition-all
                   peer-placeholder-shown:top-4 peer-placeholder-shown:text-base
                   peer-focus:top-2 peer-focus:text-sm"
      >
        {label}
      </label>
      {trailingIcon && (
        <div className="absolute right-3 top-3">
          {trailingIcon}
        </div>
      )}
    </div>
  )
}
