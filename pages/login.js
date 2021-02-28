import React from 'react'
import styles from '../styles/Login.module.scss'
import Header from '../components/header'
import { ApolloClient, InMemoryCache, gql } from '@apollo/client'
import Router from 'next/router'

class Login extends React.Component {
  constructor(props){
    super(props)
    this.state = {
      email: '',
      password: '',
      message: ''
    }
  }

  onChangeHandler = (event) => {
    let nam = event.target.name;
    let val = event.target.value;
    this.setState({[nam]: val});
  }

  onSubmitHandler = async (event) => {
    event.preventDefault();
    
    const client = new ApolloClient({
      uri: '/graphql',
      cache: new InMemoryCache()
    })

    const query = gql`
    query Login($email: String, $password: String){
      login(email: $email, password: $password) {
        userid
        username
        email
        password
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
        email: this.state.email,
        password: this.state.password
      }
    })

    if(data.login.userid){
      Router.push('/dashboard')
    }else{
      this.setState({message: data.login.metadata})
    }

  }

  render(){
    if(this.props.logged){
      Router.push('/dashboard')
    }

    return(
      <div className={`${styles.Login}`}>
        <Header active='.login' />
        
        <form className={`${styles.login_form}`} onSubmit={this.onSubmitHandler} >
          <span>Email:</span><input name='email' type='email' onChange={this.onChangeHandler} required />
          <span>Password:</span><input name='password' type='password' onChange={this.onChangeHandler} required />
          <span></span><input type='submit' value='Submit' />
          <span></span><div style={{textAlign: 'center'}}>{this.state.message}</div>
        </form>
        
      </div>
    )
  }
}

export default Login

export async function getServerSideProps({ req }){
  const login = require('../controllers/login')
  const result = login.checklogin(req)
  return {
    props: {
      logged: result.logged,
    }
  }
}