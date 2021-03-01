// The root provides a resolver function for each API endpoint
var root = {
  login: async (args, req) => {
    const login = require('../../../controllers/login')
    const user = await login.postLogin(args, req)
    return user
  },
  create: async (args, req) => {
    const author = require('../../../controllers/dashboard/author')
    const user = await author.postAuthor(args, req)
    return user
  }
}

module.exports = root