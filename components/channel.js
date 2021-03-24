import React from 'react'
import styles from  '../styles/Channel.module.scss'

import channel from './channeljs'

class Channel extends React.Component{
  constructor(props){
    super(props);
    this.state = {};
  }

  componentDidMount(){
    const script = document.createElement("script");
    script.src = "https://apis.google.com/js/client.js";
    script.onload = () => {
      window.gapi.load('client', () => {
        channel.getVidContent();
      });
    };

    document.body.appendChild(script);
  }

  render(){
    return(
      <div className="Channel">
        <section className={`${styles.panel} region`} >
          <div className={styles.title}>YouTube Channel</div>
          <div className={`${styles.videoScreen}`} id="video-screen"></div>
          <div className={styles.navigation}>
            <img alt='' onClick={()=>channel.getVidContent(channel.yt_prevPageToken)} src={'/images/left.png'} />
            <img alt='' onClick={()=>channel.getVidContent()} src={'/images/home.png'} />
            <img alt='' onClick={()=>channel.getVidContent(channel.yt_nextPageToken)} src={"/images/right.png"} />
          </div>
        </section>

      </div>
    );
  }
}

export default Channel;