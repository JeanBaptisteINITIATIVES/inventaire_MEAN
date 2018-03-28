const express      = require('express');
const app          = express();
const bodyParser   = require('body-parser');
const jwt          = require('jsonwebtoken');

let dataLocation   = require('./locations');
let locations      = dataLocation.locations;

let stockEntries   = []; // ce qui est posté par l'utilisateur
let freeEntries    = [];
let totalEntries   = []; // Toutes les entrées

// on passe le middleware bodyParser.json() qui parse en json les données du formulaire
app.use(bodyParser.json());

// custom middleware pour gestion des headers
app.use((req, res, next) => {
	res.header('Access-Control-Allow-Origin', '*');
	res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization');
	next();
});

const api = express.Router();
app.use('/api', api);

// Récupération des produits
api.get('/locations', (req, res) => {
	res.json(locations);
});

// Récupération des entrées
api.get('/stock-entries', (req, res) => {
	res.json(stockEntries);
});

api.get('/free-entries', (req, res) => {
	res.json(freeEntries);
});

// Ajout entrée
api.post('/add/stock-entries', (req, res) => {
	// on récupère le "corps" du formulaire (grâce au middleware bodyParser)
	const stockEntry = req.body;
	// on ajoute le nouveau contenu aux jobs postés
	stockEntries = [stockEntry, ...stockEntries];
	totalEntries = [stockEntry, ...totalEntries];
	console.log('nombre d\'entrées suivies stock: ', stockEntries.length);
	console.log('Entrées stock', stockEntries);
	res.json(stockEntry); // on retourne une réponse
});

api.post('/add/free-entries', (req, res) => {
	// on récupère le "corps" du formulaire (grâce au middleware bodyParser)
	const freeEntry = req.body;
	// on ajoute le nouveau contenu aux jobs postés
	freeEntries  = [freeEntry, ...freeEntries];
	totalEntries = [freeEntry, ...totalEntries];
	console.log('nombre d\'entrées non-suivies stock: ', freeEntries.length);
	res.json(freeEntry); // on retourne une réponse
});

// Mise à jour entrée
api.post('/upd/stock-entries', (req, res) => {
	const stockEntry = req.body;
	let id           = stockEntry.id;
	// console.log(id);
	let entryIndex = stockEntries.findIndex(item => item.id == id);
	if ( typeof(entryIndex) === 'number' )
	{
		stockEntries[entryIndex] = stockEntry;
		console.log('Entrées stock', stockEntries);
		res.json({ success: true, entry: stockEntry });
	}
	else
	{
		res.json({ success: false, message: `Pas d'entrée stock ayant pour id ${id}` });
	}
});

api.post('/upd/free-entries', (req, res) => {
	const freeEntry = req.body;
	let id = freeEntry.id;
	// console.log(id);
	let entryIndex = freeEntries.findIndex(item => item.id == id);
	if (typeof (entryIndex) === 'number') {
		freeEntries[entryIndex] = freeEntry;
		res.json({ success: true, entry: freeEntry });
	}
	else {
		res.json({ success: false, message: `Pas d'entrée non-suivie ayant pour id ${id}` });
	}
});

// Suppression entré
api.post('/del/stock-entries', (req, res) => {
	const stockEntry = req.body;
	let id = stockEntry.id;
	// console.log(id);
	let entryIndex = stockEntries.findIndex(item => item.id == id);
	if (typeof(entryIndex) === 'number') {
		stockEntries.splice(entryIndex, 1);
		res.json({ success: true, entry: stockEntry });
	}
	else {
		res.json({ success: false, message: `Pas d'entrée stock ayant pour id ${id}` });
	}
});

api.post('/del/free-entries', (req, res) => {
	const freeEntry = req.body;
	let id = freeEntry.id;
	// console.log(id);
	let entryIndex = freeEntries.findIndex(item => item.id == id);
	if (typeof(entryIndex) === 'number') {
		freeEntries.splice(entryIndex, 1);
		res.json({ success: true, entry: freeEntry });
	}
	else {
		res.json({ success: false, message: `Pas d'entrée non-suivie ayant pour id ${id}` });
	}
});

const port = 4201;
app.listen(port, () => {
	console.log(`listening on port ${port}`);
});