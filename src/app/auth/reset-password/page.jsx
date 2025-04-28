// src/app/auth/reset-password/page.jsx

import ResetPasswordForm from '@/app/components/Forms/ResetPasswordForm'

export default function ResetPasswordPage({ searchParams }) {
  const token = searchParams?.token || ''
  return <ResetPasswordForm token={token} />
}
