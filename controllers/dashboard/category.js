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
      const category = await this.categoriesdb.selectCategory(1, id) 
      const thumbs = self.tool.getThumbUrl([category])
      const message = `Category ${category.categoryname} is being edited.`
      category.metadata = JSON.stringify({thumb: thumbs[0], message: message})
      return category
    }else if(page){
      const categories = await this.categoriesdb.selectCategory(this.vdict.dashboardLimit, false, page=page)
      const thumbs = self.tool.getThumbUrl(categories)
      const count = await self.categoriesdb.countCategory()
      if(categories.length > 0)
      categories[0].metadata = JSON.stringify({thumbs: thumbs, count: count})
        
      return categories

    }else{
      data.categories = await this.categoriesdb.selectCategory(this.vdict.dashboardLimit)
      data.thumbs = self.tool.getThumbUrl(data.categories)
      data.count = await self.categoriesdb.countCategory()
    
      return JSON.stringify(data)
    }
  }

  async updateCategory(args, req){
    const self = this
    
    if(req.session.user.role === "Admin") {
      const category = await self.categoriesdb.updateCategory(args)
      category.metadata = `Category ${category.categoryname} was successfully updated`
      return category
   }else{
      const message = 'Only Administrator has the right to modify category.'
      return {metadata: message}
    }
  }

  async deleteCategory(args, req){
    const self = this
    
    if(req.session.user.role === "Admin"){
      const category = await self.categoriesdb.deleteCategory(args)
      const message = `Category ${category.categoryname} has been deleted.`
      category.metadata = message
      return category
    }
  }

}//end class

module.exports = new Category()