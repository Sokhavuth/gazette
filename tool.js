class Utility{
  constructor() {
    this.noPost = "/images/no-image.png";
    this.noUser = "/images/userthumb.png";
    this.playIcon = "/images/play.png";
    this.cheerio = require('cheerio');
  }

  async fetchAPI(url){
    const response = await fetch(url)
    var data = await response.json()
    return data
  }

  getThumbUrl(contents, type=false){
    var thumbUrls = [];
    for(var v in contents){
      const $ = this.cheerio.load(contents[v].info);
      if($('img').length > 0){
        thumbUrls.push($("img").first().attr("src"));
      }else{
        if(type == 'author')
          thumbUrls.push(this.noUser);
        else
          thumbUrls.push(this.noPost);
      }
    }
    return (thumbUrls);
  }
}//end class

module.exports = new Utility();