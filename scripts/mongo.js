/*
File: mongo.js
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

/* Dati di prova */
let fn = "/public/data/country-by-capital-city.json"
let dbname = "countries"
let collection ="capitals"
let fieldname = "country"

const { MongoClient } = require("mongodb");
const fs = require('fs').promises ;
const template = require(global.rootDir + '/scripts/tpl.js') ; 

exports.create = async function(credentials) {
	const mongouri = `mongodb://${credentials.user}:${credentials.pwd}@${credentials.site}?writeConcern=majority`;

	let collections = ['communityFeed', 'products', 'services', 'users'];
	let debug = []
	try {
		debug.push(`Trying to connect to MongoDB with user: '${credentials.user}' and site: '${credentials.site}' and a ${credentials.pwd.length}-character long password...`)
		const mongo = new MongoClient(mongouri);		
		await mongo.connect();
		debug.push("... managed to connect to MongoDB.")

		for (let i = 0; i<collections.length; i++){
			debug.push(`Trying to read file '${fn}'... `)
			let doc = await fs.readFile(rootDir + "/public/data/"+collections[i]+".json", 'utf8')
			let data = JSON.parse(doc)
			debug.push(`... read ${data.length} records successfully. `)

			debug.push(`Trying to remove all records in table '${dbname}'... `)
			let cleared = await mongo.db(dbname)
						.collection(collections[i])
						.deleteMany()
			debug.push(`... ${cleared?.deletedCount || 0} records deleted.`)
						
			debug.push(`Trying to add ${data.length} new records... `)
			let added = await mongo.db(dbname)
						.collection(collections[i])
						.insertMany(data);	
			debug.push(`... ${added?.insertedCount || 0} records added.`)
		}

		await mongo.close();
		debug.push("Managed to close connection to MongoDB.")

		return {
			message: `<h1>Removed ${cleared?.deletedCount || 0} records, added ${added?.insertedCount || 0} records</h1>`, 
			debug: debug
		}
	} catch (e) {
		e.debug = debug
		return e
	}
}


exports.search = async function(q,credentials) {
	const mongouri = `mongodb://${credentials.user}:${credentials.pwd}@${credentials.site}?writeConcern=majority`;

	let query =  {}
	let debug = []
	let data = {query: q[fieldname], result: null}
	try {
		debug.push(`Trying to connect to MongoDB with user: '${credentials.user}' and site: '${credentials.site}' and a ${credentials.pwd.length}-character long password...`)
		const mongo = new MongoClient(mongouri);		
		await mongo.connect();
		debug.push("... managed to connect to MongoDB.")

		debug.push(`Trying to query MongoDB with query '${q[fieldname]}'... `)
		let result = []
		query[fieldname] = { $regex: q[fieldname], $options: 'i' }
		await mongo.db(dbname)
					.collection(collection)
					.find(query)
					.forEach( (r) => { 
						result.push(r) 
					} );
		debug.push(`... managed to query MongoDB. Found ${result.length} results.`)

		data.result = result
		await mongo.close();
		debug.push("Managed to close connection to MongoDB.")

		data.debug = debug

		if (q.ajax) {
			return data
		} else {
			var out = await template.generate('mongo.html', data);
			return out
		}
	} catch (e) {
		data.debug = debug
		data.error = e
		return data
	}
}

///////GET/////////

//Recupera l'intera collezione c
exports.getCollection = async function(c,credentials) {
	const mongouri = `mongodb://${credentials.user}:${credentials.pwd}@${credentials.site}?writeConcern=majority`;

	let debug = [];
	let data = {result: null};
	try {
		debug.push(`Trying to connect to MongoDB with user: '${credentials.user}' and site: '${credentials.site}' and a ${credentials.pwd.length}-character long password...`)
		const mongo = new MongoClient(mongouri);		
		await mongo.connect();
		debug.push("... managed to connect to MongoDB.")

		debug.push(`Trying to get collection '${c}'... `)
		let result = [];
		await mongo.db(dbname)
					.collection(c)
					.find({})
					.forEach( (r) => { 
						result.push(r) 
					} );
		debug.push(`... managed to get collection. Found ${result.length} results.`)

		data.result = result
		await mongo.close();
		debug.push("Managed to close connection to MongoDB.")

		data.debug = debug
		return data;
	} catch (e) {
		data.debug = debug
		data.error = e
		return data
	}
}

