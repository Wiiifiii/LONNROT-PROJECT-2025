'use client'

import React, { useState } from 'react'
import { signIn }             from 'next-auth/react'
import { useRouter }          from 'next/navigation'
import Button                 from '@/app/components/UI/Button'
import FloatingInput          from '@/app/components/UI/FloatingInput'
import {
  FiEye, FiEyeOff,
  FiLogIn, FiLock,
  FiUserPlus, FiBookOpen
}                             from 'react-icons/fi'

export default function LoginPage() {
  const router = useRouter()
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [showPw,   setShowPw]   = useState(false)
  const [errorMsg, setErrorMsg] = useState('')

  const handleSubmit = async e => {
    e.preventDefault()
    setErrorMsg('')
    const result = await signIn('credentials', {
      redirect: false,
      username,
      password,
    })
    if (result?.error) {
      setErrorMsg(result.error)
    } else {
      router.push('/')
    }
  }

  return (
    <div
      className="flex min-h-screen bg-gray-900 bg-cover bg-center"
      style={{ backgroundImage: "url('/images/baseImage.png')" }}
    >
      <div className="flex flex-1 items-center justify-center p-8 bg-black bg-opacity-50">
        <div className="w-full max-w-2xl bg-[#111827]  rounded-2xl shadow-lg p-8 space-y-6">

          <h2 className="text-3xl font-bold text-center text-white">
            Enter Väinämöinen’s Realm 🪙
          </h2>

          <form onSubmit={handleSubmit} className="space-y-4">
            <FloatingInput
              id="username"
              label="Username"
              value={username}
              onChange={e => setUsername(e.target.value)}
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

            {errorMsg && (
              <p className="text-red-500 text-center text-sm">{errorMsg}</p>
            )}

            <div className="flex flex-col gap-2">
              <Button
                type="submit"
                icon={FiLogIn}
                text="Sing the Song of Entry"
                className="w-full justify-center"
              />
              <Button
                type="button"
                onClick={() => router.push('/auth/forgot-password')}
                icon={FiLock}
                text="Forgotten Rune"
                className="w-full justify-center bg-gray-700 hover:bg-gray-600"
              />
            </div>
          </form>

          <div className="flex flex-col gap-2 text-center mt-4">
            <Button
              onClick={() => router.push('/auth/register')}
              icon={FiUserPlus}
              text="Forge Your Saga with Lönnrot’s Quill"
              className="w-full justify-center bg-gray-700 hover:bg-gray-600"
            />
            <Button
              onClick={() => router.push('/')}
              icon={FiBookOpen}
              text="Wander the Kalevala’s Lore, No Oath Required"
              className="w-full justify-center bg-gray-700 hover:bg-gray-600"
            />
          </div>

        </div>
      </div>
    </div>
  )
}
