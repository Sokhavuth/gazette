import React from 'react'
import Header from '../../components/dashboard/header'
import Sidebar from '../../components/dashboard/sidebar'
import Listing from '../../components/dashboard/postlisting'
import Footer from '../../components/footer'
import styles from '../../styles/dashboard/Posts.module.scss'
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

class Post extends React.Component {
  constructor(props){
    super(props)
    this.state = {
      message: '',
      date: '',
      category: '',
      postid: '',
      categoryList: '',
      postsData: JSON.parse(this.props.postsData),
    }

  }

  componentDidMount() {
    const postsData = JSON.parse(this.props.postsData)
    this.setState({
      message: `Total number of posts ${postsData.metadata.amount}`,
      date: this.props.date,
    })
    this.setCategory()
  }

  setCategory = () => {
    const categoryList = []
    const categories = JSON.parse(this.props.categories)
    for(let v in categories){
      categoryList.push(<option>{categories[v].categoryname}</option>)
    }

    this.setState({categoryList: categoryList})
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

    if(this.state.postid !== ''){
      Resolver = 'Updatepost'
      resolver = 'updatepost'
    }else{
      Resolver = 'Createpost'
      resolver = 'createpost'
    }

    const mutation = gql`
    mutation ${Resolver}($id: String, $title: String, $content: String, $category: String, $date: String){
      ${resolver}(id: $id, title: $title, content: $content, category: $category, date: $date){
        id
        title
        content
        category
        date
        author
        metadata
      } 
    }
    `
    const { data } = await client.mutate({
      mutation: mutation,
      variables: {
        id: this.state.postid,
        title: document.querySelector('[name="post-title"]').value,
        content: (this.editor).getData(),
        category: document.querySelector('[name="category"]').value,
        date: document.querySelector('[name="date"]').value,
      }
    })
    
    const post = data.createpost
    this.setState({message: post.metadata})

    Router.reload()
  }

  render(){
    if(!(this.props.logged)){
      Router.push('/login')
    }

    return(
      <div className={`${styles.Posts}`}>
        <Header title='Posts' />
        <div className={`${styles.body} region`}>
          <div className={styles.sidebar}>
            <Sidebar />
          </div>
          <div className={styles.content}>
            <input name="post-title" className={styles.postTitle} onChange={this.onChangeHandler} type='text' placeholder='Post title' required />
            <Ckeditor getCKEditor={this.getCKEditor} />
            <div className={styles.status}>Status: {this.state.message}</div>
            <Listing postsData={this.state.postsData} />
          </div>
          
          <div className={styles.sidebarRight}>
            <form className={styles.postsForm} onSubmit={this.onSubmitHandler} method='post'>
              <select name='category' onChange={this.onChangeHandler}>
                {this.state.categoryList}
              </select>
              <input name='date' onChange={this.onChangeHandler} value={this.state.date} type='datetime-local' required />
              <input type='submit' value='Submit' />
            </form>
          </div>
          
          <div></div><Footer /><div></div>
        </div>
      </div>
    )
  }
}

export default Post

export async function getServerSideProps({ req }){
  const login = require('../../controllers/login')
  const result = login.checklogin(req)
  const category = require('../../controllers/dashboard/category')
  const categories = await category.getCategories(false, false, 'all')
  const posts = require('../../controllers/dashboard/post')
  const postsData = await posts.getPost()
  let today = new Date()
  const date = today.toLocaleDateString('fr-CA')
  const time = today.toLocaleTimeString('it-IT')
  today = date+'T'+time
  return {
    props: {
      logged: result.logged,
      date: today,
      categories: categories,
      postsData: postsData,
    }
  }
}
