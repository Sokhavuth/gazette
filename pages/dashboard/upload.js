import React from 'react'
import Header from '../../components/dashboard/header'
import Sidebar from '../../components/dashboard/sidebar'
import Footer from '../../components/footer'
import styles from '../../styles/dashboard/Upload.module.scss'
import Router from 'next/router'
import $ from 'jquery'

class Upload extends React.Component {
  constructor(props){
    super(props)
  }

  showLoading = (uri) => {
    if(Router.pathname !== uri)
      $('#upload-loading-page').append("<img alt='' src='/images/loading.gif' />")
  }

  render(){
    if(!(this.props.logged)){
      Router.push('/login')
    }

    return(
      <div className={`${styles.Upload}`}>
        <Header title='Upload' />
        <div className={`${styles.body} region`}>
          <div className={styles.sidebar}>
            <Sidebar showLoading={this.showLoading} />
          </div>
          <div className={styles.content}>
            <form action='/api/upload' method="post" encType="multipart/form-data">
              <input type="file" name="upload" /><br/>
              <input type='submit' value='Submit' />
            </form>
            <div id='upload-loading-page' className={styles.loadingPage}></div>
          </div>
          <div className={styles.sidebarRight}>
            
          </div>
          <div></div><Footer /><div></div>
        </div>
      </div>
    )
  }
}

export default Upload

export async function getServerSideProps({ req }){
  const login = require('../../controllers/login')
  const result = login.checklogin(req)
  return {
    props: {
      logged: result.logged,
    }
  }
}