import { SignOutButton } from '@clerk/nextjs'
import React from 'react'

const Page = () => {
    return (
        <div className='min-h-screen w-full flex flex-col justify-center items-center bg-neutral-950 text-orange-50 text-6xl'>
        Student Dashboard
        <div>
            <SignOutButton>
                SIGNOUT
            </SignOutButton>
        </div>
        </div>
    )
}

export default Page
