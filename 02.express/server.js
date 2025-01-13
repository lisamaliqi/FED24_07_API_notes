/**
 * Express Server
 */

// Require eller hämta ut express, sen ge PORT ett nummer på 3500 för localhost
const express = require("express");
const PORT = 3500;
// Skapa en ny express-app
const app = express();

// Lyssna efter inkommande GET requests till "/"
// om man går in i localHost:3400 så kommer detta loggas i terminalen 
app.get("/", (req, res) => {
	console.log("Someone requested my (g)root 🌲");
	console.log("Requested method:", req.method);
	console.log("Requested path:", req.path);
	res.send("Oh, hi there 😊");
});

// Om man går in i localHost:3500/coffee så kommer detta att visas på sidan
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

// Om man går in i localHost:3500/lol så kommer detta visas på sidan
app.get("/lol", (req, res) => {
	res.send("I was wondering why the frisbee kept getting bigger and bigger, but then it hit me.");
});

// Starta lyssningen av inkommande request på port 3500
app.listen(PORT, () => {
	// Will be invoked once the server has started listening
	console.log(`🥳 Yay, server started on localhost:${PORT}`);
});