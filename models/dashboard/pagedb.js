// models/pagedb.js
class Pagedb{
  constructor(){
    const mongoose = require('mongoose')
    const pageSchema = new mongoose.Schema({
      id: {type: String, required: true},
      title: {type: String, required: true},
      info: {type: String, required: false},
      date: {type: Date, required: true},
      author: {type: String, required: true},
    })
    mongoose.models = {}
    this.page = mongoose.model('pages', pageSchema)
  }

  async insertPage(args, req){
    const id = (new Date()).getTime().toString(36) + Math.random().toString(36).slice(2)
    const date = new Date(args.date)
    const page = new (this.page)({id: id, title: args.title, info: args.info, date: date, author: req.session.user.email})
    return await page.save()
  }

  async getPages(amount=5, id=false, page=0){
    if(id){
      return await this.page.findOne({id: id})
    }else if(page){
      return await this.page.find().skip(amount * page).sort({date: -1, _id: -1}).limit(amount)
    }else{
      return await this.page.find().sort({date: -1, _id: -1}).limit(amount)
    }
  }

  async countPage(){
    return await this.page.countDocuments({})
  }

  async updatePage(args){
    const page = await this.page.findOne({id: args.id})
    page.title = args.title
    page.info = args.info
    page.date = new Date(args.date)
    return await page.save()
  }

  async deletePage(args){
    const page = await this.page.findOne({id: args.id})
    await this.page.deleteOne({id: args.id})
    return page
  }

}// end class

module.exports = new Pagedb()