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

//läsa onliners från textfil med fs
const fs = require("node:fs/promises");

//hämtar ut users från users.json i data
const users = require("./data/users.json");

//hämta ut morgan
const morgan = require('morgan');
//logga ut information om inkommande request med hjälp utav morgan logging middleware
//man behöver alltså inte skriva den middlewaren vi skrev nedan, det är i princip onödigt 
app.use(morgan("dev"));

/**
 * Logga till consollen ang alla inkommande requests
 * MIDDLEWARE
 */
app.use((req, res, next) => {
	console.log("Someone requested something 😄");

    //hämta ut dagen du gör requesten, samt vad för metod (get oftast) och vilken path (väg)
    const now = new Date();
	console.log(`${now.toLocaleString()} - ${req.method} ${req.path}`);

    //skicka vidare requesten till nästa funktion i koden, hade man ej haft next() så hade sidorna aldrig laddat
	next();
});



// Lyssna efter inkommande GET requests till "/"
// om man går in i localHost:3000 så kommer detta loggas i terminalen 
app.get("/", (req, res) => {
    //dessa behövs inte när man har middleware
	// console.log("Someone requested my (g)root 🌲");
	// console.log("Requested method:", req.method);
	// console.log("Requested path:", req.path);
	res.send({message: "Oh, hi there 😊"});
});

//skicka in dessa exempel i webburl:

// "/users/johan/books/typescript-my-eternal-love"
// "/users/pelle/books/pride&predjudice"
// "/users/SOMETHING/books/SOMETHINGELSE"
// "/users/lajsamanelli/books/READ-BITCH"
app.get("/users/:userId/books/:bookId", (req, res) => {
	console.log("Params:", req.params);
	res.send({ message: "Would send book if I could" });
});

// Lyssna efter inkommande POST requests till "/"
app.post("/", (req, res) => {
    //behövs ej med middleware
	// console.log("Someone tried to mail me something 💌");
	res.send({ message: "I'm not a mailbox 😡" });
});

// Om man går in i localHost:3000/coffee så kommer detta att visas på sidan
// Kommer synas som en JSON fil i webben 
app.get("/coffee", (req, res) => {
    //behövs ej med middleware
	// console.log("☕️ yum");
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


// Om man går in i localHost:3000/textjoke så kommer detta visas på sidan
app.get("/textjoke", async (req, res) => {
	try {
        //läser av filen oneliners.txt
		const rawFile = await fs.readFile("./data/oneliners.txt", { encoding: "utf-8" });
        //split filen till ny rad
		const oneliners = rawFile.split("\n");

		// sampla arrayen med oneliners (aka ta ut random)
		const joke = _.sample(oneliners);
		res.send({
			joke,  // joke: joke
		});

        //ifall något går fel:
	} catch (err) {
		console.error("ERROR! ERROR! Could not find ./data/oneliners.txt!");
		// Let the requester know something has gone wrong
		res.status(500).send({
			message: "Could not read file with oneliners 😢",
		});
	}
});


// Om man går in i localHost:3000/users så kommer detta att visas på sidan
// JSON format fast i array
app.get("/users", (req, res) => {
	/* res.send([
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
	]); */
    //byter ut manuellt users med users från users.json i data
    res.send(users);
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