import React from 'react'
import styles from '../../styles/dashboard/UserListing.module.scss'
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
          <a onClick={() => this.props.deleteUser(userData.authors[v].userid)}><img alt="" src="/images/delete.png" /></a>
          <a onClick={()=> this.props.editUser(userData.authors[v].userid)}><img alt="" src="/images/edit.png" /></a>
        </div>
      </li>)
    }
    
    this.setState({userList: users})
  }

  render(){
    
    return(
      <div>
      <ul id='listing' className={styles.Listing}>
        {this.state.userList}
        {this.props.usersList}
      </ul>

      <ul className={styles.Listing}>
        <li>
          <div></div><div id='pagination' className={styles.pagination}><img onClick={this.props.paginate} alt="" src="/images/load-more.png" /></div><div></div>
        </li>
      </ul>
      </div>
    )
  }
}//end class

export default Listing