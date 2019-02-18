const wikiQueries = require("../db/queries.wiki.js");
const Authorizer = require("../policies/wiki");

module.exports = {

  index(req, res, next){
    wikiQueries.getAllWikis((err, wikis) => {
    if(err){
    res.redirect(500, "static/index");
  } else {
    res.render("wikis/index", {wikis});
   }
  })
 },

new(req, res, next) {
   const authorized = new Authorizer(req.user).new();
   if (authorized) {
     console.log("User Authorized, Redirecting to `wikis/new`.");
     res.render("wikis/new");
   } else {
     console.log("Authorization FAILED!  Redirecting to `/wikis`.");

     req.flash("notice", "You are not authorized to do that.");
     res.redirect("/wikis");
   }
 },
  create(req, res, next){
    const authorized = new Authorizer(req.user).create();
    if(authorized) {

    let newWiki = {
      title: req.body.title,
      body: req.body.body
  };
   wikiQueries.addWiki(newWiki, (err, wiki) => {
    if(err){
                console.log(err);
      res.redirect(500, "/wikis/new");
    } else {
      res.redirect(303, `/wikis/${wiki.id}`);
    }
  });
} else {
  req.flash("notice", "You are not authorized to do that.");
  res.redirect(303, "/wikis");
 }
},

 show(req, res, next){
   wikiQueries.getWiki(req.params.id, (err, wiki) => {
   if(err || wiki == null){
      res.redirect(404, "/wikis");
  } else {
      res.render("wikis/show", {wiki});
   }
  });
},

edit(req, res, next){
    wikiQueries.getWiki(req.params.id, (err, wiki) => {
    if(err || wiki == null){
      res.redirect(404, "/");
    } else {
      const authorized = new Authorizer(req.user, topic).edit();
      if(authorized){
      res.render("wikis/edit", {wiki});
    } else {
      req.flash("You are not authorized to do that.")
      res.redirect(`/wikis/${req.params.id}`)
    }
   }
 });
},

update(req, res, next){
   wikiQueries.updateWiki(req, req.body, (err, wiki) => {
   if(err || wiki == null){
      res.redirect(404, `/wikis/${req.params.id}/edit`);
    } else {
      res.redirect(`/wikis/${req.params.id}`);
    }
  });
},

destroy(req, res, next){
  wikiQueries.deleteWiki(req, (err, wiki) => {
    if(err){
      res.redirect(500, `/wikis/${req.params.id}`)
    } else {
      res.redirect(303, "/wikis")
    }
  });
 }
}
