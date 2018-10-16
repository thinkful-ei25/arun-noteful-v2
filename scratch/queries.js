/* eslint-disable no-console */

'use strict';

const knex = require('../knex');

const searchTerm = 'gaga';
knex
  .select('notes.id', 'title', 'content')
  .from('notes')
  .modify((queryBuilder) => {
    if (searchTerm) {
      queryBuilder.where('title', 'like', `%${searchTerm}%`);
    }
  })
  .orderBy('notes.id')
  .then((results) => {
    console.log(JSON.stringify(results, null, 2));
  })
  .catch((err) => {
    console.error(err);
  });

const id = 1003;
knex('notes')
  .select()
  .where({ id })
  .then(results => console.log(results[0]));

const newItem = { title: 'Rabbits > Cats', content: "They're cuter, duh." };
knex('notes')
  .insert(newItem)
  .returning(['id', 'title', 'content'])
  .then((results) => {
    Object.assign(newItem, results[0]);
  })
  .then(() => knex('notes')
    .del()
    .where({ id: newItem.id }))
  .then(console.log);
