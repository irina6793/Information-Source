const request = require("request");
const server = require("../../src/server");
const base = "http://localhost:3000/users/";
const Wiki = require("../../src/db/models").Wiki;
const User = require("../../src/db/models").User;
const sequelize = require("../../src/db/models/index").sequelize;

describe("routes : wikis", () => {
  beforeEach(done => {
    sequelize.sync({ force: true }).then(() => {
      User.create({
        email: "irina6793@yahoo.com",
        password: "techy",
        role: 0
      })
      .then(user => {
        this.user;
      Wiki.create({
        title: "My new Wiki",
        body: "Testing Wiki",
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

// member user
  describe("member user for Wiki", () => {
    describe("GET /wikis/new", () => {
      beforeEach(done => {
        User.create({
          email: "irina6793@yahoo.com",
          password: "techy",
          role: 0
     })
       .then(user => {
         request.get({
           url: "http://localhost:3000/auth/fake",
           form: {
             role: user.role, // mock authenticate as admin user
             userId: user.id,
             email: user.email
      }
   },
     (err, res, body) => {
       done();
   });
  });
 });
});

it("should render a view with a new wiki form", done => {
  request.get(`${base}new`, (err, res, body) => {
    expect(err).toBeNull();
    expect(body).toContain("New Wiki");
    done();
  });
 });
});

describe("POST /wikis/create", () => {
    beforeEach((done) => {
      User.create({
            email: "dasha95@gmail.com",
            password: "smarty",
            role: 0
      })
         .then((user) => {
            request.get({
              url: "http://localhost:3000/auth/fake",
              form: {
                userId: user.id,
                role: user.role,
                email: user.email
              }
            },
               (err, res, body) => {
                done();
            });
        });
      });
  it("should create a new wiki and redirect", done => {
    const options = {
      url: `${base}create`,
      form: {
        title: "Naional Emergency",
        body: "Abuse of power",
        private: false,
        userId: this.user.id
   }
};
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

  // context of standard user
  describe("standard user performing CRUD actions for Wiki", () => {
    beforeEach(done => {
      // before each suite in admin context
      User.create({
        // mock authentication
        email: "dasha92@yahoo.com",
        password: "techy",
        role: "standard" // mock authenticate as admin user
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

    describe("GET /wikis/:id", () => {
      it("should render a view with the selected topic", done => {
        // variables defined outside, like `this.topic` are only available
        // inside `it` blocks.
        request.get(`${base}${this.wiki.id}`, (err, res, body) => {
          expect(err).toBeNull();
          expect(body).toContain("Wikis");
          done();
        });
      });
    });

    describe("POST /wikis/:id/destroy", () => {
      it("should not delete the wiki with the associated ID", done => {
        Wiki.all().then(wikis => {
          const wikiCountBeforeDelete = wikis.length;
          expect(wikiCountBeforeDelete).toBe(1);
          request.post(`${base}${this.wiki.id}/destroy`, (err, res, body) => {
            Wiki.all().then(wikis => {
              // confirm that no topics were deleted
              expect(wikis.length).toBe(wikiCountBeforeDelete);
              done();
            });
          });
        });
      });
    });

    describe("GET /wikis/:id/edit", () => {
      it("should not render a view with an edit wiki form", done => {
        request.get(`${base}${this.wiki.id}/edit`, (err, res, body) => {
          expect(err).toBeNull();
          expect(body).not.toContain("Edit Wiki");
          expect(body).toContain("Wikis"); // confirm redirect to topic show
          done();
        });
      });
    });

    describe("POST /wikis/:id/update", () => {
      it("should not update the wiki with the given values", done => {
        const options = {
          url: `${base}${this.wiki.id}/update`,
          form: {
            title: "Revise Wiki",
            description: "There are a lot of them"
          }
        };
        request.post(options, (err, res, body) => {
          expect(err).toBeNull();
          Wiki.findOne({
            where: { id: 1 }
          }).then(wiki => {
            expect(wiki.title).toBe("Wikis"); // confirm title is unchanged
            done();
          });
        });
      });
    });
    //standard user end

    //premium user
    describe("user performing CRUD actions for Wiki", () => {
      beforeEach((done) => {
        request.get({
          url: "http://localhost:3000/auth/fake",
          form: {
            role: "premium"
          }
        }, (err, res, body) => {
            done();
        });
      });

    describe("GET /wikis/:id", () => {
      it("should render a view with the selected wiki", (done) => {
          request.get(`${base}/${this.wiki.id}`, (err, res, body) => {
            expect(err).toBeNull();
            expect(body).toContain("Wikis");
            done();
          });
      });
     });
     describe("GET /wikis/:id/edit", () => {
       it("should not render a view with an edit wiki form", done => {
         request.get(`${base}${this.wiki.id}/edit`, (err, res, body) => {
           expect(err).toBeNull();
           expect(body).not.toContain("Edit Wiki");
           expect(body).toContain("Wikis"); // confirm redirect to topic show
           done();
         });
       });
     });

     describe("POST /wikis/:id/update", () => {
       it("should not update the wiki with the given values", done => {
         const options = {
           url: `${base}${this.wiki.id}/update`,
           form: {
             title: "Revise Wiki",
             description: "There are a lot of them"
           }
         };
         request.post(options, (err, res, body) => {
           expect(err).toBeNull();
           Wiki.findOne({
             where: { id: 1 }
           }).then(wiki => {
             expect(wiki.title).toBe("Wikis"); // confirm title is unchanged
             done();
           });
         });
       });
     }); //premium user end
    });
  }
}
