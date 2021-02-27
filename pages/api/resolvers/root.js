// The root provides a resolver function for each API endpoint
var root = {
  user: async (args, req, res) => {
    const login = require('../../../controllers/login')
    const user = await login.postLogin(args, req)
    return user
  },
}

module.exports = root