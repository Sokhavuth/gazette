import React from 'react'
import Header from '../components/header'

class News extends React.Component {

  render(){
    return(
      <div className='News'>
        <Header active='.news' />
      </div>
    )
  }
}

export default News