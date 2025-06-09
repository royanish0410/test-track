# Fetch Quizzes for student
## Method: GET
## Route: /api/quiz/student/get-quizzess

This route doesn't takes anything on body, it returns the active quizzes.

## Request Body >
```
{}
```
## Response Body >
```
{
    "message": "Quizzess Fetching successful",
    "data": [
        {
            "id": "700dbb97-b60a-4c07-8871-c6095356d4aa",
            "endsAt": "2025-06-25T12:30:00.000Z",
            "name": "Physics Fundamental Exam",
            "number": 1,
            "teacher": {
                "id": "362b103d-0b2c-40d4-b014-e2f5a94e842a",
                "fullname": "Debasish Sahu"
            },
            "quizsections": [
                {
                    "id": "80aac8e3-0b05-4d31-bf35-0ad066c68cf0",
                    "createdAt": "2025-06-06T19:25:31.180Z",
                    "updatedAt": "2025-06-06T19:25:31.180Z",
                    "subjectId": "9df34f7c-1cfe-4d05-bf7b-fa8a00ae6744",
                    "mockQuizId": "700dbb97-b60a-4c07-8871-c6095356d4aa",
                    "subject": {
                        "id": "9df34f7c-1cfe-4d05-bf7b-fa8a00ae6744",
                        "imgUrl": null,
                        "name": "PHYSICS"
                    },
                    "questionSection": [
                        {
                            "id": "ccf77092-e6c4-4308-8faa-8185bc6c8a85",
                            "question": {
                                "id": "45f9e319-b107-492f-8187-b0b0a2342536",
                                "question": "An object is placed 15 cm in front of a concave mirror of focal length 10 cm. What is the nature and position of the image formed?",
                                "questionImg": null,
                                "options": [
                                    "Real, inverted and 30 cm behind the mirror",
                                    "Virtual, erect and 30 cm behind the mirror",
                                    "Real, inverted and 30 cm in front of the mirror",
                                    "Virtual, erect and 30 cm in front of the mirror"
                                ]
                            }
                        },
                        {
                            "id": "1b45bfe6-7921-4352-9f87-b26ab5cb24eb",
                            "question": {
                                "id": "1fdd3960-72a6-4f89-880c-8e0072d23641",
                                "question": "Why do we feel heavier when an elevator suddenly starts going up?",
                                "questionImg": null,
                                "options": [
                                    "Gravity becomes stronger",
                                    "The floor pushes us up with more force",
                                    "Our weight increases permanently",
                                    "Air pressure increases"
                                ]
                            }
                        },
                        {
                            "id": "edc6f267-c351-412e-95ac-adf1d6810b4b",
                            "question": {
                                "id": "f52f7657-8ba7-4643-a1f2-5a3364c3fd3b",
                                "question": "Why does a metal spoon feel colder than a wooden spoon at the same room temperature?",
                                "questionImg": null,
                                "options": [
                                    "Metal is heavier than wood",
                                    "Metal conducts heat away from your hand faster",
                                    "Wood absorbs more heat",
                                    "Wood is always warmer"
                                ]
                            }
                        },
                        {
                            "id": "51a7e784-feaf-432f-aa46-c9cddb4d11bd",
                            "question": {
                                "id": "2930bf8a-b7cd-4f5a-8884-968a1d094927",
                                "question": "Why is it easier to push a trolley on a smooth floor than on a rough one?",
                                "questionImg": null,
                                "options": [
                                    "The trolley is lighter on a smooth floor",
                                    "Smooth floors have less friction",
                                    "Gravity is weaker on smooth surfaces",
                                    "Wheels don't work on rough floors"
                                ]
                            }
                        },
                        {
                            "id": "c0a31d4a-c3e0-4bf0-a507-d3cb37cb5a2e",
                            "question": {
                                "id": "512743f2-c766-4132-9b67-c2e1df991431",
                                "question": "Why do objects float in water but sink in oil sometimes?",
                                "questionImg": null,
                                "options": [
                                    "Water is colder than oil",
                                    "Oil is sticky",
                                    "Water can hold objects better",
                                    "Water is denser than oil"
                                ]
                            }
                        }
                    ]
                }
            ]
        },
    ]
}
```
***
# SUBMIT QUIZ
## Method: POST
## Route: /api/quiz/student/submit-quiz/:quizid

