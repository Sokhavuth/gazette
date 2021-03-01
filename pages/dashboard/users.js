import React from 'react'
import Header from '../../components/dashboard/header'
import Sidebar from '../../components/dashboard/sidebar'
import Footer from '../../components/footer'
import styles from '../../styles/dashboard/Users.module.scss'
import Router from 'next/router'
import dynamic from 'next/dynamic'
import { ApolloClient, InMemoryCache, gql } from '@apollo/client'

const Ckeditor = dynamic(
  () => import('../../components/dashboard/ckeditor'),
  { ssr: false }
)

class Index extends React.Component {
  constructor(props){
    super(props)
    this.state = {
      username: '',
      email: '',
      password: '',
      role: '',
      info: '',
      date: '',
      time: '',
      message: ''
    }
  }

  getCKEditorContent = (content) => {
    this.setState({info: content})
  }

  onChangeHandler = (event) => {
    let nam = event.target.name
    let val = event.target.value
    this.setState({[nam]: val})
  }

  onSubmitHandler = async (event) => {
    event.preventDefault()
  
    const client = new ApolloClient({
      uri: '/graphql',
      cache: new InMemoryCache()
    })

    const mutation = gql`
    mutation Create($username: String, $email: String, $password: String, $role: String, $info: String, $date: String, $time: String){
      create(username: $username, email: $email, password: $password, role: $role, info: $info, date: $date, time: $time) {
        userid
        username
        email
        password
        role
        info
        date
        time
        metadata
      } 
    }
    `

    const { data } = await client.mutate({
      mutation: mutation,
      variables: {
        username: this.state.username,
        email: this.state.email,
        password: this.state.password,
        role: this.state.role,
        info: this.state.info,
        date: document.querySelector('[name="date"]').value,
        time: document.querySelector('[name="time"]').value,
      }
    })
    this.setState({message: data.create.metadata})
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
            <Ckeditor getCKEditorContent={this.getCKEditorContent} />
            <div className={styles.status}>Status: {this.state.message}</div>
          </div>
          <div className={styles.sidebarRight}>
            <form className={styles.usersForm} onSubmit={this.onSubmitHandler} method='post'>
              <input name='username' onChange={this.onChangeHandler} type='text' placeholder='Username' required />
              <input name='email' onChange={this.onChangeHandler} type='email' placeholder='Email' required />
              <input name='password' onChange={this.onChangeHandler} type='password' placeholder='Password' required />
              <input name='role' onChange={this.onChangeHandler} type='text' placeholder='Role' required />
              <input name='date' onChange={this.onChangeHandler} value={this.props.date} type='date' required />
              <input name='time' onChange={this.onChangeHandler} value={this.props.time} type='time' required />
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