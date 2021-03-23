import React from 'react'
import styles from '../styles/Commercial.module.scss'

class Commercial extends React.Component {


  render(){
    return(
      <div className={`${styles.Commercial} region`}>
        <img alt='' src='/images/horizontal-ad.png' />
        <img alt='' src='/images/horizontal-ad.png' />
      </div>
    )
  }
}

export default Commercial