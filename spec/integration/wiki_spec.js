const request = require("request");
const server = require("../../src/server");
const base = "http://localhost:3000/users/";
const Wiki = require("../../src/db/models").Wiki;
const User = require("../../src/db/models").User;
const sequelize = require("../../src/db/models/index").sequelize;

describe("routes : wikis", () => {
  beforeEach(done => {
    this.wiki;
    this.user;
    sequelize.sync({ force: true }).then(() => {
      Wiki.create({
        title: "My new Wiki",
        body: "Testing Wiki"
      })
        .then(wiki => {
          this.wiki = wiki;
          done();
        })
        .catch(err => {
          console.log(err);
          done();
        });
    });
  });

  // context of admin user
  describe("admin user performing CRUD actions for Wiki", () => {
    beforeEach(done => {
      // before each suite in admin context
      User.create({
        // mock authentication
        email: "irina6793@yahoo.com",
        password: "techjob2019",
        role: "admin" // mock authenticate as admin user
      }).then(user => {
        request.get(
          {
            // mock authentication
            url: "http://localhost:3000/auth/fake",
            form: {
              role: user.role, // mock authenticate as admin user
              userId: user.id,
              email: user.email
            }
          },
          (err, res, body) => {
            done();
          }
        );
      });
    });

    describe("GET /wikis", () => {
      it("should return a status code 200 and all wikis", done => {
        request.get(base, (err, res, body) => {
          expect(res.statusCode).toBe(200);
          expect(err).toBeNull();
          expect(body).toContain("Wikis");
          done();
        });
      });
    });

    describe("GET /wikis/new", () => {
      it("should render a view with a new wiki form", done => {
        request.get(`${base}new`, (err, res, body) => {
          expect(err).toBeNull();
          expect(body).toContain("New Wiki");
          done();
        });
      });
    });

    describe("POST /wikis/create", () => {
      const options = {
        url: `${base}create`,
        form: {
          title: "Naional Emergency",
          body: "Abuse of power",
          private: false
        }
      };
      it("should create a new wiki and redirect", done => {
        request.post(options, (err, res, body) => {
          Wiki.findOne({ where: { title: "National Emergency" } })
            .then(wiki => {
              expect(wiki.title).toBe("National Emergency");
              expect(wiki.body).toBe("Abuse of power");
              done();
            })
            .catch(err => {
              console.log(err);
              done();
            });
        });
      });
    });

    describe("GET /wikis/:id", () => {
      it("should render a view with the selected wiki", done => {
        request.get(`${base}${this.wiki.id}`, (err, res, body) => {
          expect(err).toBeNull();
          expect(body).toContain("National Emergency");
          done();
        });
      });
    });

    describe("POST /wikis/:id/destroy", () => {
      it("should delete the wiki with the associated ID", done => {
        Wiki.all().then(wikis => {
          const wikiCountBeforeDelete = wikis.length;
          expect(wikiCountBeforeDelete).toBe(1);
          request.post(`${base}${this.wiki.id}/destroy`, (err, res, body) => {
            Wiki.all().then(wikis => {
              expect(err).toBeNull();
              expect(wikis.length).toBe(wikiCountBeforeDelete - 1);
              done();
            });
          });
        });
      });
    });

    describe("GET /wikis/:id/edit", () => {
      it("should render a view with an edit wiki form", done => {
        request.get(`${base}${this.wiki.id}/edit`, (err, res, body) => {
          expect(err).toBeNull();
          expect(body).toContain("Edit Wiki");
          expect(body).toContain("Impeach Trump");
          done();
        });
      });
    });

    describe("POST /wikis/:id/update", () => {
      it("should update the wiki with the given values", done => {
        request.post(
          {
            url: `${base}${this.wiki.id}/update`,
            form: {
              title: "Impeach Trump",
              body: "There are a lot of them"
            }
          },
          (err, res, body) => {
            expect(err).toBeNull();
            Wiki.findOne({
              where: { id: 1 }
            }).then(wiki => {
              expect(wiki.title).toBe("Impeach Trump");
              done();
            });
          }
        );
      });
    });
  }); //end context for admin user

  // context of member user
  describe("member user performing CRUD actions for Wiki", () => {
    beforeEach(done => {
      // before each suite in admin context
      User.create({
        // mock authentication
        email: "dasha92@yahoo.com",
        password: "techy",
        role: "member" // mock authenticate as admin user
      }).then(user => {
        request.get(
          {
            // mock authentication
            url: "http://localhost:3000/auth/fake",
            form: {
              role: user.role, // mock authenticate as admin user
              userId: user.id,
              email: user.email
            }
          },
          (err, res, body) => {
            done();
          }
        );
      });
    });

    describe("GET /wikis", () => {
      it("should respond with all wikis", done => {
        request.get(base, (err, res, body) => {
          expect(err).toBeNull();
          expect(body).toContain("Wikis");
          expect(body).toContain("Best Wikis");
          done();
        });
      });
    });

    describe("GET /wikis/new", () => {
      it("should redirect to wikiss view", done => {
        request.get(`${base}new`, (err, res, body) => {
          expect(err).toBeNull();
          expect(body).toContain("Wikis");
          done();
        });
      });
    });

    describe("POST /wikis/create", () => {
      const options = {
        url: `${base}create`,
        form: {
          title: "the first wiki",
          body: "changes in wiki"
        }
      };
      it("should not create a new wiki", done => {
        request.post(options, (err, res, body) => {
          Wiki.findOne({ where: { title: "the first wiki" } })
            .then(wiki => {
              expect(wiki).toBeNull(); // no topic should be returned
              done();
            })
            .catch(err => {
              console.log(err);
              done();
            });
        });
      });
    });

    describe("GET /wikis/:id", () => {
      it("should render a view with the selected topic", done => {
        // variables defined outside, like `this.topic` are only available
        // inside `it` blocks.
        request.get(`${base}${this.wiki.id}`, (err, res, body) => {
          expect(err).toBeNull();
          expect(body).toContain("JS Frameworks");
          done();
        });
      });
    });

    describe("POST /topics/:id/destroy", () => {
      it("should not delete the topic with the associated ID", done => {
        Topic.all().then(topics => {
          const topicCountBeforeDelete = topics.length;
          expect(topicCountBeforeDelete).toBe(1);
          request.post(`${base}${this.topic.id}/destroy`, (err, res, body) => {
            Topic.all().then(topics => {
              // confirm that no topics were deleted
              expect(topics.length).toBe(topicCountBeforeDelete);
              done();
            });
          });
        });
      });
    });

    describe("GET /topics/:id/edit", () => {
      it("should not render a view with an edit topic form", done => {
        request.get(`${base}${this.topic.id}/edit`, (err, res, body) => {
          expect(err).toBeNull();
          expect(body).not.toContain("Edit Topic");
          expect(body).toContain("JS Frameworks"); // confirm redirect to topic show
          done();
        });
      });
    });

    describe("POST /topics/:id/update", () => {
      it("should not update the topic with the given values", done => {
        const options = {
          url: `${base}${this.topic.id}/update`,
          form: {
            title: "JavaScript Frameworks",
            description: "There are a lot of them"
          }
        };
        request.post(options, (err, res, body) => {
          expect(err).toBeNull();
          Topic.findOne({
            where: { id: 1 }
          }).then(topic => {
            expect(topic.title).toBe("JS Frameworks"); // confirm title is unchanged
            done();
          });
        });
      });
    });
  });
});
