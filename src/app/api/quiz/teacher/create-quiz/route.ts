import prisma from '@/lib/prisma';
import { NextResponse, NextRequest } from 'next/server'

const generateTheNameString =(name:string,date:Date,number:number)=>{
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');

    return `${name}-${year}Y${month}M${number}N`;
}

export async function POST(request: NextRequest) {
    try {
        const requestBody = await request.json();
        const {
            subjectid,
            teacherclerkid,
            endsAt,
            duration,
            quizname
        } = requestBody;

        if(!teacherclerkid){
            return NextResponse.json({message:"Unauthorized access to create quiz. No teacher id provided"},{status:401});
        }

        const existenceOfTeacher = await prisma.user.findUnique({
            where:{
                clerkId:teacherclerkid,
                role:"TEACHER"
            },
            select:{
                id:true
            }
        })

        if(!existenceOfTeacher){
            return NextResponse.json({message:"No teacher exists with the given id."},{status:403});
        }

        if(!subjectid){
            return NextResponse.json({message:"No subject Id provided."},{status:400});
        }

        const existenceOfSubject = await prisma.subject.findUnique({
            where:{
                id:subjectid
            },
            select:{
                id:true,
                name:true,
            }
        })

        if(!existenceOfSubject){
            return NextResponse.json({message:"No such subject exists with the given id"},{status:400});
        }

        const endsAtDateType = new Date(endsAt);

        const quizLatestNumber = await prisma.quiz.aggregate({
            where:{
                subjectid:subjectid,
            },
            _count:{
                id:true
            },
            _max:{
                number:true
            }
        })

        const latestNumber = quizLatestNumber._count?.id === 0 ? 1 : (quizLatestNumber._max?.number ?? 1);

        const createResponse = await prisma.quiz.create({
            data:{
                name:quizname?quizname:generateTheNameString(existenceOfSubject.name, new Date(),latestNumber),
                duration:duration,
                endsAt:endsAtDateType,
                number:latestNumber,
                createdAt:new Date(),
                subjectid:subjectid,
                teacherid:existenceOfTeacher.id
            },
        })

        if(!createResponse){
            return NextResponse.json({
                message:"Quiz Creation Failed"
            },{
                status:500
            })
        }

        return NextResponse.json({
            message:"Quiz created successfully",
            data:createResponse
        },{
            status:201
        })
    } catch (error) {
        console.log("Error at creating Quiz ::::: ");
        console.error(error);
        return NextResponse.json({message:"Something Went Wrong during quiz creating",error:error},{status:500});
    }
}
