import React from 'react'
import Header from '../../components/dashboard/header'
import Sidebar from '../../components/dashboard/sidebar'
import Footer from '../../components/footer'
import styles from '../../styles/dashboard/Users.module.scss'
import Router from 'next/router'
import dynamic from 'next/dynamic'

const Ckeditor = dynamic(
  () => import('../../components/dashboard/ckeditor'),
  { ssr: false }
)

class Index extends React.Component {
  constructor(props){
    super(props)
  }

  render(){
    if(!(this.props.logged)){
      Router.push('/login')
    }
    
    return(
      <div className={`${styles.Users}`}>
        <Header title='Users' />
        <div className={`${styles.body} region`}>
          <div className={styles.sidebar}>
            <Sidebar />
          </div>
          <div className={styles.content}>
            <Ckeditor />
          </div>
          <div className={styles.sidebarRight}>Sidebar</div>
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