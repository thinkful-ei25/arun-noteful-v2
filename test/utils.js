'use strict';

const fs = require('fs');
const knex = require('../db/knex');

function createDBFixtures(filename) {
  const sql = fs.readFileSync(filename).toString();
  return knex.raw(sql);
}

module.exports = { createDBFixtures };
