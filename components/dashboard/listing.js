import React from 'react'
import styles from '../../styles/dashboard/Listing.module.scss'
import Link from 'next/link'

class Listing extends React.Component {
  constructor(props){
    super(props)
    this.state = {
      userList: []
    }
  }

  componentDidMount() {
    this.generateItems()
  }

  editUser = () => {
    alert()
  }

  generateItems = () => {
    const users = []
    const userData = this.props.userData
    
    for(let v in (userData.thumbs)){
      users.push(<li>
        <Link href={`/user/${userData.authors[v].userid}`}><a><img className={styles.thumb} alt="" src={userData.thumbs[v]} /></a></Link>
        <div className={styles.username}>
          <Link href={`/user/${userData.authors[v].userid}`}><a>{userData.authors[v].username}</a></Link>
          <div>{userData.authors[v].role}</div>
          <div>{(new Date(userData.authors[v].date)).toLocaleDateString('km-KH')}</div>
        </div>
        <div className={styles.edit}>
          <Link href={`/user/delete/${userData.authors[v].userid}`}><a><img alt="" src="/images/delete.png" /></a></Link>
          <Link href={`/user/edit/${userData.authors[v].userid}`}><a><img alt="" src="/images/edit.png" /></a></Link>
        </div>
      </li>)
    }
    
    this.setState({userList: users})
  }

  render(){
    
    return(
      <ul className={styles.Listing}>
        {this.state.userList}
      </ul>
    )
  }
}//end class

export default Listing