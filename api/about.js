let aboutMessage = 'Issue Tracker API v1.0';

// GraphQL Resolver Functions
function setAboutMessage(_, { message }) {
  aboutMessage = message;
  return aboutMessage;
}

function getMessage(){
    return aboutMessage;
}

module.exports = { getMessage, setAboutMessage }