import React from 'react'
import Head from 'next/head'
import styles from '../styles/Header.module.scss'
import moment from 'moment-timezone'
import Menu from './menu'

class Header extends React.Component {
  constructor(props){
    super(props)
    this.state = {
      siteTitle: 'Khmer Web Gazette',
      timezone: moment().tz("Asia/Phnom_Penh").format('MMMM Do YYYY')
    }
  }

  render(){
    return(
      <div className='Header-wrapper'>
        <Head>
          <link rel='icon' href='/images/react.png' />
          <link rel='stylesheet' href='/fonts/setup.css' />
          <link rel='stylesheet' href='/styles/globals.css' />
          <title>Khmer Web Gazette</title>
        </Head>
        <div className={`${styles.Header} region`}>
          <div className='date'>{this.state.timezone}</div>
          <h1>{this.state.siteTitle}</h1>
          <div className={styles.searchbox}>
          <form className='search' action='/search' method='get'>
            <input name='q' placeholder='Search' style={{background: '#ededed url("/images/search.png") no-repeat 9px center'}} type='search'/> 
          </form>
          </div>
        </div>
        <Menu active={this.props.active} />
      </div>
    )
  }
}

export default Header