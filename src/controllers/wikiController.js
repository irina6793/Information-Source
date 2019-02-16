const wikiQueries = require("../db/queries.wiki.js");
const userQueries = require("../db/queries.users.js");

module.exports = {

  index(req, res, next) {
      WikiQueries.getAllWikis((err, wikis) => {
        if(err){
         res.redirect(500, "static/index");
    } else {
         res.render("wikis/index", {wikis});
      }
    })
  },








   create(req, res, next){
   wikiQueries.createWiki(newWiki, (err, user) => {
     if(err){
       req.flash("error", err);
       res.redirect("/wiki/");
     } else {
       res.redirect("/wiki/");
   }
 })
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
