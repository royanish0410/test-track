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
        {
            "id": "02d831b2-c0eb-45e6-92c1-54f759535f4b",
            "endsAt": "2025-07-13T12:30:00.000Z",
            "name": "All Fundamentals Exam",
            "number": 2,
            "teacher": {
                "id": "362b103d-0b2c-40d4-b014-e2f5a94e842a",
                "fullname": "Debasish Sahu"
            },
            "quizsections": [
                {
                    "id": "96323bfd-1e7c-4f21-a754-a2d9fbdf869d",
                    "createdAt": "2025-06-06T19:35:28.314Z",
                    "updatedAt": "2025-06-06T19:35:28.314Z",
                    "subjectId": "9df34f7c-1cfe-4d05-bf7b-fa8a00ae6744",
                    "mockQuizId": "02d831b2-c0eb-45e6-92c1-54f759535f4b",
                    "subject": {
                        "id": "9df34f7c-1cfe-4d05-bf7b-fa8a00ae6744",
                        "imgUrl": null,
                        "name": "PHYSICS"
                    },
                    "questionSection": [
                        {
                            "id": "8881e133-089f-4ec0-b474-935af9219414",
                            "question": {
                                "id": "c9d1f0af-7b92-4fdc-9d1d-2ccd5cf5d855",
                                "question": "What happens to a ball when you drop it from a height?",
                                "questionImg": null,
                                "options": [
                                    "It floats in the air",
                                    "It stays still",
                                    "It falls to the ground",
                                    "It moves upward"
                                ]
                            }
                        },
                        {
                            "id": "7606153b-a6f5-4e5c-b404-af1740fa6eab",
                            "question": {
                                "id": "4e374e60-6efe-4a57-9b22-bd7dc81bd39b",
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
                            "id": "fc5d04df-fb91-4903-b90d-244c19caf81a",
                            "question": {
                                "id": "af20e45f-3123-49bc-89d2-d080c66e9135",
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
                            "id": "90daee01-18e1-4e9c-853e-56eae1e547ce",
                            "question": {
                                "id": "7ad6557e-a23d-4a03-9ea4-0ffde062988c",
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
                            "id": "c73cda91-6d47-40bf-a04c-705243f9a9e6",
                            "question": {
                                "id": "1a40c2d1-04a1-4d44-af9f-a7f7660fc245",
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
                },
                {
                    "id": "21126106-e72a-492c-937c-692ed36a78e4",
                    "createdAt": "2025-06-06T19:35:29.482Z",
                    "updatedAt": "2025-06-06T19:35:29.482Z",
                    "subjectId": "339c51d6-5095-4373-b326-37274f2f053c",
                    "mockQuizId": "02d831b2-c0eb-45e6-92c1-54f759535f4b",
                    "subject": {
                        "id": "339c51d6-5095-4373-b326-37274f2f053c",
                        "imgUrl": null,
                        "name": "MATH"
                    },
                    "questionSection": [
                        {
                            "id": "d780797b-8eab-4837-8625-386b9aff7385",
                            "question": {
                                "id": "5f95cec5-4535-4260-81ce-a0ccb6208048",
                                "question": "What is the next number in the sequence: 2, 4, 6, 8, ___?",
                                "questionImg": null,
                                "options": [
                                    "10",
                                    "11",
                                    "12",
                                    "14"
                                ]
                            }
                        },
                        {
                            "id": "b0bc61cf-0633-431c-9bdb-ea9ab1548d32",
                            "question": {
                                "id": "93cbbc27-33fe-4431-b010-6f575752cd2c",
                                "question": "Which number is both a multiple of 3 and 5?",
                                "questionImg": null,
                                "options": [
                                    "10",
                                    "15",
                                    "12",
                                    "8"
                                ]
                            }
                        },
                        {
                            "id": "c04733d7-71f5-4c7c-820d-8b483733d817",
                            "question": {
                                "id": "8adff334-793e-4827-8c83-ce17f98414a5",
                                "question": "What is the value of 9 minus 4?",
                                "questionImg": null,
                                "options": [
                                    "6",
                                    "5",
                                    "4",
                                    "3"
                                ]
                            }
                        },
                        {
                            "id": "2c796bbb-7b4c-4678-96c7-6e67146494ed",
                            "question": {
                                "id": "7e9a66d4-0bb2-43d3-9a08-3b6b4aafddd8",
                                "question": "How many sides does a triangle have?",
                                "questionImg": null,
                                "options": [
                                    "2",
                                    "3",
                                    "4",
                                    "5"
                                ]
                            }
                        },
                        {
                            "id": "3658d603-819f-4e7d-885f-6d1db5e1d01b",
                            "question": {
                                "id": "380cdf7e-8161-43a5-8261-23dd01e39b1b",
                                "question": "Which shape has all sides equal and four right angles?",
                                "questionImg": null,
                                "options": [
                                    "Rectangle",
                                    "Circle",
                                    "Triangle",
                                    "Square"
                                ]
                            }
                        }
                    ]
                },
                {
                    "id": "d4ea48a8-08f4-4c51-9659-38cfef98a134",
                    "createdAt": "2025-06-06T19:35:30.672Z",
                    "updatedAt": "2025-06-06T19:35:30.672Z",
                    "subjectId": "c8f2f72d-6a44-4f8a-a359-4e9923eb3d71",
                    "mockQuizId": "02d831b2-c0eb-45e6-92c1-54f759535f4b",
                    "subject": {
                        "id": "c8f2f72d-6a44-4f8a-a359-4e9923eb3d71",
                        "imgUrl": null,
                        "name": "CHEMISTRY"
                    },
                    "questionSection": [
                        {
                            "id": "eb04085d-43a0-40cf-aad0-ff887395d774",
                            "question": {
                                "id": "ffc67ec4-0f2e-4fb7-b98f-0f5578e4c2f5",
                                "question": "What is the chemical symbol for water?",
                                "questionImg": null,
                                "options": [
                                    "H2O",
                                    "CO2",
                                    "O2",
                                    "NaCl"
                                ]
                            }
                        },
                        {
                            "id": "cbb9b0a7-dd84-4ba3-ad09-d2e23ac556f3",
                            "question": {
                                "id": "00f0e3e7-0d16-4b22-84cb-0ef34a6f133c",
                                "question": "Which gas do plants take in for photosynthesis?",
                                "questionImg": null,
                                "options": [
                                    "Oxygen",
                                    "Carbon dioxide",
                                    "Nitrogen",
                                    "Hydrogen"
                                ]
                            }
                        },
                        {
                            "id": "10c1c045-5373-45af-89fb-af5abe3f60ee",
                            "question": {
                                "id": "77fc0720-ecd0-4bcb-a708-9dce79826255",
                                "question": "Which one of these is a metal?",
                                "questionImg": null,
                                "options": [
                                    "Oxygen",
                                    "Gold",
                                    "Chlorine",
                                    "Helium"
                                ]
                            }
                        },
                        {
                            "id": "df2a756b-4c18-44f8-8cb4-d18db3de218d",
                            "question": {
                                "id": "341aa70c-a5dd-46e2-be49-ab0d2ac51a15",
                                "question": "What do you call a substance made of only one type of atom?",
                                "questionImg": null,
                                "options": [
                                    "Compound",
                                    "Mixture",
                                    "Element",
                                    "Solution"
                                ]
                            }
                        },
                        {
                            "id": "740b6aa8-5f68-476f-bba7-3a6d49bd2a27",
                            "question": {
                                "id": "993be326-a8b1-4f28-9138-d5990f9e5ad1",
                                "question": "What happens when you mix vinegar and baking soda?",
                                "questionImg": null,
                                "options": [
                                    "Nothing",
                                    "It freezes",
                                    "It catches fire",
                                    "It bubbles and produces gas"
                                ]
                            }
                        }
                    ]
                }
            ]
        }
    ]
}
```
***