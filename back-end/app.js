/*----------------------------------------------------------------
													REQUIRE
----------------------------------------------------------------*/
const express = require('express');
const helmet = require('helmet');
const mongoose = require('mongoose');
const dotenv = require('dotenv').config();
const rateLimit = require('express-rate-limit');

const path = require('path');
const sauceRoutes = require('./routes/sauce');
const userRoutes = require('./routes/user');

/*----------------------------------------------------------------
													CONNECTION
----------------------------------------------------------------*/
mongoose.connect( `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@${process.env.DB_HOST}/${process.env.DB_NAME}?retryWrites=true&w=majority`, { useNewUrlParser: true, useUnifiedTopology: true })
	.then(() => console.log("Connexion à la base de données réussie !"))
	.catch(() => console.log("Connexion à la base de données échouée !"));

const app = express();

// CORS
app.use((req, res, next) => {
	res.setHeader("Access-Control-Allow-Origin", "*");
	res.setHeader("Access-Control-Allow-Headers","Origin, X-Requested-With, Content, Accept, Content-Type, Authorization");
	res.setHeader("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, PATCH, OPTIONS");
	next();
});

// Limit the number of request to 100 request each minute
const limiter = rateLimit({ windowMs: 1 * 60 * 1000, max: 100 });

/*----------------------------------------------------------------
													APP
----------------------------------------------------------------*/
app.use(helmet());
app.use(express.json());
app.use(limiter);
app.use('/images', express.static(path.join(__dirname, 'images')));
app.use('/api/sauces', sauceRoutes);
app.use('/api/auth', userRoutes);

module.exports = app;