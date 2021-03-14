// controllers/dashboard/page.js
class Page{
  constructor(){
    this.pagedb = require('../../models/dashboard/pagedb')
    this.config = require('../../config')
    this.tool = require('../../tool')
  }

  async insertPage(args, req){
    const self = this
    try{
      if((args.id)){
        var page = await self.pagedb.updatePage(args);
        var message = `Page with title «${page.title}» has been updated.`
      }else{
        var page = await self.pagedb.insertPage(args, req);
        var message = `Page with title «${page.title}» has been created.`
      }

      page.metadata = message
      return page
      
    }catch(err){
      console.log(err)
    }
  }

  async getPage(page=false, id=false){
    const self = this
    let message = ''
    var pages = {}

    try{
      const amount = await self.pagedb.countPage()

      if(page){
        pages = await self.pagedb.getPages(this.config.dashboardLimit, false, page)
        if(pages.length > 0){
          message = pages.length + ' more posts were added.'
          var thumbs = self.tool.getThumbUrl(pages)
          pages[0].metadata = JSON.stringify({message: message, thumbs: thumbs})
          return pages
        }else{
          message = '0 post were added'
          return pages
        }
        
      }else if(id){
        pages = await self.pagedb.getPages(this.config.dashboardLimit, id)
        var thumbs = self.tool.getThumbUrl([pages])
        message = `Post with title «${pages.title}» is beging edited.`
        pages.metadata = JSON.stringify({message, thumbs: thumbs})
        return pages
      }else{
        pages = await self.pagedb.getPages(this.config.dashboardLimit)
        var thumbs = self.tool.getThumbUrl(pages)
      }

      let data = {}
      data.metadata = {message:message, amount: amount}
      data.pages = pages
      data.thumbs = thumbs
      
      return JSON.stringify(data)

    }catch(err){
      console.log(err)
    }
  }

  async updatePage(args, req){
    const self = this
    var userpage = await this.getPage(false, args.id)
    
    if((req.session.user.role === "Admin") || (req.session.user.email === userpage.author)) {
      var page = await self.pagedb.updatePage(args)
      page.metadata = `Page with title ${page.title} was successfully updated`
      return page
   }else{
      const message = 'Only Administrator or the author of this page has the right to modify this page.'
      return {metadata: message}
    }
  }

  async deletePage(args, req){
    const self = this
    var userpage = await this.getPage(false, args.id)
    
    if((req.session.user.role === "Admin") || (req.session.user.email === userpage.author)){
      const page = await self.pagedb.deletePage(args)
      const message = `Page with title ${page.title} has been deleted.`
      page.metadata = message
      return page
    }else{
      const message = 'Only Administrator or the author of this page has the right to modify this page.'
      return {metadata: message}
    }
  }

}//end class

module.exports = new Page()