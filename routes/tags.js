'use strict';

const express = require('express');

const tags = require('../db/tags');

const router = express.Router();

router.get('/', (req, res, next) => {
  tags
    .fetch()
    .then((list) => {
      res.json(list);
    })
    .catch(next);
});

router.get('/:id', (req, res, next) => {
  tags
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

  const updateObj = { name: req.body.name };
  if (!updateObj.name) {
    const err = new Error('Missing `name` field in request body');
    err.status = 400;
    next(err);
    return;
  }

  tags
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
  const newTag = { name: req.body.name };

  if (!newTag.name) {
    const err = new Error('Missing `name` field in request body');
    err.status = 400;
    next(err);
    return;
  }

  tags
    .create(newTag)
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

  tags
    .delete(id)
    .then(() => res.sendStatus(204))
    .catch(next);
});

module.exports = router;
