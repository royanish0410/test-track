import prisma from '@/lib/prisma';
import { NextResponse, NextRequest } from 'next/server'

export async function PATCH(request: NextRequest) {
    try {
        const url = new URL(request.url);
        const quizid = url.pathname.split("/").pop()
        const requestBody = await request.json();
        const {
            name,
            endsAt,
            duration
        } = requestBody;

        if(!quizid){
            return NextResponse.json({
                message:"No quizid mentioned"
            },{
                status:400
            });
        }

        if(!name && !endsAt && (!duration || duration===0)){
            return NextResponse.json({
                message:"No field to update provided",
            },{
                status:400
            });
        }

        const existenceOfQuiz = await prisma.mockQuiz.findUnique({
            where:{
                id:quizid,
            },
            select:{
                id:true,
                name:true,
                duration:true,
                endsAt:true
            }
        })

        if(!existenceOfQuiz){
            return NextResponse.json({
                message:"No such quiz document found on the given id",
                id:quizid
            },{
                status:400
            })
        }

        const updatedResponse = await prisma.mockQuiz.update({
            where:{
                id:quizid
            },
            data:{
                name: name?? existenceOfQuiz.name,
                endsAt: new Date(endsAt??existenceOfQuiz.endsAt),
                duration: duration?? existenceOfQuiz.duration
            }
        })

        if(!updatedResponse){
            return NextResponse.json({
                message:"Update failed",
            },{
                status:500
            })
        }

        return NextResponse.json({
            message:"Update Complete",
            data:updatedResponse
        },{
            status:202
        })
    } catch (error) {
        console.log("Error at updating Quiz ::::: ");
        console.error(error);
        return NextResponse.json({message:"Something Went Wrong during quiz updating",error:error},{status:500});
    }
}
