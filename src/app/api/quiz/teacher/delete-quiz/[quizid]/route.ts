import prisma from '@/lib/prisma';
import { NextResponse, NextRequest } from 'next/server'

export async function DELETE(_: NextRequest,{ params }: { params: { quizid: string } }) {
    try {
        const { quizid } = await params;

        if(!quizid){
            return NextResponse.json({
                message:"No quizid mentioned",
            })
        }

        const existenceOfQuiz = await prisma.quiz.findUnique({
            where:{
                id:quizid
            },
            select:{
                id:true
            }
        })

        if(!existenceOfQuiz){
            return NextResponse.json({
                message:"No such quiz exists with the given id",
                id:quizid
            },{
                status:400
            })
        }

        const deleteResponse = await prisma.quiz.delete({
            where:{
                id:quizid
            }
        })

        if(!deleteResponse){
            return NextResponse.json({
                message:"Quiz deletion failed"
            },{
                status:500
            })
        }

        return NextResponse.json({
            message:"Delete of the quiz completed"
        },{
            status:202
        })
    } catch (error) {
        console.log("Error at deleting Quiz ::::: ");
        console.error(error);
        return NextResponse.json({message:"Something Went Wrong during quiz deleting",error:error},{status:500});
    }
}
