import React from 'react'
import styles from '../../styles/dashboard/Listing.module.scss'
import Link from 'next/link'

class Listing extends React.Component {
  constructor(props){
    super(props)
    this.state = {
      postList: []
    }
  }

  componentDidMount() {
    this.generateItems()
  }

  generateItems = () => {
    const posts = []
    const postsData = this.props.postsData
    
    for(let v in (postsData.thumbs)){
      posts.push(<li>
        <Link href={`/post/${postsData.posts[v].id}`}><a><img className={`${styles.thumb}`} alt="" src={postsData.thumbs[v]} /></a></Link>
        <div className={styles.name}>
          <Link href={`/post/${postsData.posts[v].id}`}><a>{postsData.posts[v].title}</a></Link>
          <div>{(new Date(postsData.posts[v].date)).toLocaleDateString('km-KH')}</div>
        </div>
        <div className={styles.edit}>
          <a onClick={() => this.props.deletePost(postsData.posts[v].id)}><img alt="" src="/images/delete.png" /></a>
          <a onClick={()=> this.props.editPost(postsData.posts[v].id)}><img alt="" src="/images/edit.png" /></a>
        </div>
      </li>)
    }
    
    this.setState({postList: posts})
  }

  render(){
    
    return(
      <div>
      <ul id='listing' className={`${styles.Listing}`}>
        {this.state.postList}
        {this.props.postsList}
      </ul>

      <ul className={styles.Listing}>
        <li>
          <div></div><div id='pagination' className={styles.pagination}><img onClick={this.props.paginate} alt="" src="/images/load-more.png" /></div><div></div>
        </li>
      </ul>
      </div>
    )
  }
}//end class

export default Listing