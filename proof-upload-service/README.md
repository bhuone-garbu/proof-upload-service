# Payout proof upload service

This service deals with generating presigned S3 object to enable temporarily access to PUT/GET object from Amazon S3 for payout.

## Setup

Ensure that the following environmental variables are present. The access key must have read and write permission to an S3 bucket.

S3_ACCESS_KEY_ID
S3_SECRET_KEY
