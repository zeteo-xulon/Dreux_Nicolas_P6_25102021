//----------------------------------------------------------------------------------------------
// 			REQUIRE
//----------------------------------------------------------------------------------------------

const Sauce = require("../models/Sauce");
const fs = require("fs");
const { use } = require("../routes/sauce");

//----------------------------------------------------------------------------------------------
exports.createSauce = (req, res, next) => {
	const sauceObject = JSON.parse(req.body.sauce);
	delete sauceObject._id;
	const sauce = new Sauce({
		...sauceObject,
		imageUrl: `${req.protocol}://${req.get("host")}/images/${ req.file.filename }` });
	console.log(sauce);
	sauce.save()
		.then(() => res.status(201).json({ message: "Objet enregistré !" }))
		.catch((error) => res.status(400).json({ error }));
};

//----------------------------------------------------------------------------------------------

exports.modifySauce = (req, res, next) => {
	const sauceImage = req.file;
	if(sauceImage){
		Sauce.findOne({ _id: req.params.id })
		.then((sauce) => {
			sauceObject = { 
				...JSON.parse(req.body.sauce),
				imageUrl: `${req.protocol}://${req.get("host")}/images/${ req.file.filename }` 
			};
			const imageName = sauce.imageUrl.split("/images/")[1];
			fs.unlink(`images/${imageName}`, () =>{
				Sauce.updateOne( { _id: req.params.id }, { ...sauceObject, _id: req.params.id } )
				.then(() =>	{ res.status(200).json({ message: "Sauce updated successfully!" })})
				.catch((error) => res.status(400).json({ error }))});
			})
		.catch((error) => res.status(500).json({ error }));
	} else {
		Sauce.updateOne( { _id: req.params.id }, { ...req.body, _id: req.params.id } )
		.then(() =>	{ res.status(200).json({ message: "Sauce updated successfully!" })})
		.catch((error) => res.status(400).json({ error }))
	}
};

//----------------------------------------------------------------------------------------------

exports.deleteSauce = (req, res, next) => {
	Sauce.findOne({ _id: req.params.id })
		.then((sauce) => {
			console.log(sauce);
			const imageName = sauce.imageUrl.split("/images/")[1];
			fs.unlink(`images/${imageName}`, () => {
				Sauce.deleteOne({ _id: req.params.id })
					.then(() => res.status(200).json({ message: "Deleted!" }))
					.catch((error) => res.status(400).json({ error }));
			});
		})
		.catch((error) => res.status(500).json({ error }));
};

//----------------------------------------------------------------------------------------------

exports.getOneSauce = (req, res, next) => {
	Sauce.findOne({ _id: req.params.id })
		.then((sauce) => res.status(200).json(sauce))
		.catch((error) => res.status(404).json({ error }));
};

//----------------------------------------------------------------------------------------------

exports.getAllSauce = (req, res, next) => {
	Sauce.find()
		.then((sauces) => res.status(200).json(sauces))
		.catch((error) => res.status(400).json({ error }));
};

exports.likeSauce = (req, res, next) => {
	/*
	*	Ok l'idée c'est de faire une condition ou d'abord on check l'utilisateur (userId)
	* Ensuite, 3 if, si c'est 1 alors l'utilisateur aime, donc il ne peut pas aimer 2 fois le même produit
	*	si c'est 0, alors l'utilisateur annule son like ou son dislike (remise a zero du compteur)
	*	si c'est -1, alors l'utilisateur dislike, il faut checker s'il a pas déjà liker ou disliker le produit.
	*	s'il a déjà liker ou disliker, il doit d'abord remettre a zero.
	* les like donnent un tableau avec tout les utilisateurs qui ont liké.
	*	Donc il faudra vérifier si l'userId est dans le tableau, par .find() par exemple.
	*/
	console.log(req.body);
	console.log(req.params);
	let userId = req.body.id;
	let sauceId = req.params.id;
	let like = req.body.like;
	if(like === 1) {
			Sauce.updateOne( { _id : sauceId }, { 
				$inc: { like: like }, 
				$push: { usersLiked : userId }, 
			} )
				.then(() =>	{ res.status(200).json({ message: "liked successfully!" })})
				.catch((error) => res.status(400).json({ error }));
		}
		

	if(like === -1) {
		if(sauceId != userId){
			Sauce.updateOne( { _id : sauceId }, { $inc: { like: like }, $push: { usersLiked : userId }, } )
				.then(() =>	{ res.status(200).json({ message: "liked successfully!" })})
				.catch((error) => res.status(400).json({ error }));
			}
	}
	if(like === 0) {
		
	}

}