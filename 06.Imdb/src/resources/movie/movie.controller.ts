import { Request, Response } from "express";
import { isValidObjectId } from "mongoose";
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





/**
 * Get a single movie
 */
export const show = async (req: Request, res: Response) => {
	const movieId = req.params.movieId;

    // Check if provided ID is a valid ObjectId (does not guarantee that the document exists)
	if (!isValidObjectId(movieId)) {
		res.status(400).send({ status: "fail", data: { message: "That is not a valid ID" }});
		return;
	}

	try {
		// Find a single movie
		const movie = await Movie.findById(movieId);

		// If no movie was found, respond with 404
		if (!movie) {
			res.status(404).send({
				status: "fail",
				data: {
					message: "Movie Not Found",
				},
			});
			return;
		};

		res.send({
			status: "success",
			data: movie,
		});

	} catch (err) {
		debug("Error thrown when finding movie %s: %O", movieId, err);
		res.status(500).send({
			status: "error",
			message: "Error thrown when finding movie",
		});
	};
};