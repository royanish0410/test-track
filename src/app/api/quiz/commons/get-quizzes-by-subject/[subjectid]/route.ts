import prisma from '@/lib/prisma';
import { NextResponse, NextRequest } from 'next/server'

export async function GET(request: NextRequest, { params }: { params: { subjectid: string } }) {
    try {
        const { subjectid } = await params;

        if(!subjectid){
            return NextResponse.json({
                message:"No subject id provided in this route"
            },{
                status:400
            })
        }

        const existenceOfSubject = await prisma.subject.findUnique({
            where:{
                id:subjectid
            },
            select:{
                id:true,
                name:true,
                quizzes:true
            }
        })

        if(!existenceOfSubject){
            return NextResponse.json({
                message:"No such subject found on the given id.",
                id:subjectid
            },{
                status:404
            })
        }

        return NextResponse.json({
            message:"Fetching quizzess of the subject successful.",
            subjectQuiz:existenceOfSubject
        },{
            status:200
        })
    } catch (error) {

        console.log("Error at fetching Subject ::::: ");
        console.error(error);
        
        if (error && typeof error === 'object' && 'status' in error) {
            const status = (error as { status?: number }).status;
            if (status === 404) {
                return NextResponse.json(
                    { error: 'Object not found in ....' },
                    { status: 404 }
                );
            }
        }
        
        if (error && typeof error === 'object' && 'code' in error) {
            const code = (error as { code?: string }).code;
            if (code === 'P2025') {
                return NextResponse.json(
                    { error: 'Document not found in database' },
                    { status: 404 }
                );
            }
        }
        
        return NextResponse.json({message:"Something Went Wrong during quiz fetching",error:error},{status:500});
    }
}
