import prisma from '@/lib/prisma';
import { NextResponse, NextRequest } from 'next/server'

export async function GET(request: NextRequest) {
    try {
        const { searchParams } = new URL(request.url);

        const subjectsRaw = searchParams.getAll("subjects"); // can be multiple subjects in the query
        const sortType = searchParams.get("sortType") || "ATIME"; // default if not provided
        const countRaw = searchParams.get("count") || "10"; // default 10 results

        const count = parseInt(countRaw);
        if (isNaN(count) || count <= 0) {
            return NextResponse.json({ error: "Invalid count value." }, { status: 400 });
        }

        let subjectIds: string[] = [];      
        if (subjectsRaw.length > 0) {
            const subjectsUpper = subjectsRaw.map((subj) => subj.toUpperCase());

            const matchingSubjects = await prisma.subject.findMany({
                where: { name: { in: subjectsUpper } },
                select: { id: true },
            });

            subjectIds = matchingSubjects.map((s) => s.id);

            // If no matching subjects, return empty result early
            if (subjectIds.length === 0) {  
                return NextResponse.json({ quizzes: [] });
            }
        }

        // Determine sort configuration
        let orderBy: any = {};
        switch (sortType) {
        case "ATIME":
            orderBy = { createdAt: "asc" };
            break;
        case "DTIME":
            orderBy = { createdAt: "desc" };
            break;
        case "ADUR":
            orderBy = { duration: "asc" };
            break;
        case "DDUR":
            orderBy = { duration: "desc" };
            break;
        case "AENDS":
            orderBy = { endsAt: "asc" };
            break;
        case "DENDS":
            orderBy = { endsAt: "desc" };
            break;
        default:
            return NextResponse.json({ error: "Invalid sortType." }, { status: 400 });
        }

        // Fetch quizzes
        const quizzesResponse = await prisma.quiz.findMany({
            where: subjectsRaw.length > 0 ? { subjectid: { in: subjectIds } } : {},
            orderBy,
            take: count,
            include: {
                ofsubject: true,
                teacher: { select: { id: true, fullname:true, email: true } },
            },
        });

        if(!quizzesResponse){
            return NextResponse.json({
                message:"Fetching failed"
            },{
                status:500
            })
        }

        return NextResponse.json({
            message:"Successful fetch",
            quizzesResponse,
            length:quizzesResponse.length
        },{
            status:200
        })
    } catch (error) {
        console.log('Error at --------- +++++++++ ::::: ');
        console.error(error);
        return NextResponse.json({message:'Something Went Wrong during --------- +++++++++.',error:error},{status:500});
    }
}