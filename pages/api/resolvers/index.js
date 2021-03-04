// The root provides a resolver function for each API endpoint
var root = {
  login: async (args, req) => {
    const login = require('../../../controllers/login')
    const user = await login.postLogin(args, req)
    return user
  },
  createuser: async (args, req) => {
    const author = require('../../../controllers/dashboard/author')
    const user = await author.postAuthor(args, req)
    return user
  },
  getuser: async (args) => {
    const author = require('../../../controllers/dashboard/author')
    const user = await author.getAuthors(args.userid)
    return user
  },
  updateuser: async (args, req) => {
    const author = require('../../../controllers/dashboard/author')
    const user = await author.updateAuthor(args, req)
    return user
  },
  deleteuser: async (args, req) => {
    const author = require('../../../controllers/dashboard/author')
    const user = await author.deleteAuthor(args, req)
    return user
  }
}

module.exports = root