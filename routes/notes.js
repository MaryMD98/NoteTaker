const notes = require('express').Router(); 
const fs = require('fs');
const util = require('util');

const testSAVEfile = './db/test.json';
const SAVEfile = '../db/db.json'; 

// ** GET ROUTE
// ** homepage route to display the saved notes on .json file
notes.get('/', (req,res) => {
    readFromFile(testSAVEfile).then((data) => res.status(200).json(JSON.parse(data)))
});

// ** POST ROUTE
// ** route to create new notes and add them on the json file
notes.post('/', (req,res) => {
    // destructuring assignment for the items in req.body
    const {title, text} = req.body;
    // if all the required properties are present 
    if (title && text){
        // variables for the object we will save, need to add random id
        const newNote = {
            title,
            text,
            note_id: Math.floor((1 + Math.random()) * 0x10000).toString(16).substring(1),
        };
        // read and append the new note
        readAndAppend(newNote,testSAVEfile);
        // send response to user that note was aded succesfully
        const response = {
            status: 'success',
            body: newNote,
        };
        res.status(200).json(response);
        console.log(`New Note was added 📝`);
    } else {res.status(400).json(`Error adding the new note, please try again`);}
});

// ** GET ROUTE
// ** route to read a note by calling its id number
notes.get('/:note_id', (req,res) => {
    // saving the note id requested to read 
    const oldNOTE_id = req.params.note_id;
    // read funtion to call the file where notes are stored and filter the id number
    readFromFile(testSAVEfile).then((data) => JSON.parse(data)).then((json) =>{
        // filter throught the file to serch for the matching id
        const result = json.filter((note) => note.note_id === oldNOTE_id);
        // once the id is found, send the result back to the user
        res.json(result);
        console.log(`Note id ${oldNOTE_id} was called to be read 📖`);
    //   res.json(`Note ${oldNOTE_id} has been Updated 🗑️`);
    });
});

// ** DELETE ROUTE
// ** route will delete the note by usinf the corresponding id
notes.delete();

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