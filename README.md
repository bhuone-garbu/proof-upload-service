# Payout proof upload service

This service uploads to Salesforce via Lambda and uses Amazon S3 to allow client to upload file since S3 is highly scalable for file storage.

Presigned S3 object are used to to enable temporarily access to PUT/GET object from Amazon S3.

TypeScript is only for fun. 😊


## Setup

0. Some setup

**TODO: It probbably make sense to migrate this to serverless framework completely.**
There is no reason why it cannot be a pure serverless project if we are gonna use Lambda and we can avoid all these manual configuration.

* Create a S3 bucket:

Add a CORS setting to the bucket like so. I'm using a loose CORS settings for this PoC - I'd suggest not having `"*"` value in the `AllowedOrigins` for security reasons and only allow the methods that are required.

We need this settings so that we can allow clients to put object and retrieve the files from the bucket.

```
[
    {
        "AllowedHeaders": [],
        "AllowedMethods": [
            "POST",
            "GET",
            "PUT"
        ],
        "AllowedOrigins": [
            "*"
        ],
        "ExposeHeaders": []
    }
]
```

You will need the bucket name later.

1. Deploying the lambda function.

`npm run package` on the lambda directory, create a function name at AWS lamda and upload the `deploy.zip`.

The lambda function must a minimum permission of: `Allow: s3:GetObject`

Fill the lambda config environmental variables with the following:
```
SF_CLIENT_ID
SF_CLIENT_SECRET
SF_USERNAME
SF_PASSWORD

BUCKET_NAME
```

👆 The above environment are required to get the Salesforce OAuth token. Ensure the Salesforce user that is being used in Lambda has permission to use SF Native OOTB Rest endpoints.

The `BUCKET_NAME` is the name of the S3 bucket that the lambda function will look for to find and retrive the file and enventually push the file to Salesforce.

2. Express setup

The `express` routes are just for testing and triggering the file upload and lambda function execution.

Ensure that the following environmental variables are present in the `.env` at the root of this project. The access key must have read and write permission to an S3 bucket. Ensure that the IAM permissions are present.

```
AWS_ACCESS_KEY_ID
AWS_SECRET_KEY

S3_BUCKET_REGION
S3_BUCKET_NAME

LAMBDA_REGION
LAMBDA_UPLOAD_FUNC_NAME
```

## Testing

For contextual reason, I am using loan application.

Run and install npm dependencies.

```
npm install
npm start
```

1. To get a presigned url to PUT object in AWS bucket, send the following request:

```
POST http://localhost:8000/api/signedurls
RequestBody:
{
  "fileName": "testing.png",
  "loanAppId": "0068E00000QQrT3",
  "verificationCheckId": "a0J8E00000D2qdZ"
}
```

`verificationCheckId` is optional but if it is provided, it will be used with the bucketKeyName.

Currently it's organized like this in this PoC:

You should get response like this:
```
{
  "bucketKeyName": "staging/0068E00000QQrT3/a0J8E00000D2qdZ/testing.png",
  "loanAppId": "0068E00000QQrT3",
  "verificationCheckId": "a0J8E00000D2qdZ",
  "signedUrl": "https://bucketnName/staging/0068E00000QQrT3/a0J8E00000D2qdZ/testing.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Credential=blahbalahablah",
  "fileName": "testing.png"
}
```

Capture the `bucketKeyName` and `signedUrl`. The other are just for reference.

Notice how the bucketKeyName is organized which will be important for securing access per user per loan application.

```
/stage
  └── /loanAppId
    └── proof1.jpg
    └── proof2.pdf
    └── /verificationCheckId
        └── proof3.pdf
```

2. Uploading the file to S3

Use POSTMAN to test this:

```
PUT https://bucketnName/staging/0068E00000QQrT3/a0J8E00000D2qdZ/testing.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Credential=blahbalahablah
```

![image](https://user-images.githubusercontent.com/11137745/111639254-007e1e00-87f3-11eb-8eb5-20ce41d02a7f.png)


This 👆 proves we can upload S3 platform agnostically - web/app or whatever.

3. Finally triggering the lambda to upload to Salesforce.

```
POST http://localhost:8000/api//upload
RequestBody:
{
  "bucketKeyName": "staging/0068E00000QQrT3/a0J8E00000D2qdZ/testing2.png",
  "parentId": "0068E00000QQrT3"
}
```

`parentId` is an object id in Salesforce to share the uploaded file - normally the loan app id.

Response:
```
{
  "message": "Successfully uploaded to SF",
  "uploadResult": {
    "documentId": "0698E000001ii8fQAA",
    "linkedWith": "0068E00000QQrT3"
  }
}
```

The `documentId` in the `salesforceResult` body is the unique file id from Salesforce.

Header over to object (`parentId`) to see and verify that the uploaded file is present there.

## Summary

Reminder: Lambda **request body** has 5MB and it should be used to handle data, not file. People often use this request body to encode file as base64 string for file processing. While it will work for smaller file, it's not a scalable solution.

Instead we can use `aws-sdk` to retrieve S3 binary data via code (not via RequestBody) as long as the file does not eat up the whole Lambda allocated memory. 😉

This service:

* Allows user to get presigned url to PUT object in S3
* User can then upload the file directly to S3. (Client has the choice and flexibility to do PUT request).
* Since we know the S3 bucketKey, we can trigger the lambda to upload the file via Salesforce Native API to a specific loan object id.

It's a two step process - use this to understand and explore option.

The most important bit is the upload how to upload to Salesforce - so please take a look at the `uploadToSF` lambda function and understand the multi-part request concept so that you can build and replicate this into any other language of your choice.
