const wikiQueries = require("../db/queries.wiki.js");
const passport = require("passport");

module.exports = {
   create(req, res, next){
   let newWiki = {
    email: req.body.email,
    username: req.body.username,
    password: req.body.password,
    passwordConfirmation: req.body.passwordConfirmation
  };
   wikiQueries.createWiki(newWiki, (err, user) => {
     if(err){
       console.log(err)
       req.flash("error", err);
       res.redirect("/wiki/");
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
  update(req, res, next){
    res.render("wiki/update");
  },
  update(req, res, next){
    passport.authenticate("local")(req, res, function () {
      if(!req.user){
        req.flash("notice", "Update failed. Please try again.")
        res.redirect("/wiki/update");
      } else {
        req.flash("notice", "You've successfully updated!");
        res.redirect("/");
      }
    })
  },
  destroy(req, res, next){
    req.logout();
    req.flash("notice", "You've successfully deleted the wiki!");
    res.redirect("/");
  },
  show(req, res, next){
    wikiQueries.getWiki(req.params.id, (err, result) => {
      if(err || result.wiki === undefined){
        req.flash("notice", "No user found with that ID.");
        res.redirect("/");
      } else {
        res.render("wiki/show", {...result});
      }
  });
 }
}
