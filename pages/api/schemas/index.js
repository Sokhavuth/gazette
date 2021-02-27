const { buildSchema } = require('graphql')

const schema = buildSchema(`
  
  type User {
    username: String
    userid: String
    password: String
    email: String
    role: String
    info: String
    date: String
    metadata: String
  }
  type Query {
    login(email: String, password: String): User
  }
`)

module.exports = schema