// The root provides a resolver function for each API endpoint
var root = {
  login: async (args, req) => {
    const login = require('../../../controllers/login')
    const user = await login.postLogin(args, req)
    return user
  },
  createuser: async (args, req) => {
    const author = require('../../../controllers/dashboard/author')
    const user = await author.postAuthor(args, req)
    return user
  },
  getuser: async (args) => {
    const author = require('../../../controllers/dashboard/author')
    const user = await author.getAuthors(args.userid)
    return user
  },
  updateuser: async (args, req) => {
    const author = require('../../../controllers/dashboard/author')
    const user = await author.updateAuthor(args, req)
    return user
  },
  deleteuser: async (args, req) => {
    const author = require('../../../controllers/dashboard/author')
    const user = await author.deleteAuthor(args, req)
    return user
  },
  paginateuser: async (args, req) => {
    const author = require('../../../controllers/dashboard/author')
    const users = await author.getAuthors(false, args.page)
    return users
  },
  createcategory: async (args, req) => {
    const category = require('../../../controllers/dashboard/category')
    const result = await category.insertCategory(args, req)
    return result
  },
  getcategory: async (args, req) => {
    const category = require('../../../controllers/dashboard/category')
    const result = await category.getCategories(args.categoryid, req)
    return result
  },
  updatecategory: async (args, req) => {
    const category = require('../../../controllers/dashboard/category')
    const result = await category.updateCategory(args, req)
    return result
  },
  deletecategory: async (args, req) => {
    const category = require('../../../controllers/dashboard/category')
    const result = await category.deleteCategory(args, req)
    return result
  },
  paginatecategory: async (args, req) => {
    const category = require('../../../controllers/dashboard/category')
    const result = await category.getCategories(false, args.page)
    return result
  },
  createpost: async (args, req) => {
    const post = require('../../../controllers/dashboard/post')
    const result = await post.insertPost(args, req)
    return result
  },
  editpost: async (args, req) => {
    const post = require('../../../controllers/dashboard/post')
    const result = await post.getPost(false, args.id)
    return result
  },
  updatepost: async (args, req) => {
    const post = require('../../../controllers/dashboard/post')
    const result = await post.updatePost(args, req)
    return result
  },
  deletepost: async (args, req) => {
    const post = require('../../../controllers/dashboard/post')
    const result = await post.deletePost(args, req)
    return result
  },
  paginatepost: async (args, req) => {
    const post = require('../../../controllers/dashboard/post')
    const result = await post.getPost(args.page)
    return result
  },
  createpage: async (args, req) => {
    const page = require('../../../controllers/dashboard/page')
    const result = await page.insertPage(args, req)
    return result
  },
  editpage: async (args, req) => {
    const page = require('../../../controllers/dashboard/page')
    const result = await page.getPage(false, args.id)
    return result
  },
  updatepage: async (args, req) => {
    const page = require('../../../controllers/dashboard/page')
    const result = await page.updatePage(args, req)
    return result
  },
  deletepage: async (args, req) => {
    const page = require('../../../controllers/dashboard/page')
    const result = await page.deletePage(args, req)
    return result
  },
  paginatepage: async (args, req) => {
    const page = require('../../../controllers/dashboard/page')
    const result = await page.getPage(args.page)
    return result
  },
  getOlderPost: async (args, req) => {
    const post = require('../../../controllers/dashboard/post')
    const result = await post.getPost(args.page)
    return result
  },
  getSinglePost: async (args, req) => {
    const post = require('../../../controllers/dashboard/post')
    const result = await post.getPost(false, args.id)
    return result
  },
  getSinglePage: async (args, req) => {
    const page = require('../../../controllers/dashboard/page')
    const result = await page.getPage(false, args.id)
    return result
  },
}

module.exports = root