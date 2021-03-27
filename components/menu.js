import React from 'react'
import Head from 'next/head'
import styles from '../styles/Menu.module.scss'
import Link from 'next/link'

class Menu extends React.Component {
  constructor(props){
    super(props)
    this.state = {
      home: 'white',
      news: 'white',
      contact: 'white',
      menuDropdown: false
    }
  }


  mobileMenu = () => {
    var x = document.getElementById('topmenu')
    if(this.state.menuDropdown){
      x.className = styles.topnav
      this.setState({menuDropdown: false})
    }else{
      x.className += ' ' + styles.responsive
      this.setState({menuDropdown: true})
    }
  }

  render(){
    return(
      <nav className={styles.MenuWrapper} >
        <Head>
          <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/4.7.0/css/font-awesome.min.css" />
        </Head>
        <div className='region'>
        <div className={styles.topnav} id="topmenu">
          <Link href="/"><a className='home'>Home</a></Link>
          <Link href="/business"><a className='business'>Business</a></Link>
          <Link href="/world"><a className='world'>World</a></Link>
          <Link href="/contact"><a className='contact'>Contact</a></Link>
          <Link href="/about"><a className='about'>About</a></Link>
          <Link href="/login"><a className='login'>Login</a></Link>
          <a  className={styles.icon} onClick={this.mobileMenu}>
            <i className="fa fa-bars"></i>
          </a>
        </div>
        </div>
        <style jsx>{`
        ${this.props.active}{
          background: #ddd;
        }
      `}</style>
      </nav>
      
    )
  }
}

export default Menu