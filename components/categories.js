import React from 'react'
import styles from '../styles/Categories.module.scss'
import Link from 'next/link'

class Categories extends React.Component {
  constructor(props){
    super(props)
    this.state = {
      postsPage: JSON.parse(this.props.postsPage),
      category1: '',
      category2: '',
    }
  }

  componentDidMount(){
    this.setCategory1()
    this.setCategory2()
  }

  setCategory1 = () => {
    let category1 = []
    let posts = (this.state.postsPage).posts
    let thumbs = (this.state.postsPage).thumbs

    for(let v in [0,1,2]){
      category1.push(
        <div className={styles.postOuter}>
          <Link href={`/post/${posts[v].id}`}><a><img alt='' src={thumbs[v]} /></a></Link>
          <div className={styles.date}>{new Date(posts[v].date).toLocaleDateString()}</div>
          <div className={styles.postTitle} ><Link href={`/post/${posts[v].id}`}><a>{posts[v].title}</a></Link></div>
        </div>
      )
    }
    this.setState({category1: category1})
  }

  setCategory2 = () => {
    let category2 = []
    let posts = (this.state.postsPage).posts
    let thumbs = (this.state.postsPage).thumbs
    for(let v in {3:1,4:1,5:1}){
      category2.push(
        <div className={styles.postOuter}>
          <Link href={`/post/${posts[v].id}`}><a><img alt='' src={thumbs[v]} /></a></Link>
          <div className={styles.date}>{new Date(posts[v].date).toLocaleDateString()}</div>
          <div className={styles.postTitle} ><Link href={`/post/${posts[v].id}`}><a>{posts[v].title}</a></Link></div>
        </div>
      )
    }
    this.setState({category2: category2})
  }

  render(){
    return(
      <div className={`${styles.Categories} region`}>
        <div className={styles.category}>
          <div className={styles.title}>
            category1
          </div>
          {this.state.category1}
        </div>
        <div className={`${styles.category} ${styles.category2}`}>
          <div className={styles.title}>
            YouTube Channel
          </div>
          <div className={styles.player}></div>
        </div>
        <div className={styles.category}>
          <div className={styles.title}>
            category3
          </div>
          {this.state.category2}
        </div>
        
        
      </div>
    )
  }
}

export default Categories