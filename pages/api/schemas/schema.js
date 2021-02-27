const { buildSchema } = require('graphql')

const schema = buildSchema(`
  
  type User {
    username: String!
    userid: String!
    password: String!
    email: String!
    role: String!
    info: String
    date: String!
  }
  type Query {
    user(email: String, password: String): User
  }
`)

module.exports = schema