/**
 * Profile Controller
 */
import { Request, Response } from "express";
import { handlePrismaError } from "../exceptions/prisma";
import prisma from "../prisma";
import Debug from "debug";

//skapa ny debug instance
const debug = Debug('prisma-books:profile_controller');

/**
 * Get the authenticated users profile
 *
 * GET /profile
 */
export const getProfile = async (req: Request, res: Response) => {
    // So, we know that the user authenticated with the correct credentials
	// but how the **** do we know WHO they are inside the controller?


    // Om någon vill ta bort authentication från routen för denna metod? ERRORORORORORO
    if (!req.user) {
        throw new Error('Trying to access authenticated user but none exists. Did you remove authetication from this route????')
    };

    // const authenticatedUser = req.user;

    //respond med user-detaljer
    res.send({
        status: 'success',
        data: {
            id: req.user.id,
            name: req.user.name,
            email: req.user.email,
        }
    });
};


/**
 * Update the authenticated user's profile
 *
 * PATCH /profile
 */
export const updateProfile = async (req: Request, res: Response) => {
	res.status(501).send({
		status: "success",
		data: null,
	});
}




/**
 * Get the authenticated users books
 *
 * GET /profile/books
 */
export const getBooks = async (req: Request, res: Response) => {
    res.send({
        status: 'success',
        data: null
    });
};



/**
 * Link books to the authenticated user
 *
 * POST /profile/books
 */
export const addBooks = async (req: Request, res: Response) => {
	res.status(501).send({
		status: "success",
		data: null,
	});
}


/**
 * Link books to the authenticated user
 *
 * DELETE /profile/books/:bookId
 */
export const removeBook = async (req: Request, res: Response) => {
    res.status(501).send({
        status: 'success',
        data: null
    });
};
