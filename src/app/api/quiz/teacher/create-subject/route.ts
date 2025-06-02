import prisma from '@/lib/prisma';
import { NextResponse, NextRequest } from 'next/server'

export async function POST(request: NextRequest) {
    try {
        const requestbody = await request.json();
        const {
            subjectName,
        } = requestbody;

        if(!subjectName){
            return NextResponse.json({message:"No subject name provided"},{status:400});
        }

        const createResponse = await prisma.subject.create({
            data:{
                name:(subjectName as string).toUpperCase(),
            },
            select:{
                id:true,
                name:true
            }
        })

        if(!createResponse){
            return NextResponse.json({message:"Subject document creation failed."},{status:500});
        }

        return NextResponse.json({message:"Document creation successful",data:createResponse},{status:201})
    } catch (error) {
        console.log("Error at creating Subject ::::: ");
        console.error(error);
        return NextResponse.json({message:"Something Went Wrong during subject creation",error:error},{status:500});
    }
}
