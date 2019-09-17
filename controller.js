// dit is de controller.js

const express = require('express');
const controller = express();
const port = 3000;

const mysql = require("mysql");

const connection = mysql.createConnection({
	host: 'localhost',
	user: 'rloman',
	password: 'poedel',
	database: 'molveno'
});

connection.connect( (err) => {
    if (err) {
        throw err;
    } else {
        console.log('connected to database!');
    }
});

// import body-parser module here
let bodyParser = require('body-parser');

// say to the app (express instance) that he might sometimes render
// the body of a POST/PUT from JSON to an Object
controller.use(bodyParser.json());

// for now this is to say that everyone can reach this webserver
// from everywhere
controller.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Methods", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
});

controller.get('/api/guests', (req, res) => {
    
    res.setHeader('Content-Type', 'application/json');

    connection.query('SELECT * FROM guest', (err, guests) => {
        if(err) throw err;
        res.send(guests);
    });

});

// eerst testen met Postman
controller.get('/api/users/:id', (request, response) => {
    const id = +request.params.id;
    connection.query('select * from users where id=?;', [id], (err, result) => {
        if(err) throw err;
        response.send(result);
    });
});

controller.post('/api/guests', function (req, res) {
    
    let content = req.body;
    
    connection.query('INSERT INTO guest SET ?', content, (err, result) => {
        if (err) throw err;
        res.send(result)
    });

});

controller.delete('/api/guests/:id', function(req, res) {

    let id = +req.params.id;

    connection.query('DELETE FROM guest WHERE id = ?', id, (err, result) => {
        if(err) throw err;
        console.log('Deleted ', result.affectedRows,' rows');
        res.status(204).end();
    });
});

controller.put('/api/guests/:id', function(req, res) {

    let id = +req.params.id;
    let inputUser = req.body;

    connection.query('UPDATE guest SET ? WHERE id = ?', [inputUser, id], (err, response) => {
        if(err) throw err;
        connection.query('SELECT * FROM guest WHERE id = ?', id, (updatedErr, updatedGuest) => {
            if(updatedErr) throw updatedErr;
            res.send(updatedGuest);
        });
    });
});

controller.listen(port, () => { 
    console.log('Server running on port: ', port);
});