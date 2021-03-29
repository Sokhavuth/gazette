import React from 'react'
import Header from '../components/header'
import Footer from '../components/footer'
import styles from '../styles/Search.module.scss'
import Commercial from '../components/commercial'
import Link from 'next/link'

class Search extends React.Component {
  constructor(props){
    super(props)
    this.state = {
      posts: JSON.parse(this.props.posts),
      titleList: '',
    }
  }

  componentDidMount(){
    this.generateTitle()
  }

  generateTitle = () => {
    const titleList = []
    const posts = this.state.posts

    for(let v in posts){
      titleList.push(
        <Link href={`/post/${posts[v].id}`}><a className={styles.postTitle}>{posts[v].title}</a></Link>
      )
    }
    this.setState({titleList: titleList})
  }

  render(){
    return(
      <div className='Page'>
        <Header active='.page' />
        <Commercial />
        <div className={`${styles.Page} region`}>
          <div className={styles.sidebar}></div>
          <div className={styles.content}>
            <div className={styles.title}>Search Result:</div>
            {this.state.titleList}
          </div>
          <div className={styles.sidebar}></div>
        </div>
        <Footer />
      </div>
    )
  }
}

export default Search

export async function getServerSideProps( {query} ){
  const q = query.q
  const post = require('../controllers/dashboard/post')
  const posts = await post.searchPost(q)
  return {
    props: {
      posts: posts,
    }
  }
}