import React from 'react'
import Head from 'next/head'
import styles from '../../styles/dashboard/Header.module.scss'

class Header extends React.Component {
  constructor(props){
    super(props)
    this.state = {
      title: 'Dashboard',
      
    }
  }

  render(){
    return(
      <div className={styles.HeaderWrapper}>
        <Head>
          <link rel='icon' href='/images/react.png' />
          <link rel='stylesheet' href='/fonts/setup.css' />
          <link rel='stylesheet' href='/styles/dashboard_globals.css' />
          <title>Khmer Web Gazette: {this.props.title}</title>
        </Head>
        <div className={`${styles.Header} region`}>
          <h1>{this.props.title}</h1>
          <form className={styles.search} method='post' action='/search'>
            <select>
              <option>Post</option>
              <option>Category</option>
              <option>Page</option>
              <option>User</option>
            </select>
            <input type='text' name='query' required />
            <input type='submit' value='Search' />
          </form>
          <div className={styles.logout}>Logout</div>
        </div>
      </div>
    )
  }
}

export default Header