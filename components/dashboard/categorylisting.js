import React from 'react'
import styles from '../../styles/dashboard/Listing.module.scss'
import Link from 'next/link'

class Listing extends React.Component {
  constructor(props){
    super(props)
    this.state = {
      categoryList: []
    }
  }

  componentDidMount() {
    this.generateItems()
  }

  generateItems = () => {
    const categories = []
    const categoryData = this.props.categoryData
    
    for(let v in (categoryData.thumbs)){
      categories.push(<li>
        <Link href={`/category/${categoryData.categories[v].categoryid}`}><a><img className={`${styles.thumb}`} alt="" src={categoryData.thumbs[v]} /></a></Link>
        <div className={styles.name}>
          <Link href={`/category/${categoryData.categories[v].categoryid}`}><a>{categoryData.categories[v].categoryname}</a></Link>
          <div>{(new Date(categoryData.categories[v].date)).toLocaleDateString('km-KH')}</div>
        </div>
        <div className={styles.edit}>
          <a onClick={() => this.props.deleteUser(categoryData.categories[v].categoryid)}><img alt="" src="/images/delete.png" /></a>
          <a onClick={()=> this.props.editUser(categoryData.categories[v].categoryid)}><img alt="" src="/images/edit.png" /></a>
        </div>
      </li>)
    }
    
    this.setState({categoryList: categories})
  }

  render(){
    
    return(
      <div>
      <ul id='listing' className={`${styles.Listing}`}>
        {this.state.categoryList}
        
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