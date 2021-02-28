import React from 'react'
import styles from '../styles/Footer.module.scss'

class Footer extends React.Component {

  render(){
    return(
      <div className={styles.Footer}>
        <p>&copy; 2021 <a href="https://www.khmerweb.app/">Khmer Web</a></p>
      </div>
    )
  }
}

export default Footer