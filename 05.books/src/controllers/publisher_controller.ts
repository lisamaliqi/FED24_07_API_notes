/**
 * Publisher Controller
 */
import { Request, Response } from "express";
import { handlePrismaError } from "../exceptions/prisma";
import prisma from "../prisma";
import Debug from "debug";
import { matchedData, validationResult } from "express-validator";
import { CreatePublisherData, UpdatePublisherData } from "../types/Publisher.types";
import { createPublisher, deletePublisher, getPublisher, getPublishers, linkPublisherToBook, unlinkBookFromPublisher, updatePublisher } from "../services/publisher_service";

// Create a new debug instance
const debug = Debug("prisma-books:publisher_controller");

/**
 * Get all publishers
 *
 * GET /publishers
 */
export const index = async (req: Request, res: Response) => {
	try {
		const publishers = await getPublishers();
		res.send({ status: "success", data: publishers });

	} catch (err) {
		debug("Error when trying to query for all Publishers: %O", err);
		const { status_code, body } = handlePrismaError(err);
		res.status(status_code).send(body);
	};
};

/**
 * GET /publishers/:publisherId
 *
 * Get a single publisher
 */
export const show = async (req: Request, res: Response) => {
	const publisherId = Number(req.params.publisherId);

    if (!publisherId) {
		res.status(400).send({ status: "fail", data: { message: "That is not a valid ID" }});
		return;
	}

	try {
		const publisher = await getPublisher(publisherId);
		res.send({ status: "success", data: publisher });

	} catch (err) {
		debug("Error when trying to query for Publisher #%d: %O", publisherId, err);
		const { status_code, body } = handlePrismaError(err);
		res.status(status_code).send(body);
	}
};

/**
 * POST /publishers
 *
 * Create a publisher
 */
export const store = async (req: Request, res: Response) => {
    // Check for any validation errors
	const validationErrors = validationResult(req);
	if (!validationErrors.isEmpty()) {
		res.status(400).send({
			status: "fail",
			data: validationErrors.array(),
		});
		return;
	}
	// Get only the validated data
	const validatedData: CreatePublisherData = matchedData(req);

	try {
		const publisher = await createPublisher(validatedData);
		res.status(201).send({ status: "success", data: publisher });

	} catch (err) {
		debug("Error when trying to create a Publisher: %O", err);
		const { status_code, body } = handlePrismaError(err);
		res.status(status_code).send(body);
	}
};

/**
 * PATCH /publishers/:publisherId
 *
 * Update a publisher
 */
export const update = async (req: Request, res: Response) => {
	const publisherId = Number(req.params.publisherId);
	if (!publisherId) {
		res.status(400).send({ status: "fail", data: { message: "That is not a valid ID" }});
		return;
	}

    // Check for any validation errors
	const validationErrors = validationResult(req);
	if (!validationErrors.isEmpty()) {
		res.status(400).send({
			status: "fail",
			data: validationErrors.array(),
		});
		return;
	}
	// Get only the validated data
	const validatedData: UpdatePublisherData = matchedData(req);

	try {
		const publisher = await updatePublisher(publisherId, validatedData);
		res.send({ status: "success", data: publisher });

	} catch (err) {
		debug("Error when trying to update Publisher #%d: %O", publisherId, err);
		const { status_code, body } = handlePrismaError(err);
		res.status(status_code).send(body);
	}
};

/**
 * DELETE /publishers/:publisherId
 *
 * Delete a publisher
 */
export const destroy = async (req: Request, res: Response) => {
	const publisherId = Number(req.params.publisherId);
	if (!publisherId) {
		res.status(400).send({ status: "fail", data: { message: "That is not a valid ID" }});
		return;
	}

	try {
		await deletePublisher(publisherId);
		res.status(204).send();

	} catch (err) {
		debug("Error when trying to delete Publisher #%d: %O", publisherId, err);
		const { status_code, body } = handlePrismaError(err);
		res.status(status_code).send(body);
	}
};





/**
 * POST /books/:bookId/authors
 *
 * Link book to author(s)
 */
export const linkToBook = async (req: Request, res: Response) => {
    const publisherID = Number(req.params.publisherId);
  
    if (!publisherID) {
      res.status(400).send({
        status: "fail",
        message: "This is not a valid ID",
      });
      return;
    }
  
    try {
      const publisher = await linkPublisherToBook(publisherID, req);
      res.status(201).send({
        status: "success",
        publisher,
      });
    } catch (err) {
      console.error(err);
      const { status_code, body } = handlePrismaError(err);
      res.status(status_code).send(body);
    }
  };
  


/**
 * DELETE /books/:bookId/authors/:authorId
 *
 * Unlink an author from a book
 */
  export const unlinkFromBook = async (req: Request, res: Response) => {
    const publisherId = Number(req.params.publisherId);
    const bookId = Number(req.params.bookId);
  
    if (!publisherId || !bookId) {
      res.status(400).send({ message: "That is not a valid ID" });
      return;
    }
  
    try {
      const publisher = await unlinkBookFromPublisher(publisherId, bookId);
  
      res.status(200).send(publisher);
    } catch (error) {
      console.error(error);
      const { status_code, body } = handlePrismaError(error);
      res.status(status_code).send(body);
    }
  };