## Request Body >
```
{
    answers:[
        {
            questionId:"",
            selectedAnswer:"",
            timeSpent:15
        },
        {
            questionId:"",
            selectedAnswer:"",
            timeSpent:15
        },
        ....
        {
            questionId:"",
            selectedAnswer:"",
            timeSpent:15
        },
    ]
}
```
## Response Body >
```
{
    "message": "Student's Attempt has recorded successfully",
    "data": {
        "80aac8e3-0b05-4d31-bf35-0ad066c68cf0": {
            "subject": "PHYSICS",
            "QuestionAnswers": [
                {
                    "questionId": "45f9e319-b107-492f-8187-b0b0a2342536",
                    "question": "An object is placed 15 cm in front of a concave mirror of focal length 10 cm. What is the nature and position of the image formed?",
                    "selectedAnswer": "Real, inverted and 30 cm in front of the mirror",
                    "isCorrect": true,
                    "timeSpent": 10
                },
                {
                    "questionId": "1fdd3960-72a6-4f89-880c-8e0072d23641",
                    "question": "Why do we feel heavier when an elevator suddenly starts going up?",
                    "selectedAnswer": "The floor pushes us up with more force",
                    "isCorrect": true,
                    "timeSpent": 10
                },
                {
                    "questionId": "f52f7657-8ba7-4643-a1f2-5a3364c3fd3b",
                    "question": "Why does a metal spoon feel colder than a wooden spoon at the same room temperature?",
                    "selectedAnswer": "",
                    "isCorrect": false,
                    "timeSpent": 10
                },
                {
                    "questionId": "2930bf8a-b7cd-4f5a-8884-968a1d094927",
                    "question": "Why is it easier to push a trolley on a smooth floor than on a rough one?",
                    "selectedAnswer": "Wheels don't work on rough floors",
                    "isCorrect": false,
                    "timeSpent": 10
                },
                {
                    "questionId": "512743f2-c766-4132-9b67-c2e1df991431",
                    "question": "Why do objects float in water but sink in oil sometimes?",
                    "selectedAnswer": "Water is denser than oil",
                    "isCorrect": true,
                    "timeSpent": 10
                }
            ]
        }
    },
    "result": {
        "id": "aa13865f-b4a6-4325-b770-15b688902307",
        "score": 3,
        "status": "PASSED",
        "studentId": "6755b163-8967-4eeb-b7a0-c715570b4aac",
        "mockQuizId": "700dbb97-b60a-4c07-8871-c6095356d4aa",
        "totalQuestions": 5,
        "correctAnswers": 3,
        "wrongAnswers": 2,
        "attemptedAt": "2025-06-09T18:52:01.673Z",
        "completedAt": null
    }
}
```
***
# Check Student's eligibility for the quiz
## Method: GET
## Route: /api/quiz/student/eligible-to-attempt/:quizid

## Request Body >
```
{}
```
## Response Body >
```
{
    "message": "User has already attempted it.",
    "attemptStatus": true
}
```
***
# Get the overall attempt information of the Student
## Method: GET
## Route: /api/quiz/student/my-attempted-quizzes/


## Request Body >
```
{}
```
## Response Body >
```
{
    "message": "My attempts fetched successfully",
    "data": [
        {
            "id": "aa13865f-b4a6-4325-b770-15b688902307",
            "completedAt": null,
            "correctAnswers": 3,
            "mockQuiz": {
                "id": "700dbb97-b60a-4c07-8871-c6095356d4aa",
                "name": "Physics Fundamental Exam",
                "number": 1,
                "endsAt": "2025-06-25T12:30:00.000Z",
                "duration": 7,
                "teacherId": "362b103d-0b2c-40d4-b014-e2f5a94e842a",
                "createdAt": "2025-06-06T19:25:31.084Z",
                "updatedAt": "2025-06-06T19:25:31.084Z"
            },
            "mockQuizId": "700dbb97-b60a-4c07-8871-c6095356d4aa",
            "score": 3,
            "status": "PASSED",
            "totalQuestions": 5,
            "wrongAnswers": 2
        },
        {
            "id": "ccf12237-7f73-4659-a67a-f233595ce72b",
            "completedAt": null,
            "correctAnswers": 4,
            "mockQuiz": {
                "id": "02d831b2-c0eb-45e6-92c1-54f759535f4b",
                "name": "All Fundamentals Exam",
                "number": 2,
                "endsAt": "2025-07-13T12:30:00.000Z",
                "duration": 45,
                "teacherId": "362b103d-0b2c-40d4-b014-e2f5a94e842a",
                "createdAt": "2025-06-06T19:35:28.230Z",
                "updatedAt": "2025-06-07T11:23:53.466Z"
            },
            "mockQuizId": "02d831b2-c0eb-45e6-92c1-54f759535f4b",
            "score": 4,
            "status": "FAILED",
            "totalQuestions": 15,
            "wrongAnswers": 11
        }
    ]
}
```
***
# Get the detailed of specific attempt information of the Student
## Method: GET
## Route: /api/quiz/student/my-attempted-quizzes/:attemptId


