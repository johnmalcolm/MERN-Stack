const { GraphQLScalarType } = require('graphql');
const { Kind } = require('graphql/language');

const GraphQLDate = new GraphQLScalarType({
    name: 'GraphQLDate',
    description: 'A Date() type in GraphQL as a scalar',
    serialize(value) {
      return value;
    },
    parseLiteral(ast) {
      if (ast.kind === Kind.STRING) {
        const value = new Date(ast.value);
        return isNaN(value) ? undefined : value;
      }
      return undefined;
    },
    parseValue(value) {
      const dateValue = new Date(value);
      return isNaN(dateValue) ? undefined : value;
    },
  });

  module.exports = GraphQLDate;