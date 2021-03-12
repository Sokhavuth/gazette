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
    var posts = {}

    try{
      const amount = await postdb.countPost()

      if(page){
        posts = await postdb.getPosts(config.dashboardLimit, false, page)
        if(posts.length > 0){
          message = posts.length + ' more posts were added.'
          var thumbs = self.tool.getThumbUrl(posts)
          posts[0].metadata = JSON.stringify({message: message, thumbs: thumbs})
          return posts
        }else{
          message = '0 post were added'
          return posts
        }
        
      }else if(id){
        posts = await postdb.getPosts(config.dashboardLimit, id)
        var thumbs = self.tool.getThumbUrl([posts])
        message = `Post with title «${posts.title}» is beging edited.`
        posts.metadata = JSON.stringify({message, thumbs: thumbs})
        return posts
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

  async updatePost(args, req){
    var postdb = require('../../models/dashboard/postdb')
    var userpost = await this.getPost(false, args.id)
    
    if((req.session.user.role === "Admin") || (req.session.user.email === userpost.author)) {
      
      var post = await postdb.updatePost(args)
      post.metadata = `Post with title ${post.title} was successfully updated`
      
      return post
   }else{
      const message = 'Only Administrator or the author of this post has the right to modify this post.'
      return {metadata: message}
    }
  }

  async deletePost(args, req){
    var postdb = require('../../models/dashboard/postdb')
    var userpost = await this.getPost(false, args.id)
    
    if((req.session.user.role === "Admin") || (req.session.user.email === userpost.author)){
      const post = await postdb.deletePost(args)
      const message = `Post with title ${post.title} has been deleted.`
      post.metadata = message
      return post
    }else{
      const message = 'Only Administrator or the author of this post has the right to modify this post.'
      return {metadata: message}
    }
  }

}//end class

module.exports = new Post()