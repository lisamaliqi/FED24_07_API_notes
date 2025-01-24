import express from "express";
import prisma from "./prisma"; // importing the prisma instance we created
import morgan from "morgan";
import { PrismaClientInitializationError, PrismaClientKnownRequestError, PrismaClientValidationError } from "@prisma/client/runtime/library";

const app = express();
app.use(express.json());
app.use(morgan("dev"));

//funktion som hanterar errors så man slipper skriva error-kod för varje request
const handlePrismaError = (err: unknown) => {
	if (err instanceof PrismaClientInitializationError) {
		return { status: 500, message: "Error initializing connection to database" };

	} else if (err instanceof PrismaClientKnownRequestError) {
		if (err.code === "P2021") {
			return { status: 500, message: "Database table does not exist" };

		} else if (err.code === "P2025") {
			return { status: 404, message: "Not Found" };
		}

	} else if (err instanceof PrismaClientValidationError) {
		return { status: 400, message: "Validation Error" };

	}

	return { status: 500, message: "Something went wrong when querying the database" };
}

/**
 * GET /
 */
app.get("/", (req, res) => {
	res.send({
		message: "I AM API, BEEP BOOP folder 5!",
	});
});

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