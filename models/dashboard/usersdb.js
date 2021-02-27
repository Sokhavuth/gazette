// models/usersdb.js
class Usersdb{
  constructor(){
    const mongoose = require('mongoose');
    const bcrypt = require('bcryptjs');

    const usersSchema = new mongoose.Schema({
      username: {type: String, required: true},
      userid: {type: String, required: true},
      password: {type: String, required: true},
      email: {type: String, required: true},
      role: {type: String, required: true},
      info: {type: String, required: false},
      date: {type: Date, required: true}
    });

    const users = mongoose.model('users', usersSchema);
    this.users = users;
    this.bcrypt = bcrypt;

    users.findOne(function (err, user){
      if (err) return console.error(err);
      if(!user){
        const hash = bcrypt.hashSync('password', 12);
        const id = (new Date()).getTime().toString(36) + Math.random().toString(36).slice(2);
        const root = new users({userid:id, username:'root', password:hash, email:'root@gazette.com', role:'Admin', info:'test', date: new Date()});
        root.save(function (err, root){
          if (err) return console.error(err);
        });
      }
    });
  }

  async checkUser(args){
    try{
      return await this.users.findOne({email:args.email});
    }catch (err){
      console.log(err);
    }
  }

}//class ending 

module.exports = new Usersdb();