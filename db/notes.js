'use strict';

const knex = require('./knex');

const notesAndFolderFields = [
  'notes.id',
  'title',
  'content',
  'folder_id as folderId',
  'folders.name as folderName',
];

const notesDB = {
  create(newItem) {
    // folder_id is used by the database, but this is the only place we want to see it.
    const { folderId, ...internalItem } = newItem;
    Object.assign(internalItem, { folder_id: folderId });

    return knex('notes')
      .insert(internalItem)
      .returning('id')
      .then(ids => this.find(ids[0]));
  },

  filter(searchTerm, folderId) {
    return knex('notes')
      .select(notesAndFolderFields)
      .leftJoin('folders', 'notes.folder_id', 'folders.id')
      .modify((query) => {
        if (searchTerm) {
          query.where('title', 'LIKE', `%${searchTerm}%`);
        }
        if (folderId) {
          query.where('folder_id', folderId);
        }
      })
      .orderBy('id');
  },

  find(id) {
    return knex('notes')
      .select(notesAndFolderFields)
      .leftJoin('folders', 'notes.folder_id', 'folders.id')
      .where({ 'notes.id': id })
      .then(results => results[0]);
  },

  update(id, updateItem) {
    const { folderId, ...internalItem } = updateItem;
    Object.assign(internalItem, { folder_id: folderId });

    return knex('notes')
      .update(internalItem)
      .where({ 'notes.id': id })
      .returning('id')
      .then(ids => this.find(ids[0]));
  },

  delete(id) {
    return knex('notes')
      .del()
      .where({ id });
  },
};

module.exports = notesDB;
