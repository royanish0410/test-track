# add-question
## This routes takes the a quiz-id as URL param and along with the body like : {heading,options,correctone}
### heading: this is the main question, options: this is an array of the options(atleast 2 options must be there), correctone: this is a correct option(must from the array.)
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

# create-quiz
## This route take the nothing in the URL param but takes the body like : {subjectid,teacherclerkid,endsAt,duration,quizname}
### subjectid: id of the subject, teacherclerkid: clerk id of the teacher, endsAt: the Time stamp of the ending of the quiz, duration: duration of one quiz, quizname: (optional) specify the name if neccessary.
{
    "message": "Quiz created successfully",
    "data": {
        "id": "e11195a7-904a-4d4d-83fc-9f434c11a53a",
        "name": "Chemistry 2nd year",
        "subjectid": "bfb97971-f00f-43ba-9165-887dc75b53cc",
        "number": 1,
        "teacherid": "362b103d-0b2c-40d4-b014-e2f5a94e842a",
        "endsAt": "2025-06-15T12:30:00.000Z",
        "duration": 75,
        "createdAt": "2025-06-02T19:55:30.037Z",
        "updatedAt": "2025-06-02T19:55:30.040Z"
    }
}

# create-subject
## This route takes nothing in the URl param but takes the body like : {subjectName}
### subjectName: This is the name of the subject, give anyway you like and it will be stored in uppercase.
{
    "message": "Document creation successful",
    "data": {
        "id": "2811e348-aadf-4b4e-bde3-22ffdbd59363",
        "name": "MATH"
    }
}

# delete-quiz
## this route takes an URL param of the quiz-id, to be specific you want to delete.


# update-question
## This route takes an URL param of question-id, which you want to update with the body like : {heading,options,correctone}
### heading: main question heading, options: in an array if you want to change the options provide the final updated array not the index wise changed value, correctone: provide the correct answer.



# update-quiz
## This route takes an URL param of quidiz and body like : {name,endsAt,duration}
## name: name of the quiz, endsAt: ending timestamp, duration: how long the quiz will continue before auto submit.
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