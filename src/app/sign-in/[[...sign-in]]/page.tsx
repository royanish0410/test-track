'use client'
import { useState } from 'react'
import { useSignIn} from '@clerk/nextjs'
import { useRouter } from 'next/navigation'

export default function SignIn() {
    const { isLoaded, signIn, setActive } = useSignIn()
    const [emailAddress, setEmailAddress] = useState('')
    const [password, setPassword] = useState('')
    const router = useRouter()

    const handleSubmit = async (e:React.FormEvent) => {
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
                redirectUrlComplete: (process.env.NEXT_PUBLIC_CLERK_FALLBACK_REDIRECT_URL) as string
            })
        } catch (err) {
            console.error('Error:', err)
        }
    }

    return (
        <div className="max-w-md mx-auto mt-8 p-6 bg-white rounded-lg shadow-md">
            <h1 className="text-2xl font-bold mb-6">Sign In</h1>

            <button
                onClick={signInWithGoogle}
                className="w-full mb-4 bg-red-500 text-white py-2 px-4 rounded-md hover:bg-red-600"
            >
                Sign in with Google
            </button>

            <div className="text-center mb-4">
                <span className="text-gray-500">or</span>
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
                    className="w-full px-3 py-2 border rounded-md"
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
                    className="w-full px-3 py-2 border rounded-md"
                />
                </div>

                <button
                type="submit"
                className="w-full bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600"
                >
                Sign In
                </button>
            </form>
        </div>
    )
}