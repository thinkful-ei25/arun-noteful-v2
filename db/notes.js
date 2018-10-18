'use strict';

const knex = require('./knex');

const notesAndFolderFields = [
  'notes.id',
  'title',
  'content',
  'folder_id as folderId',
  'folders.name as folderName',
  'tags.id as tagId',
  'tags.name as tagName',
];

function hydrateTags(notes) {
  const hydrated = [];
  const hash = {};

  // eslint-disable-next-line no-restricted-syntax
  for (const note of notes) {
    const { tagId, tagName, ...hydratedNote } = note;
    if (!hash[hydratedNote.id]) {
      hydratedNote.tags = [];
      hash[hydratedNote.id] = hydratedNote;
      hydrated.push(hydratedNote);
    }

    if (tagId && tagName) {
      hash[hydratedNote.id].tags.push({
        id: tagId,
        name: tagName,
      });
    }
  }

  return hydrated;
}

const notes = {
  create(newItem) {
    // folder_id is used by the database, but this is the only place we want to see it.
    const { folderId, ...internalItem } = newItem;
    Object.assign(internalItem, { folder_id: folderId || null });

    return knex('notes')
      .insert(internalItem)
      .returning('id')
      .then(([newId]) => this.find(newId));
  },

  filter(searchTerm, folderId) {
    return knex('notes')
      .select(notesAndFolderFields)
      .leftJoin('folders', 'notes.folder_id', 'folders.id')
      .leftJoin('notes_tags', 'notes.id', 'notes_tags.note_id')
      .leftJoin('tags', 'notes_tags.tag_id', 'tags.id')
      .modify((query) => {
        if (searchTerm) {
          query.where('title', 'LIKE', `%${searchTerm}%`);
        }
        if (folderId) {
          query.where('folder_id', folderId);
        }
      })
      .orderBy('id')
      .then(hydrateTags);
  },

  find(id) {
    return knex('notes')
      .select(notesAndFolderFields)
      .leftJoin('folders', 'notes.folder_id', 'folders.id')
      .leftJoin('notes_tags', 'notes.id', 'notes_tags.note_id')
      .leftJoin('tags', 'notes_tags.tag_id', 'tags.id')
      .where({ 'notes.id': id })
      .then(hydrateTags)
      .then(results => results[0]);
  },

  update(id, updateItem) {
    const { folderId, ...internalItem } = updateItem;
    Object.assign(internalItem, { folder_id: folderId || null });

    return knex('notes')
      .update(internalItem)
      .where({ id })
      .returning('id')
      .then(([newId]) => this.find(newId));
  },

  delete(id) {
    return knex('notes')
      .del()
      .where({ id });
  },
};

module.exports = notes;
