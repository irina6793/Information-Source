const ApplicationPolicy = require("./application");

module.exports = class WikiPolicy extends ApplicationPolicy {

new() {
  return this.user != null;
}

create() {
  return this.new();
}

edit() {
  return this.new();
}

update() {
  return this.edit();
}

destroy() {
  return this.update();
}
}
