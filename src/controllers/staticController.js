module.exports = {
  index(req, res, next){
      res.render("static/index", {title: "Welcome to Blocipedia"});
    },
  user(req, res, next){
      res.render("static/user", {name: "Interesting Info"});
   }
}
