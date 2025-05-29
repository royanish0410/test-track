'use client'
import { useEffect } from 'react'
import { useRouter } from 'next/navigation'

export default function SignUpSSOCallback() {
    const router = useRouter()

    useEffect(() => {
        router.push('/check-role')
    }, [router])

    return (
        <div className="max-w-md mx-auto mt-8 p-6 bg-white rounded-lg shadow-md">
            <div className="text-center">
                <h2 className="text-xl font-semibold mb-4">Account Created Successfully!</h2>
                <p>Setting up your account...</p>
            </div>
        </div>
    )
}