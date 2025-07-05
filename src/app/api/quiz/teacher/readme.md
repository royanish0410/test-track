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

Here in the request body questions, share either question or questionImg, not both. It won't accept both.

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
                    "correctone":"It falls to the ground",
                    "questionImg":"imgUrl"
                },
                {
                    "question":"Why do we feel heavier when an elevator suddenly starts going up?",
                    "options":[
                        "Gravity becomes stronger",
                        "The floor pushes us up with more force",
                        "Our weight increases permanently",
                        "Air pressure increases"
                    ],
                    "correctone":"The floor pushes us up with more force",
                    "questionImg":"imgUrl"
                },
                {
                    "question": "Why does a metal spoon feel colder than a wooden spoon at the same room temperature?",
                    "options": [
                        "Metal is heavier than wood",
                        "Metal conducts heat away from your hand faster",
                        "Wood absorbs more heat",
                        "Wood is always warmer"
                    ],
                    "correctone": "Metal conducts heat away from your hand faster",
                    "questionImg":"imgUrl"
                },
                {
                    "question": "Why is it easier to push a trolley on a smooth floor than on a rough one?",
                    "options": [
                        "The trolley is lighter on a smooth floor",
                        "Smooth floors have less friction",
                        "Gravity is weaker on smooth surfaces",
                        "Wheels don't work on rough floors"
                    ],
                    "correctone": "Smooth floors have less friction",
                    "questionImg":"imgUrl"
                },
                {
                    "question": "Why do objects float in water but sink in oil sometimes?",
                    "options": [
                        "Water is colder than oil",
                        "Oil is sticky",
                        "Water can hold objects better",
                        "Water is denser than oil"
                    ],
                    "correctone": "Water is denser than oil",
                    "questionImg":"imgUrl"
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

# Quiz fields Updating
## Method: PATCH
## Route: /api/quiz/teacher/update-quiz/:quizid

## Request Body >
```
{
    "duration": 45,
}
```
The followings are the fields we can add by requirement.

| Key           | Value          | Description             |
| ------------- | -------------- | ----------------------- |
|  name      | string | Name of the quiz (the heading).
|  endAt     | string | The Ending Date and time of the mock quiz. |
|  duration  | number | Duration of the mock quiz exam.            |


## Response Body >
```
{
    "message": "Update Complete",
    "data": {
        "id": "02d831b2-c0eb-45e6-92c1-54f759535f4b",
        "name": "All Fundamentals Exam",
        "number": 2,
        "endsAt": "2025-07-13T12:30:00.000Z",
        "duration": 45,
        "teacherId": "362b103d-0b2c-40d4-b014-e2f5a94e842a",
        "createdAt": "2025-06-06T19:35:28.230Z",
        "updatedAt": "2025-06-07T11:23:53.466Z"
    }
}
```


***

# Fetch User's quizzes
## Method: GET
## Route: /api/quiz/teacher/get-my-quizzes

This route takes the userId of the user who is making the request by the clerks auth() and checks if the user is authenticated. then proceeds without requiring any parameters.

## Request Body >
```
{}
```
## Response Body >
```
{
    "message": "Quizzes Fetched successfully.",
    "data": [
        {
            "id": "700dbb97-b60a-4c07-8871-c6095356d4aa",
            "name": "Physics Fundamental Exam",
            "number": 1,
            "endsAt": "2025-06-25T12:30:00.000Z",
            "duration": 7,
            "teacherId": "362b103d-0b2c-40d4-b014-e2f5a94e842a",
            "createdAt": "2025-06-06T19:25:31.084Z",
            "updatedAt": "2025-06-06T19:25:31.084Z",
            "quizsections": [
                {
                    "id": "80aac8e3-0b05-4d31-bf35-0ad066c68cf0",
                    "createdAt": "2025-06-06T19:25:31.180Z",
                    "updatedAt": "2025-06-06T19:25:31.180Z",
                    "subjectId": "9df34f7c-1cfe-4d05-bf7b-fa8a00ae6744",
                    "mockQuizId": "700dbb97-b60a-4c07-8871-c6095356d4aa",
                    "questionSection": [
                        {
                            "id": "ccf77092-e6c4-4308-8faa-8185bc6c8a85",
                            "questionId": "45f9e319-b107-492f-8187-b0b0a2342536",
                            "quizSectionId": "80aac8e3-0b05-4d31-bf35-0ad066c68cf0",
                            "question": {
                                "id": "45f9e319-b107-492f-8187-b0b0a2342536",
                                "correctOne": "Real, inverted and 30 cm in front of the mirror",
                                "options": [
                                    "Real, inverted and 30 cm behind the mirror",
                                    "Virtual, erect and 30 cm behind the mirror",
                                    "Real, inverted and 30 cm in front of the mirror",
                                    "Virtual, erect and 30 cm in front of the mirror"
                                ],
                                "question": "An object is placed 15 cm in front of a concave mirror of focal length 10 cm. What is the nature and position of the image formed?",
                                "questionImg": null
                            }
                        },
                        {
                            "id": "1b45bfe6-7921-4352-9f87-b26ab5cb24eb",
                            "questionId": "1fdd3960-72a6-4f89-880c-8e0072d23641",
                            "quizSectionId": "80aac8e3-0b05-4d31-bf35-0ad066c68cf0",
                            "question": {
                                "id": "1fdd3960-72a6-4f89-880c-8e0072d23641",
                                "correctOne": "The floor pushes us up with more force",
                                "options": [
                                    "Gravity becomes stronger",
                                    "The floor pushes us up with more force",
                                    "Our weight increases permanently",
                                    "Air pressure increases"
                                ],
                                "question": "Why do we feel heavier when an elevator suddenly starts going up?",
                                "questionImg": null
                            }
                        },
                        {
                            "id": "edc6f267-c351-412e-95ac-adf1d6810b4b",
                            "questionId": "f52f7657-8ba7-4643-a1f2-5a3364c3fd3b",
                            "quizSectionId": "80aac8e3-0b05-4d31-bf35-0ad066c68cf0",
                            "question": {
                                "id": "f52f7657-8ba7-4643-a1f2-5a3364c3fd3b",
                                "correctOne": "Metal conducts heat away from your hand faster",
                                "options": [
                                    "Metal is heavier than wood",
                                    "Metal conducts heat away from your hand faster",
                                    "Wood absorbs more heat",
                                    "Wood is always warmer"
                                ],
                                "question": "Why does a metal spoon feel colder than a wooden spoon at the same room temperature?",
                                "questionImg": null
                            }
                        },
                        {
                            "id": "51a7e784-feaf-432f-aa46-c9cddb4d11bd",
                            "questionId": "2930bf8a-b7cd-4f5a-8884-968a1d094927",
                            "quizSectionId": "80aac8e3-0b05-4d31-bf35-0ad066c68cf0",
                            "question": {
                                "id": "2930bf8a-b7cd-4f5a-8884-968a1d094927",
                                "correctOne": "Smooth floors have less friction",
                                "options": [
                                    "The trolley is lighter on a smooth floor",
                                    "Smooth floors have less friction",
                                    "Gravity is weaker on smooth surfaces",
                                    "Wheels don't work on rough floors"
                                ],
                                "question": "Why is it easier to push a trolley on a smooth floor than on a rough one?",
                                "questionImg": null
                            }
                        },
                        {
                            "id": "c0a31d4a-c3e0-4bf0-a507-d3cb37cb5a2e",
                            "questionId": "512743f2-c766-4132-9b67-c2e1df991431",
                            "quizSectionId": "80aac8e3-0b05-4d31-bf35-0ad066c68cf0",
                            "question": {
                                "id": "512743f2-c766-4132-9b67-c2e1df991431",
                                "correctOne": "Water is denser than oil",
                                "options": [
                                    "Water is colder than oil",
                                    "Oil is sticky",
                                    "Water can hold objects better",
                                    "Water is denser than oil"
                                ],
                                "question": "Why do objects float in water but sink in oil sometimes?",
                                "questionImg": null
                            }
                        }
                    ],
                    "subject": {
                        "id": "9df34f7c-1cfe-4d05-bf7b-fa8a00ae6744",
                        "name": "PHYSICS"
                    }
                }
            ]
        },
        {
            "id": "02d831b2-c0eb-45e6-92c1-54f759535f4b",
            "name": "All Fundamentals Exam",
            "number": 2,
            "endsAt": "2025-07-13T12:30:00.000Z",
            "duration": 45,
            "teacherId": "362b103d-0b2c-40d4-b014-e2f5a94e842a",
            "createdAt": "2025-06-06T19:35:28.230Z",
            "updatedAt": "2025-06-07T11:23:53.466Z",
            "quizsections": [
                {
                    "id": "96323bfd-1e7c-4f21-a754-a2d9fbdf869d",
                    "createdAt": "2025-06-06T19:35:28.314Z",
                    "updatedAt": "2025-06-06T19:35:28.314Z",
                    "subjectId": "9df34f7c-1cfe-4d05-bf7b-fa8a00ae6744",
                    "mockQuizId": "02d831b2-c0eb-45e6-92c1-54f759535f4b",
                    "questionSection": [
                        {
                            "id": "8881e133-089f-4ec0-b474-935af9219414",
                            "questionId": "c9d1f0af-7b92-4fdc-9d1d-2ccd5cf5d855",
                            "quizSectionId": "96323bfd-1e7c-4f21-a754-a2d9fbdf869d",
                            "question": {
                                "id": "c9d1f0af-7b92-4fdc-9d1d-2ccd5cf5d855",
                                "correctOne": "It falls to the ground",
                                "options": [
                                    "It floats in the air",
                                    "It stays still",
                                    "It falls to the ground",
                                    "It moves upward"
                                ],
                                "question": "What happens to a ball when you drop it from a height?",
                                "questionImg": null
                            }
                        },
                        {
                            "id": "7606153b-a6f5-4e5c-b404-af1740fa6eab",
                            "questionId": "4e374e60-6efe-4a57-9b22-bd7dc81bd39b",
                            "quizSectionId": "96323bfd-1e7c-4f21-a754-a2d9fbdf869d",
                            "question": {
                                "id": "4e374e60-6efe-4a57-9b22-bd7dc81bd39b",
                                "correctOne": "The floor pushes us up with more force",
                                "options": [
                                    "Gravity becomes stronger",
                                    "The floor pushes us up with more force",
                                    "Our weight increases permanently",
                                    "Air pressure increases"
                                ],
                                "question": "Why do we feel heavier when an elevator suddenly starts going up?",
                                "questionImg": null
                            }
                        },
                        {
                            "id": "fc5d04df-fb91-4903-b90d-244c19caf81a",
                            "questionId": "af20e45f-3123-49bc-89d2-d080c66e9135",
                            "quizSectionId": "96323bfd-1e7c-4f21-a754-a2d9fbdf869d",
                            "question": {
                                "id": "af20e45f-3123-49bc-89d2-d080c66e9135",
                                "correctOne": "Metal conducts heat away from your hand faster",
                                "options": [
                                    "Metal is heavier than wood",
                                    "Metal conducts heat away from your hand faster",
                                    "Wood absorbs more heat",
                                    "Wood is always warmer"
                                ],
                                "question": "Why does a metal spoon feel colder than a wooden spoon at the same room temperature?",
                                "questionImg": null
                            }
                        },
                        {
                            "id": "90daee01-18e1-4e9c-853e-56eae1e547ce",
                            "questionId": "7ad6557e-a23d-4a03-9ea4-0ffde062988c",
                            "quizSectionId": "96323bfd-1e7c-4f21-a754-a2d9fbdf869d",
                            "question": {
                                "id": "7ad6557e-a23d-4a03-9ea4-0ffde062988c",
                                "correctOne": "Smooth floors have less friction",
                                "options": [
                                    "The trolley is lighter on a smooth floor",
                                    "Smooth floors have less friction",
                                    "Gravity is weaker on smooth surfaces",
                                    "Wheels don't work on rough floors"
                                ],
                                "question": "Why is it easier to push a trolley on a smooth floor than on a rough one?",
                                "questionImg": null
                            }
                        },
                        {
                            "id": "c73cda91-6d47-40bf-a04c-705243f9a9e6",
                            "questionId": "1a40c2d1-04a1-4d44-af9f-a7f7660fc245",
                            "quizSectionId": "96323bfd-1e7c-4f21-a754-a2d9fbdf869d",
                            "question": {
                                "id": "1a40c2d1-04a1-4d44-af9f-a7f7660fc245",
                                "correctOne": "Water is denser than oil",
                                "options": [
                                    "Water is colder than oil",
                                    "Oil is sticky",
                                    "Water can hold objects better",
                                    "Water is denser than oil"
                                ],
                                "question": "Why do objects float in water but sink in oil sometimes?",
                                "questionImg": null
                            }
                        }
                    ],
                    "subject": {
                        "id": "9df34f7c-1cfe-4d05-bf7b-fa8a00ae6744",
                        "name": "PHYSICS"
                    }
                },
                {
                    "id": "21126106-e72a-492c-937c-692ed36a78e4",
                    "createdAt": "2025-06-06T19:35:29.482Z",
                    "updatedAt": "2025-06-06T19:35:29.482Z",
                    "subjectId": "339c51d6-5095-4373-b326-37274f2f053c",
                    "mockQuizId": "02d831b2-c0eb-45e6-92c1-54f759535f4b",
                    "questionSection": [
                        {
                            "id": "d780797b-8eab-4837-8625-386b9aff7385",
                            "questionId": "5f95cec5-4535-4260-81ce-a0ccb6208048",
                            "quizSectionId": "21126106-e72a-492c-937c-692ed36a78e4",
                            "question": {
                                "id": "5f95cec5-4535-4260-81ce-a0ccb6208048",
                                "correctOne": "10",
                                "options": [
                                    "10",
                                    "11",
                                    "12",
                                    "14"
                                ],
                                "question": "What is the next number in the sequence: 2, 4, 6, 8, ___?",
                                "questionImg": null
                            }
                        },
                        {
                            "id": "b0bc61cf-0633-431c-9bdb-ea9ab1548d32",
                            "questionId": "93cbbc27-33fe-4431-b010-6f575752cd2c",
                            "quizSectionId": "21126106-e72a-492c-937c-692ed36a78e4",
                            "question": {
                                "id": "93cbbc27-33fe-4431-b010-6f575752cd2c",
                                "correctOne": "15",
                                "options": [
                                    "10",
                                    "15",
                                    "12",
                                    "8"
                                ],
                                "question": "Which number is both a multiple of 3 and 5?",
                                "questionImg": null
                            }
                        },
                        {
                            "id": "c04733d7-71f5-4c7c-820d-8b483733d817",
                            "questionId": "8adff334-793e-4827-8c83-ce17f98414a5",
                            "quizSectionId": "21126106-e72a-492c-937c-692ed36a78e4",
                            "question": {
                                "id": "8adff334-793e-4827-8c83-ce17f98414a5",
                                "correctOne": "5",
                                "options": [
                                    "6",
                                    "5",
                                    "4",
                                    "3"
                                ],
                                "question": "What is the value of 9 minus 4?",
                                "questionImg": null
                            }
                        },
                        {
                            "id": "2c796bbb-7b4c-4678-96c7-6e67146494ed",
                            "questionId": "7e9a66d4-0bb2-43d3-9a08-3b6b4aafddd8",
                            "quizSectionId": "21126106-e72a-492c-937c-692ed36a78e4",
                            "question": {
                                "id": "7e9a66d4-0bb2-43d3-9a08-3b6b4aafddd8",
                                "correctOne": "3",
                                "options": [
                                    "2",
                                    "3",
                                    "4",
                                    "5"
                                ],
                                "question": "How many sides does a triangle have?",
                                "questionImg": null
                            }
                        },
                        {
                            "id": "3658d603-819f-4e7d-885f-6d1db5e1d01b",
                            "questionId": "380cdf7e-8161-43a5-8261-23dd01e39b1b",
                            "quizSectionId": "21126106-e72a-492c-937c-692ed36a78e4",
                            "question": {
                                "id": "380cdf7e-8161-43a5-8261-23dd01e39b1b",
                                "correctOne": "Square",
                                "options": [
                                    "Rectangle",
                                    "Circle",
                                    "Triangle",
                                    "Square"
                                ],
                                "question": "Which shape has all sides equal and four right angles?",
                                "questionImg": null
                            }
                        }
                    ],
                    "subject": {
                        "id": "339c51d6-5095-4373-b326-37274f2f053c",
                        "name": "MATH"
                    }
                },
                {
                    "id": "d4ea48a8-08f4-4c51-9659-38cfef98a134",
                    "createdAt": "2025-06-06T19:35:30.672Z",
                    "updatedAt": "2025-06-06T19:35:30.672Z",
                    "subjectId": "c8f2f72d-6a44-4f8a-a359-4e9923eb3d71",
                    "mockQuizId": "02d831b2-c0eb-45e6-92c1-54f759535f4b",
                    "questionSection": [
                        {
                            "id": "eb04085d-43a0-40cf-aad0-ff887395d774",
                            "questionId": "ffc67ec4-0f2e-4fb7-b98f-0f5578e4c2f5",
                            "quizSectionId": "d4ea48a8-08f4-4c51-9659-38cfef98a134",
                            "question": {
                                "id": "ffc67ec4-0f2e-4fb7-b98f-0f5578e4c2f5",
                                "correctOne": "H2O",
                                "options": [
                                    "H2O",
                                    "CO2",
                                    "O2",
                                    "NaCl"
                                ],
                                "question": "What is the chemical symbol for water?",
                                "questionImg": null
                            }
                        },
                        {
                            "id": "cbb9b0a7-dd84-4ba3-ad09-d2e23ac556f3",
                            "questionId": "00f0e3e7-0d16-4b22-84cb-0ef34a6f133c",
                            "quizSectionId": "d4ea48a8-08f4-4c51-9659-38cfef98a134",
                            "question": {
                                "id": "00f0e3e7-0d16-4b22-84cb-0ef34a6f133c",
                                "correctOne": "Carbon dioxide",
                                "options": [
                                    "Oxygen",
                                    "Carbon dioxide",
                                    "Nitrogen",
                                    "Hydrogen"
                                ],
                                "question": "Which gas do plants take in for photosynthesis?",
                                "questionImg": null
                            }
                        },
                        {
                            "id": "10c1c045-5373-45af-89fb-af5abe3f60ee",
                            "questionId": "77fc0720-ecd0-4bcb-a708-9dce79826255",
                            "quizSectionId": "d4ea48a8-08f4-4c51-9659-38cfef98a134",
                            "question": {
                                "id": "77fc0720-ecd0-4bcb-a708-9dce79826255",
                                "correctOne": "Gold",
                                "options": [
                                    "Oxygen",
                                    "Gold",
                                    "Chlorine",
                                    "Helium"
                                ],
                                "question": "Which one of these is a metal?",
                                "questionImg": null
                            }
                        },
                        {
                            "id": "df2a756b-4c18-44f8-8cb4-d18db3de218d",
                            "questionId": "341aa70c-a5dd-46e2-be49-ab0d2ac51a15",
                            "quizSectionId": "d4ea48a8-08f4-4c51-9659-38cfef98a134",
                            "question": {
                                "id": "341aa70c-a5dd-46e2-be49-ab0d2ac51a15",
                                "correctOne": "Element",
                                "options": [
                                    "Compound",
                                    "Mixture",
                                    "Element",
                                    "Solution"
                                ],
                                "question": "What do you call a substance made of only one type of atom?",
                                "questionImg": null
                            }
                        },
                        {
                            "id": "740b6aa8-5f68-476f-bba7-3a6d49bd2a27",
                            "questionId": "993be326-a8b1-4f28-9138-d5990f9e5ad1",
                            "quizSectionId": "d4ea48a8-08f4-4c51-9659-38cfef98a134",
                            "question": {
                                "id": "993be326-a8b1-4f28-9138-d5990f9e5ad1",
                                "correctOne": "It bubbles and produces gas",
                                "options": [
                                    "Nothing",
                                    "It freezes",
                                    "It catches fire",
                                    "It bubbles and produces gas"
                                ],
                                "question": "What happens when you mix vinegar and baking soda?",
                                "questionImg": null
                            }
                        }
                    ],
                    "subject": {
                        "id": "c8f2f72d-6a44-4f8a-a359-4e9923eb3d71",
                        "name": "CHEMISTRY"
                    }
                }
            ]
        }
    ]
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