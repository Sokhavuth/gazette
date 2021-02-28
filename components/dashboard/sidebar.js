import React from 'react'
import styles from '../../styles/dashboard/Sidebar.module.scss'

class Sidebar extends React.Component {

  render(){
    return(
      <div className={styles.Sidebar}>
        <img alt='' src='/images/posting.png' /><a href="#">Posts</a>
        <img alt='' src='/images/paging.png' /><a href="#">Pages</a>
        <img alt='' src='/images/category.png' /><a href="#">Categories</a>
        <img alt='' src='/images/upload.png' /><a href="#">Upload</a>
        <img alt='' src='/images/user.png' /><a href="#">Users</a>
        <img alt='' src='/images/setting.png' /><a href="#">Setting</a>
      </div>
    )
  }
}

export default Sidebar