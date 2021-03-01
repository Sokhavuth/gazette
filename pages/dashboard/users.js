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
          <div className={styles.sidebarRight}>
            <form className={styles.usersForm} action='/api/users/insert' method='post'>
              <input name='username' type='text' placeholder='Username' required />
              <input name='email' type='email' placeholder='Email' required />
              <input name='password' type='password' placeholder='Password' required />
              <input name='role' type='text' placeholder='Role' required />
              <input name='date' value={this.props.date} type='date' required />
              <input name='time' value={this.props.time} type='time' required />
              <input type='submit' value='Submit' />
            </form>
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
  const today = new Date()
  const date = today.toLocaleDateString('fr-CA')
  const time = today.toLocaleTimeString('it-IT')
  return {
    props: {
      logged: result.logged,
      date: date,
      time: time
    }
  }
}