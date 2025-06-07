import prisma from '@/lib/prisma';
import { NextResponse, NextRequest } from 'next/server'

export async function GET(_: NextRequest) {
    try {
        const Subjects = await prisma.subject.findMany({
            select:{
                id:true,
                imgUrl:true,
                name:true,
            }
        })
        if(!Subjects){
            return NextResponse.json({
                message:"Subject fetching failed",
            },{
                status:500
            })
        }

        return NextResponse.json({
            message:"Successful Fetching Subjects",
            data:Subjects
        })
    } catch (error) {
        console.log('Error at fetcing Subjects ::::: ');
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
        return NextResponse.json({message:'Something Went Wrong during fetcing Subjects.',error:error},{status:500});
    }
}