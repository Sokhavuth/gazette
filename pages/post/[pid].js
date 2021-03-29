import React from 'react'
import Header from '../../components/header'
import Footer from '../../components/footer'
import { ApolloClient, InMemoryCache, gql } from '@apollo/client'
import styles from '../../styles/Post.module.scss'
import Commercial from '../../components/commercial'
import ReactHtmlParser from 'react-html-parser'
import { DiscussionEmbed } from 'disqus-react'
import Link from 'next/link'

class Post extends React.Component {
  constructor(props){
    super(props)
    this.state = {
      post: '',
    }
    
  }

  componentDidMount(){
    this.getPost(this.props.id)
  }

  getPost = async (id) => {
    const client = new ApolloClient({
      uri: '/graphql',
      cache: new InMemoryCache()
    })
  
    const query = gql`
    query GetSinglePost($id: String){
      getSinglePost(id: $id) {
        id
        title
        info
        category
        date
        metadata
      } 
    }
    `
    
    const { data } = await client.query({
      query: query,
      variables: {
        id: id,
      }
    })
    
    const post = data.getSinglePost
    this.setState({post: post})
  }

  render(){
    return(
      <div className='Post'>
        <Header active='.post' />
        <Commercial />
        <div className={`${styles.Post} region`}>
          
          <div className={styles.sidebar}>
            
          </div>
          <div className={styles.content}>
            <div className={styles.title}>{this.state.post.title}</div>
            <div className={styles.date}>{new Date(parseInt(this.state.post.date)).toLocaleDateString()}</div>
            <div className={styles.body}>{ReactHtmlParser(this.state.post.info)}</div>
            <DiscussionEmbed
              shortname='khmerweb'
              config={
                {
                  url: `https://khmerweb-gazette.herokuapp.com/post/${this.state.post.id}`,
                  identifier: this.state.post.id,
                  title: this.state.post.title,
                  language: 'en_US' 
                }
              }
            />
          </div>
          <div className={styles.sidebar}>
            
          </div>

        </div>
        <Footer />
      </div>
    )
  }
}

export default Post

export async function getServerSideProps(context){
  const id = context.params.pid
  return {
    props: {
      id: id,
    }
  }
}