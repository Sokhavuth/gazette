// controllers/login.js
class Login{
  constructor(){
    this.deepcopy = require('deepcopy');
    this.vdict = require('../config');
    this.usersdb = require('../models/dashboard/usersdb');
    this.bcrypt = require('bcryptjs');
  }

  async postLogin(args, req){
    const self = this;
    const data = this.deepcopy(this.vdict);

    const user = await this.usersdb.checkUser(args);
    if(user){
      if(self.bcrypt.compareSync(args.password, user.password)){
        data.success = true;
        req.session.data = data
        req.session.user = user
        return user
      }else{
        data.message = 'The password is wrong.';
        data.success = false;
        req.session.data = data
        return {metadata: data.message}
      }
    }else{
      data.message = 'The email is wrong.';
      data.success = false;
      req.session.data = data
      return {metadata: data.message}
    }

  }

}//end class

module.exports = new Login();