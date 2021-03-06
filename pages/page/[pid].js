import React from 'react'
import Header from '../../components/header'
import Footer from '../../components/footer'
import Sidebarleft from '../../components/sidebarleft'
import Sidebarright from '../../components/sidebarright'
import { ApolloClient, InMemoryCache, gql } from '@apollo/client'
import styles from '../../styles/Page.module.scss'
import Commercial from '../../components/commercial'
import ReactHtmlParser from 'react-html-parser'

class Page extends React.Component {
  constructor(props){
    super(props)
    this.state = {
      page: '',
    }
    
  }

  componentDidMount(){
    this.getPage(this.props.id)
  }

  getPage = async (id) => {
    const client = new ApolloClient({
      uri: '/graphql',
      cache: new InMemoryCache()
    })
  
    const query = gql`
    query GetSinglePage($id: String){
      getSinglePage(id: $id) {
        id
        title
        info
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
    
    const page = data.getSinglePage
    this.setState({page: page})
  }

  render(){
    return(
      <div className='Page'>
        <Header active='.page' />
        <Commercial />
        <div className={`${styles.Page} region`}>
          <div className={styles.sidebar}>
            <Sidebarleft />
          </div>
          <div className={styles.content}>
            <div className={styles.title}>{this.state.page.title}</div>
            <div className={styles.body}>{ReactHtmlParser(this.state.page.info)}</div>
          </div>
          <div className={styles.sidebar}>
            <Sidebarright />
          </div>
        </div>
        <Footer />
      </div>
    )
  }
}

export default Page

export async function getServerSideProps(context){
  const id = context.params.pid
  return {
    props: {
      id: id,
    }
  }
}