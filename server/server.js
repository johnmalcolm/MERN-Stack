const express = require('express');
const app = express();

const fileServerMiddleware = express.static('public');

const typeDefs = `
    type Query {
        about String!
    }
    type Mutation {
        setAboutMessage(message: String!): String
    }
`;

app.use('/public', fileServerMiddleware);

app.listen(3000, function(){
    console.log('App started on port 3000');
});
