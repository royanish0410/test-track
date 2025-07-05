import prisma from '@/lib/prisma';
import { auth } from '@clerk/nextjs/server';
import { NextResponse, NextRequest } from 'next/server'

export async function DELETE(_: NextRequest, { params }: { params: Promise<{ subjectid: string }> }) {
    try {

        const { userId } = await auth();

        const existenceOfTeacher = await prisma.user.findUnique({
            where:{
                clerkId:userId,
                role:"TEACHER"
            },
            select:{
                id:true
            }
        })

        if(!existenceOfTeacher){
            return NextResponse.json({
                message: "User isn't authorized to perform this task."
            },{
                status: 401
            })
        }

        const { subjectid } = await params;
        
        if(!subjectid){
            return NextResponse.json({
                message: "No Subject id provided."
            },{
                status: 404
            })
        }

        const existenceOfSubject = await prisma.subject.findUnique({
            where:{
                id:subjectid
            },
            select:{
                id:true,
                isDeleted:true
            }
        })

        if(!existenceOfSubject){
            return NextResponse.json({
                message: "The Subject doesn't exists at all."
            },{
                status: 400
            })
        }

        if(existenceOfSubject.isDeleted){
            return NextResponse.json({
                message: "The subject is already deleted."
            },{
                status: 400
            })
        }

        const docsOfSubject = await prisma.mockQuiz.findMany({
            where:{
                quizsections:{
                    some:{
                        subjectId:subjectid
                    }
                },
                OR:[
                    {
                        isDeleted:false
                    },
                    {
                        endsAt: {
                            gte: new Date()
                        }
                    }
                ]
            },
        })

        const isEligibleToRemove = (docsOfSubject.length > 0);

        if(isEligibleToRemove){
            return NextResponse.json({
                message: "The Given Subject Id is associated with some quiz somewhere.",
                count: docsOfSubject.length,
                data: docsOfSubject
            },{
                status: 404
            })
        }

        const softDeleteMany = await prisma.mockQuiz.updateManyAndReturn({
            where: {
                quizsections:{
                    some:{
                        subjectId: subjectid
                    }
                },
                AND:[
                    {
                        isDeleted: true
                    },
                    {
                        endsAt: {
                            lt: new Date()
                        }
                    }
                ]
            },
            data: {
                isDeleted: true,
                deletedAt: new Date()
            },
            select:{
                id: true,
                name: true,
                teacher: true,
                createdAt: true,
                deletedAt: true,
                isDeleted: true
            }
        })

        if(!softDeleteMany){
            return NextResponse.json({
                message: "Softdeletion failed."
            },{
                status: 500
            })
        }

        const subjectDeleted = await prisma.subject.update({
            where: {
                id: subjectid
            },
            data: {
                isDeleted: true,
                deletedAt: new Date()
            }
        })

        return NextResponse.json({
            message: "Deleted the following quizzes along with the subject",
            data: softDeleteMany,
            subjectDeletion: subjectDeleted
        },{
            status:200
        })

    } catch (error) {
        console.log('Error at deleting subject ::::: ');
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
        return NextResponse.json({message:'Something Went Wrong during deleting subject.',error:error},{status:500});
    }
}