//----------------------------------------------------------------------------------------------
// 			REQUIRE
//----------------------------------------------------------------------------------------------

const Sauce = require("../models/Sauce");
const fs = require("fs");
const { log } = require("console");

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

//----------------------------------------------------------------------------------------------

exports.likeSauce = (req, res, next) => {
	Sauce.findOne({ _id: req.params.id })
		.then((sauce) => {
						// get infos
			console.log(req.body);
			console.log(req.params);

			//variables
			let userId = req.body.userId;
			let sauceId = req.params.id;
			let like = req.body.like;

			console.log(sauce);
			let arrayLikers = sauce.usersLiked;
			console.log(arrayLikers);
			let arrayDislikers = sauce.usersDisliked;
			console.log(arrayDislikers);
			let arrayFindLiked = arrayLikers.find((e) => e === userId );
			console.log(arrayFindLiked);
			let arrayFindDisliked = arrayDislikers.find((e) => e === userId );
			console.log(arrayFindDisliked);

	//conditions 
			if(like === 1) {
					Sauce.updateOne( { _id : sauceId }, { $inc: { likes: parseInt(like) }, $push: { usersLiked : userId }, } )
						.then(() =>	{ res.status(200).json({ message: "liked successfully!" })})
						.catch((error) => res.status(400).json({ error }));
				}
				
			if(like === -1) {
					Sauce.updateOne( { _id : sauceId }, { $inc: { dislikes: parseInt(like) }, $push: { usersDisliked : userId }, } )
						.then(() =>	{ res.status(200).json({ message: "disliked successfully!" })})
						.catch((error) => res.status(400).json({ error }));
			}

			if(like === 0) {
				if(arrayFindLiked != undefined) {
						Sauce.updateOne( { _id : sauceId }, { $inc: { likes: -1 }, $pull: { usersLiked : userId } ,} )
						.then(() =>	{ res.status(200).json({ message: "liked successfully!" })})
						.catch((error) => res.status(400).json({ error }));
				}
				if(arrayFindDisliked != undefined) {
					Sauce.updateOne( { _id : sauceId }, { $inc: { dislikes: +1 }, $pull: { usersDisliked : userId }, } )
					.then(() =>	{ res.status(200).json({ message: "liked successfully!" })})
					.catch((error) => res.status(400).json({ error }));
				}
						
			}
	})
	.catch((error) => res.status(400).json({ error }));
}