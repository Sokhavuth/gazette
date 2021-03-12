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
  type Category {
    categoryid: String
    categoryname: String
    info: String
    date: String
    time: String
    metadata: String
  }
  type Post {
    id: String
    title: String
    info: String
    category: String
    date: String
    author: String
    metadata: String
  }

  type Query {
    login(email: String, password: String): User
    getuser(userid: String): User
    paginateuser(page: Int): [User]
    getcategory(categoryid: String): Category
    paginatecategory(page: Int): [Category]
    editpost(id: String): Post
  }
  type Mutation {
    createuser(userid: String, username: String, password: String, email: String, role: String, info: String, date: String, time: String): User
    updateuser(userid: String, username: String, password: String, email: String, role: String, info: String, date: String, time: String): User
    deleteuser(userid: String): User
    createcategory(categoryid: String, categoryname: String, info: String, date: String, time: String): Category
    updatecategory(categoryid: String, categoryname: String, info: String, date: String, time: String): Category
    deletecategory(categoryid: String): Category
    createpost(id: String, title: String, info: String, category: String, date: String): Post
    updatepost(id: String, title: String, info: String, category: String, date: String): Post
    deletepost(id: String): Post
  }
`)

module.exports = schema