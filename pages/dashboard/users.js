import React from 'react'
import Header from '../../components/dashboard/header'
import Sidebar from '../../components/dashboard/sidebar'
import Listing from '../../components/dashboard/listing'
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
      userid: '',
      username: '',
      email: '',
      password: '',
      role: '',
      info: '',
      date: '',
      time: '',
      message: '',
      userData: JSON.parse(this.props.userData)
    }
  }

  componentDidMount() {
    const userData = JSON.parse(this.props.userData)
    this.setState({
      message: `Total number of users ${userData.count}`,
    })
  }

  getCKEditor = (editor) => {
    this.editor = editor
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

    let Resolver = ''
    let resolver = ''

    if(this.state.userid !== ''){
      Resolver = 'Updateuser'
      resolver = 'updateuser'
    }else{
      Resolver = 'Createuser'
      resolver = 'createuser'
    }

    const mutation = gql`
    mutation ${Resolver}($userid: String, $username: String, $email: String, $password: String, $role: String, $info: String, $date: String, $time: String){
      ${resolver}(userid: $userid, username: $username, email: $email, password: $password, role: $role, info: $info, date: $date, time: $time) {
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
        userid: this.state.userid,
        username: document.querySelector('[name="username"]').value,
        email: document.querySelector('[name="email"]').value,
        password: document.querySelector('[name="password"]').value,
        role: document.querySelector('[name="role"]').value,
        info: (this.editor).getData(),
        date: document.querySelector('[name="date"]').value,
        time: document.querySelector('[name="time"]').value,
      }
    })
    if(this.state.userid !== ''){
      const metadata = data.updateuser.metadata
      this.setState({message: metadata})
    }else{
      var metadata = JSON.parse(data.createuser.metadata)
      this.setState({message: metadata.message})
    }
    
    Router.reload()
  }

  editUser = async (userid) => {
    const client = new ApolloClient({
      uri: '/graphql',
      cache: new InMemoryCache()
    })

    const query = gql`
    query Getuser($userid: String){
      getuser(userid: $userid) {
        userid
        username
        email
        role
        info
        date
        time
        metadata
      } 
    }
    `
    
    const { data } = await client.query({
      query: query,
      variables: {
        userid: userid,
      }
    })
    const user = data.getuser
    const metadata = JSON.parse(user.metadata)
    this.setState({message: metadata.message})
    this.state.userid = user.userid
    document.querySelector('[name="username"]').value = user.username
    document.querySelector('[name="email"]').value = user.email
    document.querySelector('[name="password"]').value = 'oldpassword'
    document.querySelector('[name="role"]').value = user.role
    this.editor.setData(user.info)
    document.querySelector('[name="date"]').value = (new Date(parseInt(user.date))).toLocaleDateString('fr-CA')
    document.querySelector('[name="time"]').value = (new Date(parseInt(user.date))).toLocaleTimeString('it-IT')
  }

  deleteUser = (userid) => {
    alert(userid)
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
            <Ckeditor getCKEditor={this.getCKEditor} />
            <div className={styles.status}>Status: {this.state.message}</div>
            <Listing userData={this.state.userData} editUser={this.editUser} deleteUser={this.deleteUser} />
          </div>
          <div className={styles.sidebarRight}>
            <form className={styles.usersForm} onSubmit={this.onSubmitHandler} method='post'>
              <input name='username' onChange={this.onChangeHandler} type='text' placeholder='Username' required />
              <input name='email' onChange={this.onChangeHandler} type='email' placeholder='Email' required />
              <input name='password' onChange={this.onChangeHandler} type='password' placeholder='Password' required />
              <input name='role' onChange={this.onChangeHandler} type='text' placeholder='Role' required />
              <input name='date' onChange={this.onChangeHandler} value={this.props.date} type='date' required />
              <input name='time' onChange={this.onChangeHandler} value={this.props.time} step="1" type='time' required />
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
  const users = require('../../controllers/dashboard/author')
  const userData = await users.getAuthors()
  const result = login.checklogin(req)
  const today = new Date()
  const date = today.toLocaleDateString('fr-CA')
  const time = today.toLocaleTimeString('it-IT')
  return {
    props: {
      logged: result.logged,
      date: date,
      time: time,
      userData: userData
    }
  }
}