const notes = require('express').Router();
const fs = require('fs');

notes.get('/', (req,res) =>{

    // fs.readFile('./db/test.json').then((data) => res.json(JSON.parse(data)))
    // console.log('i am inside notes.js');

    fs.readFile('./db/test.json', JSON.stringify(content, null, 4), (err) =>
    err ? console.error(err) : console.info(`\nData written to ${destination}`)
  );
});
// notes.post();
// notes.delete();

module.exports = notes;