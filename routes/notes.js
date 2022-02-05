const notes = require('express').Router();
const testSAVEfile = require('../db/test.json');
const SAVEfile = require('../db/test.json');  
const fs = require('fs');
const util = require('util');

notes.get('/', (req,res) => {
    readFromFile('./db/test.json').then((data) => res.json(JSON.parse(data)))
//    res.json(testSAVEfile)}
});

// POST Route for submitting note
notes.post('/', (req,res) => {
    // destructuring assignment for the items in req.body
    const {title, text} = req.body;
    // if all the required properties are present 
    if (title && text){
        // variable for the object we will save
        const newNote = {
            title,
            text,
            // note_id: uuidv4(),
            note_id: Math.floor((1 + Math.random()) * 0x10000).toString(16).substring(1),
        };
        // read and append the new note
        readAndAppend(newNote,'./db/test.json');
        // send response to
        const response = {
            status: 'success',
            body: newNote,
        };
        res.status(200).json(response);
        console.log(`Diagnostic information added 🔧`);
    } else {res.status(400).json(`Error adding the new note, please try again`);}
});
// Get route to read wih id number
notes.get('/:note_id', (req,res) => {
    // saving the note id requested to read and make changes
    const oldNOTE_id = req.params.note_id;

    readFromFile('./db/test.json').then((data) => JSON.parse(data)).then((json) =>{
        // make a copy of the tip to be read
        const result = json.filter((note) => note.note_id === oldNOTE_id);
        console.log("this is in the result when grabbing the note id");
        console.log(result); 
        res.json(result);
        // Respond POST id reqquest
    //   res.json(`Note ${oldNOTE_id} has been Updated 🗑️`);
    });
});
// notes.delete();

///***********************************************/////
///** Functions to read and write to the file ***//////
///***********************************************/////
/*** Function Promise  to read from file  *///
const readFromFile = util.promisify(fs.readFile);

/***  Function to write data to the JSON file given a destination and some content */
const writeToFile = (destination, content) =>
  fs.writeFile(destination, JSON.stringify(content, null, 4), (err) =>
    err ? console.error(err) : console.info(`\nData written to ${destination}`)
  );

/***  Function to read data from a given a file and append some content  */
const readAndAppend = (content, file) => {
    fs.readFile(file, 'utf8', (err, data) => {
      if (err) {console.error(err);} 
      else {
        const parsedData = JSON.parse(data);
        parsedData.push(content);
        writeToFile(file, parsedData);
      }
    });
};

module.exports = notes;