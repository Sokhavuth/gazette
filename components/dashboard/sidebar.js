import React from 'react'
import styles from '../../styles/dashboard/Sidebar.module.scss'
import Link from 'next/link'

class Sidebar extends React.Component {

  render(){
    return(
      <div className={styles.Sidebar}>
        <Link href="/dashboard/posts"><a><img alt='' src='/images/posting.png' /></a></Link>
        <Link href="/dashboard/posts"><a>Posts</a></Link>
        <Link href="/dashboard/pages"><a><img alt='' src='/images/paging.png' /></a></Link>
        <Link href="/dashboard/pages"><a>Pages</a></Link>
        <Link href="/dashboard/categories"><a><img alt='' src='/images/category.png' /></a></Link>
        <Link href="/dashboard/categories"><a>Categories</a></Link>
        <Link href="/dashboard/upload"><a><img alt='' src='/images/upload.png' /></a></Link>
        <Link href="/dashboard/upload"><a>Upload</a></Link>
        <Link href="/dashboard/users"><a><img alt='' src='/images/user.png' /></a></Link>
        <Link href="/dashboard/users"><a>Users</a></Link>
        <Link href="/dashboard/setting"><a><img alt='' src='/images/setting.png' /></a></Link>
        <Link href="/dashboard/setting"><a>Setting</a></Link>
      </div>
    )
  }
}

export default Sidebar