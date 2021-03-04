// controllers/dashboard/author.js
class Author{
  constructor(){
    this.deepcopy = require('deepcopy')
    this.vdict = require('../../config')
    this.tool = require('../../tool')
    this.usersdb = require('../../models/dashboard/usersdb')
    this.emailCheck = require('email-check')
    this.bcrypt = require('bcryptjs')
  }

  async postAuthor(args, req){
    const self = this
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
          const thumbs = self.tool.getThumbUrl([user], 'author');
          const message = `User​ ${user.username} was successfully created.`
          user.metadata = JSON.stringify({thumb: thumbs[0], message: message})
          return user
        }else{
          data.message = 'This email deos not exist.'
          return {metadata: data.message}
        }
      }

    }else{
      data.message = 'Only Administrator have the right to create user.​'
      return {metadata: data.message}
    }
  }

  async getAuthors(id=false){
    const self = this
    const data = this.deepcopy(this.vdict)
    
    if(id){
      const user = await this.usersdb.selectUser(1, id) 
      const thumbs = self.tool.getThumbUrl([user], 'author')
      const message = `User ${user.username} is being edited.`
      user.metadata = JSON.stringify({thumb: thumbs[0], message: message})
      return user
    }else{
      data.authors = await this.usersdb.selectUser(this.vdict.dashboardLimit)
      data.thumbs = self.tool.getThumbUrl(data.authors, 'author')
      data.count = await self.usersdb.countUser()
    
      return JSON.stringify(data)
    }
  }

  async updateAuthor(args, req){
    const self = this
    
    if((req.session.user.role === "Admin") || (req.session.user.userid === args.userid)){
      const user = await this.usersdb.checkEmail(args)
      
      if(user && (args.userid !== user.userid)){
        const message = 'This email is already being used.​'
        return {metadata: message}
      }else{
        const result = await self.emailCheck(args.email)
        if(result){
          const author = await self.usersdb.updateUser(args)
          author.metadata = `User ${author.username} was successfully updated`
          return author
        }else{
          const message = 'This email does not exist.'
          return {metadata: message}
        }
      }
    
   }else{
      const message = 'You are not authorized to modify this user.'
      return {metadata: message}
    }
  }

  async deleteAuthor(args, req){
    const self = this
    
    if(req.session.user.role === "Admin"){
      const user = await self.usersdb.deleteUser(args)
      const message = `User ${user.username} has been deleted.`
      user.metadata = message
      return user
    }
  }

}//end class

module.exports = new Author()