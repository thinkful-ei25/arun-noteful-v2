'use strict';

const chai = require('chai');
const chaiHttp = require('chai-http');

const app = require('../server');

const { expect } = chai;
chai.use(chaiHttp);

describe('Static Server', () => {
  it('GET request "/" should return the index page', () => chai
    .request(app)
    .get('/')
    .then((res) => {
      expect(res).to.exist;
      expect(res).to.have.status(200);
      expect(res).to.be.html;
    }));
});
