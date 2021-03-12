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
      postsList: '',
      postsData: JSON.parse(this.props.postsData),
      page: 0,
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
    mutation ${Resolver}($id: String, $title: String, $info: String, $category: String, $date: String){
      ${resolver}(id: $id, title: $title, info: $info, category: $category, date: $date){
        id
        title
        info
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
        info: (this.editor).getData(),
        category: document.querySelector('[name="category"]').value,
        date: document.querySelector('[name="date"]').value,
      }
    })
    
    if(this.state.postid !== ''){
      var post = data.updatepost
    }else{
      var post = data.createpost
    }

    this.setState({message: post.metadata})

    Router.reload()
  }

  editPost = async (id) => {
    const client = new ApolloClient({
      uri: '/graphql',
      cache: new InMemoryCache()
    })

    const query = gql`
    query Editpost($id: String){
      editpost(id: $id) {
        id
        title
        info
        category
        date
        metadata
      } 
    }
    `
    
    const { data } = await client.query({
      query: query,
      variables: {
        id: id,
      }
    })
    
    const post = data.editpost
    
    const metadata = JSON.parse(post.metadata)
    this.setState({message: metadata.message})
    this.state.postid = post.id

    document.querySelector('[name="post-title"]').value = post.title
    document.querySelector('[name="category"]').value = post.category
    this.editor.setData(post.info)
    var datetime = new Date(parseInt(post.date))
    const date = datetime.toLocaleDateString('fr-CA')
    const time = datetime.toLocaleTimeString('it-IT')
    datetime = date+'T'+time
    document.querySelector('[name="date"]').value = datetime
    
  }

  deletePost = async (id) => {
    const client = new ApolloClient({
      uri: '/graphql',
      cache: new InMemoryCache()
    })

    const mutation = gql`
    mutation Deletepost($id: String){
      deletepost(id: $id) {
        metadata
      } 
    }
    `
    const { data } = await client.mutate({
      mutation: mutation,
      variables: {
        id: id,
      }
    })

    const metadata = data.deletepost.metadata
    this.setState({message: metadata})
    Router.reload()
  }

  paginate = async () => {
    this.state.page += 1;
    $('#pagination img').attr('src', '/images/loading.gif')

    const client = new ApolloClient({
      uri: '/graphql',
      cache: new InMemoryCache()
    })

    const query = gql`
    query Paginatepost($page: Int){
      paginatepost(page: $page) {
        id
        title
        info
        date
        metadata
      } 
    }
    `
    const { data } = await client.query({
      query: query,
      variables: {
        page: this.state.page,
      }
    })
    
    const posts = data.paginatepost
    if(posts && (posts.length > 0)){
      const metadata = JSON.parse(posts[0].metadata)
      const postsData = {
        posts: posts,
        thumbs: metadata.thumbs,
      }
      this.loadmore(postsData)
    }else
      $('#pagination img').attr('src', '/images/load-more.png')
  }

  loadmore = (data) => {
    const postList = []
    const postsData = data
    
    for(let v in (postsData.thumbs)){
      postList.push(<li>
        <Link href={`/post/${postsData.posts[v].id}`}><a><img className={style.thumb} alt="" src={postsData.thumbs[v]} /></a></Link>
        <div className={style.title}>
          <Link href={`/post/${postsData.posts[v].id}`}><a>{postsData.posts[v].title}</a></Link>
          <div>{(new Date(parseInt(postsData.posts[v].date))).toLocaleDateString('km-KH')}</div>
        </div>
        <div className={style.edit}>
          <a onClick={() => this.deletePost(postsData.posts[v].id)}><img alt="" src="/images/delete.png" /></a>
          <a onClick={()=> this.editPost(postsData.posts[v].id)}><img alt="" src="/images/edit.png" /></a>
        </div>
      </li>)
    }

    let list = this.state.postsList
    if(list !== '') 
      this.setState({postsList: list.concat(postList)})
    else
      this.setState({postsList: postList})
    
    $('#pagination img').attr('src', '/images/load-more.png')
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
            <Listing paginate={this.paginate} postsList={this.state.postsList} deletePost={this.deletePost} editPost={this.editPost} postsData={this.state.postsData} />
          </div>
          
          <div className={styles.sidebarRight}>
            <form className={styles.postsForm} onSubmit={this.onSubmitHandler} method='post'>
              <select name='category' onChange={this.onChangeHandler}>
                {this.state.categoryList}
              </select>
              <input name='date' onChange={this.onChangeHandler} value={this.state.date} step="1" type='datetime-local' required />
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
