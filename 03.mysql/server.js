/**
 *     MySQL
 */

// Hämta ut express, lodash, file-system, morgan, mySQL och port-nr
const express = require("express");
const _ = require("lodash");
const fs = require("node:fs/promises");
const morgan = require("morgan");
const mysql = require("mysql2/promise");
const PORT = 3000;

// Read any .env-files
require("dotenv").config();
// console.log("DATABASE_HOST:", process.env.DATABASE_HOST);

// Create the connection to the database
const connection = mysql.createConnection({
	host: process.env.DATABASE_HOST,
	port: process.env.DATABASE_PORT,
	user: process.env.DATABASE_USER,
	password: process.env.DATABASE_PASSWORD,
	database: process.env.DATABASE_NAME,
});   

// Skapa en ny Express app
const app = express();

// Parse all inkommande JSON
app.use(express.json());

//logga all info ang kommande requests med morgan middleware
app.use(morgan("dev"));

// Listen for incoming GET requests to "/"
app.get("/", (req, res) => {
	res.send({ message: "Oh, hi there 😊" });
});

/**
 * GET /users
 *
 * Get all users
 */
app.get("/users", async (req, res) => {
	// Wait for connection to be established
	const db = await connection;

	// Execute a query
	// const result = await db.query("SELECT * FROM users");
	const [ rows ] = await db.query("SELECT * FROM users");
    //detta hämtar ut alla users från api:n jag skapat i phpmyadmin under api_todos och users

	// Extract rows from result
	// const rows = result[0];

	// Respond with rows
	res.send(rows);
});

/**
 * GET /users/:userId
 *
 * Get a single user
 */

/**
 * WORKSHOP 2025-01-10
 */
app.get("/users/:userId", async (req, res) => {
    //hämta ut det vi skriver in i url på userId och gör om det till ett Number
    const userId = Number(req.params.userId);

    //om man skriver in ett falsey värde, aka inte ett nummer id man kan söka på (typ apa elr 0)
    if(!userId) {
        console.log('error!');
        //skicka res.status som 404 (error) samt skicka meddelande 
        res.status(404).send({ message: 'Thats not a number idiot'});
        return; 
    }

    //hämta ut databas från connection
    const db = await connection;

    //skapa en query som tar ut id som stämmer med det id vi skriver in
	// SELECT * FROM users WHERE id = 2
	const [ rows ] = await db.query("SELECT * FROM users WHERE id = ?", [userId]);
	// guard clause 👮🏻‍♂️
	if (!rows.length) {
		// Respond with 404 and message in JSON-format
		res.status(404).send({
			message: "User Not Found",
		});
		return;
	}
	// skicka response med rows
	res.send(rows[0]);
});


/**
 * POST /users
 *
 * Create a user
 */
app.post("/users", async (req, res) => {
	console.log("Incoming! 🚀", req.body);
	const db = await connection;
	const [ result ] = await db.query("INSERT INTO users SET username = ?, name = ?, email = ?", [
		req.body.username,
		req.body.name,
		req.body.email,
	]);
	console.log("Result:", result);
	// Send back the received data and append the id of the newly created record
	res.send({
		...req.body,
		id: result.insertId,
	});
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