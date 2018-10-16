'use strict';

const knex = require('./knex');

const notesDB = {
  create(newItem) {
    return knex('notes')
      .insert(newItem)
      .returning('*')
      .then(results => results[0]);
  },

  filter(searchTerm) {
    return knex('notes')
      .select()
      .modify((query) => {
        if (searchTerm) {
          query.where('title', 'LIKE', `%${searchTerm}%`);
        }
      })
      .orderBy('id');
  },

  find(id) {
    return knex('notes')
      .select()
      .where({ id })
      .then(results => results[0]);
  },

  update(id, updateItem) {
    return knex('notes')
      .update(updateItem)
      .where({ id })
      .returning('*')
      .then(results => results[0]);
  },

  delete(id) {
    return knex('notes')
      .del()
      .where({ id });
  },
};

module.exports = notesDB;
