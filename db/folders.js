'use strict';

const knex = require('./knex');

module.exports = {
  create(newItem) {
    return knex('folders')
      .insert(newItem)
      .returning('*')
      .then(results => results[0]);
  },

  fetch() {
    return knex('folders')
      .select()
      .orderBy('id');
  },

  find(id) {
    return knex('folders')
      .first()
      .where({ id });
  },

  update(id, updateItem) {
    return knex('folders')
      .update(updateItem)
      .where({ id })
      .returning('*')
      .then(results => results[0]);
  },

  delete(id) {
    return knex('folders')
      .del()
      .where({ id });
  },
};
