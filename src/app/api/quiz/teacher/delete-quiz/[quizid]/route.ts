import prisma from '@/lib/prisma';
import { NextResponse, NextRequest } from 'next/server'

export async function DELETE(request: NextRequest) {
    try {
        const url = new URL(request.url);
        const quizid = url.pathname.split("/").pop()

        if(!quizid){
            return NextResponse.json({
                message:"No quizid mentioned",
            })
        }

        const existenceOfQuiz = await prisma.mockQuiz.findUnique({
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

        const deleteResponse = await prisma.mockQuiz.delete({
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
        if (error && typeof error === 'object' && 'code' in error) {
            const code = (error as { code?: string }).code;
            if (code === 'P2025') {
                return NextResponse.json(
                    { error: 'Document not found in database' },
                    { status: 404 }
                );
            }
        }
        if (error && typeof error === 'object' && 'status' in error) {
            const status = (error as { status?: number }).status;
            if (status === 404) {
                return NextResponse.json(
                    { error: 'Object not found in mock quiz model' },
                    { status: 404 }
                );
            }
        }
        return NextResponse.json({message:"Something Went Wrong during quiz deleting",error:error},{status:500});
    }
}
