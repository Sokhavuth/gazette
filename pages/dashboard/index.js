import React from 'react'
import Header from '../../components/dashboard/header'
import Sidebar from '../../components/dashboard/sidebar'
import Footer from '../../components/footer'
import styles from '../../styles/dashboard/Index.module.scss'
import Router from 'next/router'

class Index extends React.Component {
  constructor(props){
    super(props)
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
            <Sidebar />
          </div>
          <div className={styles.content}>
            content
          </div>
          <div></div><Footer />
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