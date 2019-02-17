module.exports = class ApplicationPolicy {

constructor(user) {
  this.user = user;
}

new() {
  return this.new();
}

create() {
  return this.new();
}

show() {
  return true;
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
