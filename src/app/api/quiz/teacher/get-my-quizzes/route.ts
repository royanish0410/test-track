import { NextResponse, NextRequest } from 'next/server'
import { auth, clerkClient } from '@clerk/nextjs/server';
import prisma from '@/lib/prisma';

export async function GET(request: NextRequest) {
    try {

        // const { userId } = await auth();
        const userId = "user_2xwfgayWB78AYK2m716oqB5fXoW";
        const teacherExistence = await prisma.user.findUnique({
            where:{
                clerkId:userId,
                role:'TEACHER'
            }
        })

        if(!teacherExistence){
            return NextResponse.json({
                message:"User with given id doesn't exist.",
                id:userId
            },{
                status:404
            })
        }

        const quizData = await prisma.mockQuiz.findMany({
            where:{
                teacherId:teacherExistence.id
            },
            include:{
                quizsections:{
                    include:{
                        questionSection:{
                            include:{
                                question:{
                                    select:{
                                        id:true,
                                        correctOne:true,
                                        options:true,
                                        question:true,
                                        questionImg:true,
                                    }
                                }
                            }
                        },
                        subject:{
                            select:{
                                id:true,
                                name:true,
                            }
                        }
                    },
                }
            }
        })

        if(!quizData){
            return NextResponse.json({
                message:"No Quiz Record found that is created by the user",
                id:userId
            },{
                status:404
            })
        }

        return NextResponse.json({
            message:"Quizzes Fetched successfully.",
            data:quizData
        },{
            status:200
        })
    } catch (error) {
        console.log('Error at fetching Quizzes for the user ::::: ');
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
                    { error: 'Documents not found in Database' },
                    { status: 404 }
                );
            }
        }
        return NextResponse.json({message:'Something Went Wrong during fetching Quizzes for the user.',error:error},{status:500});
    }
}