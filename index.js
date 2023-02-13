﻿/*
File: index.js
Author: Fabio Vitali
Version: 1.0 
Last change on: 10 April 2021


Copyright (c) 2021 by Fabio Vitali

   Permission to use, copy, modify, and/or distribute this software for any
   purpose with or without fee is hereby granted, provided that the above
   copyright notice and this permission notice appear in all copies.

   THE SOFTWARE IS PROVIDED "AS IS" AND THE AUTHOR DISCLAIMS ALL WARRANTIES
   WITH REGARD TO THIS SOFTWARE INCLUDING ALL IMPLIED WARRANTIES OF
   MERCHANTABILITY AND FITNESS. IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR ANY
   SPECIAL, DIRECT, INDIRECT, OR CONSEQUENTIAL DAMAGES OR ANY DAMAGES
   WHATSOEVER RESULTING FROM LOSS OF USE, DATA OR PROFITS, WHETHER IN AN ACTION
   OF CONTRACT, NEGLIGENCE OR OTHER TORTIOUS ACTION, ARISING OUT OF OR IN
   CONNECTION WITH THE USE OR PERFORMANCE OF THIS SOFTWARE.

*/



/* ========================== */
/*                            */
/*           SETUP            */
/*                            */
/* ========================== */

global.rootDir = __dirname;
global.startDate = null;

const template = require(global.rootDir + '/scripts/tpl.js');
const mymongo = require(global.rootDir + '/scripts/mongo.js');
const express = require('express');
const cors = require('cors')







/* ========================== */
/*                            */
/*  EXPRESS CONFIG & ROUTES   */
/*                            */
/* ========================== */

let app= express(); 
app.use(express.static(global.rootDir +'/public'))
app.use('/js'  , express.static(global.rootDir +'/public/js'));
app.use('/css' , express.static(global.rootDir +'/public/css'));
app.use('/data', express.static(global.rootDir +'/public/data'));
app.use('/docs', express.static(global.rootDir +'/public/html'));
app.use('/img' , express.static(global.rootDir +'/public/media'));
app.use('/backoffice', express.static(global.rootDir + '/public/BackOffice'));
app.use('/shop', express.static(global.rootDir + '/public/FrontOffice'));
app.use('/game', express.static(global.rootDir + '/public/Game'));
app.use(express.urlencoded({ extended: true }))
app.use(cors())

//Game
app.use('/game' , express.static(global.rootDir +'/public/Game'));
app.use('/game/quiz' , express.static(global.rootDir +'/public/Game'));
app.use('/game/wordle' , express.static(global.rootDir +'/public/Game'));
app.use('/game/memory' , express.static(global.rootDir +'/public/Game'));
app.use('/game/animalinfo' , express.static(global.rootDir +'/public/Game'));
app.use('/game/medinfo' , express.static(global.rootDir +'/public/Game'));
app.use('/game/yourpets' , express.static(global.rootDir +'/public/Game'));

app.get('/game', (req, res) => {
    res.sendFile(
        global.rootDir + 'public/Game/index.html'
    )
})

app.get('/game/quiz', (req, res) => {
    res.sendFile(
        global.rootDir + 'public/Game/index.html'
    )
})

app.get('/game/wordle', (req, res) => {
    res.sendFile(
        global.rootDir + 'public/Game/index.html'
    )
})

app.get('/game/memory', (req, res) => {
    res.sendFile(
        global.rootDir + 'public/Game/index.html'
    )
})

app.get('/game/animalinfo', (req, res) => {
    res.sendFile(
        global.rootDir + 'public/Game/index.html'
    )
})

app.get('/game/medinfo', (req, res) => {
    res.sendFile(
        global.rootDir + 'public/Game/index.html'
    )
})

app.get('/game/yourpets', (req, res) => {
    res.sendFile(
        global.rootDir + 'public/Game/index.html'
    )
})
// https://stackoverflow.com/questions/40459511/in-express-js-req-protocol-is-not-picking-up-https-for-my-secure-link-it-alwa
app.enable('trust proxy');

app.get('/backoffice', (req, res) => {
    res.send(global.rootDir + '/public/BackOffice/index.html');
})

app.get('/backoffice/bacheca', (req, res) => {
    res.send(global.rootDir + '/public/BackOffice/frontend/index.html');
})

app.get('/backoffice/utenti', (req, res) => {
    res.send(global.rootDir + '/public/BackOffice/frontend/static/js/views/utenti/utenti.html');
})

app.get('/backoffice/prodotti', (req, res) => {
    res.send(global.rootDir + '/public/BackOffice/frontend/static/js/views/prodotti/prodotti.html');
})

app.get('/backoffice/messaggi', (req, res) => {
    res.send(global.rootDir + '/public/BackOffice/frontend/static/js/views/bacheca/bacheca.html');
})

app.get('/backoffice/servizi', (req, res) => {
    res.send(global.rootDir + '/public/BackOffice/frontend/static/js/views/servizi/servizi.html');
})

app.get('/backoffice/serviziOnline', (req, res) => {
    res.send(global.rootDir + '/public/BackOffice/frontend/static/js/views/serviziOnline/serviziOnline.html');
})

app.get('/', async function(req, res) {
    let sitename = req.hostname.split('.')[0]
    res.send(await template.generate('index.html', {
        host: req.hostname,
        site: sitename
    }));
})
app.get('/', async function(req, res) {
    let sitename = req.hostname.split('.')[0]
    res.send(await template.generate('index.html', {
        host: req.hostname,
        site: sitename
    }));
})

app.get('/backoffice', (req, res) => {
    res.sendFile(
        global.rootDir + 'public/FrontOffice/index.html'
    )
})

app.get('/hw', async function(req, res) {
    var text = "Hello world as a Node service";
    res.send(
        `<!doctype html>
<html>
	<body>
		<h1>${text}</h1>
		<p><a href="javascript:history.back()">Go back</a></p>
	</body>
</html>
			`)
});

app.get('/hwhb', async function(req, res) {
    res.send(await template.generate('generic.html', {
        text: "Hello world as a Handlebar service",
    }));
});

const info = async function(req, res) {
    let data = {
        startDate: global.startDate.toLocaleString(),
        requestDate: (new Date()).toLocaleString(),
        request: {
            host: req.hostname,
            method: req.method,
            path: req.path,
            protocol: req.protocol
        },
        query: req.query,
        body: req.body
    }
    res.send(await template.generate('info.html', data));
}

app.get('/info', info)
app.post('/info', info)





/* ========================== */
/*                            */
/*           MONGODB          */
/*                            */
/* ========================== */

/* Replace these info with the ones you were given when activating mongoDB */
const mongoCredentials = {
        user: "site212229",
        pwd: "oiy3ahSa",
        site: "mongo_site212229"
    }
    /* end */

app.get('/db/create', async function(req, res) {
    res.send(await mymongo.create(mongoCredentials))
});
app.get('/db/search', async function(req, res) {
    res.send(await mymongo.search(req.query, mongoCredentials))
});









/* ========================== */
/*                            */
/*    ACTIVATE NODE SERVER    */
/*                            */
/* ========================== */

app.listen(8000, function() {
    global.startDate = new Date();
    console.log(`App listening on port 8000 started ${global.startDate.toLocaleString()}`)
})


/*       END OF SCRIPT        */