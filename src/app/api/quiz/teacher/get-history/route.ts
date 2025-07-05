import prisma from '@/lib/prisma';
import { auth } from '@clerk/nextjs/server';
import { NextResponse, NextRequest } from 'next/server'

export async function GET(request: NextRequest) {
    try {
        // const { userId } = await auth();

        const userId = "user_2yOlSpFoolUR70E3G2y4B7oJmvC"

        const teacherExistence = await prisma.user.findUnique({
            where:{
                clerkId: userId,
                role: "TEACHER"
            },
            select:{
                id:true
            }
        })

        if(!teacherExistence){
            return NextResponse.json({
                message:"User Id not found or doesn't exist"
            },{
                status: 401 
            })
        }

        const pastQuizzes = await prisma.mockQuiz.findMany({
            where:{
                teacherId:teacherExistence.id,
                OR:[
                    {
                        isDeleted:true
                    },
                    {
                        endsAt:{
                            lt:new Date()
                        }
                    }
                ]
            },
        })

        if(!pastQuizzes){
            return NextResponse.json({
                message:"No Past record found"
            },{
                status:404
            })
        }

        return NextResponse.json({
            message:"Past Quizzes fetched successfully",
            data:pastQuizzes
        },{
            status:200
        })

    } catch (error) {
        console.log('Error at fetching past records ::::: ');
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
        return NextResponse.json({message:'Something Went Wrong during fetching past records.',error:error},{status:500});
    }
}