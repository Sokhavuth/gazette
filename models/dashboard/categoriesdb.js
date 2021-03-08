// models/dashboard/categoriesdb.js
class Categoriesdb{
  constructor(){
    const mongoose = require('mongoose')

    const categoriesSchema = new mongoose.Schema({
      categoryname: {type: String, required: true},
      categoryid: {type: String, required: true},
      info: {type: String, required: false},
      date: {type: Date, required: true}
    })

    mongoose.models = {}
    this.categories = mongoose.model('categories', categoriesSchema)
  }

  async insertCategory(args){
    const id = (new Date()).getTime().toString(36) + Math.random().toString(36).slice(2)
    const date = new Date(args.date+' '+args.time)
    const category = new (this.categories)({categoryid:id, categoryname:args.categoryname, info:args.info, date: date})
    return await category.save()
  }

  async selectCategory(amount=5, id=false, page=0){
    if(id){
      return await this.categories.findOne({categoryid: id})
    }else if(page){
      return await this.categories.find().skip(amount * page).sort({date: -1, _id: -1}).limit(amount)
    }else{
      return await this.categories.find().sort({date: -1, _id: -1}).limit(amount)
    }
  }

  async countCategory(){
    return await this.categories.countDocuments({})
  }

  async updateCategory(args){
    const category = await this.categories.findOne({categoryid: args.categoryid})
    category.categoryname = args.categoryname
    category.info = args.info
    category.date = new Date(args.date+' '+args.time)
  
    return await category.save()
  }

  async deleteCategory(args){
    const category = await this.categories.findOne({categoryid: args.categoryid})
    await this.categories.deleteOne({categoryid:category.categoryid})
    return category
  }

}//class ending 

module.exports = new Categoriesdb()