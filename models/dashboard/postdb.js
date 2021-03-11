// models/postdb.js
class Postdb{
  constructor(){
    const mongoose = require('mongoose')
    const postSchema = new mongoose.Schema({
      id: {type: String, required: true},
      title: {type: String, required: true},
      info: {type: String, required: false},
      category: {type: String, required: false},
      date: {type: Date, required: true},
      author: {type: String, required: true},
    })
    mongoose.models = {}
    this.post = mongoose.model('posts', postSchema)
  }

  async insertPost(args, req){
    const id = (new Date()).getTime().toString(36) + Math.random().toString(36).slice(2)
    const date = new Date(args.date)
    const category = args.category
    const post = new (this.post)({id: id, title: args.title, info: args.info, category: category, date: date, author: req.session.user.email})
    return await post.save()
  }

  async getPosts(amount=5, id=false, page=0){
    if(id){
      return await this.post.findOne({id: id})
    }else if(page){
      return await this.post.find().skip(amount * page).sort({date: -1, _id: -1}).limit(amount)
    }else{
      return await this.post.find().sort({date: -1, _id: -1}).limit(amount)
    }
  }

  async countPost(){
    return await this.post.countDocuments({})
  }

  async updatePost(args){
    const post = await this.post.findOne({id: args.id})
    post.title = args.title
    post.info = args.info
    post.category = args.category
    post.date = new Date(args.date)
  
    return await post.save()
  }

}// end class

module.exports = new Postdb()