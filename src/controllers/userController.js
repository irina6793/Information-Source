module.exports = {
  signup(req, res, next){
          console.log("user controller: signup");
      res.post("user/signup", {title: "Signup"});
    }
   }
