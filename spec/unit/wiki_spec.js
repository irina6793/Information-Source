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
            body: "The adventures in the tallest mountain in the world",
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
          body: "Awesomens",

     }).then((wiki) => {
      expect(wiki.title).toBe("Best parts of the adventure");
      done();
    }).catch((err) => {
       console.log(err);
       done();
     });
    });
  });

describe("#setWiki()", () => {
   it("should associate a wiki and a user together", (done) => {
      Wiki.create({
       title: "Wiki 1",
       body: "1. The Wiki"
  }).then((newTopic) => {
     expect(this.post.topicId).toBe(this.topic.id);
     this.post.setTopic(newTopic).then((post) => {
      expect(post.topicId).toBe(newTopic.id);
      done();
      });
    });
    });
  });

describe("#getTopic()", () => {
    it("should return the associated topic", (done) => {
      this.post.getTopic()
      .then((associatedTopic) => {
        expect(associatedTopic.title).toBe("Expeditions to Alpha Centauri");
        done();
      });
    });
   });

describe("#setUser()", () => {
    it("should associate a post and a user together", (done) => {
      User.create({
        email: "ada@example.com",
        password: "password"
      })
      .then((newUser) => {
        expect(this.post.userId).toBe(this.user.id);
        this.post.setUser(newUser)
        .then((post) => {
          expect(this.post.userId).toBe(newUser.id);
          done();
        });
      })
    });
  });

describe("#getUser()", () => {
    it("should return the associated topic", (done) => {
      this.post.getUser()
      .then((associatedUser) => {
        expect(associatedUser.email).toBe("starman@tesla.com");
        done();
      });
    });
   });
});
