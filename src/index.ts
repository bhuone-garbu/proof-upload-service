import bodyParser from 'body-parser';
import express from 'express';

import router from './config/router';

const app = express();
const PORT = process.env.PORT || 8000;

// or just use cors 😅
app.use((_, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header(
    'Access-Control-Allow-Headers',
    'Origin, X-Requested-With, Content-Type, Accept',
  );
  next();
});

app.use(bodyParser.json());

// all the handlers are routed from the '/api'
app.use('/api', router);

app.use('*', (req, res) => {
  res.status(404).send({ message: `Sorry, cant ${req.method} on that route` });
});

// eslint-disable-next-line no-console
app.listen(PORT, () => console.log(`⚡️Server is running at port: ${PORT}`));
