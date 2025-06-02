import prisma from '@/lib/prisma';
import { NextResponse, NextRequest } from 'next/server'

export async function POST(request: NextRequest,{ params }: { params: { quizid: string } }) {
    try {
        const { quizid } = await params;
        const requestBody = await request.json();
        const {
            heading,
            options,
            correctone
        } = requestBody;

        if(!quizid){
            return NextResponse.json({
                message:"No quiz id mentioned"
            },{
                status:400
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
                message:"No such quiz exists with the mentioned id",
                id:quizid
            },{
                status:400
            })
        }

        if(!heading || !correctone){
            return NextResponse.json({
                message:"Missing field either heading or correctone"
            },{
                status:400
            });
        }

        if(!Array.isArray(options) || options.length<2){
            return NextResponse.json({
                message:"Options Invalid Type or Length. Option must have at least 2 options.",
            },{
                status:400
            });
        }

        if(!options.includes(correctone)){
            return NextResponse.json({
                message:"Correct Option must be one of the options",
                options,
                correctone
            },{
                status:400
            })
        }

        const createQuestion = await prisma.question.create({
            data:{
                quizid:quizid,
                heading:heading,
                correctone:correctone,
                options:options,
            }
        })

        if(!createQuestion){
            return NextResponse.json({
                message:"Failed Creating Question"
            },{
                status:500
            })
        }

        return NextResponse.json({
            message:"Question Created successfully",
            data:createQuestion
        },{
            status:201
        })
    } catch (error) {
        console.log("Error at creating Question ::::: ");
        console.error(error);
        return NextResponse.json({message:"Something Went Wrong during creating question.",error:error},{status:500});
    }
}
