import prisma from '@/lib/prisma';
import { auth } from '@clerk/nextjs/server';
import { NextResponse, NextRequest } from 'next/server'

export async function GET(_: NextRequest) {
    try {
        // const { userId } = await auth();

        const userId = "user_2xwfofyCl4SSZCDvnT6eqY6ntFj"

        if(!userId){
            return NextResponse.json({
                message:"No user Id provided, Unauthorized access."
            },{
                status:403
            })
        }

        const existenceOfStudent = await prisma.user.findUnique({
            where:{
                clerkId:userId,
                role:'STUDENT'
            },
            select:{
                id:true
            }
        })

        if(!existenceOfStudent){
            return NextResponse.json({
                message:"No user exists on the given Id",
                id:userId
            },{
                status:404
            })
        }

        const quizResult = await prisma.mockQuiz.findMany({
            where:{
                endsAt:{
                    gt: new Date()
                }
            },
            select:{
                id:true,
                endsAt:true,
                name:true,
                number:true,
                teacher:{
                    select:{
                        id:true,
                        fullname:true
                    }
                },
                quizsections:{
                    include:{
                        subject:{
                            select:{
                                id:true,
                                imgUrl:true,
                                name:true
                            }
                        },
                        questionSection:{
                            select:{
                                id:true,
                                question:{
                                    select:{
                                        id:true,
                                        question:true,
                                        questionImg:true,
                                        options:true
                                    }
                                }
                            }
                        }
                    }
                }
            }
        })

        if(!quizResult){
            return NextResponse.json({
                message:"Failed at fetching quizzes."
            },{
                status:500
            })
        }

        return NextResponse.json({
            message:"Quizzess Fetching successful",
            data:quizResult
        },{
            status:200
        })
    } catch (error) {
        console.log('Error at fetching Quizzes for students ::::: ');
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
        return NextResponse.json({message:'Something Went Wrong during fetching Quizzes for students.',error:error},{status:500});
    }
}