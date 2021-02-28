export default (req, res) => {
  const login = require('../../controllers/login')
  login.logOut(req, res)
}