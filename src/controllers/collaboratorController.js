const collaboratorQueries = require("../../src/db/queries.collaborators.js");

module.exports = {
  add(req, res, next) {
    collaboratorQueries.addCollaborator(req, (err, collaborator) => {
      if (err) {
        res.redirect(500, "static/index");
      } else {
        res.render("wikis/index", { wikis });
      }
    });
  },
  remove(req, res, next) {
    if (req.user) {
      collaboratorQueries.removeCollaborator(req, (err, collaborator) => {
        if (err) {
          req.flash("error", err);
        }
        req.flash("notice", "This user is no longer a collaborator");
        res.redirect("/collaborator");
      });
    } else {
      req.flash("notice", "Please sign in to do that.");
      res.redirect("/collaborator");
    }
  }
};
