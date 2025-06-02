import prisma from '@/lib/prisma';
import { NextResponse, NextRequest } from 'next/server'

export async function PATCH(request: NextRequest, { params }: { params: { questionid: string } } ) {
    try {
        const { questionid } = await params;
        const requestBody = await request.json();
        const {
            heading,
            options,
            correctone
        } = requestBody;

        if(!questionid){
            return NextResponse.json({
                message:"No question id mentioned"
            },{
                status:400
            });
        }

        const existenceOfQuestion = await prisma.question.findUnique({
            where:{
                id:questionid
            },
            select:{
                id:true,
                heading:true,
                correctone:true,
                options:true
            }
        })

        if(!existenceOfQuestion){
            return NextResponse.json({
                message:"No question available with the given id",
                id:questionid
            },{
                status:400
            })
        }

        if(!Array.isArray(options)){
            return NextResponse.json({
                message:"Options Invalid Type or Length. Option must have at least 2 options.",
            },{
                status:400
            });
        }

        if(options.length >= 2){
            if(!options.includes(correctone)){
                return NextResponse.json({
                    message:"Correct Option must be one of the options",
                    options,
                    correctone
                },{
                    status:400
                })
            }
        }else{
            if(!existenceOfQuestion.options.includes(correctone)){
                return NextResponse.json({
                    message:"Correct Option must be one of the options",
                    options,
                    correctone
                },{
                    status:400
                })
            }
        }

        

        const updateQuestion = await prisma.question.update({
            where:{
                id:questionid
            },
            data:{
                heading: heading ?? existenceOfQuestion.heading,
                options: options.length===0?existenceOfQuestion.options:options,
                correctone: correctone ?? existenceOfQuestion.correctone
            }
        })
    } catch (error) {
        
    }
}
