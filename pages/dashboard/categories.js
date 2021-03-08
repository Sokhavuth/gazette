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
      page: 0,
      categoriesList: '',
    }
  }

  componentDidMount() {
    const categoryData = JSON.parse(this.props.categoryData)
    this.setState({
      message: `Total number of categories ${categoryData.count}`,
      date: this.props.date,
      time: this.props.time
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

  editCategory = async (categoryid) => {
    const client = new ApolloClient({
      uri: '/graphql',
      cache: new InMemoryCache()
    })

    const query = gql`
    query Getcategory($categoryid: String){
      getcategory(categoryid: $categoryid) {
        categoryid
        categoryname
        info
        date
        time
        metadata
      } 
    }
    `
    const { data } = await client.query({
      query: query,
      variables: {
        categoryid: categoryid,
      }
    })

    const category = data.getcategory
    const metadata = JSON.parse(category.metadata)
    this.setState({message: metadata.message})
    this.state.categoryid = category.categoryid

    document.querySelector('[name="categoryname"]').value = category.categoryname
    this.editor.setData(category.info)
    document.querySelector('[name="date"]').value = (new Date(parseInt(category.date))).toLocaleDateString('fr-CA')
    document.querySelector('[name="time"]').value = (new Date(parseInt(category.date))).toLocaleTimeString('it-IT')
  }

  deleteCategory = async (categoryid) => {
    const client = new ApolloClient({
      uri: '/graphql',
      cache: new InMemoryCache()
    })

    const mutation = gql`
    mutation Deletecategory($categoryid: String){
      deletecategory(categoryid: $categoryid) {
        metadata
      } 
    }
    `
    const { data } = await client.mutate({
      mutation: mutation,
      variables: {
        categoryid: categoryid,
      }
    })

    const metadata = data.deletecategory.metadata
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
    query Paginatecategory($page: Int){
      paginatecategory(page: $page) {
        categoryid
        categoryname
        info
        date
        time
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
    
    const categories = data.paginatecategory
    if(categories.length > 0){
      const metadata = JSON.parse(categories[0].metadata)
      const categoryData = {
        categories: categories,
        thumbs: metadata.thumbs,
      }
      this.loadmore(categoryData)
    }else
      $('#pagination img').attr('src', '/images/load-more.png')
  }

  loadmore = (data) => {
    const categoryList = []
    const categoryData = data
    
    for(let v in (categoryData.thumbs)){
      categoryList.push(<li>
        <Link href={`/category/${categoryData.categories[v].categoryid}`}><a><img className={style.thumb} alt="" src={categoryData.thumbs[v]} /></a></Link>
        <div className={style.categoryname}>
          <Link href={`/category/${categoryData.categories[v].categoryid}`}><a>{categoryData.categories[v].categoryname}</a></Link>
          <div>{(new Date(parseInt(categoryData.categories[v].date))).toLocaleDateString('km-KH')}</div>
        </div>
        <div className={style.edit}>
          <a onClick={() => this.deleteCategory(categoryData.categories[v].categoryid)}><img alt="" src="/images/delete.png" /></a>
          <a onClick={()=> this.editCategory(categoryData.categories[v].categoryid)}><img alt="" src="/images/edit.png" /></a>
        </div>
      </li>)
    }

    let list = this.state.categoriesList
    if(list !== '') 
      this.setState({categoriesList: list.concat(categoryList)})
    else
      this.setState({categoriesList: categoryList})
    
    $('#pagination img').attr('src', '/images/load-more.png')
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
            <Listing categoriesList={this.state.categoriesList} paginate={this.paginate} deleteCategory={this.deleteCategory} editCategory={this.editCategory} categoryData={this.state.categoryData} />
          </div>
          
          <div className={styles.sidebarRight}>
            <form className={styles.categoriesForm} onSubmit={this.onSubmitHandler} method='post'>
              <input name='categoryname' onChange={this.onChangeHandler} type='text' placeholder='Category name' required />
              <input name='date' onChange={this.onChangeHandler} value={this.state.date} type='date' required />
              <input name='time' onChange={this.onChangeHandler} value={this.state.time}  type='time' required />
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