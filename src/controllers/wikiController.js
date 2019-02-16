const wikiQueries = require("../db/queries.wiki.js");
const Authorizer = require("../policies/topic");

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
 new(req, res, next){
const authorized = new Authorizer(req.user).new();
if(authorized) {
   res.render("wikis/new");
 } else {
   req.flash("notice", "You are not authorized to do that.");
   res.redirect("/wikis");
 }
},
  create(req, res, next){
  const authorized = new Authorizer(req.user).create();
  if(authorized) {
    let newWiki = {
      title: req.body.title,
      description: req.body.description
  };
   wikiQueries.addWiki(newWiki, (err, wiki) => {
    if(err){
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
      res.redirect(404, "/");
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
   const authorized = new Authorizer(req.user, wiki).edit();
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
// #1
   topicQueries.updateTopic(req, req.body, (err, topic) => {
   if(err || topic == null){
      res.redirect(404, `/topics/${req.params.id}/edit`);
    } else {
      res.redirect(`/topics/${req.params.id}`);
    }
  });
},
destroy(req, res, next){
// #1
  topicQueries.deleteTopic(req, (err, topic) => {
    if(err){
      res.redirect(500, `/topics/${req.params.id}`)
    } else {
      res.redirect(303, "/topics")
    }
  });
 }
}
