const express = require('express');
const helmet = require('helmet');
const mongoose = require('mongoose');
const dotenv = require('dotenv').config();


mongoose.connect( process.env.DATABASE, { useNewUrlParser: true, useUnifiedTopology: true })
	.then(() => console.log("Connexion à la base de donnée réussie !"))
	.catch(() => console.log("Connexion à la base de donnée échouée !"));


const app = express();

app.use((req, res, next) => {
	res.setHeader("Access-Control-Allow-Origin", "*");
	res.setHeader(
		"Access-Control-Allow-Headers",
		"Origin, X-Requested-With, Content, Accept, Content-Type, Authorization"
	);
	res.setHeader(
		"Access-Control-Allow-Methods",
		"GET, POST, PUT, DELETE, PATCH, OPTIONS"
	);
	next();
});


app.use(helmet());
app.use(express.json());

module.exports = app;