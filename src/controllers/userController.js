const userQueries = require("../db/queries.users.js");
const wikiQueries = require("../db/queries.wiki.js");
const passport = require("passport");
const sgMail = require('@sendgrid/mail');
const express = require('express');
const router = express.Router();

module.exports = {

  signup(req, res, next){
      res.render("user/signup", {title: "Signup"});
    },

  create(req, res, next){
   let newUser = {
    email: req.body.email,
    username: req.body.username,
    password: req.body.password,
    passwordConfirmation: req.body.passwordConfirmation
  };

   userQueries.createUser(newUser, (err, user) => {
     if(err){
       console.log(err)
       req.flash("error", err);
       res.redirect("/user/signup");
     } else {

  passport.authenticate("local")(req, res, () => {
    req.flash("notice", "You've successfully signed in!");
    sgMail.setApiKey(process.env.SENDGRID_API_KEY);
    const msg = {
      to: 'irina6793@yahoo.com',
      from: 'test@example.com',
      subject: 'Sending with SendGrid is Fun',
      text: 'and easy to do anywhere, even with Node.js',
      html: '<strong>and easy to do anywhere, even with Node.js</strong>',
    };
        console.log("Sending message...");
    sgMail.send(msg);
    res.redirect("/");
  })
}
});
 },
  signInForm(req, res, next){
    res.render("user/sign_in");
  },

  signIn(req, res, next) {
      passport.authenticate("local", (err, user, info) => {
        if (err || !user) {
          req.flash(
            "notice",
            info ? info.message : "Sign in failed. Please try again."
          );
          return res.redirect("/user/sign_in");
        } else {
          req.logIn(user, err => {
            if (err) {
              req.flash("notice", "Sign in failed. Please try again.");
              return res.redirect(500, "/user/sign_in");
            }
            req.flash("notice", "You've succesfully signed in!");
            return res.redirect("/");
          });
        }
      })(req, res, next);
  },

signOut(req, res, next){
    req.logout();
    req.flash("notice", "You've successfully signed out!");
    res.redirect("/");
  },

  show(req, res, next){
    userQueries.getUser(req.params.id, (err, result) => {
      if(err || result.user === undefined){
        req.flash("notice", "No user found with that ID.");
        res.redirect("/");
      } else {
        res.render("user/show", {...result});
      }
  });
 }
}
