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
  addTags(noteId, tagIds) {
    if (!tagIds) {
      return Promise.resolve();
    }

    const junctionRows = tagIds.map(tagId => ({ note_id: noteId, tag_id: tagId }));
    return knex('notes_tags')
      .insert(junctionRows);
  },

  removeTags(noteId) {
    return knex('notes_tags')
      .del()
      .where('note_id', noteId);
  },

  create(newItem) {
    // folder_id is used by the database, but this is the only place we want to see it.
    const { folderId, tags, ...internalItem } = newItem;
    Object.assign(internalItem, { folder_id: folderId || null });

    return knex('notes')
      .insert(internalItem)
      .returning('id')
      .tap(([newId]) => this.addTags(newId, tags))
      .then(([newId]) => this.find(newId));
  },

  filter(searchTerm, folderId, tagId) {
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
        if (tagId) {
          query.where('tags.id', tagId);
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
    const { folderId, tags, ...internalItem } = updateItem;
    Object.assign(internalItem, { folder_id: folderId || null });

    return knex('notes')
      .update(internalItem)
      .where({ id })
      .returning('id')
      .tap(([newId]) => this.removeTags(newId))
      .tap(([newId]) => this.addTags(newId, tags))
      .then(([newId]) => this.find(newId));
  },

  delete(id) {
    return knex('notes')
      .del()
      .where({ id });
  },
};

module.exports = notes;
