module.exports = {
  signup(req, res, next){
          console.log("user controller: signup");
      res.render("user/signup", {title: "Signup"});
    }
   }
