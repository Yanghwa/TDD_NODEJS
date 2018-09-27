// const http = require('http');
// const math = require('./math');

// // http.createServer();

// const result = math.sum(1,3);

// console.log(result);

// const fs = require('fs');
// const data = fs.readFileSync('./data.txt', 'utf8');

// const data = fs.readFile('./data.txt', 'utf8', (err, data) => {
//     console.log(data);
// });

// console.log(data);

const express = require('express');
const morgan = require('morgan');
const bodyParser = require('body-parser');
const app = express();

let users = [
    {id: 1, name: 'alice'},
    {id: 2, name: 'hey'},
    {id: 3, name: 'therr'}
];

commonMw = (req, res, next) => {
    console.log('commonMw');
    next(new Error('error occurred'));
};

errorMw = (err, req, res, next) => {
    console.log(err.message);
    next();
};

logger = (req, res, next)=> {
    console.log('i am logger');
    next();
};

logger2 = (req,res,next) => {
    console.log('i am logger2');
    next();
};

// app.use(logger);
// app.use(logger2);
app.use(morgan('dev'));
// app.use(commonMw);
// app.use(errorMw);
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.get('/users', (req, res) =>{
    req.query.limit = req.query.limit || 10;
    const limit = parseInt(req.query.limit, 10);
    if(Number.isNaN(limit)) {
        return res.status(400).end();
    }
    res.json(users.slice(0, limit));
    // res.send('users list\n');
});

app.get('/users/:id', (req, res) => {
    const id = parseInt(req.params.id, 10);
    if(Number.isNaN(id)) return res.status(400).end();
    const user = users.filter(user => user.id === id)[0];
    if(!user) return res.status(404).end();
    res.json(user);
});

app.delete('/users/:id', (req, res) => {
    const id = parseInt(req.params.id, 10);
    if(Number.isNaN(id)) return res.status(400).end();
    users = users.filter(user => user.id !== id);
    res.status(204).end();
});

app.post('/users', (req, res) => {
    const name = req.body.name;
    if(!name) return res.status(400).end();
    const isDuplicated = users.filter(user => user.name === name).length
    if(isDuplicated) return res.status(409).end();
    const id = Date.now();
    const user = {id, name};
    users.push(user);
    res.status(201).json(user);
});

app.post('/users', (req, res) =>{ 
    res.send('users list\n');
});

app.put('/users/:id', (req,res) => {
    const id = parseInt(req.params.id, 10);
    if(Number.isNaN(id)) return res.status(400).end();
    
    const name = req.body.name;
    if(!name) return res.status(400).end();

    const isConflict = users.filter(user => user.name === name).length;
    if(isConflict) return res.status(409).end();

    const user = users.filter(user => user.id === id)[0];
    if(!user) return res.status(404).end();
    user.name = name;
    
    res.json(user);
});

app.get('/', (req, res) => {
    res.send('Hello wolrd\n');
});

app.listen(3000, () => {console.log('server is running');});

module.exports = app;