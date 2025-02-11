/**
 * Register Controller
 */
import bcrypt from 'bcrypt';
import Debug from "debug";
import { Request, Response } from "express";
import { handlePrismaError } from "../exceptions/prisma";
import { matchedData, validationResult } from "express-validator";
import { CreateAuthorData } from '../types/Author.types';
import { CreateUserData } from '../types/User.types';
import { createUser } from '../services/user_service';

// create new debug instance
const debug = Debug('prisma-books:register_controller');

// get environment variable 
const SALT_ROUNDS =  Number(process.env.SALT_ROUNDS) || 10;

/**
 * Log in a user
 *
 * POST /login
 */
export const login = async (req: Request, res: Response) => {
	// get (destructure) email and password from request body

	// find user with email, otherwise bail 🛑

	// verify credentials against hash, otherwise bail 🛑

	// construct jwt-payload

	// sign payload with access-token secret and get access-token
    
	// respond with access-token
	res.send({
		status: "success",
		data: null,
	});
};



/**
 * Register a new user
 *
 * POST /register
 * 
 * validate incoming data and bail if validation fails 
 */
export const register = async (req: Request, res: Response) => {
    //validera inkommande data
    const validationErrors = validationResult(req);
    if(!validationErrors.isEmpty()) {
        res.status(400).send({
            status: 'fail',
            data: validationErrors.array(),
        });
        return;
    };

    //få endast validerade datan från requesten 
    const validateData: CreateUserData = matchedData(req);
    // debug('req.body: ', req.body); //visar allt du skriver i din postman (ex ink också id)
    debug('validatedData: ', validateData); //visar bara det man validerar i din postman (ex ink INTE id pga validerar ej i index.ts)

    //kalkylera hash + salt för lösenordet 
    const hashed_password = await bcrypt.hash(validateData.password, SALT_ROUNDS); // saltrounds hämtat från process.env (env filen) eller 10 som default 
    debug('plain text password: ', validateData.password);
    debug('hashed password: ', hashed_password);

    //skapa användaren i databasen
    try {
        //skapa användaren
        const user = await createUser({
            ...validateData,
            password: hashed_password
        });

        //skicka respons med 201 Created + status success
        //byt ut null med uppskapade användaren 
        res.status(201).send({ status: "success", data: user })

    } catch (err) {
        debug("Error when trying to create user %o: %O", validateData, err);
        const { status_code, body } = handlePrismaError(err);
        res.status(status_code).send(body);
    }


}

/**
 * Get a single resource
 *
 * GET /resources/:resourceId
 */
export const show = async (req: Request, res: Response) => {
}

/**
 * Create a resource
 *
 * POST /resources
 */
export const store = async (req: Request, res: Response) => {
}

/**
 * Update a resource
 *
 * PATCH /resources/:resourceId
 */
export const update = async (req: Request, res: Response) => {
}

/**
 * Delete a resource
 *
 * DELETE /resources/:resourceId
 */
export const destroy = async (req: Request, res: Response) => {
}