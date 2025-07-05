import prisma from '@/lib/prisma';
import { auth } from '@clerk/nextjs/server';
import { NextResponse, NextRequest } from 'next/server'

const generateTheNameString =(name:string,date:Date,number:number)=>{
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');

    return `${name}-${year}Y${month}M${number}N`;
}

export async function POST(request: NextRequest) {
    try {

        // const {userId:teacherclerkid} = await auth();
        const teacherclerkid="user_2yOlSpFoolUR70E3G2y4B7oJmvC";
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

        const requestBody = await request.json();
        const {
            endsAt,
            duration,
            quizname,
            quizSections
        } = requestBody;

        if(duration === undefined || duration<=0){
            return NextResponse.json({
                message:"Invalid Duration type",
                duration
            },{
                status:400
            })
        }

        if(!quizSections || !Array.isArray(quizSections) || quizSections.length === 0){
            return NextResponse.json({
                message:"The quiz Section contains 0 elements or not in array type.",
                quizSections
            },{
                status:400
            })
        }

        if(!endsAt){
            return NextResponse.json({
                message:"Ending time of the quiz is not mentioned. It is a necessary field"
            },{
                status:400
            })
        }

        if((new Date(endsAt)).getTime() < (new Date()).getTime()){
            return NextResponse.json({
                message:"The Time stamp you have provided is of past value which is not acceptable."
            },{
                status:400
            })
        }

        const subjectIds = [...new Set(quizSections.map(section=>section.subjectId))];
        const existingSubjects = await prisma.subject.findMany({
            where:{
                id:{
                    in:subjectIds
                }
            },
            select:{
                id:true
            }
        })

        if(subjectIds.length !== existingSubjects.length){
            const missingSubjects = subjectIds.filter(id=>!existingSubjects.find(subject=>subject.id === id));
            return NextResponse.json({
                message:"Invalid subject ids provided, no such subject found on the given ids.",
                ids:missingSubjects
            },{
                status:404
            })
        }

        const teacherId = await prisma.user.findUnique({
            where:{
                clerkId:teacherclerkid,
                role:"TEACHER"
            },
            select:{
                id:true
            }
        })

        const lastQuiz = await prisma.mockQuiz.findFirst({
            where:{
                teacherId:teacherId.id
            },
            orderBy:{
                number:'desc'
            },
            select:{
                number:true
            }
        })
        const nextNumber = (lastQuiz?.number ?? 0) + 1;
        const quizName = quizname ?? generateTheNameString("MOCK-QUIZ",new Date(),nextNumber)

        //Transaction Initiation
        console.log("Transaction Inititated.")
        const result = await prisma.$transaction(async (tx)=>{

            //MockQuiz document creation
            console.log("Mock quiz document creating for the transaction")
            const mockQuizDoc = await tx.mockQuiz.create(
                {
                    data:{
                        name:quizName,
                        number:nextNumber,
                        endsAt: new Date(endsAt),
                        duration: duration,
                        teacherId:teacherId.id
                    },
                }
            )
            console.log(mockQuizDoc);
            console.log("Mock quiz document created")

            const quizSectionFinalDocuments = []

            //Creating QuizSections
            console.log("Creating... QuizSections")
            for(const section of quizSections){
                const {subjectId,questions} = section;
                const questionDocs = []

                console.log("Creating QuizSection for the subject ",subjectId)
                const quizSectionDocument = await tx.quizSection.create({
                    data:{
                        subjectId:subjectId,
                        mockQuizId:mockQuizDoc.id
                    }
                })
                console.log("Created... Quiz Document");
                console.log(quizSectionDocument);

                console.log("Creating... Questions");
                for(const Qs of questions){
                    const {question,options,correctone,questionImg} = Qs;
                    if(question && questionImg){
                        return NextResponse.json({
                            message:"Provide only one. Either question as text or questionImg URL."
                        },{
                            status:400
                        })
                    }
                    if(!question && !questionImg){
                        return NextResponse.json({
                            message:"Provide atleast something question or questionImgUrl.",
                        },{
                            status:400
                        })
                    }
                    const questionObj = await tx.question.create({
                        data:{
                            question:(question && !questionImg)?question:"",
                            questionImg:(!question && questionImg)?questionImg:"",
                            correctOne: correctone,
                            options:options 
                        },
                        select:{
                            id:true,
                            question:true,
                            correctOne:true,
                            options:true,
                            questionImg:true
                        }
                    })
                    console.log("Question document created");
                    console.log(questionObj)
                    const questionSection = await tx.questionSection.create({
                        data:{
                            questionId:questionObj.id,
                            quizSectionId:quizSectionDocument.id
                        }
                    })
                    console.log("Question Section (question-quizsection link) document created");
                    console.log(questionSection);
                    const questionSubject = await tx.questionSubject.create({
                        data:{
                            questionId:questionObj.id,
                            subjectId:subjectId
                        }
                    })
                    console.log("Question Subject (question-subject link) document created");
                    console.log(questionSubject);
                    questionDocs.push(questionObj);
                }

                quizSectionFinalDocuments.push({
                    quizSectionDocument,
                    questionDocs
                });
            }

            return {
                mockQuizDoc,
                quizSectionFinalDocuments
            }
        })

        return NextResponse.json({
            message:"Created quiz Successfully",
            data:result
        },{
            status:201
        })

    } catch (error) {
        console.log("Error at creating Quiz ::::: ");
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
        return NextResponse.json({message:"Something Went Wrong during quiz creating",error:error},{status:500});
    }
}
