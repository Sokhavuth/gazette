import React from 'react'
import Header from '../components/header'
import Panel from '../components/panel'
import Channel from '../components/channel'
import Commercial from '../components/commercial'
import Footer from '../components/footer'
import { ApolloClient, InMemoryCache, gql } from '@apollo/client'
import $ from 'jquery'
import deepcopy from 'deepcopy'

class Home extends React.Component {
  constructor(props){
    super(props)
    this.child = React.createRef()
    this.state = {
      page: 0,
      postList: '',
      postsData: this.props.postsData,
    }
  }

  getPost = async () => {
    $('#nav-home').attr('src', '/images/loading.gif')

    const client = new ApolloClient({
      uri: '/graphql',
      cache: new InMemoryCache()
    })

    const query = gql`
    query GetOlderPost($page: Int){
      getOlderPost(page: $page) {
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
        page: this.state.page,
      }
    })
    
    let posts = deepcopy(data.getOlderPost)
    if(posts && (posts.length > 0)){
      const metadata = JSON.parse(posts[0].metadata)

      for(let v in posts){
        posts[v].date = parseInt(posts[v].date)
      }

      const postsData = {
        posts: posts,
        thumbs: metadata.thumbs,
      }

      this.child.current.setPost(postsData)
    }else{
      this.state.page -= 1
      $('#nav-home').attr('src', '/images/home.png')
    }
      
  }

  getOlderPost = async () => {
    this.state.page += 1;
    this.getPost()
    
  }

  getNewerPost = async () => {
    if(this.state.page > 0){
      this.state.page -= 1
    }
    this.getPost()
  }

  getHomePost = async () => {
    this.state.page = 0
    this.getPost()
  }

  render(){
    return(
      <div className='Home'>
        <Header active='.home' />
        <Panel ref={this.child} postList={this.state.postList} getHomePost={this.getHomePost} getNewerPost={this.getNewerPost} getOlderPost={this.getOlderPost}  postsData={this.state.postsData} />
        <Commercial />
        <Channel />
        <Footer />
      </div>
    )
  }
}

export default Home

export async function getServerSideProps({ req }){
  const posts = require('../controllers/dashboard/post')
  const postsData = await posts.getPost()
  return {
    props: {
      postsData: postsData,
    }
  }
}