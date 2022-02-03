const express = require('express');
const path = require('path');
const api = require('./routes/index.js');

const PORT = 3001;

const app = express();

// custom middlware to display the info in a cyan color
const middleware = (req, res, next) => {
    const cyan = '\x1b[36m';
    console.info(`📘 ${cyan}${req.method} request to ${req.path}`);
    next();
};

// inittialize the routes
app.use(middleware);

//middleware for parsing JSON and urlencoded ofr data
app.use(express.json());
app.use(express.urlencoded({extended: true}));
app.use('/api', api);

app.use(express.static('public'));

// GET  Route for homepage
app.get('/', (req,res) => 
    res.sendFile(path.join(__dirname, '/public/index.html'))
);

// GET Route for pages
app.get('/page', (req,res) => 
    res.sendFile(path.join(__dirname, '/public/notes.html'))
);

app.listen(PORT, () => 
    console.log(`APP listening to requests at http://localhost:${PORT} 🏎️`)
);