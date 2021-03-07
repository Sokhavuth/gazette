// controllers/dashboard/category.js
class Category{
  constructor(){
    this.deepcopy = require('deepcopy')
    this.vdict = require('../../config')
    this.tool = require('../../tool')
    this.categoriesdb = require('../../models/dashboard/categoriesdb')
  }

  async insertCategory(args, req){
    const self = this
    const data = this.deepcopy(this.vdict)
  
    if(req.session.user.role === 'Admin'){
      let category = await self.categoriesdb.insertCategory(args)
      const thumbs = self.tool.getThumbUrl([category]);
      const message = `Category ${category.categoryname} was successfully created.`
      category.metadata = JSON.stringify({thumb: thumbs[0], message: message})
      return category
    }else{
      data.message = 'Only Administrator have the right to create category.​'
      return {metadata: data.message}
    }
  }

  async getCategories(id=false, page=false){
    const self = this
    const data = this.deepcopy(this.vdict)
    
    if(id){
      const user = await this.usersdb.selectUser(1, id) 
      const thumbs = self.tool.getThumbUrl([user], 'author')
      const message = `User ${user.username} is being edited.`
      user.metadata = JSON.stringify({thumb: thumbs[0], message: message})
      return user
    }else if(page){
      const users = await this.usersdb.selectUser(this.vdict.dashboardLimit, false, page=page)
      const thumbs = self.tool.getThumbUrl(users, 'author')
      const count = await self.usersdb.countUser()
      if(users.length > 0)
        users[0].metadata = JSON.stringify({thumbs: thumbs, count: count})
        
      return users

    }else{
      data.categories = await this.categoriesdb.selectCategory(this.vdict.dashboardLimit)
      data.thumbs = self.tool.getThumbUrl(data.categories)
      data.count = await self.categoriesdb.countCategory()
    
      return JSON.stringify(data)
    }
  }

}//end class

module.exports = new Category()