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

    mongoose.models = {}
    const users = mongoose.model('users', usersSchema)
    this.users = users
    this.bcrypt = bcrypt

    users.findOne(function (err, user){
      if (err) return console.error(err)
      if(!user){
        const hash = bcrypt.hashSync('password', 12)
        const id = (new Date()).getTime().toString(36) + Math.random().toString(36).slice(2)
        const root = new users({userid:id, username:'root', password:hash, email:'root@gazette.com', role:'Admin', info:'test', date: new Date()})
        root.save(function (err, root){
          if (err) return console.error(err)
        });
      }
    });
  }

  async checkUser(args){
    try{
      return await this.users.findOne({email:args.email})
    }catch (err){
      console.log(err)
    }
  }

  async checkEmail(args){
    return await this.users.findOne({email: args.email})
  }

  async insertUser(args){
    const hash = this.bcrypt.hashSync(args.password, 12)
    const id = (new Date()).getTime().toString(36) + Math.random().toString(36).slice(2)
    const date = new Date(args.date+' '+args.time)
    const user = new (this.users)({userid:id, username:args.username, password:hash, email:args.email, role:args.role, info:args.info, date: date})
    return await user.save()
  }

  async selectUser(amount=5, id=false, page=0){
    if(id){
      return await this.users.findOne({userid: id})
    }else if(page){
      return await this.users.find().skip(amount * page).sort({date: -1, _id: -1}).limit(amount)
    }else{
      return await this.users.find().sort({date: -1, _id: -1}).limit(amount)
    }
  }

  async countUser(){
    return await this.users.countDocuments({})
  }

  async updateUser(args){
    const user = await this.users.findOne({userid: args.userid})
    user.username = args.username
    user.email = args.email
    user.role = args.role
    user.info = args.info
    user.date = new Date(args.date+' '+args.time)
    if(args.password !== "oldpassword"){
      const hash = this.bcrypt.hashSync(args.password, 12)
      user.password = hash
    }
    return await user.save()
  }

  async deleteUser(args){
    const user = await this.users.findOne({userid: args.userid})
    await this.users.deleteOne({userid:user.userid})
    return user
  }

}//class ending 

module.exports = new Usersdb()