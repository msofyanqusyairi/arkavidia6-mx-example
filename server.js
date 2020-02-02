const express = require('express');
const { MongoClient } = require('mongodb');
const app = express();

// HTTP SERVER PORT
const SERVICE_PORT = 9000

// DB CONFIG
const dbConfig = {
  uri: 'mongodb://localhost:27017'
}

const connectionDb = async () => {
  const client = await MongoClient.connect(dbConfig.uri, { useNewUrlParser: true });
  console.log('connected to db')

  return client.db('test');
}

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const dbMiddleware = async (req, res, next) => {
  if (!res.locals.db) {
    const db = await connectionDb();
    res.locals.db = db
  }
  next()
}

app.use(dbMiddleware);

app.post('/register', async (req, res) => {
  const { db } = res.locals;
  // const db = await connectionDb();
  const payload = req.body;

  // insert to db
  const result = await db.collection('user').insertOne(payload);

  res.status(200).send(result);
});

app.get('/user-profile', async (req, res) => {
  const { db } = res.locals;
  // const db = await connectionDb();
  const result = await db.collection('user').find({}).toArray();

  return res.status(200).send(result);
})

app.listen(SERVICE_PORT, () => {
  console.log('listening in port:', SERVICE_PORT)
});
