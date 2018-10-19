'use strict';

const chai = require('chai');
const chaiHttp = require('chai-http');

const { createDBFixtures } = require('../utils');
const knex = require('../../db/knex');
const server = require('../../server');

const { expect } = chai;
chai.use(chaiHttp);

describe('/api/notes endpoint', () => {
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
        expect(res.body[3].tags[0].name).to.equal('MANDATORY');
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
});
