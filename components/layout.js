import React from 'react'


class Layout extends React.Component {
  constructor(props){
    super(props)
    this.state = {

    }
  }
  
  render(){
    return(
      <div className='Layount'>
        <div>{this.props.children}</div>
      </div>
    )
  }
}

export default Layout