/**
 * MySQL
 */

// Hämta ut express, lodash, file-system, morgan och port-nr
const express = require("express");
const _ = require("lodash");
const fs = require("node:fs/promises");
const morgan = require("morgan");
const PORT = 3000;

// Skapa ny express app
const app = express();

// Parse all inkommande JSON 
app.use(express.json());

//logga all info ang kommande requests med morgan middleware
app.use(morgan("dev"));

//GET requests till "/"
app.get("/", (req, res) => {
	res.send({ message: "Oh, hi there 😊" });
});

// GET all users
app.get("/users", (req, res) => {
	res.send([]);
});

// Catch-all route
app.use((req, res) => {
	res.status(404).send({ message: `Cannot ${req.method} ${req.path}`});
});

//starta lyssningen för inkommande requests till port 3000
app.listen(PORT, () => {
	// Will be invoked once the server has started listening
	console.log(`🥳 Yay, server started on localhost:${PORT}`);
});