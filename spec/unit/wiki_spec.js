const sequelize = require("../../src/db/models/index").sequelize;
const Wiki = require("../../src/db/models").Wiki;
const User = require("../../src/db/models").User;

describe("Wiki", () => {

  beforeEach((done) => {
       this.wiki = this.wiki;
       sequelize.sync({force: true}).then((res) => {

        User.create({

          email: "dasha@gmail.com",
          password: "new"
        }).then((user) => {
          Wiki.create({
            title: "Expeditions to Mount Everest",
            description: "The adventures in the tallest mountain in the world",
          }),

        }).then((wiki) => {
              this.wiki = wiki;
              done();
          })
        })
      });
  });
    describe("#create()", () => {
        it("should create a wiki object with a title, and body", (done) => {
        Wiki.create({
          title: "Best parts of the adventure",
          description: "Awesomens",

     }).then((wiki) => {
      expect(wiki.title).toBe("Best parts of the adventure");

      //expect(topic.topicId).toBe(this.topic.id);
      done();
    }).catch((err) => {
       console.log(err);
       done();
     });
    });
  });
});
