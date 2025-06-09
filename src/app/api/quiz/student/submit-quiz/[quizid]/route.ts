import prisma from '@/lib/prisma';
import { auth } from '@clerk/nextjs/server';
import { NextResponse, NextRequest } from 'next/server'

export async function POST(request: NextRequest) {
    try {

        //QuizId grabbing
        const url = new URL(request.url);
        const quizid = url.pathname.split("/").pop();

        if(!quizid){
            return NextResponse.json({
                message:"no quizid provided"
            },{
                status:400
            })
        }

        //User Id fetching
        const { userId } = await auth()

        if(!userId){
            return NextResponse.json({
                message:"No user id found, unauthorized access, please login"
            },{
                status:401
            })
        }

        //User Existence checking
        const existenceOfStudent = await prisma.user.findUnique({
            where:{
                clerkId:userId,
                role:"STUDENT"
            },
            select:{
                id:true
            }
        })

        if(!existenceOfStudent){
            return NextResponse.json({
                message:"No user found with the signed in userid to be student"
            },{
                status:403
            })
        }

        //Request Body extracting
        const requestBody = await request.json();
        const {
            answers
        } = requestBody ;

        //Answers validation
        if(!answers || !Array.isArray(answers) || answers.length === 0){
            return NextResponse.json({
                message:"Invalid body format, the answers must be array containing questionId and selectedAnswer objects"
            },{
                status:400
            })
        }

        //Fetch the attempted MockQuiz and check if it exists
        const mockQuizDoc = await prisma.mockQuiz.findUnique({
            where:{
                id: quizid
            },
            include:{
                quizsections:{
                    include:{
                        subject:true,
                        questionSection:{
                            include:{
                                question:true
                            }
                        }
                    }
                }
            }
        });

        if(!mockQuizDoc){
            return NextResponse.json({
                message:"With the given id no mock quiz found",
                id:quizid
            },{
                status:404
            })
        }

        //Proper Mappings SectionId to QuestionId: 
        const SectionIdToSubject = new Map(mockQuizDoc.quizsections.map(section=>[section.id,section.subject.name]))
        const SectionIdToQuestionId = new Map(mockQuizDoc.quizsections.map(section=>[section.id,section.questionSection.map(qS=>qS.questionId)]))
        
        //Questions and then, Original questionId to answer
        const questions = mockQuizDoc.quizsections.flatMap(section=>section.questionSection).map(q=>q.question)
        const OriginalQuestionIdToAnswerMap = new Map(questions.map(question=>[question.id,question.correctOne]));
        const OriginalQuestionIdToQuestion = new Map(questions.map(question=>[question.id,question.question]));

        //Incoming Answer Mapps:
        const answerMap = new Map(answers.map(a => [a.questionId, a.selectedAnswer]));
        const QuestionIdToTimeSpent = new Map(answers.map(a => [a.questionId,a.timeSpent]));

        //Student score and answer evaluating
        let CorrectAnswers=0,WrongAnswers=0;
        const StudentAnswerMap = new Map()

        for(const OriginalQuestionId of OriginalQuestionIdToAnswerMap.keys()){
            console.log(`Original id : ${OriginalQuestionId}`);
            console.log(`Original Answer by the id ${OriginalQuestionId} : ${OriginalQuestionIdToAnswerMap.get(OriginalQuestionId)}`)
            console.log(`Incoming Answer by the id ${OriginalQuestionId} : ${answerMap.get(OriginalQuestionId)}`)
            const isCorrect = OriginalQuestionIdToAnswerMap.get(OriginalQuestionId) === answerMap.get(OriginalQuestionId);
            console.log(isCorrect);

            isCorrect?CorrectAnswers++:WrongAnswers++;
            StudentAnswerMap.set(
                OriginalQuestionId,
                {
                    questionId:OriginalQuestionId,
                    question:OriginalQuestionIdToQuestion.get(OriginalQuestionId),
                    selectedAnswer:answerMap.get(OriginalQuestionId) ?? "",
                    isCorrect:isCorrect,
                    timeSpent:QuestionIdToTimeSpent.get(OriginalQuestionId) ?? 10
                }
            )
        }

        //Final Response drafting.
        const FinalResponse = new Map();
        for(const sectionId of SectionIdToQuestionId.keys()){
            const subject = SectionIdToSubject.get(sectionId);

            const questionIds = SectionIdToQuestionId.get(sectionId);
            const StudentAnswerDocs = questionIds.map(id=>StudentAnswerMap.get(id));

            FinalResponse.set(
                sectionId,
                {
                    subject:subject,
                    QuestionAnswers:StudentAnswerDocs
                }
            )
        }
        const FinalResponseJson = Object.fromEntries(FinalResponse);

        //Making a database transaction of MockQuiz Attempt and student answer.
        const transactionResult = await prisma.$transaction(async(tx)=>{

            const StudentAnswers = [];
            const MockQuizAttempDoc = await tx.mockQuizAttempt.create({
                data:{
                    score:CorrectAnswers,
                    status:CorrectAnswers>=WrongAnswers?'PASSED':'FAILED',
                    studentId:existenceOfStudent.id,
                    mockQuizId:quizid,
                    totalQuestions:questions.length,
                    correctAnswers:CorrectAnswers,
                    wrongAnswers:WrongAnswers,
                }
            })

            for(const QuestionId of StudentAnswerMap.keys()){
                const { selectedAnswer,isCorrect,timeSpent } = StudentAnswerMap.get(QuestionId);
                const StudentAnswerResponse = await tx.studentAnswer.create({
                    data:{
                        isCorrect:isCorrect,
                        selectedAnswer:selectedAnswer,
                        timeSpent:timeSpent,
                        questionId:QuestionId,
                        mockQuizAttemptId:MockQuizAttempDoc.id
                    }
                })
                StudentAnswers.push(StudentAnswerResponse);
            }

            return {
                MockQuizAttempDoc,
                StudentAnswers
            }
        })

        console.log(transactionResult.MockQuizAttempDoc);
        console.log(transactionResult.StudentAnswers);
        
        return NextResponse.json({
            message:"Student's Attempt has recorded successfully",
            data:FinalResponseJson,
            result:transactionResult.MockQuizAttempDoc
        },{
            status:202
        })

    } catch (error) {
        console.log('Error at creating Student attempt submission ::::: ');
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
                    { error: 'Object not found in model' },
                    { status: 404 }
                );
            }
        }

        return NextResponse.json({message:'Something Went Wrong during creating Student attempt submission.',error:error},{status:500});
    }
}