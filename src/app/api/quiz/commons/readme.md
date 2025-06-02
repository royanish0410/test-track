# get-quiz : 
## This route takes an quiz-id as url paramter and returns a specific quiz Like the following output
```
"data": {
    "createdAt": "2025-06-02T19:03:31.989Z",
    "duration": 15,
    "endsAt": "2025-06-15T12:30:00.000Z",
    "id": "quiz-id",
    "name": "Chemistry in everyday",
    "number": 1,
    "ofsubject": {
        "id": "subject-id",
        "name": "CHEMISTRY",
        "imagelink": null
    },
    "questionmodel": [],
    "quizattempts": [],
    "subjectid": "subject-id",
    "teacher": {
        "id": "teacher-id",
        "fullname": "Debasish Sahu",
        "email": "debasish.sahu.1912@gmail.com",
        "clerkId": "teacher-clerk-id",
        "emailVerified": true,
        "role": "TEACHER",
        "createdAt": "2025-06-02T08:49:28.721Z",
        "updatedAt": "2025-06-02T08:49:41.790Z"
    },
    "teacherid": "teacher-id",
    "updatedAt": "2025-06-02T19:03:31.990Z",
    "_count": {
        "questionmodel": 0,
        "quizattempts": 0
    }
}
```

# get-quizzes-by-subject
## This route takes the subject-id and returns all the quizzes under the subject. Like the following response
```
"subjectQuiz": {
    "id": "subject-id",
    "name": "CHEMISTRY",
    "quizzes": [
        {
            "id": "quiz-ids",
            "name": "Phsyical chemistry",
            "subjectid": "subject-id",
            "number": 1,
            "teacherid": "teacher-id",
            "endsAt": "2025-06-15T12:30:00.000Z",
            "duration": 15,
            "createdAt": "2025-06-02T19:02:42.383Z",
            "updatedAt": "2025-06-02T19:02:42.384Z"
        },
        {
            "id": "quiz-ids",
            "name": "Organic chemistry",
            "subjectid": "subject-id",
            "number": 1,
            "teacherid": "teacher-id",
            "endsAt": "2025-06-15T12:30:00.000Z",
            "duration": 15,
            "createdAt": "2025-06-02T19:02:49.398Z",
            "updatedAt": "2025-06-02T19:02:49.399Z"
        },
        {
            "id": "quiz-ids",
            "name": "Inorganic chemistry",
            "subjectid": "subject-id",
            "number": 1,
            "teacherid": "teacher-id",
            "endsAt": "2025-06-15T12:30:00.000Z",
            "duration": 15,
            "createdAt": "2025-06-02T19:02:57.074Z",
            "updatedAt": "2025-06-02T19:02:57.075Z"
        },
        {
            "id": "quiz-ids",
            "name": "Benzene Reactions",
            "subjectid": "subject-id",
            "number": 1,
            "teacherid": "teacher-id",
            "endsAt": "2025-06-15T12:30:00.000Z",
            "duration": 15,
            "createdAt": "2025-06-02T19:03:23.054Z",
            "updatedAt": "2025-06-02T19:03:23.055Z"
        },
        {
            "id": "quiz-ids",
            "name": "Chemistry in everyday",
            "subjectid": "subject-id",
            "number": 1,
            "teacherid": "teacher-id",
            "endsAt": "2025-06-15T12:30:00.000Z",
            "duration": 15,
            "createdAt": "2025-06-02T19:03:31.989Z",
            "updatedAt": "2025-06-02T19:03:31.990Z"
        }
    ]
}
```

# get-subjects
## This route takes nothing but returns the entered subjects and their number of quizzes. Like the following.
```
{
    "message": "Subject fetching successful.",
    "data": [
        {
            "id": "subject-id",
            "name": "PHYSICS",
            "quizzes": []
        },
        {
            "id": "subject-id",
            "name": "MATH",
            "quizzes": []
        },
        {
            "id": "subject-id",
            "name": "CHEMISTRY",
            "quizzes": []
        }
    ]
}
```

# list-quizzes
## This route takes query params in the URL such as subjects(if no subject mentioned it is considered as all the subjects) and sorting types as sortType(It's an enum) and a count(default 10). And gives like the following response.
### sortType must be one of these : "ATIME" | "DTIME" | "ADUR" | "DDUR" | "AENDS" | "DENDS"
```
{
    "message": "Successful fetch",
    "quizzesResponse": [
        {
            "id": "ids",
            "name": "Chemistry in everyday",
            "subjectid": "subject-id",
            "number": 1,
            "teacherid": "teacher-id",
            "endsAt": "2025-06-15T12:30:00.000Z",
            "duration": 15,
            "createdAt": "2025-06-02T19:03:31.989Z",
            "updatedAt": "2025-06-02T19:03:31.990Z",
            "ofsubject": {
                "id": "ids",
                "name": "CHEMISTRY",
                "imagelink": null
            },
            "teacher": {
                "id": "ids",
                "fullname": "Debasish Sahu",
                "email": "debasish.sahu.1912@gmail.com"
            }
        },
        {
            "id": "ids",
            "name": "Benzene Reactions",
            "subjectid": "subject-id",
            "number": 1,
            "teacherid": "teacher-id",
            "endsAt": "2025-06-15T12:30:00.000Z",
            "duration": 15,
            "createdAt": "2025-06-02T19:03:23.054Z",
            "updatedAt": "2025-06-02T19:03:23.055Z",
            "ofsubject": {
                "id": "ids",
                "name": "CHEMISTRY",
                "imagelink": null
            },
            "teacher": {
                "id": "ids",
                "fullname": "Debasish Sahu",
                "email": "debasish.sahu.1912@gmail.com"
            }
        },
    ],
    "length": 2
}
```

# list-subjects
## This doesn't take any body or parameters but returns only the subject id and their name. Like the following
```
{
    "message": "All subjects fetched successfully",
    "data": [
        {
            "id": "subject-id",
            "name": "CHEMISTRY"
        },
        {
            "id": "subject-id",
            "name": "MATH"
        },
        {
            "id": "subject-id",
            "name": "PHYSICS"
        }
    ],
    "length": 3
}
```