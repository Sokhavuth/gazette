import React from 'react'
import styles from '../styles/Panel.module.scss'
import Link from 'next/link'

class Panel extends React.Component {
  constructor(props){
    super(props)
    this.state = {
      postList: '',
    }

  }

  componentDidMount(){
    this.setPost()
  }

  setPost = () => {
    let postList = []
    let postData = JSON.parse(this.props.postsData)
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
  }

  render(){
    return(
      <div className={`${styles.Panel} region`}>
        {this.state.postList}
      </div>
    )
  }
}

export default Panel