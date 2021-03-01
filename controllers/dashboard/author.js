// controllers/dashboard/author.js
class Author{
  constructor(){
    this.deepcopy = require('deepcopy')
    this.vdict = require('../../config')
    this.usersdb = require('../../models/dashboard/usersdb')
    this.emailCheck = require('email-check')
    this.bcrypt = require('bcryptjs')
  }

  async postAuthor(args, req){
    const self = this;
    const data = this.deepcopy(this.vdict)
  
    if(req.session.user.role === 'Admin'){
      const user = await this.usersdb.checkEmail(args)
      if(user){
        data.message = 'This email is already used.'
        return {metadata: data.message}
      }else{
        const result = await self.emailCheck(args.email)
        if(result){
          let user = await self.usersdb.insertUser(args)
          user.metadata = `User​ ${user.username} was successfully created.`
          return user
        }else{
          data.message = 'This email deos not exist.'
          return {metadata: data.message}
        }
      }

    }else{
      data.message = 'Only Administrator have the right to create user.​';
      return {metadata: data.message}
    }
  }

}//end class

module.exports = new Author();