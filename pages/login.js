import React from 'react'
import styles from '../styles/Login.module.scss'
import Header from '../components/header'

class Login extends React.Component {
  constructor(){
    super()
    this.state = {
      email: '',
      password: ''
    }
  }

  onChangeHandler = (event) => {
    let nam = event.target.name;
    let val = event.target.value;
    this.setState({[nam]: val});
  }

  onSubmitHandler = async (event) => {
    event.preventDefault();
    const option = {
      email: this.state.email,
      password: this.state.password
    }
    
  }

  render(){
    return(
      <div className={`${styles.Login}`}>
        <Header active='.login' />
        
        <form className={`${styles.login_form}`} onSubmit={this.onSubmitHandler} >
          <span>Email:</span><input name='email' type='email' onChange={this.onChangeHandler} />
          <span>Password:</span><input name='email' type='password' onChange={this.onChangeHandler} />
          <span></span><input type='submit' value='Submit' />
        </form>
        
      </div>
    )
  }
}

export default Login