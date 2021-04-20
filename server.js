'use strict'
// Application Dependencies
const express = require('express');
const pg = require('pg');
const methodOverride = require('method-override');
const superagent = require('superagent');
const cors = require('cors');

// Environment variables
require('dotenv').config();

// Application Setup
const app = express();
const PORT = process.env.PORT || 3000;


// Express middleware
// Utilize ExpressJS functionality to parse the body of the request
app.use(express.urlencoded({ extended: true }));

// Specify a directory for static resources
app.use(express.static('./public/css'));

// define our method-override reference
app.use(methodOverride('_method'));

// Set the view engine for server-side templating
app.set('view engine', "ejs");

// Use app cors
app.use(cors());


// Database Setup
const client = new pg.Client(process.env.DATABASE_URL);

// app routes here
app.get('/', homePage);
app.post('/saveToDB', handleSave);
app.get(`/favorite-quotes`, renderFav);
app.get('/favorite-quotes/:id', handleDetails);
app.put('/update/:id', handleUpdate);
app.delete('/delete/:id', handleDelete);



// callback functions
function homePage(req, res) {
    const url = 'https://thesimpsonsquoteapi.glitch.me/quotes?count=10'
    superagent.get(url).set('User-Agent', '1.0').then(resultes => {
        res.render('index', { data: resultes.body })
    })
}

function handleSave(req, res) {

    const { quote, character, image, characterDirection } = req.body;

    const safeValues = [quote, character, image, characterDirection];
    const sql = 'INSERT INTO simp ( quote, character, image, characterDirection) VALUES ($1, $2, $3, $4);'

    client.query(sql, safeValues).then(() => {
        res.redirect('/favorite-quotes');
    })



}

function renderFav(req, res) {

    const sql = "SELECT * FROM simp;"

    client.query(sql).then(result => {
        res.render('favourets', { data: result.rows });
    })

}

function handleDetails(req, res) {
    const id = req.params.id

    const safe = [id];

    const sql = 'SELECT * FROM simp WHERE id=$1;'

    client.query(sql, safe).then((resultes) => {
        res.render('viewDetails', { data: resultes.rows });
    })

}



function handleUpdate(req, res) {
    const { quote } = req.body

    const id = req.params.id;

    const values = [quote, id]

    const sql = `UPDATE simp SET quote=$1 WHERE id=$2;`

    client.query(sql, values).then((result) => {
        res.redirect('/favorite-quotes');
    })
}


function handleDelete(req, res) {
    const id = req.params.id
    const value = [id]

    const sql = 'DELETE FROM simp WHERE id=$1;'

    client.query(sql, value).then(() => {
        res.redirect('/favorite-quotes');
    })
}


// helper functions

// app start point
client.connect().then(() =>
    app.listen(PORT, () => console.log(`Listening on port: ${PORT}`))
);