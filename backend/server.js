const express      = require('express');
const app          = express();
const bodyParser   = require('body-parser');
const jwt          = require('jsonwebtoken');

let dataLocation   = require('./locations');
let locations      = dataLocation.locations;

// let dataEntries    = require('./entries'); 
// let initialEntries = dataEntries.entries;
let stockEntries   = []; // ce qui est posté par l'utilisateur
let freeEntries    = [];
let totalEntries   = []; // Toutes les entrées

// fonction qui récupère toutes les entrées
// const getAllEntries = () => {
// 	return [...addedEntries, ...initialEntries];
// };

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

// ajout d'une nouvelle entrée saisie par l'utilisateur
api.post('/stock-entries', (req, res) => {
	// on récupère le "corps" du formulaire (grâce au middleware bodyParser)
	const stockEntry = req.body;
	// on ajoute le nouveau contenu aux jobs postés
	stockEntries = [stockEntry, ...stockEntries];
	totalEntries = [stockEntry, ...totalEntries];
	console.log('nombre d\'entrées suivies stock: ', stockEntries.length);
	res.json(stockEntry); // on retourne une réponse
});

api.post('/free-entries', (req, res) => {
	// on récupère le "corps" du formulaire (grâce au middleware bodyParser)
	const freeEntry = req.body;
	// on ajoute le nouveau contenu aux jobs postés
	freeEntries = [freeEntry, ...freeEntries];
	totalEntries = [freeEntry, ...totalEntries];
	console.log('nombre d\'entrées non-suivies stock: ', freeEntries.length);
	res.json(freeEntry); // on retourne une réponse
});

const port = 4201;
app.listen(port, () => {
	console.log(`listening on port ${port}`);
});