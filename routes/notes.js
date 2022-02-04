const notes = require('express').Router();
const { v4: uuidv4 } = require('uuid');
const testSAVEfile = require('../db/test.json'); 
const fs = require('fs');
const util = require('util');

notes.get('/', (req,res) =>{ res.json(testSAVEfile)});

// POST Route for submitting note
notes.post('/', (req,res) => {
    console.log(req.body);
    // destructuring assignment for the items in req.body
    const {title, text} = req.body;
    // if all the required properties are present 
    if (title && text){
        // variable for the object we will save
        const newNote = {
            title,
            text,
            note_id = uuidv4(),
        };
        // read and append the new note

        // send response to
        const response = {
            status: 'success',
            body: newNote,
        };
        res.json(`Diagnostic information added 🔧`);
    } else {res.json(`Error adding the new note, please try again`);}
});
// notes.delete();

// Promise version of fs.readFile
const readFromFile = util.promisify(fs.readFile);
/**
 *  Function to write data to the JSON file given a destination and some content
 */
const writeToFile = (destination, content) =>
  fs.writeFile(destination, JSON.stringify(content, null, 4), (err) =>
    err ? console.error(err) : console.info(`\nData written to ${destination}`)
  );
/**
 *  Function to read data from a given a file and append some content
 */
const readAndAppend = (content, file) => {
    fs.readFile(file, 'utf8', (err, data) => {
      if (err) {
        console.error(err);
      } else {
        const parsedData = JSON.parse(data);
        parsedData.push(content);
        writeToFile(file, parsedData);
      }
    });
  };

module.exports = notes;