const express = require('express');
const helmet = require('helmet');
const mongoose = require('mongoose');
const dotenv = require('dotenv').config();

const path = require('path');

const sauceRoutes = require('./routes/sauce');
const userRoutes = require('./routes/user');
const auth = require('./middleware/auth');



mongoose.connect( process.env.DATABASE, { useNewUrlParser: true, useUnifiedTopology: true })
	.then(() => console.log("Connexion à la base de données réussie !"))
	.catch(() => console.log("Connexion à la base de données échouée !"));


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

app.use('/images', express.static(path.join(__dirname, 'images')));

app.use('/api/sauces', sauceRoutes);
app.use('/api/auth', userRoutes);

module.exports = app;