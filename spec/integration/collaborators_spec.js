const request = require("request");
const server = require("../../src/server");
const base = "http://localhost:3000/users/";
const sequelize = require("../../src/db/models/index").sequelize;
const User = require("../../src/db/models").User;
const Wiki = require("../../src/db/models").Wiki;
const Collaborator = require("../../src/db/models").Collaborator;

describe("routes : wikis", () => {
  beforeEach(done => {
    this.wiki;
    this.user;

    sequelize.sync({ force: true }).then(() => {
      User.create({
        email: "irina92@yahoo.com",
        password: "tech",
        role: 0
      }).then(user => {
        this.user;
        Wiki.create({
          title: "Job hunting",
          body: "The job",
          private: false,
          userId: this.user.id
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
  });

  describe("POST /wikis/:id/collaborators/add", () => {
    it("should add a collaborator", done => {
      User.create({
        email: "dasha@gmail.com",
        password: "smarty",
        role: 0
      }).then(collab => {
        this.collab = collab;

        const options = {
          url: `${base}/${this.wiki.id}/collaborators/add`,
          form: {
            email: "dcollab43@example.com"
          }
        };
        request.post(options, (err, res, body) => {
          expect(this.collab.userId).toBe(this.user.id);
          done();
        });
      });
    });

    it("should not add a collaborator with invalid email", done => {
      User.create({
        email: "dasha@gmail.com",
        password: "smarty",
        role: 0
      }).then(collab => {
        this.collab = collab;

        const options = {
          url: `{base}/${this.wiki.id}/collaborators/add`,
          form: {
            email: "no"
          }
        };

        request.post(options, (err, res, body) => {
          expect(err.message).toContain("Validation error:");
          done();
        });
      });
    });
  });
});
