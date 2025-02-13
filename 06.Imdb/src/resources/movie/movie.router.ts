import express from "express";
import * as movieController from "./movie.controller";

const router = express.Router();


/**
 * GET /movies
 * 
 * Get all movies
 */

router.get("/", movieController.index);



/**
 * GET /movies/:movieId
 * 
 * Get a movie
 */

router.get("/:movieId", movieController.show);



/**
 * POST /movies
 * 
 * Create a new movie
 */

router.post("/", movieController.store);



/**
 * PATCH /movies
 * 
 * Update a movie 
 */

router.patch("/:movieId", movieController.update);



export default router;