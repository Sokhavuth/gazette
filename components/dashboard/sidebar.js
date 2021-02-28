import React from 'react'
import styles from '../../styles/dashboard/Sidebar.module.scss'
import Link from 'next/link'

class Sidebar extends React.Component {

  render(){
    return(
      <div className={styles.Sidebar}>
        <Link href="/dashboard"><a><img alt='' src='/images/house.png' /></a></Link>
        <Link href="/dashboard"><a>Home</a></Link>
        <img alt='' src='/images/posting.png' /><a>Posts</a>
        <img alt='' src='/images/paging.png' /><a>Pages</a>
        <img alt='' src='/images/category.png' /><a>Categories</a>
        <img alt='' src='/images/upload.png' /><a>Upload</a>
        <Link href="/dashboard/users"><a><img alt='' src='/images/user.png' /></a></Link>
        <Link href="/dashboard/users"><a>Users</a></Link>
        <img alt='' src='/images/setting.png' /><a >Setting</a>
      </div>
    )
  }
}

export default Sidebar