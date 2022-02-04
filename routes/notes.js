const notes = require('express').Router();
const testSAVEfile = require('../db/test.json'); 
const fs = require('fs');

notes.get('/', (req,res) =>{ res.json(testSAVEfile)});

notes.post('/', (req,res) => {
    console.log(req.body);
});
// notes.delete();

module.exports = notes;