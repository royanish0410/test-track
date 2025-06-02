import prisma from '@/lib/prisma';
import { NextResponse, NextRequest } from 'next/server'

export async function GET(request: NextRequest) {
    try {
        const allSubjects = await prisma.subject.findMany({
            select:{
                id:true,
                name:true,
                quizzes:true
            }
        })

        if(!allSubjects){
            return NextResponse.json({
                message:"No document found in subject model"
            },{
                status:404
            })
        }

        return NextResponse.json({
            message:"Subject fetching successful.",
            data:allSubjects
        })
    } catch (error) {
        console.log('Error at --------- +++++++++ ::::: ');
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

        return NextResponse.json({message:'Something Went Wrong during --------- +++++++++.',error:error},{status:500});
    }
}