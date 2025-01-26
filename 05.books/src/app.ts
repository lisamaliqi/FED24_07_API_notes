import express from "express";
import prisma from "./prisma"; // importing the prisma instance we created
import morgan from "morgan";
import authorRouter from "./routes/author";
import bookRouter from "./routes/book";
import { stat } from "fs";
import { error } from "console";

const app = express();
app.use(express.json());
app.use(morgan("dev"));

//skicka funktionen handlePrismaError till exception/prisma.ts 

/**
 * GET /
 */
app.get("/", (req, res) => {
	res.send({
		message: "I AM API, BEEP BOOP folder 5!",
	});
});



//flytta alla get, post, patch och delete till author.ts i src/routes för att göra sidan fin 
//      Author routes
app.use(authorRouter);




//flytta alla get, post, patch och delete till book.ts i src/routes för att göra sidan fin 
//      Book routes
app.use(bookRouter);





/**
 * Catch-all route handler
 */
app.use((req, res) => {
	// Respond with 404 and a message in JSON-format
	res.status(404).send({
		message: `Cannot ${req.method} ${req.path}`,
	});
});

export default app;