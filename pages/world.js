import React from 'react'
import Header from '../components/header'
import Footer from '../components/footer'
import { ApolloClient, InMemoryCache, gql } from '@apollo/client'
import styles from '../styles/Category.module.scss'
import Commercial from '../components/commercial'
import Link from 'next/link'
import $ from 'jquery'

class Category extends React.Component {
  constructor(props){
    super(props)
    this.state = {
      postList: '',
      page: 0,
    }
    
  }

  componentDidMount(){
    this.getCategory('world news')
  }

  getCategory = async (label) => {
    $('#loadMore').attr('src', '/images/loading.gif')
    const client = new ApolloClient({
      uri: '/graphql',
      cache: new InMemoryCache()
    })
  
    const query = gql`
    query GetPostByCategory($label: String, $page: Int){
      getPostByCategory(label: $label, page: $page) {
        id
        title
        date
        metadata
      } 
    }
    `
    
    const { data } = await client.query({
      query: query,
      variables: {
        label: label,
        page: this.state.page,
      }
    })
    
    const posts = data.getPostByCategory
    if(posts.length > 0){
      const obj = JSON.parse(posts[0].metadata)
      const thumbs = obj.thumbs
      this.generateHTML(posts, thumbs)
    }else{
      $('#loadMore').attr('src', '/images/load-more.png')
    }
  }

  generateHTML = (_posts, _thumbs) => {
    let postList = []
    const posts = _posts
    const thumbs = _thumbs
    for(let v in posts){
      
      postList.push(
        <div className={styles.postOuter}>
          <Link href={`/post/${posts[v].id}`}><a><img alt='' src={thumbs[v]} /></a></Link>
          <span className={styles.date}>{new Date(parseInt(posts[v].date)).toLocaleDateString()}</span>
          <Link href={`/post/${posts[v].id}`}><a className={styles.title}>{posts[v].title}</a></Link>
        </div>
      )
    }
    const _postList = this.state.postList

    if(_postList === ''){
      this.setState({postList: postList})
    }else{
      _postList.push(postList)
      this.setState({postList: _postList})
    }
    $('#loadMore').attr('src', '/images/load-more.png')
  }

  loadMore = () => {
    this.state.page += 1
    this.getCategory('world news')
  }

  render(){
    return(
      <div className='Category'>
        <Header active='.world' />
        <Commercial />
        <div className={`${styles.Category} region`}>
          <div className={styles.content}>
            {this.state.postList}
          </div>
          <div className={styles.loadMore}>
            <img id='loadMore' onClick={this.loadMore}  alt='' src='/images/load-more.png' />
          </div>
        </div>
        <Footer />
      </div>
    )
  }
}

export default Category