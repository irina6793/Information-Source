const sequelize = require("../../src/db/models/index").sequelize;
const Wiki = require("../../src/db/models").Wiki;
const User = require("../../src/db/models").User;

describe("Wiki", () => {
   beforeEach((done) => {
      sequelize.sync({force: true})
       .then(() => {
        done();
  })
    .catch((err) => {
     console.log(err);
     done();
   });
});

describe("#create()", () => {
    it("should create a Wiki object with a valid email and password", (done) => {
      Wiki.create({
        title: "The Struggles and Adventures",
        body: "The difficulty in money management and travel"
      })
      .then((wiki) => {
        expect(wiki.title).toBe("The Struggles and Adventures");
        expect(wiki.body.toBe("The difficulty in money management and travel");
        done();
      })
      .catch((err) => {
        console.log(err);
        done();
      });
    });

// #3
   it("should not create a wiki with missing title and body", (done) => {
     Wiki.create({
       title: "The Struggles and Adventures",
       body: "The difficulty in money management and travel"
     })
     .then((wiki) => {
       // The code in this block will not be evaluated since the validation error
       // will skip it. Instead, we'll catch the error in the catch block below
       // and set the expectations there.
       done();
     })
     .catch((err) => {

// #4
      expect(err.message).toContain("Error: must be a valid email");
      done();
    });
  });
});
