const fs = require('fs');
const express = require('express');
const { ApolloServer, UserInputError } = require('apollo-server-express');
const { GraphQLScalarType } = require('graphql');
const { Kind } = require('graphql/language');
const { MongoClient } = require('mongodb');

require('dotenv').config();
const password = process.env.MONGO_DB_PASS;
const url = `mongodb+srv://john123:${password}@scientometrics-cluster.c3y2t.mongodb.net/development?retryWrites=true&w=majority`

async function connectToDb(){
  const client = new MongoClient(url, { useNewUrlParser: true });
  await client.connect();
  console.log('Connected to MongoDB at ', url);
  db = client.db();
}

// In Server Memory DB (Temp)

const GraphQLDate = new GraphQLScalarType({
  name: 'GraphQLDate',
  description: 'A Date() type in GraphQL as a scalar', 
  serialize(value) {
    return value;   
  },
  parseLiteral(ast) {
    if (ast.kind == Kind.STRING){
      const value = new Date(ast.value);
      return isNaN(value) ? undefined : value;
    } 
  },
  parseValue(value) {
    const dateValue = new Date(value);
    return isNaN(dateValue) ? undefined : value;
  },
});

let aboutMessage = "Issue Tracker API v1.0";

const issuesDB = [
  {
    id: 1,
    status: "New",
    owner: "Ravan",
    effort: 5,
    created: new Date("2019-01-15"),
    due: undefined,
    title: "Error in console when clicking Add",
  },
  {
    id: 2,
    status: "Assigned",
    owner: "Eddie",
    effort: 14,
    created: new Date("2019-01-16"),
    due: new Date("2019-02-01"),
    title: "Missing bottom border on panel",
  },
];

// GraphQL Resolver Functions
function setAboutMessage(_, { message }) {
  return aboutMessage = message;
}

function issueAdd(_, { issue }){
  issueValidate(issue);
  issue.created = new Date();
  issue.id = issuesDB.length +1;
  issuesDB.push(issue);
  return issue; 
}

function issueValidate( issue ){
  const errors = [];
  if (issue.title.length < 3){
    errors.push('Field "title" must be at least 3 characters long.')
  }
  if (issue.status == 'Assigned' && !issue.owner){
    errors.push('Field "owner" is required when status is "Assigned"')
  }
  if (errors.length > 0){
    throw new UserInputError('Invalid input(s)', {errors});
  }
}

async function issueList(){
  const issues = await db.collection('issues').find({}).toArray();
  return issues;
}

// Map Resolver for Graph QL
const resolvers = {
  Query: {
    about: () => aboutMessage,
    issueList
  },
  Mutation: {
    setAboutMessage,
    issueAdd,
  },
  GraphQLDate
};

// Setup GraphQL Server Middleware
const server = new ApolloServer({
  typeDefs: fs.readFileSync('./server/schema.graphql', 'utf-8'),
  resolvers,
  formatError: error => {
    console.log(error);
    return error;
  }
});

// Setup Express Server
const app = express();
app.use(express.static('public'));
server.applyMiddleware({ app, path: '/graphql' });

(async function (){
  try {
    await connectToDb();
    app.listen(2000, function () {
      console.log('App started on port 2000');
    });
  } catch (err) {
    console.log('ERROR', err);
  }
})()
