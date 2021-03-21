import React from 'react'
import styles from '../../styles/dashboard/Sidebar.module.scss'
import Link from 'next/link'

class Sidebar extends React.Component {

  render(){
    return(
      <div className={styles.Sidebar}>
        <Link href="/dashboard"><a onClick={()=>this.props.showLoading('/dashboard')} ><img alt='' src='/images/house.png' /></a></Link>
        <Link href="/dashboard"><a onClick={()=>this.props.showLoading('/dashboard')} >Home</a></Link>
        <Link href="/dashboard/posts"><a onClick={()=>this.props.showLoading('/dashboard/posts')} ><img alt='' src='/images/posting.png' /></a></Link>
        <Link href="/dashboard/posts"><a onClick={()=>this.props.showLoading('/dashboard/posts')}>Posts</a></Link>
        <Link href="/dashboard/pages"><a onClick={()=>this.props.showLoading('/dashboard/pages')}><img  alt='' src='/images/paging.png' /></a></Link>
        <Link href="/dashboard/pages"><a onClick={()=>this.props.showLoading('/dashboard/pages')}>Pages</a></Link>
        <Link href="/dashboard/categories"><a onClick={()=>this.props.showLoading('/dashboard/categories')} ><img alt='' src='/images/category.png' /></a></Link>
        <Link href="/dashboard/categories"><a onClick={()=>this.props.showLoading('/dashboard/categories')} >Categories</a></Link>
        <Link href="/dashboard/upload"><a onClick={()=>this.props.showLoading('/dashboard/upload')}><img alt='' src='/images/upload.png' /></a></Link>
        <Link href="/dashboard/upload"><a onClick={()=>this.props.showLoading('/dashboard/upload')}>Upload</a></Link>
        <Link href="/dashboard/users"><a onClick={()=>this.props.showLoading('/dashboard/users')} ><img alt='' src='/images/user.png' /></a></Link>
        <Link href="/dashboard/users"><a onClick={()=>this.props.showLoading('/dashboard/users')} >Users</a></Link>
        <img alt='' src='/images/setting.png' /><a >Setting</a>
      </div>
    )
  }
}

export default Sidebar