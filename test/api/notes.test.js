'use strict';

const chai = require('chai');
const chaiHttp = require('chai-http');

const { createDBFixtures } = require('../utils');
const knex = require('../../db/knex');
const server = require('../../server');

const { expect } = chai;
chai.use(chaiHttp);

describe('/api/notes', () => {
  beforeEach(() => createDBFixtures('./db/noteful-app.sql'));

  after(() => knex.destroy());

  describe('GET /', () => {
    it('should return 10 notes', () => chai
      .request(server)
      .get('/api/notes')
      .then((res) => {
        expect(res).to.have.status(200);
        expect(res).to.be.json;
        expect(res.body).to.be.an('array');
        expect(res.body).to.have.length(10);
      }));

    it('should return notes with hydrated tags', () => chai
      .request(server)
      .get('/api/notes')
      .then((res) => {
        res.body.forEach((note) => {
          expect(note.tags).to.be.an('array');
          note.tags.forEach((tag) => {
            expect(tag).to.have.keys('id', 'name');
          });
        });

        expect(res.body[1].tags[0].id).to.equal(201);
        expect(res.body[3].tags).to.have.length(2);
        expect(res.body[0].tags).to.have.length(0);
      }));

    context('with query parameters', () => {
      let agent;

      beforeEach(() => {
        agent = chai.request(server).keepOpen();
      });

      afterEach(() => {
        agent.close();
      });

      // eslint-disable-next-line max-len
      it('should return only notes that contain the `searchTerm` in their title', () => agent
        .get('/api/notes?searchTerm=The')
        .then((res) => {
          expect(res).to.have.status(200);
          expect(res).to.be.json;
          expect(res.body).to.be.an('array');
          expect(res.body).to.have.length(2);
          res.body.forEach((note) => {
            expect(note).to.be.an('object');
          });
        })
        .then(() => agent.get('/api/notes?searchTerm=Rabbit'))
        .then((res) => {
          expect(res).to.have.status(200);
          expect(res.body).to.be.an('array');
          expect(res.body).to.have.length(0);
        }));

      it('should return only notes with the matching `tagId`', () => agent
        .get('/api/notes?tagId=200')
        .then((res) => {
          expect(res).to.have.status(200);
          expect(res).to.be.json;
          expect(res.body).to.be.an('array');
          expect(res.body).to.have.length(1);
          expect(res.body[0].id).to.equal(1008);
        })
        .then(() => agent.get('/api/notes?tagId=1'))
        .then((res) => {
          expect(res).to.have.status(200);
          expect(res.body).to.be.an('array');
          expect(res.body).to.have.length(0);
        })
        .finally(() => agent.close()));
    });
  });

  describe('GET /:id', () => {
    it('should return 404 for an invalid `id`', () => chai
      .request(server)
      .get('/api/notes/1')
      .then((res) => {
        expect(res).to.have.status(404);
      }));

    it('should return a note for a valid `id`', () => chai
      .request(server)
      .get('/api/notes/1000')
      .then((res) => {
        expect(res).to.have.status(200);
        expect(res).to.be.json;
        expect(res.body).to.be.an('object');
        expect(res.body).to.have.keys(
          'id',
          'title',
          'content',
          'folderId',
          'folderName',
          'tags',
        );
        expect(res.body.tags).to.be.an('array');
        expect(res.body.tags).to.have.length(0);
        expect(res.body.id).to.equal(1000);
      }));

    it('should return a note with hydrated tags', () => chai
      .request(server)
      .get('/api/notes/1003')
      .then((res) => {
        expect(res).to.have.status(200);
        expect(res.body.tags).to.be.an('array');
        expect(res.body.tags).to.have.length(2);
        res.body.tags.forEach((tag) => {
          expect(tag).to.have.keys('id', 'name');
        });
        expect(res.body.tags[0].id).to.equal(202);
        expect(res.body.tags[0].name).to.equal('MANDATORY');
      }));
  });

  describe('POST /api/notes', () => {
    it('should return status 400 for a missing title field', () => {
      const errorFixture = {
        content: 'Lorem ipsum dolor',
      };

      return chai
        .request(server)
        .post('/api/notes')
        .send(errorFixture)
        .then((res) => {
          expect(res).to.have.status(400);
          expect(res.body.message).to.equal('Missing `title` in request body');
        });
    });

    it('should create and return a new item when provided valid data', () => {
      const fixture = {
        title: 'Test title',
        content: 'Lorem ipsum dolor',
        tags: [200, 201],
      };

      const expectedReturn = {
        id: 1010,
        title: 'Test title',
        content: 'Lorem ipsum dolor',
        folderId: null,
        folderName: null,
        tags: [{ id: 200, name: 'URGENT' }, { id: 201, name: 'WORLD ENDING' }],
      };

      return chai
        .request(server)
        .post('/api/notes')
        .send(fixture)
        .then((res) => {
          expect(res).to.have.status(201);
          expect(res).to.be.json;
          expect(res.body).to.be.an('object');
          expect(res.body).to.deep.equal(expectedReturn);

          const location = new URL(res.header.location);
          return chai.request(server).get(location.pathname);
        })
        .then((res) => {
          expect(res).to.have.status(200);
        });
    });
  });

  describe('PUT /api/notes/:id', () => {
    const fixture = {
      title: 'Rabbits > Cats',
      content: 'Lorem ipsum dolor',
      tags: [200],
    };

    const expectedReturn = {
      id: 1003,
      title: 'Rabbits > Cats',
      content: 'Lorem ipsum dolor',
      folderId: null,
      folderName: null,
      tags: [{ id: 200, name: 'URGENT' }],
    };

    it('should return 404 if `id` is invalid', () => chai
      .request(server)
      .put('/api/notes/1')
      .send(fixture)
      .then((res) => {
        expect(res).to.have.status(404);
      }));

    it('should return 400 if `title` is missing', () => chai
      .request(server)
      .put('/api/notes/1003')
      .send({ content: 'Lorem ipsum dolor' })
      .then((res) => {
        expect(res).to.have.status(400);
        expect(res.body.message).to.equal('Missing `title` in request body');
      }));

    it('should update and return a note if provided valid data', () => chai
      .request(server)
      .put('/api/notes/1003')
      .send(fixture)
      .then((res) => {
        expect(res).to.have.status(200);
        expect(res).to.be.json;
        expect(res.body).to.deep.equal(expectedReturn);

        return chai.request(server).get('/api/notes/1003');
      })
      .then((res) => {
        expect(res).to.have.status(200);
        expect(res).to.be.json;
        expect(res.body).to.deep.equal(expectedReturn);
      }));
  });

  describe('DELETE /api/notes/:id', () => {
    it('should delete an item when provided a valid id', () => {
      const url = '/api/notes/1003';
      return chai
        .request(server)
        .delete(url)
        .then((res) => {
          expect(res).to.have.status(204);
        })
        .then(() => chai.request(server).get(url))
        .then((res) => {
          expect(res).to.have.status(404);
        });
    });

    it('should be idempotent', () => {
      const url = '/api/notes/1001';
      return chai
        .request(server)
        .delete(url)
        .then(() => chai.request(server).delete(url))
        .then((res) => {
          expect(res).to.have.status(204);
        });
    });
  });
});
