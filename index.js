/*
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
const cors = require('cors');
const fs = require('fs');







/* ========================== */
/*                            */
/*  EXPRESS CONFIG & ROUTES   */
/*                            */
/* ========================== */

let app = express();

let bodyParser = require('body-parser');
const { Exception } = require('handlebars');
const { ObjectID } = require('bson');

//app.use(bodyParser.json());
app.use(bodyParser.json({ limit: '50mb', extended: true }));
app.use(bodyParser.urlencoded({ limit: "50mb", extended: true, parameterLimit: 50000 }));
app.use(bodyParser.text({ limit: '200mb' }));
app.use(express.static(global.rootDir + '/public'))
app.use('/js', express.static(global.rootDir + '/public/js'));
app.use('/css', express.static(global.rootDir + '/public/css'));
app.use('/data', express.static(global.rootDir + '/public/data'));
app.use('/docs', express.static(global.rootDir + '/public/html'));
app.use('/img', express.static(global.rootDir + '/public/media'));
app.use(express.urlencoded({ extended: true }))
app.use(cors())

app.use('/login', express.static(global.rootDir + '/public/BackOffice'));

app.get('/login', (req, res) => {
    res.sendFile(
        global.rootDir + 'public/BackOffice/index.html'
    )
})

//Shop
app.use('/', express.static(global.rootDir + '/public/FrontOffice'));
app.use('/results', express.static(global.rootDir + '/public/FrontOffice'));
app.use('/cart', express.static(global.rootDir + '/public/FrontOffice'));
app.use('/services', express.static(global.rootDir + '/public/FrontOffice'));
app.use('/profile', express.static(global.rootDir + '/public/FrontOffice'));
app.use('/feed', express.static(global.rootDir + '/public/FrontOffice'));

app.get('/', (req, res) => {
    res.sendFile(
        global.rootDir + 'public/FrontOffice/index.html'
    )
})

app.get('/results', (req, res) => {
    res.sendFile(
        global.rootDir + 'public/FrontOffice/index.html'
    )
})

app.get('/cart', (req, res) => {
    res.sendFile(
        global.rootDir + 'public/FrontOffice/index.html'
    )
})

app.get('/services', (req, res) => {
    res.sendFile(
        global.rootDir + 'public/FrontOffice/index.html'
    )
})

app.get('/profile', (req, res) => {
    res.sendFile(
        global.rootDir + 'public/FrontOffice/index.html'
    )
});

app.get('/feed', (req, res) => {
    res.sendFile(
        global.rootDir + 'public/FrontOffice/index.html'
    )
})

//Game
app.use('/game', express.static(global.rootDir + '/public/Game'));
app.use('/game/quiz', express.static(global.rootDir + '/public/Game'));
app.use('/game/wordle', express.static(global.rootDir + '/public/Game'));
app.use('/game/memory', express.static(global.rootDir + '/public/Game'));
app.use('/game/animalinfo', express.static(global.rootDir + '/public/Game'));
app.use('/game/medinfo', express.static(global.rootDir + '/public/Game'));
app.use('/game/yourpets', express.static(global.rootDir + '/public/Game'));
app.use('/login', express.static(global.rootDir + '/public/BackOffice'));

app.get('/login', (req, res) => {
    res.sendFile(
        global.rootDir + 'public/BackOffice/index.html'
    )
})
app.use('/game/funnyvideos', express.static(global.rootDir + '/public/Game'));

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

app.get('/game/funnyvideos', (req, res) => {
    res.sendFile(
        global.rootDir + 'public/Game/index.html'
    )
})

app.get('/game/yourpets', (req, res) => {
        res.sendFile(
            global.rootDir + 'public/Game/index.html'
        )
    })
    // http://stackoverflow.com/questions/40459511/in-express-js-req-protocol-is-not-picking-up-http-for-my-secure-link-it-alwa
app.enable('trust proxy');

//Backoffice
app.use('/backoffice', express.static(global.rootDir + '/public/BackOffice'));
app.use('/backoffice/bacheca', express.static(global.rootDir + '/public/BackOffice/frontend/index.html'));
app.use('/backoffice/utenti', express.static(global.rootDir + '/public/BackOffice/frontend/static/js/views/utenti/utenti.html'));
app.use('/backoffice/prodotti', express.static(global.rootDir + '/public/BackOffice/frontend/static/js/views/prodotti/prodotti.html'));
app.use('/backoffice/messaggi', express.static(global.rootDir + '/public/BackOffice/frontend/static/js/views/messaggi/messaggi.html'));
app.use('/backoffice/servizi', express.static(global.rootDir + '/public/BackOffice/frontend/static/js/views/servizi/servizi.html'));
app.use('/backoffice/serviziOnline', express.static(global.rootDir + '/public/BackOffice/frontend/static/js/views/serviziOnline/serviziOnline.html'));

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

app.put('/backoffice/users.json', (req, res) => {
    var filepath = 'public/BackOffice/users.json';
    var file = fs.readFileSync(filepath);
    var json = JSON.parse(file);
    const newUser = {
        username: req.body.username,
        email: req.body.email,
        password: req.body.password,
        admin: '1'
    };
    json.push(newUser);
    fs.writeFileSync(filepath, JSON.stringify(json));
    res.send();
})

