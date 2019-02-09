module.exports = {
  signup(req, res, next){
      res.post("user/signup", {title: "Signup"});
    }
   }
