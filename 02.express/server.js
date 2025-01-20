/**
 * Express Server
 */

// Require eller hämta ut express, sen ge PORT ett nummer på 3500 för localhost
const express = require("express");
const PORT = 3000;
// Skapa en ny express-app
const app = express();

//hämta ut jokes från onliners
//WORKSHOP
const oneliners = require('./data/oneliners.json');
const _ = require('lodash');



// Lyssna efter inkommande GET requests till "/"
// om man går in i localHost:3000 så kommer detta loggas i terminalen 
app.get("/", (req, res) => {
	console.log("Someone requested my (g)root 🌲");
	console.log("Requested method:", req.method);
	console.log("Requested path:", req.path);
	res.send({message: "Oh, hi there 😊"});
});

// Lyssna efter inkommande POST requests till "/"
app.post("/", (req, res) => {
	console.log("Someone tried to mail me something 💌");
	res.send({ message: "I'm not a mailbox 😡" });
});

// Om man går in i localHost:3000/coffee så kommer detta att visas på sidan
// Kommer synas som en JSON fil i webben 
app.get("/coffee", (req, res) => {
	console.log("☕️ yum");
	res.send({
		can_you_have_too_much: false,
		coffee: "is good for you",
		do_i_need_moar_coffee: true,
		message: "Lolcats are funny",
		nicknames: [
			"coffee",
			"life-giving liquid",
			"black gold",
		],
	});
});

//WORKSHOP
// Listen for incoming GET requests to "/joke"
app.get("/joke", (req, res) => {
	// Somehow get all oneliners from `data/oneliners.json`
	// Get a random oneliner from the array of oneliners
	// Respond with an object with the oneliner as the `joke` attribute

    //ta ut en random nummer mellan 0-längen på arrayen i oneliners
    // const i = Math.floor(Math.random() * oneliners.length);
    //skämtet blir indexnumret i oneliners filen

    //lodash versionen av det som är tidigare (ta ut random från oneliner)
    // const i = _.random(oneliners.length - 1);

    // const joke = oneliners[i];

    
    //detta är mest optimalt, slipper ha två const (i och joke, räcker med joke)
    const joke = _.sample(oneliners);
    
    //skickar ut joke som en json sträng till webben
	res.send({
		joke
	});
});


// Om man går in i localHost:3000/lol så kommer detta visas på sidan
app.get("/lol", (req, res) => {
	res.send("I was wondering why the frisbee kept getting bigger and bigger, but then it hit me.");
});

// Om man går in i localHost:3000/users så kommer detta att visas på sidan
// JSON format fast i array
app.get("/users", (req, res) => {
	res.send([
		{
			username: "johan",
			profile_picture: "https://thumb.ac-illust.com/3c/3cea0e36d984553348ca536f07ca7617_t.jpeg",
		},
		{
			username: "pelle",
			profile_picture: null,
		},
		{
			username: "kajsa",
			profile_picture: null,
		},
		{
			username: "mimmi",
			profile_picture: null,
		},
	]);
});

// ifall användaren skriver en sida som inte finns i localhost:3000 
app.use((req, res) => {
	res.status(404).send({ message: `Cannot ${req.method} ${req.path}`});
});


// Starta lyssningen av inkommande request på port 3000
app.listen(PORT, () => {
	// Will be invoked once the server has started listening
	console.log(`🥳 Yay, server started on localhost:${PORT}`);
});