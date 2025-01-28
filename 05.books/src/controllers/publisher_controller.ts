/**
 * Publisher Controller
 */
import { Request, Response } from "express";
import { handlePrismaError } from "../exceptions/prisma";
import prisma from "../prisma";
import Debug from "debug";
import { matchedData, validationResult } from "express-validator";
import { CreatePublisherData, UpdatePublisherData } from "../types/Publisher.types";

// Create a new debug instance
const debug = Debug("prisma-books:publisher_controller");

/**
 * Get all publishers
 *
 * GET /publishers
 */
export const index = async (req: Request, res: Response) => {
	try {
		const publishers = await prisma.publisher.findMany();
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
		const publisher = await prisma.publisher.findUniqueOrThrow({
			where: {
				id: publisherId,
			},
			include: {
				books: true,
			},
		});
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
		const publisher = await prisma.publisher.create({
			data: validatedData,
		});
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
		const publisher = await prisma.publisher.update({
			where: {
				id: publisherId,
			},
			data: validatedData,
		});
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
		await prisma.publisher.delete({
			where: {
				id: publisherId,
			}
		});
		res.status(204).send();

	} catch (err) {
		debug("Error when trying to delete Publisher #%d: %O", publisherId, err);
		const { status_code, body } = handlePrismaError(err);
		res.status(status_code).send(body);
	}
};






// ROUTE: LINK / CONNECT A PUBLISHER TO A BOOK
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
      const publisher = await prisma.publisher.update({
        where: { id: publisherID },
        data: {
          books: {
            connect: req.body,
          },
        },
        include: {
          books: true,
        },
      });
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
  
  // ROUTE: UNLINK / DISCONNECT A PUBLISHER FROM A BOOK
  export const unlinkFromBook = async (req: Request, res: Response) => {
    const publisherID = Number(req.params.publisherId);
    const bookID = Number(req.params.bookId);
  
    if (!publisherID || !bookID) {
      res.status(400).send({ message: "That is not a valid ID" });
      return;
    }
  
    try {
      const publisher = await prisma.publisher.update({
        where: { id: publisherID },
        data: {
          books: {
            disconnect: { id: bookID },
          },
        },
        include: { books: true },
      });
  
      res.status(200).send(publisher);
    } catch (error) {
      console.error(error);
      const { status_code, body } = handlePrismaError(error);
      res.status(status_code).send(body);
    }
  };