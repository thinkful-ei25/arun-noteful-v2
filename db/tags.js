'use strict';

const knex = require('./knex');

const tags = {
  fetch() {
    return knex('tags')
      .select()
      .orderBy('id');
  },

  find(id) {
    return knex('tags')
      .first()
      .where({ id });
  },

  update(id, updateObj) {
    return knex('tags')
      .update(updateObj)
      .where({ id })
      .returning('*')
      .then(results => results[0]);
  },

  create(newTag) {
    return knex('tags')
      .insert(newTag)
      .returning('*')
      .then(results => results[0]);
  },

  delete(id) {
    return knex('tags')
      .del()
      .where({ id });
  },
};

module.exports = tags;
