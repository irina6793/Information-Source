const request = require("request");
const server = require("../../src/server");
const base = "http://localhost:3000/users/";
const Wiki = require("../../src/db/models").Wiki;
const User = require("../../src/db/models").User;
const sequelize = require("../../src/db/models/index").sequelize;

describe("routes : wikis", () => {
   beforeEach((done) => {
        this.wiki;
        sequelize.sync({ force: true }).then(() => {
     Wiki.create({
          title: "Impeach Trump",
          body: "Trump needs to get impeached for the Russia collusion"
    })
         .then((wiki) => {
            this.wiki = wiki;
          done();
    })
         .catch((err) => {
            console.log(err);
            done();
      })
    });
 });

describe("GET /wikis", () => {
     it("should return a status code 200 and all wikis", (done) => {
         request.get(base, (err, res, body) => {
           expect(res.statusCode).toBe(200);
           expect(err).toBeNull();
           expect(body).toContain("Impeach Trump");
           done();
            });
       });
    });

describe("GET /wikis/new", () => {
    it("should render a view with a new wiki form", (done) => {
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
                 body: "Abuse of power"
              }
          };
it("should create a new wiki and redirect", (done) => {
    request.post(options,
      (err, res, body) => {
        Wiki.findOne({where: {title: "National Emergency"}})
            .then((wiki) => {
             expect(wiki.title).toBe("National Emergency");
             expect(wiki.body).toBe("Abuse of power");
             done();
          })
            .catch((err) => {
             console.log(err);
             done();
           });
        }
       );
     });
   })

describe("GET /wikis/:id", () => {
       it("should render a view with the selected wiki", (done) => {
           request.get(`${base}${this.wiki.id}`, (err, res, body) => {
            expect(err).toBeNull();
            expect(body).toContain("National Emergency");
            done();
        });
      });
   });

describe("POST /wikis/:id/destroy", () => {
    it("should delete the wiki with the associated ID", (done) => {
        Wiki.all()
             .then((wikis) => {
              const wikiCountBeforeDelete = wikis.length;
              expect(wikiCountBeforeDelete).toBe(1);
                     request.post(`${base}${this.wiki.id}/destroy`, (err, res, body) => {
        Wiki.all()
             .then((wikis) => {
              expect(err).toBeNull();
              expect(wikis.length).toBe(wikiCountBeforeDelete - 1);
              done();
            })
          });
        })
      });
   });

describe("GET /wikis/:id/edit", () => {
     it("should render a view with an edit wiki form", (done) => {
        request.get(`${base}${this.wiki.id}/edit`, (err, res, body) => {
            expect(err).toBeNull();
            expect(body).toContain("Edit Wiki");
            expect(body).toContain("Impeach Trump");
            done();
        });
      });
   });

describe("POST /wikis/:id/update", () => {
     it("should update the wiki with the given values", (done) => {
        request.post({
           url: `${base}${this.wiki.id}/update`,
              form: {
              title: "Impeach Trump",
              body: "There are a lot of them"
           }
         }, (err, res, body) => {
             expect(err).toBeNull();
                 Wiki.findOne({
                   where: {id:1}
                 })
                 .then((wiki) => {
                   expect(wiki.title).toBe("Impeach Trump");
                   done();
                 });
               });
             });
       });
   });
