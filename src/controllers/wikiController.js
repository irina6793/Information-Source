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
             body: req.body.body,
             userId: req.user.id
         };
              console.log('My newWiki: ', newWiki);
              wikiQueries.addWiki(newWiki, (err, wiki) => {
              if(err){
                   console.log(err);
                  res.redirect(500, "/wikis/new");
             } else {
               console.log(`Wiki Added, sending to "/wikis/${wiki.id}"`);
                 res.redirect(303, `/wikis/${wiki.id}`);
             }
         });
             } else {
               console.log("Wiki NOT Added, authorization failed.");
               console.log(`Redirecting to "/wikis/${wiki.id}"`);
                 req.flash("notice", "You are not authorized to do that.");
                 res.redirect(303, "/wikis");
            }
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
    console.log(`No Wiki was deleted`);

       wikiQueries.deleteWiki(req.params.id, (err, wiki) => {
         if(err || wiki == null ){
           console.log(`No Wiki was deleted`);

           res.redirect(404, "/");
         } else {
           console.log(` Wiki was deleted`);

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
