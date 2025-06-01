'use client'
import { useState, useEffect } from "react"
import { useUser } from "@clerk/nextjs"
import type { UserResource } from "@clerk/types"
import { useRouter } from "next/navigation"

const updateUserRole = async (role:string,user:UserResource) => {
    try {
        const response = await fetch('/api/users/set-role', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                userId: user.id,
                role: role
            })
        });

        const data = await response.json();

        if (!response.ok) {
            throw new Error('Failed to update role');
        }

        return data;
    } catch (error) {
        console.error('Error updating user role:', error);
        throw error;
    }
};

const Page = () => {

    const { isLoaded, user } = useUser();
    const [fullName, setFullName] = useState<string>("");
    const [role, setRole] = useState<string>("STUDENT");
    const router = useRouter();

    useEffect(()=>{
        if(isLoaded && user){
            setFullName(`${user.fullName||""} ${user.lastName||""}`.trim())
        }
    },[isLoaded,user]);

    const handleSubmit = async(e:React.FormEvent) => {
        e.preventDefault();
        if(!user) return;

        try {
            const [firstName,...lastNameParts] = fullName.split(' ');
            const lastName = lastNameParts.join(" ");

            await user.update({
                firstName,
                lastName,
            })

            await updateUserRole(role,user);

            router.push("/sign-in")
        } catch (error) {
            console.error('Error updating profile:', error)
        }
    }

    if (!isLoaded) return <div>Loading...</div>

    return (
        <div className="max-w-md mx-auto mt-8 p-6 bg-white rounded-lg shadow-md">
            <h1 className="text-2xl font-bold mb-6">Complete Your Profile</h1>
            <form onSubmit={handleSubmit}>
                <div className="mb-4">
                <label className="block text-sm font-medium mb-2">Full Name</label>
                <input
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    type="text"
                    required
                    className="w-full px-3 py-2 border rounded-md"
                />
                </div>

                <div className="mb-6">
                <label className="block text-sm font-medium mb-2">Role</label>
                <select
                    value={role}
                    onChange={(e) => setRole(e.target.value)}
                    className="w-full px-3 py-2 border rounded-md"
                >
                    <option value="STUDENT">STUDENT</option>
                    <option value="TEACHER">TEACHER</option>
                </select>
                </div>

                <button
                type="submit"
                className="w-full bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600"
                >
                Complete Profile
                </button>
            </form>
        </div>
    )
}

export default Page