//Recupera l'elemento e
exports.getElem = async function(id,collection,credentials) {
	const mongouri = `mongodb://${credentials.user}:${credentials.pwd}@${credentials.site}?writeConcern=majority`;

	let debug = []
	let data = {result: null};
	try {
		debug.push(`Trying to connect to MongoDB with user: '${credentials.user}' and site: '${credentials.site}' and a ${credentials.pwd.length}-character long password...`)
		const mongo = new MongoClient(mongouri);		
		await mongo.connect();
		debug.push("... managed to connect to MongoDB.")

		debug.push(`Trying to get element with id '${id}'... `)
		let result = await mongo.db(dbname)
			.collection(collection)
			.findOne({
				_id: id
			});
		
		debug.push(`... managed to get element. `)
		data.result = result;

		await mongo.close();
		debug.push("Managed to close connection to MongoDB.")

		data.debug = debug
		return data;
	} catch (e) {
		data.debug = debug
		data.error = e
		return data
	}
}

//Recupera il numero di elementi presenti nella collezione c
exports.getCollectionSize = async function(c,credentials) {
	const mongouri = `mongodb://${credentials.user}:${credentials.pwd}@${credentials.site}?writeConcern=majority`;

	let debug = []
	let data = {result: null};
	try {
		debug.push(`Trying to connect to MongoDB with user: '${credentials.user}' and site: '${credentials.site}' and a ${credentials.pwd.length}-character long password...`)
		const mongo = new MongoClient(mongouri);		
		await mongo.connect();
		debug.push("... managed to connect to MongoDB.")

		debug.push(`Trying to get the number of elements in '${c}'... `)
		let result = await mongo.db(dbname)
								.collection(c)
								.estimatedDocumentCount();
		
		debug.push(`... managed to get length.`)

		data.result = result
		await mongo.close();
		debug.push("Managed to close connection to MongoDB.")

		data.debug = debug
		return data;
	} catch (e) {
		data.debug = debug
		data.error = e
		return data
	}
}

///////INSERT/////////

//Inserisci l'elemento e 
exports.insertElem = async function(e,collection,credentials) {
	const mongouri = `mongodb://${credentials.user}:${credentials.pwd}@${credentials.site}?writeConcern=majority`;

	let debug = []
	let data = {result: null};
	try {
		debug.push(`Trying to connect to MongoDB with user: '${credentials.user}' and site: '${credentials.site}' and a ${credentials.pwd.length}-character long password...`)
		const mongo = new MongoClient(mongouri);		
		await mongo.connect();
		debug.push("... managed to connect to MongoDB.")

		debug.push(`Trying to insert element with id '${e._id}' in '${collection}'... `)

		await mongo.db(dbname)
					.collection(collection)
					.insertOne(e);
		debug.push(`... managed to insert element. `)

		await mongo.close();
		debug.push("Managed to close connection to MongoDB.")

		data.debug = debug
		return data;
	} catch (e) {
		data.debug = debug
		data.error = e
		return data
	}
}
///////EDIT/////////

//Modifica l'elemento e
exports.editElem = async function(e,collection,credentials) {
	const mongouri = `mongodb://${credentials.user}:${credentials.pwd}@${credentials.site}?writeConcern=majority`;

	let debug = []
	let data = {result: null};
	try {
		debug.push(`Trying to connect to MongoDB with user: '${credentials.user}' and site: '${credentials.site}' and a ${credentials.pwd.length}-character long password...`)
		const mongo = new MongoClient(mongouri);		
		await mongo.connect();
		debug.push("... managed to connect to MongoDB.")

		debug.push(`Trying to edit element with id '${e._id}'... `)

		await mongo.db(dbname)
					.collection(collection)
					.findOneAndReplace(
						{_id: e._id},
						e
					)
		debug.push(`... managed to edit element.`)

		await mongo.close();
		debug.push("Managed to close connection to MongoDB.")

		data.debug = debug
		return data;
	} catch (e) {
		data.debug = debug
		data.error = e
		return data
	}
}

///////REMOVE/////////

//Rimuovi un elemento da una collezione
exports.removeElem = async function(id,collection,credentials) {
	const mongouri = `mongodb://${credentials.user}:${credentials.pwd}@${credentials.site}?writeConcern=majority`;

	let debug = []
	let data = {result: null};
	try {
		debug.push(`Trying to connect to MongoDB with user: '${credentials.user}' and site: '${credentials.site}' and a ${credentials.pwd.length}-character long password...`)
		const mongo = new MongoClient(mongouri);		
		await mongo.connect();
		debug.push("... managed to connect to MongoDB.")

		debug.push(`Trying to remove element with id '${id}'... `)

		await mongo.db(dbname)
					.collection(collection)
					.findOneAndDelete(
						{
							_id: id
						}
					)
		debug.push(`... managed to remove element.`)

		await mongo.close();
		debug.push("Managed to close connection to MongoDB.")

		data.debug = debug
		return data;
	} catch (e) {
		data.debug = debug
		data.error = e
		return data
	}
}

/* Untested */
// https://stackoverflow.com/questions/39599063/check-if-mongodb-is-connected/39602781
exports.isConnected = async function() {
	let client = await MongoClient.connect(mongouri) ;
	return !!client && !!client.topology && client.topology.isConnected()
}