## Request Body >
```
{}
```
## Response Body >
```
{
    "message": "My attempts fetched successfully",
    "data": {
        "id": "aa13865f-b4a6-4325-b770-15b688902307",
        "score": 3,
        "status": "PASSED",
        "studentId": "6755b163-8967-4eeb-b7a0-c715570b4aac",
        "mockQuizId": "700dbb97-b60a-4c07-8871-c6095356d4aa",
        "totalQuestions": 5,
        "correctAnswers": 3,
        "wrongAnswers": 2,
        "attemptedAt": "2025-06-09T18:52:01.673Z",
        "completedAt": null,
        "mockQuiz": {
            "id": "700dbb97-b60a-4c07-8871-c6095356d4aa",
            "name": "Physics Fundamental Exam",
            "number": 1,
            "endsAt": "2025-06-25T12:30:00.000Z",
            "duration": 7,
            "teacherId": "362b103d-0b2c-40d4-b014-e2f5a94e842a",
            "createdAt": "2025-06-06T19:25:31.084Z",
            "updatedAt": "2025-06-06T19:25:31.084Z"
        },
        "studentAnswers": [
            {
                "id": "e7fc498c-4b78-4332-98c2-bf3ecdab9a00",
                "mockQuizAttemptId": "aa13865f-b4a6-4325-b770-15b688902307",
                "questionId": "45f9e319-b107-492f-8187-b0b0a2342536",
                "selectedAnswer": "Real, inverted and 30 cm in front of the mirror",
                "isCorrect": true,
                "timeSpent": 10,
                "createdAt": "2025-06-09T18:52:01.739Z"
            },
            {
                "id": "47991869-d5db-44a3-959d-0797a8b8719b",
                "mockQuizAttemptId": "aa13865f-b4a6-4325-b770-15b688902307",
                "questionId": "1fdd3960-72a6-4f89-880c-8e0072d23641",
                "selectedAnswer": "The floor pushes us up with more force",
                "isCorrect": true,
                "timeSpent": 10,
                "createdAt": "2025-06-09T18:52:01.799Z"
            },
            {
                "id": "8e4b78ca-e1f4-4340-a95c-bf129b1447ae",
                "mockQuizAttemptId": "aa13865f-b4a6-4325-b770-15b688902307",
                "questionId": "f52f7657-8ba7-4643-a1f2-5a3364c3fd3b",
                "selectedAnswer": "",
                "isCorrect": false,
                "timeSpent": 10,
                "createdAt": "2025-06-09T18:52:01.862Z"
            },
            {
                "id": "bb6ff6fc-f196-4082-a9c6-8c63e6f578ff",
                "mockQuizAttemptId": "aa13865f-b4a6-4325-b770-15b688902307",
                "questionId": "2930bf8a-b7cd-4f5a-8884-968a1d094927",
                "selectedAnswer": "Wheels don't work on rough floors",
                "isCorrect": false,
                "timeSpent": 10,
                "createdAt": "2025-06-09T18:52:01.922Z"
            },
            {
                "id": "decaf89d-c797-48ab-a6d6-09a8c601c6d1",
                "mockQuizAttemptId": "aa13865f-b4a6-4325-b770-15b688902307",
                "questionId": "512743f2-c766-4132-9b67-c2e1df991431",
                "selectedAnswer": "Water is denser than oil",
                "isCorrect": true,
                "timeSpent": 10,
                "createdAt": "2025-06-09T18:52:01.985Z"
            }
        ]
    }
}
```
***