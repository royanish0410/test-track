import { NextResponse,NextRequest } from "next/server";
import { ClerkClient } from "@/lib/clerkClient";

export async function POST(req:NextRequest){
    try {
        const requestBody = await req.json();
        const {userId,role} = requestBody;
        
        if(!userId || !role){
            return NextResponse.json({error:"UserId or Role is not available"},{status:400});
        }

        const validRoles = ["STUDENT","TEACHER"]
        if(!validRoles.includes(role.toUpperCase())){
            return NextResponse.json({error:"Role is not valid type."},{status:400});
        }
        
        const updatedUser = await ClerkClient.users.updateUserMetadata(userId,{publicMetadata:{role:role.toUpperCase()}})

        console.log(updatedUser);

        return NextResponse.json({
            success:true,
            message:"User Role updated successful in the clerk",
        })
    } catch (error:any) {
        console.error('Error updating user role:', error);

        if (error.status === 404) {
            return NextResponse.json(
                { error: 'User not found in Clerk' },
                { status: 404 }
            );
        }
        if (error.code === 'P2025') {
            return NextResponse.json(
                { error: 'User not found in database' },
                { status: 404 }
            );
        }
        return NextResponse.json(
            { error: 'Failed to update user role' },
            { status: 500 }
        );
    }
}