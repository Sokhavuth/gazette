export default (req, res) => {

  console.log(req.session);
  res.redirect('/')
  
}