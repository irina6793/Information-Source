const request = require("request");
const server = require("../../src/server");
const base = "http://localhost:3000/users/";
const Wiki = require("../../src/db/models").Wiki;
const User = require("../../src/db/models").User;
const sequelize = require("../../src/db/models/index").sequelize;

describe("routes : wiki", () => {
   beforeEach((done) => { // before each context
        this.wiki;   // define variables and bind to context
        sequelize.sync({ force: true }).then(() => {  // clear database
     Wiki.create({
          title: "Impeach Trump",
          description: "Trump needs to get impeached for the Russia collusion"
    })
         .then((res) => {
            this.wiki = res;  // store resulting topic in context
          done();
    })
         .catch((err) => {
            console.log(err);
            done();
      })
    });
 });

describe("GET /wiki", () => {
     it("should respond with all wiki", (done) => {
         request.get(base, (err, res, body) => {
                 expect(err).toBeNull();
                 expect(body).toContain("Impeach Trump");
                 expect(body).toContain("Mueller investigation");
                 done();
            });
       });
    });

describe("GET /wiki/new", () => {
    it("should render a view with a new wiki form", (done) => {
        request.get(`${base}new`, (err, res, body) => {
                expect(err).toBeNull();
                expect(body).toContain("New Wiki");
                done();
              });
             });
           });

describe("POST /wiki/create", () => {
     const options = {
          url: `${base}create`,
              form: {
                 title: "Naional Emergency",
                 description: "Abuse of power"
              }
          };
   it("should create a new wiki and redirect", (done) => {
        request.post(options,
            (err, res, body) => {
        Wiki.findOne({where: {title: "National Emergency"}})
             .then((topic) => {
              expect(topic.title).toBe("National Emergency");
              expect(topic.description).toBe("Abuse of power");
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

describe("GET /wiki/:id", () => {
       it("should render a view with the selected wiki", (done) => {
           request.get(`${base}${this.wiki.id}`, (err, res, body) => {
            expect(err).toBeNull();
            expect(body).toContain("National Emergency");
            done();
        });
      });
   });

describe("POST /wiki/:id/destroy", () => {
    it("should delete the wiki with the associated ID", (done) => {
        Wiki.all()
             .then((wiki) => {
              const wikiCountBeforeDelete = wiki.length;
              expect(wikiCountBeforeDelete).toBe(1);
                     request.post(`${base}${this.wiki.id}/destroy`, (err, res, body) => {
        Wiki.all()
             .then((wiki) => {
              expect(err).toBeNull();
              expect(wiki.length).toBe(wikiCountBeforeDelete - 1);
              done();
            })
          });
        })
      });
   });

describe("GET /wiki/:id/edit", () => {
     it("should render a view with an edit wiki form", (done) => {
          request.get(`${base}${this.wiki.id}/edit`, (err, res, body) => {
              expect(err).toBeNull();
              expect(body).toContain("Edit Wiki");
              expect(body).toContain("Impeach Trump");
             done();
          });
        });
   });

describe("POST /wiki/:id/update", () => {
     it("should update the wiki with the given values", (done) => {
        request.post({
           url: `${base}${this.topic.id}/update`,
              form: {
              title: "Impeach Trump",
              description: "There are a lot of them"
           }
         }, (err, res, body) => {
             expect(err).toBeNull();
                 Wiki.findOne({
                   where: {id:1}
                 })
                 .then((topic) => {
                   expect(topic.title).toBe("Impeach Trump");
                   done();
                 });
               });
             });
       });
   });
  
