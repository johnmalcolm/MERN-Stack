const fs = require('fs');
const express = require('express');
const { ApolloServer, UserInputError } = require('apollo-server-express');
const { MongoClient } = require('mongodb');
const about = require('./about.js')
require('dotenv').config();
const url = process.env.DB_URL;
const port = process.env.API_SERVER_PORT;

/* global db print */
/* eslint no-restricted-globals: "off" */
let db;

async function connectToDb() {
  const client = new MongoClient(url, { useNewUrlParser: true });
  await client.connect();
  console.log('Connected to MongoDB at ', url);
  db = client.db();
}

// In Server Memory DB (Temp)


function issueValidate(issue) {
  const errors = [];
  if (issue.title.length < 3) {
    errors.push('Field "title" must be at least 3 characters long.');
  }
  if (issue.status === 'Assigned' && !issue.owner) {
    errors.push('Field "owner" is required when status is "Assigned"');
  }
  if (errors.length > 0) {
    throw new UserInputError('Invalid input(s)', { errors });
  }
}

async function getNextSequence(name) {
  const result = await db.collection('counters').findOneAndUpdate(
    { _id: name },
    { $inc: { current: 1 } },
    { returnOriginal: false }
  );
  return result.value.current;
}



async function issueAdd(_, { issue }) {
  issueValidate(issue);
  const newIssue = Object.assign({}, issue);
  newIssue.created = new Date();
  newIssue.id = await getNextSequence('issues');
  const result = await db.collection('issues').insertOne(newIssue);
  const savedIssue = await db.collection('issues').findOne({ _id: result.insertedId });
  return savedIssue;
}

async function issueList() {
  const issues = await db.collection('issues').find({}).toArray();
  return issues;
}

// Map Resolver for Graph QL
const resolvers = {
  Query: {
    about: about.getMessage,
    issueList,
  },
  Mutation: {
    about: about.setAboutMessage,
    issueAdd,
  },
  GraphQLDate,
};

// Setup GraphQL Server Middleware
const server = new ApolloServer({
  typeDefs: fs.readFileSync('schema.graphql', 'utf-8'),
  resolvers,
  formatError: error => {
    console.log(error);
    return error;
  },
});

// Setup Express Server
const app = express();
const enableCors = (process.env.ENABLE_CORS || 'true') === 'true';
server.applyMiddleware({ app, path: '/graphql', cors: enableCors });

(async function start() {
  try {
    await connectToDb();
    app.listen(port, () => {
      console.log(`API started on port ${port}`);
    });
  } catch (err) {
    console.log('ERROR', err);
  }
}());
