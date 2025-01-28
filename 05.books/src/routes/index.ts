import express from "express";
import authorRouter from "./author";
import bookRouter from "./book";
import publisherRouter from "./publisher";
import { register} from "../controllers/register_controller"


// Create a new Root router
const router = express.Router();


//skicka funktionen handlePrismaError till exception/prisma.ts 

/**
 * GET /
 */
router.get("/", (req, res) => {
	res.send({
		status: "success",
		data: {
			message: "I AM BOOK API, LOREM IPSUM",
		}
	});
});



//flytta alla get, post, patch och delete till author.ts i src/routes för att göra sidan fin 
//      Author routes
//skriver /authors i början så jag slipper ha det i books, kan ta bort första /authors i mina get, post, patch, del osv
router.use("/authors", authorRouter);




//flytta alla get, post, patch och delete till book.ts i src/routes för att göra sidan fin 
//      Book routes
//skriver /books i början så jag slipper ha det i books, kan ta bort första /books i mina get, post, patch, del osv
router.use("/books", bookRouter);




//      Publisher routes
router.use('/publishers', publisherRouter)



/**
 * Register a new user
 * 
 * POST /register
 */

router.post('/register', register);

/**
 * Catch-all route handler
 */
router.use((req, res) => {
	// Respond with 404 and a message in JSON-format
	res.status(404).send({
		status: "fail",
		data: {
			message: `Cannot ${req.method} ${req.path}`,
		}
	});
});

export default router;