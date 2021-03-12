import React from 'react'
import Header from '../../components/dashboard/header'
import Sidebar from '../../components/dashboard/sidebar'
import Footer from '../../components/footer'
import styles from '../../styles/dashboard/Index.module.scss'
import Router from 'next/router'
import $ from 'jquery'

class Index extends React.Component {
  constructor(props){
    super(props)
  }

  showLoading = (uri) => {
    if(Router.pathname !== uri)
      $('#index-loading-page').append("<img alt='' src='/images/loading.gif' />")
  }

  render(){
    if(!(this.props.logged)){
      Router.push('/login')
    }

    return(
      <div className={`${styles.Index}`}>
        <Header title='Dashboard' />
        <div className={`${styles.body} region`}>
          <div className={styles.sidebar}>
            <Sidebar showLoading={this.showLoading} />
          </div>
          <div className={styles.content}>
            <div id='index-loading-page' className={styles.loadingPage}></div>
          </div>
          <div className={styles.sidebarRight}>
            Sidebar
          </div>
          <div></div><Footer /><div></div>
        </div>
      </div>
    )
  }
}

export default Index

export async function getServerSideProps({ req }){
  const login = require('../../controllers/login')
  const result = login.checklogin(req)
  return {
    props: {
      logged: result.logged,
    }
  }
}