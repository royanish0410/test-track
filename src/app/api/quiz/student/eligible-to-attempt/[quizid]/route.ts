import prisma from '@/lib/prisma';
import { auth } from '@clerk/nextjs/server';
import { NextResponse, NextRequest } from 'next/server'

export async function GET(_: NextRequest,{ params }: { params: { quizid: string } }) {
    try {

        //QuizId grabbing
        const { quizid } = await params;

        if(!quizid){
            return NextResponse.json({
                message:"no quizid provided"
            },{
                status:400
            })
        }

        //User Id fetching
        const { userId } = await auth()
        
        if(!userId){
            return NextResponse.json({
                message:"No user id found, unauthorized access, please login"
            },{
                status:401
            })
        }

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

        const findEligible = await prisma.mockQuizAttempt.findFirst({
            where:{
                mockQuizId:quizid,
                studentId:existenceOfStudent.id
            }
        })

        if(findEligible){
            return NextResponse.json({
                message:"User has already attempted it.",
                attemptStatus:true
            },{
                status:200
            })
        }

        return NextResponse.json({
            message:"User can attempt the quiz",
            attemptStatus:false
        },{
            status:200
        })
    } catch (error) {
        console.log('Error at --------- +++++++++ ::::: ');
        console.error(error);
        return NextResponse.json({message:'Something Went Wrong during --------- +++++++++.',error:error},{status:500});
    }
}