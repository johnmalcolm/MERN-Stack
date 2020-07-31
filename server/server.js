const fs = require('fs');
const express = require('express');
const { ApolloServer, UserInputError } = require('apollo-server-express');
const { GraphQLScalarType } = require('graphql');
const { Kind } = require('graphql/language');

// In Server Memory DB (Temp)
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
  issue.created = new Date();
  issue.id = issuesDB.length +1;
  if (issue.status == undefined) issue.status = 'New';
  issuesDB.push(issue);
  return issue; 
}

function validateIssue(_, { issue }){
  const errors = [];
  if (issuesDB.title.length < 3){
    errors.push('Field "title" must be at least 3 characters long.')
  }
  if (issue.status == 'Assigned' && !issue.owner){
    errors.push('Field "owner" is required when status is "Assigned"')
  }
  if (errors.length > 0){
    throw new UserInputError('Invalid input(s)', {errors});
  }
}

function issueList(){
  return issuesDB;
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
});

// Setup Express Server
const app = express();
app.use(express.static('public'));
server.applyMiddleware({ app, path: '/graphql' });
app.listen(2000, function () {
  console.log('App started on port 2000');
});