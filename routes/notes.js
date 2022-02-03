const notes = require('express').Router();

notes.get('/', (req,res) =>{

    // res.json(JSON.parse(data))
    console.log('i am inside notes.js');
});
// notes.post();
// notes.delete();

module.exports = notes;