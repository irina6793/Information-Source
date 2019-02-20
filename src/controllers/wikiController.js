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
        let newWiki = {
             title: req.body.title,
             body: req.body.body,
             userId: req.user.id
         };
        wikiQueries.addWiki(req.params.id, (err, wiki) => {
        if(err || wiki == null){
            res.redirect(500, "/wikis/new");
     } else {
           res.redirect(303, `/wikis/${wiki.id}`);
             }
         });
  },

  show(req, res, next){
         wikiQueries.getWiki(req.params.id, (err, wiki) => {
           if(err || wiki == null){
              console.log(`No Wiki was found with id: ${req.params.id}`);
                   res.redirect(404, "/wikis");
           } else {
             console.log(`Success! Wiki was found with id: ${req.params.id}`);
                res.render("wikis/show", {wiki});
           }
       });
     },

  destroy(req, res, next){
     wikiQueries.deleteWiki(req, (err, wiki) => {
         if(err || wiki == null ){
           res.redirect(404, `/wikis/${wiki.id}`);
         } else {
            res.redirect("/wikis")
         }
    });
  },

 edit(req, res, next){
    wikiQueries.getWiki(req.params.id, (err, wiki) => {
    if(err || wiki == null){
      res.redirect(404, "/");
    } else {
      res.render("wikis/edit", {wiki})
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
}
