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
        req.session.user = user;
      }else{
        data.message = 'The password is wrong.';
        data.success = false;
        req.session.data = data
      }
    }else{
      data.message = 'The email is wrong.';
      data.success = false;
      req.session.data = data
    }

    return user
  }

  checkLogin(req, res){
    if(req.session.user){
      res.json({logged: true});
    }else{
      res.json({logged: false});
    }
  }

  logOut(req, res){
    if(req.session.user){
      req.session.destroy(function (err) {
        if(err)
          res.json({success: false});
        else
          res.json({success: true});
      });  
    }
  }

}//end class

module.exports = new Login();