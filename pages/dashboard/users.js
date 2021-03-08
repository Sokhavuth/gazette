import React from 'react'
import Header from '../../components/dashboard/header'
import Sidebar from '../../components/dashboard/sidebar'
import Listing from '../../components/dashboard/userlisting'
import Footer from '../../components/footer'
import styles from '../../styles/dashboard/Users.module.scss'
import style from '../../styles/dashboard/UserListing.module.scss'
import Router from 'next/router'
import dynamic from 'next/dynamic'
import { ApolloClient, InMemoryCache, gql } from '@apollo/client'
import Link from 'next/link'
import $ from 'jquery'

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
      userData: JSON.parse(this.props.userData),
      page: 0,
      usersList: ''
    }
  }

  componentDidMount() {
    const userData = JSON.parse(this.props.userData)
    this.setState({
      message: `Total number of users ${userData.count}`,
      date: this.props.date,
      time: this.props.time,
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

  deleteUser = async (userid) => {
    const client = new ApolloClient({
      uri: '/graphql',
      cache: new InMemoryCache()
    })

    const mutation = gql`
    mutation Deleteuser($userid: String){
      deleteuser(userid: $userid) {
        metadata
      } 
    }
    `
    const { data } = await client.mutate({
      mutation: mutation,
      variables: {
        userid: userid,
      }
    })

    const metadata = data.deleteuser.metadata
    this.setState({message: metadata})
    Router.reload()
  }

  paginate = async () => {
    this.state.page += 1;
    $('#pagination img').attr('src', '/images/loading.gif')

    const client = new ApolloClient({
      uri: '/graphql',
      cache: new InMemoryCache()
    })

    const query = gql`
    query Paginateuser($page: Int){
      paginateuser(page: $page) {
        userid
        username
        email
        role
        info
        date
        metadata
      } 
    }
    `
    const { data } = await client.query({
      query: query,
      variables: {
        page: this.state.page,
      }
    })
    
    const users = data.paginateuser
    if(users.length > 0){
      const metadata = JSON.parse(users[0].metadata)
      const userData = {
        authors: users,
        thumbs: metadata.thumbs,
      }
      this.loadmore(userData)
    }else
      $('#pagination img').attr('src', '/images/load-more.png')
  }

  loadmore = (data) => {
    const usersList = []
    const userData = data
    
    for(let v in (userData.thumbs)){
      usersList.push(<li>
        <Link href={`/user/${userData.authors[v].userid}`}><a><img className={style.thumb} alt="" src={userData.thumbs[v]} /></a></Link>
        <div className={style.username}>
          <Link href={`/user/${userData.authors[v].userid}`}><a>{userData.authors[v].username}</a></Link>
          <div>{userData.authors[v].role}</div>
          <div>{(new Date(parseInt(userData.authors[v].date))).toLocaleDateString('km-KH')}</div>
        </div>
        <div className={style.edit}>
          <a onClick={() => this.deleteUser(userData.authors[v].userid)}><img alt="" src="/images/delete.png" /></a>
          <a onClick={()=> this.editUser(userData.authors[v].userid)}><img alt="" src="/images/edit.png" /></a>
        </div>
      </li>)
    }

    let list = this.state.usersList
    if(list !== '') 
      this.setState({usersList: list.concat(usersList)})
    else
      this.setState({usersList: usersList})
    
    $('#pagination img').attr('src', '/images/load-more.png')
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
            <Listing usersList={this.state.usersList} userData={this.state.userData} editUser={this.editUser} deleteUser={this.deleteUser} paginate={this.paginate} />
          </div>
          
          <div className={styles.sidebarRight}>
            <form className={styles.usersForm} onSubmit={this.onSubmitHandler} method='post'>
              <input name='username' onChange={this.onChangeHandler} type='text' placeholder='Username' required />
              <input name='email' onChange={this.onChangeHandler} type='email' placeholder='Email' required />
              <input name='password' onChange={this.onChangeHandler} type='password' placeholder='Password' required />
              <input name='role' onChange={this.onChangeHandler} type='text' placeholder='Role' required />
              <input name='date' onChange={this.onChangeHandler} value={this.state.date} type='date' required />
              <input name='time' onChange={this.onChangeHandler} value={this.state.time} type='time' required />
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