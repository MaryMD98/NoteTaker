const notes = require('express').Router(); 
const fs = require('fs');
const util = require('util');

const testSAVEfile = './db/test.json';
const SAVEfile = '../db/db.json'; 

// ** GET ROUTE
// ** homepage route to display the saved notes on .json file
notes.get('/', (req,res) => {
    readFromFile(SAVEfile).then((data) => res.status(200).json(JSON.parse(data)))
});

// ** GET ROUTE
// ** route to read a note by calling its id number
notes.get('/:note_id', (req,res) => {
    // saving the note id requested to read 
    const oldNOTE_id = req.params.note_id;
    // read funtion to call the file where notes are stored and filter the id number
    console.log(`Note with id ${oldNOTE_id} was called to be read 📖`);
    readFromFile(SAVEfile).then((data) => JSON.parse(data)).then((json) =>{
        // filter throught the file to serch for the matching id
        const result = json.filter((note) => note.note_id === oldNOTE_id);
        // once the id is found, send the result back to the user
        // validate id => first check if the id trying to read exists
        return result.length>0 
                    ? res.status(200).json(result) 
                    : res.status(400).json(`Note with id ${oldNOTE_id} does not exists ❌`)
    });
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
        readAndAppend(newNote,SAVEfile);
        // send response to user that note was aded succesfully
        const response = {
            status: 'success',
            body: newNote,
        };
        res.status(200).json(response);
        console.log(`New Note was added 📝`);
    } else {res.status(400).json(`Error adding the new note, please fill out the title and text area`);}
});

// ** DELETE ROUTE
// ** route will delete the note by usinf the corresponding id
notes.delete('/:note_id', (req,res) =>{
    const deleteNote = req.params.note_id;

    readFromFile(SAVEfile).then((data) => JSON.parse(data)).then((json) =>{
        console.log(`Note with ID ${deleteNote} on delete route 🗑️`);
        // DeleteID will validate if the ID to be deleted exists
        const DeleteID = json.filter((note) => note.note_id === deleteNote);
        // validate ID - if id exists then run the delete process
        if(DeleteID.length > 0) {
            // Array noteTOsave with all the notes except the one to be deleted
            const noteTOsave = json.filter((note) => note.note_id !== deleteNote);
            // save the array to the filesystem in .json file
            writeToFile(SAVEfile,noteTOsave);
            // respond to the Delete request
            res.status(200).json(`Note with ID ${deleteNote} has been deleted 🗑️`);
        } else {
            // then the id does not exists
            res.status(400).json(`Note with id ${deleteNote} does not exists ❌`);
        }
    });
});

///***********************************************************//////
///******   Functions to read and write to the file   ********//////
///** these functions were used in the bootcamp activities ***//////
///***********************************************************//////
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