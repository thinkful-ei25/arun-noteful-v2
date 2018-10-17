'use strict';

const express = require('express');

const folders = require('../db/folders');

const router = express.Router();

router.get('/', (req, res, next) => {
  folders
    .fetch()
    .then(res.json.bind(res))
    .catch(next);
});

router.get('/:id', (req, res, next) => {
  folders
    .find(req.params.id)
    .then((result) => {
      if (!result) {
        next();
        return;
      }

      res.json(result);
    })
    .catch(next);
});

router.put('/:id', (req, res, next) => {
  const { id } = req.params;

  // Validate & filter input
  const updateObj = { name: req.body.name };

  if (!updateObj.name) {
    const err = new Error('Missing `name` field in request body');
    err.status = 400;
    next(err);
    return;
  }

  folders
    .update(id, updateObj)
    .then((item) => {
      if (!item) {
        next();
        return;
      }

      res.json(item);
    })
    .catch(next);
});

router.post('/', (req, res, next) => {
  const newItem = { name: req.body.name };

  if (!newItem.name) {
    const err = new Error('Missing `name` field in request body');
    err.status = 400;
    next(err);
    return;
  }

  folders
    .create(newItem)
    .then((item) => {
      res
        .location(`${req.protocol}://${req.headers.host}${req.baseUrl}/${item.id}`)
        .status(201)
        .json(item);
    })
    .catch(next);
});

router.delete('/:id', (req, res, next) => {
  const { id } = req.params;
  folders
    .delete(id)
    .then(() => res.sendStatus(204))
    .catch(next);
});

module.exports = router;
