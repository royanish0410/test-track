import prisma from '@/lib/prisma';
import { NextResponse, NextRequest } from 'next/server'

export async function DELETE(_: NextRequest, { params }: { params: Promise<{ quizid: string }> }) {
    try {
        const { quizid } = await params;

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
                id:true,
                isDeleted:true
            }
        })

        if(!existenceOfQuiz){
            return NextResponse.json({
                message:"No such quiz exists with the given id or hard cleaned",
                id:quizid
            },{
                status:400
            })
        }

        if(existenceOfQuiz.isDeleted){
            return NextResponse.json({
                message:"The quiz of given id to delete is already deleted.",
                id:quizid
            },{
                status:403
            })
        }

        const deleteResponse = await prisma.mockQuiz.update({
            where:{
                id:quizid
            },
            data:{
                deletedAt: new Date(),
                isDeleted: true
            },
        })

        if(!deleteResponse){
            return NextResponse.json({
                message:"Quiz deletion failed",
                data:deleteResponse
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
