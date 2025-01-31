/**
 * Profile Controller
 */
import { Request, Response } from "express";
import { handlePrismaError } from "../exceptions/prisma";
import prisma from "../prisma";
import Debug from "debug";
import { getBooksByOwner } from "../services/book_service";
import { linkBooksToUser, unlinkBookFromUser, updateUser } from "../services/user_service";
import { UpdateUserData } from "../types/User.types";
import { matchedData, validationResult } from "express-validator";
import bcrypt from 'bcrypt';

//skapa ny debug instance
const debug = Debug('prisma-books:profile_controller');

// get environment variable 
const SALT_ROUNDS =  Number(process.env.SALT_ROUNDS) || 10;

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
    // Om någon vill ta bort authentication från routen för denna metod? ERRORORORORORO
    if (!req.user) {
        throw new Error('Trying to access authenticated user but none exists. Did you remove authetication from this route????')
    };

    const userId = req.user.id;

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
    const validatedData: UpdateUserData = matchedData(req);

    if(validatedData.password) {
        //kalkylera hash + salt för lösenordet 
        validatedData.password = await bcrypt.hash(validatedData.password, SALT_ROUNDS); 
    }

    try {
        // update user 
        const user = await updateUser(userId, validatedData);

        res.send({
            status: "success",
            data: user,
        });

    } catch (err) {
        debug('error when trying to uppdate authenticated users %d: %O', userId, err);
        const { status_code, body } = handlePrismaError(err);
        res.status(status_code).send(body);
    };
}




/**
 * Get the authenticated users books
 *
 * GET /profile/books
 */
export const getBooks = async (req: Request, res: Response) => {
    // Om någon vill ta bort authentication från routen för denna metod? ERRORORORORORO
    if (!req.user) {
        throw new Error('Trying to access authenticated user but none exists. Did you remove authetication from this route????')
    };

    //hämta ut id 
    const userId = req.user.id;

    try {
        const books = await getBooksByOwner(userId);

        res.send({
            status: 'success',
            data: books,
        });


    } catch (err) {
        debug('error when trying to get authenticated users books #%d: %O', userId, err);
        const { status_code, body } = handlePrismaError(err);
        res.status(status_code).send(body);
    };
};



/**
 * Link books to the authenticated user
 *
 * POST /profile/books
 */
export const addBooks = async (req: Request, res: Response) => {
	// Om någon vill ta bort authentication från routen för denna metod? ERRORORORORORO
    if (!req.user) {
        throw new Error('Trying to access authenticated user but none exists. Did you remove authetication from this route????')
    };

    //hämta ut id 
    const userId = req.user.id;

    try {
        const books = await linkBooksToUser(userId, req.body);

        res.status(201).send({
            status: 'success',
            data: books,
        });


    } catch (err) {
        debug('error when trying to links books %o to authenticated users %d: ', req.body, userId, err);
        const { status_code, body } = handlePrismaError(err);
        res.status(status_code).send(body);
    };
}


/**
 * Unlink books to the authenticated user
 *
 * DELETE /profile/books/:bookId
 */
export const removeBook = async (req: Request, res: Response) => {
    	// Om någon vill ta bort authentication från routen för denna metod? ERRORORORORORO
        if (!req.user) {
            throw new Error('Trying to access authenticated user but none exists. Did you remove authetication from this route????')
        };
    
        //hämta ut id 
        const userId = req.user.id;
        const bookId = Number(req.params.bookId);

        if (!bookId) {
            res.status(400).send({ status: "fail", data: { message: "That is not a valid ID" }});
            return;
        }
    
        try {
            //ta bort boken
            await unlinkBookFromUser(userId, bookId);
    
            res.status(204).send();
    
    
        } catch (err) {
            debug('error when trying to unlinks book %d to authenticated users %d: ', req.body, userId, err);
            const { status_code, body } = handlePrismaError(err);
            res.status(status_code).send(body);
        };
};
