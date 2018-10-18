'use strict';

const express = require('express');

// Create an router instance (aka "mini-app")
const router = express.Router();

const notes = require('../db/notes');

// Get All (and search by query)
router.get('/', (req, res, next) => {
  const { searchTerm, folderId, tagId } = req.query;

  notes
    .filter(searchTerm, folderId, tagId)
    .then((list) => {
      res.json(list);
    })
    .catch((err) => {
      next(err);
    });
});

// Get a single item
router.get('/:id', (req, res, next) => {
  const { id } = req.params;

  notes
    .find(id)
    .then((item) => {
      if (item) {
        res.json(item);
      } else {
        next();
      }
    })
    .catch((err) => {
      next(err);
    });
});

// Put update an item
router.put('/:id', (req, res, next) => {
  const { id } = req.params;

  /** *** Never trust users - validate input **** */
  const updateObj = {};
  const updateableFields = ['title', 'content', 'folderId'];

  updateableFields.forEach((field) => {
    if (field in req.body) {
      updateObj[field] = req.body[field];
    }
  });

  /** *** Never trust users - validate input **** */
  if (!updateObj.title) {
    const err = new Error('Missing `title` in request body');
    err.status = 400;
    next(err);
    return;
  }

  notes
    .update(id, updateObj)
    .then((item) => {
      if (item) {
        res.json(item);
      } else {
        next();
      }
    })
    .catch((err) => {
      next(err);
    });
});

// Post (insert) an item
router.post('/', (req, res, next) => {
  const {
    title, content, folderId, tags,
  } = req.body;

  /** *** Never trust users - validate input **** */
  const newItem = {
    title, content, folderId, tags,
  };
  if (!newItem.title) {
    const err = new Error('Missing `title` in request body');
    err.status = 400;
    next(err);
    return;
  }

  notes
    .create(newItem)
    .then((item) => {
      if (item) {
        res
          .location(`http://${req.headers.host}/notes/${item.id}`)
          .status(201)
          .json(item);
      }
    })
    .catch((err) => {
      next(err);
    });
});

// Delete an item
router.delete('/:id', (req, res, next) => {
  const { id } = req.params;

  notes
    .delete(id)
    .then(() => {
      res.sendStatus(204);
    })
    .catch((err) => {
      next(err);
    });
});

module.exports = router;
