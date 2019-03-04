const ApplicationPolicy = require("./application");
const Collaborator = require("../db/models").Collaborator;

module.exports = class WikiPolicy extends ApplicationPolicy {
  _isCollaborator() {
    return this.collaborator;
  }

  new() {
    return this.user != null;
  }

  create() {
    return this.new();
  }

  show() {
    return this._isAdmin() || this._isOwner() || this._isCollaborator();
  }

  edit() {
    return this._isOwner();
  }

  update() {
    return this.edit();
  }

  destroy() {
    this.record && (this._isOwner() || this._isAdmin());
  }
};
