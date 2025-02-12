import { Request, Response } from "express";
import Debug from "debug";
import { Movie } from "./movie.model";

const debug = Debug("lmdb:movie.controller");


/**
 * Get all movies
 */

export const index = async (req: Request, res: Response) => {
	try {
		// Find all movies
		const movies = await Movie
			.find({})
			.sort({ title: "asc", release_year: "asc" });  // sort first by title, then by release_year (if two or more titles are the same)
            
		res.send({
			status: "success",
			data: movies,
		});

	} catch (err) {
		debug("Error thrown when finding movies: %O", err);
		res.status(500).send({
			status: "error",
			message: "Error thrown when finding movies",
		});
	};
};