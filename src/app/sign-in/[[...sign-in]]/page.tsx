'use client'

import { useState } from 'react'
import { useSignIn } from '@clerk/nextjs'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'

export default function SignIn() {
  const { isLoaded, signIn, setActive } = useSignIn()
  const [emailAddress, setEmailAddress] = useState('')
  const [password, setPassword] = useState('')
  const [darkMode, setDarkMode] = useState(false)
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!isLoaded) return

    try {
      const result = await signIn.create({
        identifier: emailAddress,
        password,
      })

      if (result.status === 'complete') {
        await setActive({ session: result.createdSessionId })
        router.push('/check-role')
      } else {
        console.log(result)
      }
    } catch (err) {
      console.error('Error:', err)
    }
  }

  const signInWithGoogle = async () => {
    if (!isLoaded) return

    try {
      await signIn.authenticateWithRedirect({
        strategy: 'oauth_google',
        redirectUrl: '/sign-in/sso-callback',
        redirectUrlComplete: process.env.NEXT_PUBLIC_CLERK_FALLBACK_REDIRECT_URL as string,
      })
    } catch (err) {
      console.error('Error:', err)
    }
  }

  return (
    <div
      className={`relative min-h-screen px-4 py-10 transition-all duration-300 ${
        darkMode
          ? 'bg-gradient-to-bl from-gray-900 to-gray-800 text-white'
          : 'bg-gradient-to-bl from-pink-100 via-white to-blue-100 text-gray-900'
      }`}
    >
      {/* Background Bubbles */}
      <motion.div
        className="absolute -top-28 -left-28 w-[250px] h-[250px] bg-purple-300 rounded-full filter blur-3xl opacity-40 animate-pulse z-0"
        animate={{ scale: [1, 1.1, 1], opacity: [0.4, 0.6, 0.4] }}
        transition={{ duration: 6, repeat: Infinity }}
      />
      <motion.div
        className="absolute -bottom-28 -right-28 w-[250px] h-[250px] bg-yellow-300 rounded-full filter blur-3xl opacity-40 animate-pulse z-0"
        animate={{ scale: [1, 1.1, 1], opacity: [0.4, 0.6, 0.4] }}
        transition={{ duration: 6, repeat: Infinity }}
      />

      {/* Header */}
      <div className="relative z-10 flex justify-between items-center mb-8">
        <motion.h1
          className="text-2xl sm:text-3xl font-bold w-full text-center"
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
           Sign In
        </motion.h1>

        <motion.button
          onClick={() => setDarkMode(!darkMode)}
          className="absolute right-2 top-0 p-2 rounded-full bg-white text-xl shadow-md sm:right-4"
          whileTap={{ scale: 0.9 }}
        >
          {darkMode ? '☀️' : '🌙'}
        </motion.button>
      </div>

      {/* Sign-in Card */}
      <div className="max-w-md mx-auto z-10 relative">
        <motion.div
          className={`rounded-xl p-6 border shadow-md transition-all duration-300 ${
            darkMode ? 'bg-gray-700 text-white' : 'bg-white text-gray-800'
          }`}
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.4 }}
        >
          <button
            onClick={signInWithGoogle}
            className={`w-full mb-4 py-2 px-4 rounded-md font-semibold transition-colors ${
              darkMode
                ? 'bg-red-600 text-white hover:bg-red-700'
                : 'bg-red-500 text-white hover:bg-red-600'
            }`}
          >
            Sign in with Google
          </button>

          <div className="text-center mb-4">
            <span className="text-gray-500 dark:text-gray-300">or</span>
          </div>

          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <label className="block text-sm font-medium mb-2">Email</label>
              <input
                onChange={(e) => setEmailAddress(e.target.value)}
                id="email"
                name="email"
                type="email"
                required
                className="w-full px-3 py-2 border rounded-md bg-transparent focus:outline-none focus:ring-2 focus:ring-blue-400"
              />
            </div>

            <div className="mb-6">
              <label className="block text-sm font-medium mb-2">Password</label>
              <input
                onChange={(e) => setPassword(e.target.value)}
                id="password"
                name="password"
                type="password"
                required
                className="w-full px-3 py-2 border rounded-md bg-transparent focus:outline-none focus:ring-2 focus:ring-blue-400"
              />
            </div>

            <button
              type="submit"
              className={`w-full py-2 px-4 rounded-md font-semibold transition-colors ${
                darkMode
                  ? 'bg-blue-600 text-white hover:bg-blue-700'
                  : 'bg-blue-500 text-white hover:bg-blue-600'
              }`}
            >
              Sign In
            </button>
          </form>
        </motion.div>
      </div>
    </div>
  )
}
