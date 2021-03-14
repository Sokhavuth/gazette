import React from 'react'
import Header from '../../components/dashboard/header'
import Sidebar from '../../components/dashboard/sidebar'
import Listing from '../../components/dashboard/pagelisting'
import Footer from '../../components/footer'
import styles from '../../styles/dashboard/Pages.module.scss'
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
      pageid: '',
      pagesList: '',
      pagesData: JSON.parse(this.props.pagesData),
      page: 0,
    }

  }

  componentDidMount() {
    const pagesData = JSON.parse(this.props.pagesData)
    this.setState({
      message: `Total number of pages ${pagesData.metadata.amount}`,
      date: this.props.date,
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

    if(this.state.pageid !== ''){
      Resolver = 'Updatepage'
      resolver = 'updatepage'
    }else{
      Resolver = 'Createpage'
      resolver = 'createpage'
    }

    const mutation = gql`
    mutation ${Resolver}($id: String, $title: String, $info: String, $date: String){
      ${resolver}(id: $id, title: $title, info: $info, date: $date){
        id
        title
        info
        date
        metadata
      } 
    }
    `
    const { data } = await client.mutate({
      mutation: mutation,
      variables: {
        id: this.state.pageid,
        title: document.querySelector('[name="page-title"]').value,
        info: (this.editor).getData(),
        date: document.querySelector('[name="date"]').value,
      }
    })
    
    if(this.state.pageid !== ''){
      var page = data.updatepage
    }else{
      var page = data.createpage
    }

    this.setState({message: page.metadata})

    Router.reload()
  }

  editPage = async (id) => {
    const client = new ApolloClient({
      uri: '/graphql',
      cache: new InMemoryCache()
    })

    const query = gql`
    query Editpage($id: String){
      editpage(id: $id) {
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
        id: id,
      }
    })
    
    const page = data.editpage
    
    const metadata = JSON.parse(page.metadata)
    this.setState({message: metadata.message})
    this.state.pageid = page.id

    document.querySelector('[name="page-title"]').value = page.title
    this.editor.setData(page.info)
    var datetime = new Date(parseInt(page.date))
    const date = datetime.toLocaleDateString('fr-CA')
    const time = datetime.toLocaleTimeString('it-IT')
    datetime = date+'T'+time
    document.querySelector('[name="date"]').value = datetime
    
  }

  deletePage = async (id) => {
    const client = new ApolloClient({
      uri: '/graphql',
      cache: new InMemoryCache()
    })

    const mutation = gql`
    mutation Deletepage($id: String){
      deletepage(id: $id) {
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

    const metadata = data.deletepage.metadata
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
    query Paginatepage($page: Int){
      paginatepage(page: $page) {
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
    
    const pages = data.paginatepage
    if(pages && (pages.length > 0)){
      const metadata = JSON.parse(pages[0].metadata)
      const pagesData = {
        pages: poages,
        thumbs: metadata.thumbs,
      }
      this.loadmore(pagesData)
    }else
      $('#pagination img').attr('src', '/images/load-more.png')
  }

  loadmore = (data) => {
    const pageList = []
    const pagesData = data
    
    for(let v in (pagesData.thumbs)){
      pageList.push(<li>
        <Link href={`/page/${pagesData.pages[v].id}`}><a><img className={style.thumb} alt="" src={pagesData.thumbs[v]} /></a></Link>
        <div className={style.title}>
          <Link href={`/page/${pagesData.pages[v].id}`}><a>{pagesData.pages[v].title}</a></Link>
          <div>{(new Date(parseInt(pagesData.pages[v].date))).toLocaleDateString('km-KH')}</div>
        </div>
        <div className={style.edit}>
          <a onClick={() => this.deletePage(pagesData.pages[v].id)}><img alt="" src="/images/delete.png" /></a>
          <a onClick={()=> this.editPage(pagesData.pages[v].id)}><img alt="" src="/images/edit.png" /></a>
        </div>
      </li>)
    }

    let list = this.state.pagesList
    if(list !== '') 
      this.setState({pagesList: list.concat(pageList)})
    else
      this.setState({pagesList: pageList})
    
    $('#pagination img').attr('src', '/images/load-more.png')
  }

  showLoading = (uri) => {
    if(Router.pathname !== uri)
      $('#page-loading-page').append("<img alt='' src='/images/loading.gif' />")
  }

  render(){
    if(!(this.props.logged)){
      Router.push('/login')
    }

    return(
      <div className={`${styles.Pages}`}>
        <Header title='Pages' />
        <div className={`${styles.body} region`}>
          <div className={styles.sidebar}>
            <Sidebar showLoading={this.showLoading} />
          </div>
          <div className={styles.content}>
            <input name="page-title" className={styles.pageTitle} onChange={this.onChangeHandler} type='text' placeholder='Page title' required />
            <Ckeditor getCKEditor={this.getCKEditor} />
            <div className={styles.status}>Status: {this.state.message}</div>
            <Listing paginate={this.paginate} pagesList={this.state.pagesList} deletePage={this.deletePage} editPage={this.editPage} pagesData={this.state.pagesData} />
            <div id='page-loading-page' className={styles.loadingPage}></div>
          </div>
          
          <div className={styles.sidebarRight}>
            <form className={styles.pagesForm} onSubmit={this.onSubmitHandler} method='post'>
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
  const pages = require('../../controllers/dashboard/page')
  const pagesData = await pages.getPage()
  let today = new Date()
  const date = today.toLocaleDateString('fr-CA')
  const time = today.toLocaleTimeString('it-IT')
  today = date+'T'+time
  return {
    props: {
      logged: result.logged,
      date: today,
      pagesData: pagesData,
    }
  }
}
