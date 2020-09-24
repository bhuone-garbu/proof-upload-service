require('dotenv').config();
import express from 'express';
import AWS from 'aws-sdk';

const app = express();
const PORT = process.env.PORT || 8000;

const credentials = {
  accessKeyId: process.env.S3_ACCESS_KEY_ID,
  secretAccessKey : process.env.S3_SECRET_KEY
};

app.get('/', (_, res) => res.send('Hello word from Express'));

app.get('/presigns', (req: Request, res: Response) => {
  res.send('Oie')
})

app.listen(PORT, () => console.log(`⚡️[server]: Server is running at port: ${PORT}`));
