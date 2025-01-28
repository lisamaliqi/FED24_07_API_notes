/**
 * Register Controller
 */
import Debug from "debug";
import { Request, Response } from "express";
import { handlePrismaError } from "../exceptions/prisma";
import prisma from "../prisma";
import { matchedData, validationResult } from "express-validator";
import { debug, log } from "node:console";

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
    const validateData = matchedData(req);
    debug('req.body: ', req.body); //visar allt du skriver i din postman (ex ink också id)
    debug('validatedData: ', validateData); //visar bara det man validerar i din postman (ex ink INTE id pga validerar ej i index.ts)

    

    //kalkylera hash + salt för lösenordet 


    //skapa användaren i databasen


    //skicka respons med 201 Created + status success
    //byt ut null med uppskapade användaren 
    res.status(201).send({ status: "success", data: null })
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