import $ from 'jquery';

class Channel{
  constructor(){
    this.pageTokens = [];
    this.apiKey = 'AIzaSyCDMr6toQGyDRFPChRsbQ2sheSQfTQLVqg';

    this.kplaylistId = 'UUQfwfsi5VrQ8yKZ-UWmAEFg';
    this.yt_nextPageToken = false;
    this.yt_prevPageToken = false;
    this.kclicked = false;
    this.kPlaylistt = [];
    this.kPlaylist = [];
    this.created = false;
    this.videoIds = [];
  }

  getVidContent(pageToken) {
    $('#navigation img').eq(1).attr('src', '/images/loading.gif')
    channel.option = {
      "part": ["snippet,contentDetails"],
      "playlistId": channel.kplaylistId,
      "maxResults": 5
    }

    if(pageToken)
    channel.option.pageToken = pageToken;

    window.gapi.client.init({
      'apiKey': channel.apiKey,
      'discoveryDocs': ['https://www.googleapis.com/discovery/v1/apis/youtube/v3/rest'],
    }).then(function() {
      return window.gapi.client.youtube.playlistItems.list(channel.option);
    }).then(function(response) {
      channel.yt_nextPageToken = response.result.nextPageToken;  
      channel.yt_prevPageToken = response.result.prevPageToken;
      channel.getVidData(response.result.items);
    }, function(reason) {
      console.log('Error: ' + reason.result.error.message);
    });
  }

  getVidData(items){
    this.videoIds = [];
    for(var v in items){
      this.videoIds.push(items[v].snippet.resourceId.videoId);
    }
    this.createPlayer();
  }

  createPlayer(){
    var html = ``;
    
    for(var v in this.videoIds){
      html += `<div>`;
      html += `<iframe allowfullscreen src="https://www.youtube.com/embed/${this.videoIds[v]}"></iframe>`;
      html += `</div>`;
    }
    $('#video-screen').html(html);
    $('#navigation img').eq(1).attr('src', '/images/home.png')
  }

}//end class

const channel = new Channel();

export default channel;