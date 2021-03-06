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
    time: String
    metadata: String
  }
  type Query {
    login(email: String, password: String): User
    getuser(userid: String): User
    paginateuser(page: Int): [User]
  }
  type Mutation {
    createuser(userid: String, username: String, password: String, email: String, role: String, info: String, date: String, time: String): User
    updateuser(userid: String, username: String, password: String, email: String, role: String, info: String, date: String, time: String): User
    deleteuser(userid: String): User
  }
`)

module.exports = schema