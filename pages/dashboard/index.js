import React from 'react'
import Header from '../../components/dashboard/header'
import Sidebar from '../../components/dashboard/sidebar'
import Footer from '../../components/footer'
import styles from '../../styles/dashboard/Index.module.scss'

class Index extends React.Component {

  render(){
    return(
      <div className={`${styles.Index}`}>
        <Header title='Dashboard' />
        <div className={`${styles.body} region`}>
          <div className={styles.sidebar}>
            <Sidebar />
          </div>
          <div className={styles.content}>
            content
          </div>
          <div></div><Footer />
        </div>
      </div>
    )
  }
}

export default Index