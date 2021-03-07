import React from 'react'
import Header from '../../components/dashboard/header'
import Sidebar from '../../components/dashboard/sidebar'
import Listing from '../../components/dashboard/categorylisting'
import Footer from '../../components/footer'
import styles from '../../styles/dashboard/Categories.module.scss'
import style from '../../styles/dashboard/Listing.module.scss'
import Router from 'next/router'
import dynamic from 'next/dynamic'
import { ApolloClient, InMemoryCache, gql } from '@apollo/client'
import Link from 'next/link'
import $ from 'jquery'

const Ckeditor = dynamic(
  () => import('../../components/dashboard/ckeditor'),
  { ssr: false }
)

class Category extends React.Component {
  constructor(props){
    super(props)
    this.state = {
      message: '',
      categoryid: '',
      categoryname: '',
      date: '',
      time: '',
      categoryData: JSON.parse(this.props.categoryData),
    }
  }

  componentDidMount() {
    const categoryData = JSON.parse(this.props.categoryData)
    this.setState({
      message: `Total number of categories ${categoryData.count}`,
    })
  }

  getCKEditor = (editor) => {
    this.editor = editor
  }

  onChangeHandler = (event) => {
    let nam = event.target.name
    let val = event.target.value
    this.setState({[nam]: val})
  }

  onSubmitHandler = async (event) => {
    event.preventDefault()
  
    const client = new ApolloClient({
      uri: '/graphql',
      cache: new InMemoryCache()
    })

    let Resolver = ''
    let resolver = ''

    if(this.state.categoryid !== ''){
      Resolver = 'Updatecategory'
      resolver = 'updatecategory'
    }else{
      Resolver = 'Createcategory'
      resolver = 'createcategory'
    }

    const mutation = gql`
    mutation ${Resolver}($categoryid: String, $categoryname: String, $info: String, $date: String,  $time: String){
      ${resolver}(categoryid: $categoryid, categoryname: $categoryname, info: $info, date: $date, time: $time) {
        categoryid
        categoryname
        info
        date
        time
        metadata
      } 
    }
    `
    
    const { data } = await client.mutate({
      mutation: mutation,
      variables: {
        categoryid: this.state.categoryid,
        categoryname: document.querySelector('[name="categoryname"]').value,
        info: (this.editor).getData(),
        date: document.querySelector('[name="date"]').value,
        time: document.querySelector('[name="time"]').value,
      }
    })

    if(this.state.categoryid !== ''){
      const metadata = data.updatecategory.metadata
      this.setState({message: metadata})
    }else{
      var metadata = JSON.parse(data.createcategory.metadata)
      this.setState({message: metadata.message})
    }
    
    Router.reload()
  }

  render(){
    if(!(this.props.logged)){
      Router.push('/login')
    }

    return(
      <div className={`${styles.Categories}`}>
        <Header title='Categories' />
        <div className={`${styles.body} region`}>
          <div className={styles.sidebar}>
            <Sidebar />
          </div>
          <div className={styles.content}>
            <Ckeditor getCKEditor={this.getCKEditor} />
            <div className={styles.status}>Status: {this.state.message}</div>
            <Listing categoryData={this.state.categoryData} />
          </div>
          
          <div className={styles.sidebarRight}>
            <form className={styles.categoriesForm} onSubmit={this.onSubmitHandler} method='post'>
              <input name='categoryname' onChange={this.onChangeHandler} type='text' placeholder='Category name' required />
              <input name='date' onChange={this.onChangeHandler} value={this.props.date} type='date' required />
              <input name='time' onChange={this.onChangeHandler} value={this.props.time} step="1" type='time' required />
              <input type='submit' value='Submit' />
            </form>
          </div>
          
          <div></div><Footer /><div></div>
        </div>
      </div>
    )
  }
}

export default Category

export async function getServerSideProps({ req }){
  const login = require('../../controllers/login')
  const result = login.checklogin(req)
  const categories = require('../../controllers/dashboard/category')
  const categoryData = await categories.getCategories()
  const today = new Date()
  const date = today.toLocaleDateString('fr-CA')
  const time = today.toLocaleTimeString('it-IT')
  return {
    props: {
      logged: result.logged,
      date: date,
      time: time,
      categoryData: categoryData
    }
  }
}