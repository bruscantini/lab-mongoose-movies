/* jshint esversion: 6, node: true */
"use strict";

const express = require('express');
const mongoose = require('mongoose');
const Celebrity = require('../models/celebrity');

const router = express.Router();

router.get('/new', (req, res, next) => {
  res.render('celebrities/new');
});

router.get('/:id/edit', (req, res, next) => {
  const celebId = req.params.id;
  Celebrity.findById(celebId, (err, celeb) => {
    if (err) return next(err);
    res.render('celebrities/edit', {celeb});
  });

});

router.post('/:id/delete', (req, res, next) => {
  const celebId = req.params.id;
  Celebrity.findByIdAndRemove(celebId, (err, doc) =>{
    if (err) return next(err);
    console.log('Deleted: ', doc);
    res.redirect('/celebrities');
  });
});

router.get('/:id', (req, res, next) => {
  const celebrityId = req.params.id;
  Celebrity.findById(celebrityId, (err, celebrity) =>{
    if (err) return next(err);
    res.render('celebrities/show', {celeb: celebrity});
  });
});

router.post('/:id', (req, res, next) => {
  const celebId = req.params.id;
  const {name, occupation, catchPhrase} = req.body;

  Celebrity.findByIdAndUpdate(celebId, {name, occupation, catchPhrase}, (err, doc) => {
    if (err) return next(err);
    res.render(`celebrities/show`, {celeb: {celebId, name, occupation, catchPhrase} });
  });

});

router.get('/', (req, res, next) => {
  Celebrity.find({}, (err, docs) => {
    if (err) return next(err);
    res.render('celebrities/index', {celebs: docs});
  });
});

router.post('/', (req, res, next) => {
  const body = req.body;
  const celebToCreate = {
    name : body.name,
    occupation : body.occupation,
    catchPhrase : body.catchPhrase
  };

  const newCeleb = new Celebrity(celebToCreate);
  newCeleb.save((err) =>{
    if (err) res.render('celebrities/new');
    res.redirect('/');
  });
});

module.exports = router;
