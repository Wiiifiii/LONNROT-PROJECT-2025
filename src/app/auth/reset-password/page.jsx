// 'use client';

// import { useState, Suspense, useEffect } from 'react';
// import { useSearchParams, useRouter } from 'next/navigation';
// import Button from '@/app/components/Button';

// function ResetPasswordForm() {
//   const params = useSearchParams();
//   const token  = params.get('token') ?? '';
//   const router = useRouter();

//   const [pw, setPw] = useState('');
//   const [confirm, setConfirm] = useState('');
//   const [error, setError] = useState('');
//   const [done, setDone] = useState(false);

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     if (pw !== confirm) {
//       setError('Passwords do not match');
//       return;
//     }
//     const res = await fetch('/api/reset-password', {
//       method: 'POST',
//       headers: { 'Content-Type': 'application/json' },
//       body: JSON.stringify({ token, newPassword: pw }),
//     });
//     const data = await res.json();
//     if (data.ok) {
//       setDone(true);
//       setTimeout(() => router.push('/auth/login'), 2000);
//     } else {
//       setError(data.error);
//     }
//   };

//   if (done) {
//     return (
//       <div className="max-w-md mx-auto p-6">
//         <p className="text-green-400 text-center">
//           Password reset! Redirecting to login…
//         </p>
//       </div>
//     );
//   }

//   return (
//     <div
//       className="flex min-h-screen bg-gray-900 bg-cover bg-center"
//       style={{ backgroundImage: "url('/images/LogInPage.png')" }}
//     >
//       <div className="flex flex-1 items-center justify-center p-8 bg-black bg-opacity-50">
//         <div className="w-full max-w-md bg-gray-800 rounded-2xl shadow-lg p-8 space-y-6">
//           <h2 className="text-2xl font-bold text-center text-white">
//             Set a new password
//           </h2>

//           {error && <p className="text-red-500 text-center">{error}</p>}

//           <form onSubmit={handleSubmit} className="space-y-4">
//             <div className="relative">
//               <input
//                 type="password"
//                 required
//                 placeholder=" "
//                 value={pw}
//                 onChange={(e) => setPw(e.target.value)}
//                 className="w-full px-4 pt-6 pb-2 bg-gray-700 text-white rounded-lg border border-gray-600 peer"
//               />
//               <label
//                 className="absolute left-4 top-2 text-gray-400 text-sm transition-all
//                            peer-placeholder-shown:top-4 peer-placeholder-shown:text-base
//                            peer-focus:top-2 peer-focus:text-sm"
//               >
//                 New password
//               </label>
//             </div>

//             <div className="relative">
//               <input
//                 type="password"
//                 required
//                 placeholder=" "
//                 value={confirm}
//                 onChange={(e) => setConfirm(e.target.value)}
//                 className="w-full px-4 pt-6 pb-2 bg-gray-700 text-white rounded-lg border border-gray-600 peer"
//               />
//               <label
//                 className="absolute left-4 top-2 text-gray-400 text-sm transition-all
//                            peer-placeholder-shown:top-4 peer-placeholder-shown:text-base
//                            peer-focus:top-2 peer-focus:text-sm"
//               >
//                 Confirm password
//               </label>
//             </div>

//             <Button type="submit" text="Reset password" className="w-full justify-center" />
//           </form>

//           <div className="text-center">
//             <Button
//               onClick={() => router.push('/auth/login')}
//               text="Back to login"
//               className="w-full justify-center bg-gray-700 hover:bg-gray-600"
//             />
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }

// export default function ResetPasswordPage() {
//   return (
//     <Suspense fallback={<div>Loading...</div>}>
//       <ResetPasswordForm />
//     </Suspense>
//   );
// }


import ComingSoon from "@/app/components/ComingSoon";

export default function FooBarPage() {
  return <ComingSoon featureName="Foo / Bar" />;
}
