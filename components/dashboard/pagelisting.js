import React from 'react'
import styles from '../../styles/dashboard/Listing.module.scss'
import Link from 'next/link'

class Listing extends React.Component {
  constructor(props){
    super(props)
    this.state = {
      pageList: []
    }
  }

  componentDidMount() {
    this.generateItems()
  }

  generateItems = () => {
    const pages = []
    const pagesData = this.props.pagesData
    
    for(let v in (pagesData.thumbs)){
      pages.push(<li>
        <Link href={`/page/${pagesData.pages[v].id}`}><a><img className={`${styles.thumb}`} alt="" src={pagesData.thumbs[v]} /></a></Link>
        <div className={styles.name}>
          <Link href={`/page/${pagesData.pages[v].id}`}><a>{pagesData.pages[v].title}</a></Link>
          <div>{(new Date(pagesData.pages[v].date)).toLocaleDateString('km-KH')}</div>
        </div>
        <div className={styles.edit}>
          <a onClick={() => this.props.deletePage(pagesData.pages[v].id)}><img alt="" src="/images/delete.png" /></a>
          <a onClick={() => this.props.editPage(pagesData.pages[v].id)}><img alt="" src="/images/edit.png" /></a>
        </div>
      </li>)
    }
    
    this.setState({pageList: pages})
  }

  render(){
    
    return(
      <div>
      <ul id='listing' className={`${styles.Listing}`}>
        {this.state.pageList}
        {this.props.pagesList}
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