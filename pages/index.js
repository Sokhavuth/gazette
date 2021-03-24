import React from 'react'
import Header from '../components/header'
import Panel from '../components/panel'
import Channel from '../components/channel'
import Commercial from '../components/commercial'
import Footer from '../components/footer'
import { ApolloClient, InMemoryCache, gql } from '@apollo/client'
import $ from 'jquery'

class Home extends React.Component {
  constructor(props){
    super(props)
    this.state = {
      page: 0,
      label: '',
    }
  }

  getOlderPost = async () => {
    this.state.page += 1;
    $('#nav-home').attr('src', '/images/loading.gif')

    const client = new ApolloClient({
      uri: '/graphql',
      cache: new InMemoryCache()
    })

    const query = gql`
    query GetOlderPost($page: Int, $label: String){
      getOlderPost(page: $page, label: $label) {
        id
        title
        date
      } 
    }
    `
    const { data } = await client.query({
      query: query,
      variables: {
        page: this.state.page,
      }
    })
    
    const posts = data.paginatepost
    if(posts && (posts.length > 0)){
      const metadata = JSON.parse(posts[0].metadata)
      const postsData = {
        posts: posts,
        thumbs: metadata.thumbs,
      }
      this.loadmore(postsData)
    }else
      $('#pagination img').attr('src', '/images/load-more.png')
  }

  render(){
    return(
      <div className='Home'>
        <Header active='.home' />
        <Panel postsData={this.props.postsData} />
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