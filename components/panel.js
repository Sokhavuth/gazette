import React from 'react'
import styles from '../styles/Panel.module.scss'
import Link from 'next/link'
import $ from 'jquery'

class Panel extends React.Component {
  constructor(props){
    super(props)
    this.state = {
      postList: '',
      postsData: '',
    }

  }

  static getDerivedStateFromProps(props, state) {
    return {
      postsData: JSON.parse(props.postsData), 
    }
  }

  componentDidMount(){
    this.setPost(this.state.postsData)
  }

  setPost = (json) => {
    let postList = []
    let postData = json
    
    for(let v in postData.thumbs){
      postList.push(
      <div className={styles.postOuter}>
        <Link href={postData.posts[v].id}><a><img alt='' src={postData.thumbs[v]} /></a></Link>
        <span className={styles.date}>{new Date(postData.posts[v].date).toLocaleDateString()}</span>
        <Link href={postData.posts[v].id}><a><span className={styles.title}>{postData.posts[v].title}</span></a></Link>
      </div>
      )
    }
    this.setState({postList: postList})
    $('#nav-home').attr('src', '/images/home.png')
  }

  render(){
    
    return(
      <div className={`${styles.wrapper} region`}>
        <div id='Panel' className={`${styles.Panel} `}>
          {this.state.postList}
        </div>
        <div className={styles.pagination}>
          <img onClick={this.props.getNewerPost} alt='' src='/images/left.png' />
          <img onClick={this.props.getHomePost} id='nav-home' alt='' src='/images/home.png' />
          <img onClick={this.props.getOlderPost} alt='' src='/images/right.png' />
        </div>
      </div>
    )
  }
}

export default Panel