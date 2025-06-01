"use client"
import { useSignUp } from "@clerk/nextjs"
import { useRouter } from "next/navigation"
import { useState } from "react"

export default function SignUp(){

    const {isLoaded,signUp} = useSignUp();
    const [emailaddress, setEmailaddress] = useState<string>("");
    const [password, setPassword] = useState<string>("");
    const [fullname, setfullname] = useState<string>("");
    const [pendingVerification, setPendingVerification] = useState<boolean>(false);
    const [code,setCode] = useState<string>("");
    const router = useRouter();

    const handleSubmit = async (e:React.FormEvent) => {
        e.preventDefault()
        if (!isLoaded) return

        try {
            await signUp.create({
                emailAddress:emailaddress,
                password,
                firstName: fullname.split(' ')[0],
                lastName: fullname.split(' ').slice(1).join(' '),
            })

            await signUp.prepareEmailAddressVerification({ strategy: 'email_code' })
            setPendingVerification(true)
        } catch (err) {
            console.error('Error:', err)
        }
    }

    const signUpWithGoogle = async () => {
        if (!isLoaded) return

        try {
            await signUp.authenticateWithRedirect({
                strategy: 'oauth_google',
                redirectUrl: '/sign-up/sso-callback',
                redirectUrlComplete: '/check-role'
            })
            
        } catch (err) {
            console.error('Error:', err)
        }
    }

    const onPressVerify = async (e:React.FormEvent) => {
        e.preventDefault()
        if (!isLoaded) return

        try {
            const completeSignUp = await signUp.attemptEmailAddressVerification({
                code,
            })
            
            if (completeSignUp.status !== 'complete') {
                console.log(JSON.stringify(completeSignUp, null, 2))
            }
            
            if (completeSignUp.status === 'complete') {
                router.push('/check-role');
            }
        } catch (err) {
            console.error('Error:', err)
        }
    }

    if (pendingVerification) {
        return (
        <div className="max-w-md mx-auto mt-8 p-6 bg-white rounded-lg shadow-md">
            <h1 className="text-2xl font-bold mb-6">Verify your email</h1>
            <form onSubmit={onPressVerify}>
            <div className="mb-4">
                <label className="block text-sm font-medium mb-2">
                Enter verification code
                </label>
                <input
                value={code}
                className="w-full px-3 py-2 border rounded-md"
                placeholder="Code..."
                onChange={(e) => setCode(e.target.value)}
                />
            </div>
            <button
                type="submit"
                className="w-full bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600"
            >
                Verify Email
            </button>
            </form>
        </div>
        )
    }

    return (
        <div className="max-w-md mx-auto mt-8 p-6 bg-white rounded-lg shadow-md">
            <h1 className="text-2xl font-bold mb-6">Sign Up</h1>
            
            <div id="clerk-captcha" data-cl-theme="dark" data-cl-size="flexible" data-cl-language="es-ES" />
            <button
                onClick={signUpWithGoogle}
                className="w-full mb-4 bg-red-500 text-white py-2 px-4 rounded-md hover:bg-red-600"
            >
                Sign up with Google
            </button>
            
            <div className="text-center mb-4">
                <span className="text-gray-500">or</span>
            </div>

            {/* Email/Password Form */}
            <form onSubmit={handleSubmit}>
                <div className="mb-4">
                <label className="block text-sm font-medium mb-2">Full Name</label>
                <input
                    onChange={(e) => setfullname(e.target.value)}
                    id="fullName"
                    name="fullName"
                    type="text"
                    required
                    className="w-full px-3 py-2 border rounded-md"
                    value={fullname}
                />
                </div>

                <div className="mb-4">
                <label className="block text-sm font-medium mb-2">Email</label>
                <input
                    onChange={(e) => setEmailaddress(e.target.value)}
                    id="email"
                    name="email"
                    type="email"
                    required
                    className="w-full px-3 py-2 border rounded-md"
                    value={emailaddress}
                />
                </div>

                <div className="mb-4">
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
                Sign Up
                </button>
            </form>
        </div>
    )
}