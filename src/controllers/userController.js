const userQueries = require("../db/queries.users.js");
const wikiQueries = require("../db/queries.wiki.js");
const passport = require("passport");
const sgMail = require("@sendgrid/mail");
const express = require("express");
const router = express.Router();
const stripe = require("stripe")("sk_test_3pFGtZtiPUx91Syj9CNoi6AJ");

module.exports = {
  signUp(req, res, next) {
    res.render("user/signup", { title: "Signup" });
  },

  create(req, res, next) {
    let newUser = {
      username: req.body.username,
      email: req.body.email,
      password: req.body.password,
      passwordConfirmation: req.body.passwordConfirmation
    };
    userQueries.createUser(newUser, (err, user) => {
      if (err) {
        console.log(err);
        req.flash("error", err);
        res.redirect("/user/signup");
      } else {
        passport.authenticate("local")(req, res, () => {
          req.flash("notice", "You've successfully signed in!");
          sgMail.setApiKey(process.env.SENDGRID_API_KEY);
          const msg = {
            to: "irina6793@yahoo.com",
            from: "test@example.com",
            subject: "Sending with SendGrid is Fun",
            text: "and easy to do anywhere, even with Node.js",
            html: "<strong>and easy to do anywhere, even with Node.js</strong>"
          };
          console.log("Sending message...");
          sgMail.send(msg);
          res.redirect("/");
        });
      }
    });
  },

  signInForm(req, res, next) {
    res.render("user/sign_in");
  },

  signIn(req, res, next) {
    passport.authenticate("local"),
      (function(err, user, info) {
        if (!user) {
          req.flash("notice", "Sign in failed. Please try again.");
          res.redirect("/user/sign_in");
        } else {
          req.flash("notice", "You've succesfully signed in!");
          res.redirect("/");
        }
      })(req, res, next);
  },

  signOut(req, res, next) {
    req.logout();
    req.flash("notice", "You've successfully signed out!");
    res.redirect("/");
  },

  show(req, res, next) {
    userQueries.getUser(req.params.id, (err, user) => {
      if (err || user === undefined) {
        req.flash("notice", "user not found");
        res.redirect("/");
      } else {
        res.render("user/show", { user });
      }
    });
  },

  upgradeForm(req, res, next) {
    res.render("user/upgrade");
  },

  upgrade(req, res, next) {
    const token = req.body.stripeToken;
    userQueries.upgradeUser(req, (err, user) => {
      if (err || user == null) {
        req.flash("notice", "Something went wrong. Please try again.");
        res.redirect(404, `/user/${req.params.id}`);
      } else {
        (async () => {
          const charge = await stripe.charges.create({
            amount: 1500,
            currency: "USD",
            description: "Blocipedia Upgrade",
            source: token
          });
        })();
        res.redirect(302, `/user/${req.params.id}`);
      }
    });
  },

  downgrade(req, res, next) {
    userQueries.downgradeUser(req, (err, user) => {
      if (err || user == null) {
        req.flash("notice", "Something went wrong. Please try again.");
        res.redirect(404, `/user/${req.params.id}`);
      } else {
        res.redirect(302, `/user/${req.params.id}`);
      }
    });
  }
};
