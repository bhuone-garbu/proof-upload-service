# Payout proof upload service

This service deals with generating presigned S3 object to enable temporarily access to PUT/GET object from Amazon S3 for payout.

Using TypeScript only for fun. 😊

## Setup

Ensure that the following environmental variables are present. The access key must have read and write permission to an S3 bucket.

AWS_ACCESS_KEY_ID
AWS_SECRET_KEY
S3_BUCKET_REGION
S3_BUCKET_NAME
LAMBDA_REGION
LAMBDA_FUNC_NAME

## What it does

Reminder: Lambda **request body** has 5MB and it should be used to handle data, not file. But it does not stop us from exploiting `aws-sdk` to retrieve S3 binary data via code as long as the file does not eat up the whole Lambda allocated memory.

This service:

* Allows user to get presigned url to PUT object in S3
* User can then upload the file directly to S3. (Client has the choice and flexibility to do PUT request).
* Since we know the S3 bucketKey, we can trigger the lambda to upload the file via Salesforce Native API to a specific loan object id.

It's a two step process - use this to understand and explore option.