app.put('/backoffice/frontend/static/js/views/utenti/utenti.json', (req, res) => {
    var filepath = 'public/BackOffice/frontend/static/js/views/utenti/utenti.json';
    var file = fs.readFileSync(filepath);
    var json = JSON.parse(file);
    const newUser = {
        id: req.body.id,
        name: req.body.name,
        favorites: req.body.favorites,
        score: req.body.score
    };
    json.push(newUser);
    fs.writeFileSync(filepath, JSON.stringify(json));
    res.send();
})

app.put('/backoffice/frontend/static/js/views/prodotti/prodotti.json', (req, res) => {
    var filepath = 'public/BackOffice/frontend/static/js/views/prodotti/prodotti.json';
    var file = fs.readFileSync(filepath);
    var json = JSON.parse(file);
    const newProduct = {
        id: req.body.id,
        name: req.body.name,
        description: req.body.description,
        price: req.body.price,
        availability: req.body.availability,
        image: req.body.image
    };
    json.products.push(newProduct);
    fs.writeFileSync(filepath, JSON.stringify(json));
    res.send();
})



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

app.get('/db/getUserBookings', async function(req, res) {
    let allBookings = await mymongo.getCollection("bookings", mongoCredentials);
    let userBookings = [];
    try {
        allBookings.result.map((booking) => {
            if (booking.userId == req.query.id)
                userBookings.push(booking);
        });
        res.send(userBookings);
    } catch (ex) {
        console.log(ex);
        res.send(ex);
    }
});

app.get('/db/getMultipleElements', async function(req, res) {
    let allElems = await mymongo.getCollection(req.query.collection, mongoCredentials);
    console.log(req.query.ids);
    let multElems = [];
    try {
        allElems.map((elem) => {
            if (req.query.ids.includes(elem._id))
                multElems.push(elem);
        });
        res.send(multElems);
    } catch (ex) {
        console.log(ex);
        res.send(ex);
    }
});

app.get('/db/create', async function(req, res) {
    res.send(await mymongo.create(mongoCredentials))
});

app.get('/db/search', async function(req, res) {
    res.send(await mymongo.search(req.query, mongoCredentials))
});

app.get('/api/getProducts', async function(req, res) {
    res.send({ risposta: "yoyoyo" });
})

app.get('/mongo/collections', async(req, res) => {
    let collection_name = ["Uffici", "Clienti", "Dipendenti", "Manager"];

    MongoClient.connect(localMongoUri, async function(err, database) {
        if (err) throw err;
        console.log("DB OK - RESET DATA");
        var dbo = database.db("SiteDB");

        for (name of collection_name) {
            //Crea le collezioni di default
            dbo.createCollection(name, function(err, res) {
                if (err) throw err;
                console.log("Collection created! " + name);
            });

            dbo.collection(name).find({}).toArray(function(err, result) {
                if (err) throw err;
                console.log(result);
            });
        }
    });
});

/*
fetch('/db/collection?collection=users',{
        method:'GET'
    })
*/
app.get('/db/collection', async function(req, res) {
    res.send(await mymongo.getCollection(req.query.collection, mongoCredentials))
});

/*
fetch('/db/collectionsize?collection=products',{
    method:'GET'
    })
*/
app.get('/db/collectionsize', async function(req, res) {
    res.send(await mymongo.getCollectionSize(req.query.collection, mongoCredentials))
});

//mettere nella query direttamente l'id
/*
fetch('/db/element?id=3&collection=users',{
        method:'GET'
    })
*/
app.get('/db/element', async function(req, res) {
    res.send(await mymongo.getElem(ObjectID(req.query.id), req.query.collection, mongoCredentials))
});

//mettere nel body l'oggetto intero
/*
let obj = {
    collection:'users',
    elem:{ 
        "_id":"3",
        "name": "Gerald",
        "username": "Geraldadmin",
        "email": "gerald@marcio.com",
        "password":"ciaociao",
        "favorites": ["cat"],
        "pets":[],
        "score": "1000",
        "admin": "1"
    }
};

fetch('/db/element',{
    method:'POST',
    headers: {
        'Content-type': 'application/json',
        'Accept': 'application/json'
    },
    body: JSON.stringify(obj)
})
*/
app.post('/db/element', async function(req, res) {
    console.log("post" + req.body.elem._id)
    req.body.elem._id = new ObjectID();
    res.send(await mymongo.insertElem(req.body.elem, req.body.collection, mongoCredentials))
});

//mettere nel body l'oggetto intero
/*
obj = {
    collection:'users',
    elem:{
        "_id":"3",
        "name": "Gerald",
        "username": "Budino",
        "email": "gerald@marcio.com",
        "password":"ciaociao",
        "favorites": ["cat"],
        "pets":[],
        "score": "1000",
        "admin": "1"
    }
}
fetch('/db/element',{
    method:'PUT',
    headers: {
        'Content-type': 'application/json',
        'Accept': 'application/json'
    },
    body: JSON.stringify(obj)
})
*/
app.put('/db/element', async function(req, res) {
    req.body.elem._id = ObjectID(req.body.elem._id);
    console.log(req.body.elem._id);
    res.send(await mymongo.editElem(req.body.elem, req.body.collection, mongoCredentials))
});

//mettere nel body direttamente l'id
/*
obj = {
    collection:'users',
    id:'3'
}
fetch('/db/element',{
    method:'DELETE',
    headers: {
        'Content-type': 'application/json',
        'Accept': 'application/json'
    },
    body: JSON.stringify(obj)
})
*/
app.delete('/db/element', async function(req, res) {
    res.send(await mymongo.removeElem(ObjectID(req.body.id), req.body.collection, mongoCredentials))
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