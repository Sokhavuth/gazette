import React from 'react'
import Header from '../components/header'

class Home extends React.Component {

  render(){
    return(
      <div className='Home'>
        <Header active='.home' />
      </div>
    )
  }
}

export default Home