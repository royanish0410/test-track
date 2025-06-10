# Get All Subjects
## Method: GET
## Route: /api/quiz/commons/get-subjects

## Request Body >
```
{}
```
## Response Body >
```
{
    "message": "Successful Fetching Subjects",
    "data": [
        {
            "id": "9df34f7c-1cfe-4d05-bf7b-fa8a00ae6744",
            "imgUrl": null,
            "name": "PHYSICS"
        },
        {
            "id": "339c51d6-5095-4373-b326-37274f2f053c",
            "imgUrl": null,
            "name": "MATH"
        },
        {
            "id": "c8f2f72d-6a44-4f8a-a359-4e9923eb3d71",
            "imgUrl": null,
            "name": "CHEMISTRY"
        }
    ]
}
```

***

# Get Signed Url for secure uploading
## Method: GET
## Route: /api/quiz/commons/signature-url

## Request Body >
```
{}
```
## Response Body >
```
{
    "signature": "120cfcfeb9c9de30adbed13106188da1ad94ba79",
    "timestamp": 1749546412,
    "folder": "MockQuiz",
    "max_file_size": 7000000,
    "resource_type": "image",
    "expires_at": 1749547012,
    "api_key": "867554791284663",
    "cloud_name": "dy26w6o2h"
}
```
Create a formBody with the following key and values

| Key           | Value          | Description             |
| ------------- | -------------- | ----------------------- |
|  file         | file           | the file you want to upload |
|  signature    | string         | Signature for the secure authentic upload |
|  timestamp    | number         | the timestamp at which the signed url created |
|  folder       | string         | folder name where the files would be stored(mention the one that is obtained from the response)            |
| max_file_size | number         | this is the maximum size of the file to upload            |
| resource_type | string         | file type            |
|  expires_at   | string         | the timestamp when the url get invalid           |
|  api_key      | string         | Api key used for the authentication of signature             |
|  cloud_name   | string         | the cloudname where you would upload the files            |

***