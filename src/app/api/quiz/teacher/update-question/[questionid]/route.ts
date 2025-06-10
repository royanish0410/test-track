import prisma from '@/lib/prisma';
import { NextResponse, NextRequest } from 'next/server'

export async function PATCH(request: NextRequest, { params }: { params: Promise<{ questionid:string }> }) {
    try {
        const { questionid } = await params;

        const requestBody = await request.json();
        const {
            question,
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
                question:true,
                correctOne:true,
                options:true
            }
        })

        if(!existenceOfQuestion){
            return NextResponse.json({
                message:"No question available with the given id",
                id:questionid
            },{
                status:404
            })
        }

        if(!Array.isArray(options) || options.length <= 1 ){
            return NextResponse.json({
                message:"Options Invalid Type or Length. Option must have at least 2 options.",
            },{
                status:400
            });
        }

        if(options.length >= 2){
            if(!options.includes(correctone)){
                return NextResponse.json({
                    message:"Correct Option must be one of the options if you want to update the options entirely.",
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
                id:questionid,
            },
            data:{
                question: (question===""?null:question )?? existenceOfQuestion.question,
                options: options.length===0?existenceOfQuestion.options:options,
                correctOne: correctone ?? existenceOfQuestion.correctOne
            }
        })

        if(!updateQuestion){
            return NextResponse.json({
                message:"Question Updated Failed."
            },{
                status:500
            })
        
        }
        return NextResponse.json({
            message:"Question Updated successfully.",
            oldQuestionModel:existenceOfQuestion,
            updateData:updateQuestion
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
        return NextResponse.json({message:"Something Went Wrong during quiz deleting",error:error},{status:500});
    }
}
