'use client'
import { useEffect } from 'react'
import { useRouter } from 'next/navigation'

export default function SignInSSOCallback() {
    const router = useRouter()

    useEffect(() => {
        // Redirect to check-role after OAuth sign-in completes
        router.push('/check-role')
    }, [router])

    return (
        <div className="max-w-md mx-auto mt-8 p-6 bg-white rounded-lg shadow-md">
            <div className="text-center">
                <h2 className="text-xl font-semibold mb-4">Welcome Back!</h2>
                <p>Redirecting you to your dashboard...</p>
            </div>
        </div>
    )
}