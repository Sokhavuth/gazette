import React from 'react'
import Header from '../components/header'
import Panel from '../components/panel'
import Categories from '../components/channel'
import Commercial from '../components/commercial'
import Footer from '../components/footer'

class Home extends React.Component {
  constructor(props){
    super(props)
  }

  render(){
    return(
      <div className='Home'>
        <Header active='.home' />
        <Panel postsData={this.props.postsData} />
        <Commercial />
        <Categories postsPage={this.props.postsPage} />
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