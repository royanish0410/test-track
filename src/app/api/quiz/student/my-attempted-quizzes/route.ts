import prisma from '@/lib/prisma';
import { auth } from '@clerk/nextjs/server';
import { NextResponse, NextRequest } from 'next/server'

export async function GET(request: NextRequest) {
    try {

        //User Id fetching
        const { userId } = await auth()

        if(!userId){
            return NextResponse.json({
                message:"No user id found, unauthorized access, please login"
            },{
                status:401
            })
        }

        //User Existence checking
        const existenceOfStudent = await prisma.user.findUnique({
            where:{
                clerkId:userId,
                role:"STUDENT"
            },
            select:{
                id:true
            }
        })

        if(!existenceOfStudent){
            return NextResponse.json({
                message:"No user found with the signed in userid to be student"
            },{
                status:403
            })
        }

        const myAttemptedQuizzes = await prisma.mockQuizAttempt.findMany({
            where:{
                studentId:existenceOfStudent.id
            },
            select:{
                id:true,
                completedAt:true,
                correctAnswers:true,
                mockQuiz:true,
                mockQuizId:true,
                score:true,
                status:true,
                totalQuestions:true,
                wrongAnswers:true
            }
        })

        if(!myAttemptedQuizzes){
            return NextResponse.json({
                message:"You have not attempted any quizzes"
            },{
                status:400
            })
        }

        return NextResponse.json({
            message:"My attempts fetched successfully",
            data:myAttemptedQuizzes
        },{
            status:200
        })
    } catch (error) {
        console.log('Error at fetching my attempted quizzes ::::: ');
        console.error(error);
        if (error && typeof error === 'object' && 'code' in error) {
            const code = (error as { code?: string }).code;
            if (code === 'P2025') {
                return NextResponse.json(
                    { error: 'User not found in database' },
                    { status: 404 }
                );
            }
        }
        if (error && typeof error === 'object' && 'status' in error) {
            const status = (error as { status?: number }).status;
            if (status === 404) {
                return NextResponse.json(
                    { error: 'Object not found in ....' },
                    { status: 404 }
                );
            }
        }
        return NextResponse.json({message:'Something Went Wrong during fetching my attempted quizzes.',error:error},{status:500});
    }
}