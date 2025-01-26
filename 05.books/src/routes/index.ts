import express from "express";
import authorRouter from "./author";
import bookRouter from "./book";


// Create a new Root router
const router = express.Router();


//skicka funktionen handlePrismaError till exception/prisma.ts 

/**
 * GET /
 */
router.get("/", (req, res) => {
	res.send({
		message: "I AM API, BEEP BOOP folder 5!",
	});
});



//flytta alla get, post, patch och delete till author.ts i src/routes för att göra sidan fin 
//      Author routes
router.use(authorRouter);




//flytta alla get, post, patch och delete till book.ts i src/routes för att göra sidan fin 
//      Book routes
router.use(bookRouter);





/**
 * Catch-all route handler
 */
router.use((req, res) => {
	// Respond with 404 and a message in JSON-format
	res.status(404).send({
		message: `Cannot ${req.method} ${req.path}`,
	});
});

export default router;