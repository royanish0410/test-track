# Subject Creating
## Method: POST 
## Route: /api/quiz/teacher/create-subject/

## Request Body >
```
{
  "subjectName":"Chemistry"
}
```
## Response Body >

```
{
    "message": "Document creation successful",
    "data": {
        "id": "2811e348-aadf-4b4e-bde3-22ffdbd59363",
        "name": "MATH"
    }
}
```
***
# Quiz Creating
## Method: POST
## Route: /api/quiz/teacher/create-quiz/route.ts

## Request Body >
```
{
    "quizname":"All Fundamentals Exam",
    "endsAt":"2025-07-13T12:30:00Z",
    "duration":7,
    "teacherclerkid":"user_2xwfgayWB78AYK2m716oqB5fXoW",
    "quizSections":[
        {
            "subjectId":"9df34f7c-1cfe-4d05-bf7b-fa8a00ae6744",
            "questions":[
                {
                    "question":"What happens to a ball when you drop it from a height?",
                    "options":[
                        "It floats in the air",
                        "It stays still",
                        "It falls to the ground",
                        "It moves upward"
                    ],
                    "correctone":"It falls to the ground"
                },
                {
                    "question":"Why do we feel heavier when an elevator suddenly starts going up?",
                    "options":[
                        "Gravity becomes stronger",
                        "The floor pushes us up with more force",
                        "Our weight increases permanently",
                        "Air pressure increases"
                    ],
                    "correctone":"The floor pushes us up with more force"
                },
                {
                    "question": "Why does a metal spoon feel colder than a wooden spoon at the same room temperature?",
                    "options": [
                        "Metal is heavier than wood",
                        "Metal conducts heat away from your hand faster",
                        "Wood absorbs more heat",
                        "Wood is always warmer"
                    ],
                    "correctone": "Metal conducts heat away from your hand faster"
                },
                {
                    "question": "Why is it easier to push a trolley on a smooth floor than on a rough one?",
                    "options": [
                        "The trolley is lighter on a smooth floor",
                        "Smooth floors have less friction",
                        "Gravity is weaker on smooth surfaces",
                        "Wheels don't work on rough floors"
                    ],
                    "correctone": "Smooth floors have less friction"
                },
                {
                    "question": "Why do objects float in water but sink in oil sometimes?",
                    "options": [
                        "Water is colder than oil",
                        "Oil is sticky",
                        "Water can hold objects better",
                        "Water is denser than oil"
                    ],
                    "correctone": "Water is denser than oil"
                }
            ]
        }
    ]
}
```
## Response Body >

```
{
    "message": "Created quiz Successfully",
    "data": {
        "mockQuizDoc": {
            "id": "700dbb97-b60a-4c07-8871-c6095356d4aa",
            "name": "Physics Fundamental Exam",
            "number": 1,
            "endsAt": "2025-06-25T12:30:00.000Z",
            "duration": 7,
            "teacherId": "362b103d-0b2c-40d4-b014-e2f5a94e842a",
            "createdAt": "2025-06-06T19:25:31.084Z",
            "updatedAt": "2025-06-06T19:25:31.084Z"
        },
        "quizSectionFinalDocuments": [
            {
                "quizSectionDocument": {
                    "id": "80aac8e3-0b05-4d31-bf35-0ad066c68cf0",
                    "createdAt": "2025-06-06T19:25:31.180Z",
                    "updatedAt": "2025-06-06T19:25:31.180Z",
                    "subjectId": "9df34f7c-1cfe-4d05-bf7b-fa8a00ae6744",
                    "mockQuizId": "700dbb97-b60a-4c07-8871-c6095356d4aa"
                },
                "questionDocs": [
                    {
                        "id": "45f9e319-b107-492f-8187-b0b0a2342536",
                        "question": "What happens to a ball when you drop it from a height?",
                        "correctOne": "It falls to the ground",
                        "options": [
                            "It floats in the air",
                            "It stays still",
                            "It falls to the ground",
                            "It moves upward"
                        ]
                    },
                    {
                        "id": "1fdd3960-72a6-4f89-880c-8e0072d23641",
                        "question": "Why do we feel heavier when an elevator suddenly starts going up?",
                        "correctOne": "The floor pushes us up with more force",
                        "options": [
                            "Gravity becomes stronger",
                            "The floor pushes us up with more force",
                            "Our weight increases permanently",
                            "Air pressure increases"
                        ]
                    },
                    {
                        "id": "f52f7657-8ba7-4643-a1f2-5a3364c3fd3b",
                        "question": "Why does a metal spoon feel colder than a wooden spoon at the same room temperature?",
                        "correctOne": "Metal conducts heat away from your hand faster",
                        "options": [
                            "Metal is heavier than wood",
                            "Metal conducts heat away from your hand faster",
                            "Wood absorbs more heat",
                            "Wood is always warmer"
                        ]
                    },
                    {
                        "id": "2930bf8a-b7cd-4f5a-8884-968a1d094927",
                        "question": "Why is it easier to push a trolley on a smooth floor than on a rough one?",
                        "correctOne": "Smooth floors have less friction",
                        "options": [
                            "The trolley is lighter on a smooth floor",
                            "Smooth floors have less friction",
                            "Gravity is weaker on smooth surfaces",
                            "Wheels don't work on rough floors"
                        ]
                    },
                    {
                        "id": "512743f2-c766-4132-9b67-c2e1df991431",
                        "question": "Why do objects float in water but sink in oil sometimes?",
                        "correctOne": "Water is denser than oil",
                        "options": [
                            "Water is colder than oil",
                            "Oil is sticky",
                            "Water can hold objects better",
                            "Water is denser than oil"
                        ]
                    }
                ]
            }
        ]
    }
}
```
***

# delete-quiz
## this route takes an URL param of the quiz-id, to be specific you want to delete.
⚠️ **Warning:** This action will delete all your data permanently. And this isn't implemented properly yet.
***
# update-question
## This route takes an URL param of question-id, which you want to update with the body like : {heading,options,correctone}
### heading: main question heading, options: in an array if you want to change the options provide the final updated array not the index wise changed value, correctone: provide the correct answer.
⚠️ **Warning:** This route is yet to be developed.
***
# ⚠️ **Warning:** This is deprecated will be removed soon.
## This route takes an URL param of quidiz and body like : {name,endsAt,duration}
## name: name of the quiz, endsAt: ending timestamp, duration: how long the quiz will continue before auto submit.
```
{
    "message": "Update Complete",
    "data": {
        "id": "2294df1d-fe68-4043-a599-28988a527178",
        "name": "Introduction to Java",
        "subjectid": "de3afefb-8692-4a35-879d-5596384fd957",
        "number": 1,
        "teacherid": "84adfd5c-7471-48b1-9160-d5c697bb4de2",
        "endsAt": "2025-06-15T12:30:00.000Z",
        "duration": 15,
        "createdAt": "2025-05-31T06:12:18.749Z",
        "updatedAt": "2025-05-31T08:48:18.900Z"
    }
}
```
## add-question
## This routes takes the a quiz-id as URL param and along with the body like : {heading,options,correctone}
### heading: this is the main question, options: this is an array of the options(atleast 2 options must be there), correctone: this is a correct option(must from the array.)
```
{
    "message": "Question Created successfully",
    "data": {
        "id": "f5b48f68-28aa-4798-8ba8-345f0bcc61d1",
        "quizid": "98d121fc-1a38-444b-b527-91798ccc4e06",
        "heading": "How many types of inheritance available in the C++?",
        "options": [
            "5",
            "6",
            "3",
            "4"
        ],
        "correctone": "5"
    }
}
```