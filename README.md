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
