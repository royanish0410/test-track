import prisma from '@/lib/prisma';
import { NextResponse, NextRequest } from 'next/server'

export async function GET(request: NextRequest, { params }: { params: { quizid: string } }) {
    try {
        const { quizid } = await params;

        if(!quizid){
            return NextResponse.json({
                message: "No mention of quizid in this route"
            },{
                status:400
            })
        }

        const existenceOfQuiz = await prisma.quiz.findUnique({
            where:{
                id:quizid
            },select:{
                createdAt:true,
                duration:true,
                endsAt:true,
                id:true,
                name:true,
                number:true,
                ofsubject:true,
                questionmodel:true,
                quizattempts:true,
                subjectid:true,
                teacher:true,
                teacherid:true,
                updatedAt:true,
                _count:true
            }
        })

        if(!existenceOfQuiz){
            return NextResponse.json({
                message:"No quiz document found on this mentioned id.",
                id:quizid
            },{
                status:404
            })
        }

        return NextResponse.json({
            message:"Fetching quiz document successful.",
            data:existenceOfQuiz
        },{
            status:200
        })
    } catch (error) {
        console.log("Error at fetching Subject ::::: ");
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
                    { error: 'Object not found in ....' },
                    { status: 404 }
                );
            }
        }

        return NextResponse.json({message:"Something Went Wrong during subject fetching",error:error},{status:500});
    }
}
