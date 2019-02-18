const Wiki = require("./models").Wiki;

module.exports = {
   getAllWikis(callback){
       return Wiki.all()
          .then((wikis) => {
             callback(null, wikis);
         })
            .catch((err) => {
               callback(err);
         })
     },

  addWiki(newWiki, callback){
    return Wiki.create({
      title: newWiki.title,
      body: newWiki.body
     })
    .then((wiki) => {
      callback(null, wiki);
    })
   .catch((err) => {
      callback(err);
    })
  },

  getWiki(id, callback){
    return Wiki.findById(id)
    .then((wiki) => {
      callback(null, wiki);
    })
      .catch((err) => {
       callback(err);
    })
  },

 updateWiki(req, updatedWiki, callback){
    return Wiki.findById(req.params.id)
    .then((wiki) => {
      if(!wiki){
        return callback("Wiki not found");
      }
      const authorized = new Authorizer(req.user, wiki).update();
      if(authorized) {
        wiki.update(updatedWiki, {
          fields: Object.keys(updatedWiki)
      })
      .then(() => {
        callback(null, wiki);
      })
      .catch((err) => {
        callback(err);
      });
    } else {
      req.flash("notice", "You are not authorized to do that.");
      callback("Forbidden");
    }
   });
  },

  deleteWiki(req, callback){
  return Wiki.findById(req.params.id)
  .then((wiki) => {

   const authorized = new Authorizer(req.user, wiki).destroy();
   if(authorized) {

   wiki.destroy()
   .then((res) => {
     callback(null, wiki);
   });
 } else {

req.flash("notice", "You are not authorized to do that.")
callback(401);
}
})
.catch((err) => {
  callback(err);
});
},
validateWiki(req, res, next) {

if(req.method === "POST") {

req.checkParams("wikiId", "must be valid").notEmpty().isInt();
req.checkDescription("title", "must be at least 5 characters in length").isLength({min: 5});
req.checkDescription("description", "must be at least 10 characters in length").isLength({min: 10});
}


const errors = req.validationErrors();

if (errors) {


req.flash("error", errors);
return res.redirect(303, req.headers.referer)
} else {
return next();
}
}
}
