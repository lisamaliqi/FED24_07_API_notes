import { Request, Response } from "express";
import mongoose from "mongoose";
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
	if (!mongoose.isValidObjectId(movieId)) {
		res.status(400).send({ status: "fail", data: { message: "That is not a valid ID" }});
		return;
	}

	try {
		// Find a single movie
		const movie = await Movie.findById(movieId).populate('director', 'name').populate('actors', 'name');

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




/**
 * Create a new movie
 */

export const store = async (req:Request, res: Response) => {
    try {
        //create and save a new movie
        const movie = await Movie.create(req.body);

        res.status(201).send({
            status: "success",
            data: movie,
        });

    } catch (err) {
        if (err instanceof mongoose.Error.ValidationError) {
			debug("Validation failed when creating movie %o: %O", req.body, err);
			res.status(400).send({
				status: "fail",
				data: err.errors,
			});
			return;
		};

        debug("Error thrown when creating movie %s: %O", req.body, err);
		res.status(500).send({
			status: "error",
			message: "Error thrown when creating movie",
		});
    }
};





/**
 * Update a movie
 */

export const update = async (req: Request, res: Response) => {
    //hämta ut movieId från input fältet i postman men gör INTE om det till Number (pga i ett objekt med nummer och siffror, aka string)
    const movieId = req.params.movieId;

    // Check if provided ID is a valid ObjectId (does not guarantee that the document exists)
	if (!mongoose.isValidObjectId(movieId)) {
		res.status(400).send({ status: "fail", data: { message: "That is not a valid ID" }});
		return;
	};

    try {
		const movie = await Movie.findByIdAndUpdate(movieId, req.body, {
            new: true,
            runValidators: true,
        });

		res.status(201).send({ 
            status: "success", 
            data: movie 
        });

    } catch (err) {
        if (err instanceof mongoose.Error.ValidationError) {
			debug("Validation failed when updating movie %o: %O", req.body, err);
			res.status(400).send({
				status: "fail",
				data: err.errors,
			});
			return;
		};

        debug("Error thrown when updating movie %s: %O", req.body, err);
		res.status(500).send({
			status: "error",
			message: "Error thrown when updating movie",
		});
    };
};




/**
 * Delete a movie
 */

export const destroy = async (req: Request, res: Response) => {
    const movieId = req.params.movieId;

    // Check if provided ID is a valid ObjectId (does not guarantee that the document exists)
	if (!mongoose.isValidObjectId(movieId)) {
		res.status(400).send({ status: "fail", data: { message: "That is not a valid ID" }});
		return;
	};

    try {
        await Movie.findByIdAndDelete(movieId);

		res.status(204).send();

    } catch (err) {
        if (err instanceof mongoose.Error.ValidationError) {
			debug("Validation failed when deleting movie %o: %O", req.body, err);
			res.status(400).send({
				status: "fail",
				data: err.errors,
			});
			return;
		};

        debug("Error thrown when deleting movie %s: %O", req.body, err);
		res.status(500).send({
			status: "error",
			message: "Error thrown when deleting movie",
		});
    }
};

