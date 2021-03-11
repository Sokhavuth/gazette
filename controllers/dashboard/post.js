// controllers/dashboard/post.js
class Post{

  async insertPost(args, req){
    const postdb = require('../../models/dashboard/postdb')

    try{
      if((args.id)){
        var post = await postdb.updatePost(args);
        var message = `Post with title «${post.title}» has been updated.`
      }else{
        var post = await postdb.insertPost(args, req);
        var message = `Post with title «${post.title}» has been created.`
      }

      post.metadata = message
      return post
      
    }catch(err){
      console.log(err)
    }
  }

  async getPost(page=false, id=false){
    const postdb = require('../../models/dashboard/postdb')
    const config = require('../../config')
    this.tool = require('../../tool')

    const self = this
    let message = ''
    var posts = []

    try{
      const amount = await postdb.countPost()

      if(page){
        posts = await postdb.getPosts(config.dashboardLimit, false, page)
        var thumbs = self.tool.getThumbUrl(posts)
        if(posts.length > 0){
          message = posts.length + ' more posts were added.'
        }else{
          message = '0 post were added'
        }
      }else if(id){
        posts = await postdb.getPosts(config.dashboardLimit, id)
        var thumbs = self.tool.getThumbUrl(posts)
        message = `Post with title «${posts.name}» is beging edited.`
      }else{
        posts = await postdb.getPosts(config.dashboardLimit)
        var thumbs = self.tool.getThumbUrl(posts)
        
      }

      let data = {}
      data.metadata = {message:message, amount: amount}
      data.posts = posts
      data.thumbs = thumbs
      
      return JSON.stringify(data)

    }catch(err){
      console.log(err)
    }
  }

}//end class

module.exports = new Post()