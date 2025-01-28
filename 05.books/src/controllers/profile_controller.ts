/**
 * Profile Controller
 */
import { Request, Response } from "express";
import { handlePrismaError } from "../exceptions/prisma";
import prisma from "../prisma";

/**
 * Get the authenticated users profile
 *
 * GET /profile
 */
export const getProfile = async (req: Request, res: Response) => {
    res.send({
        status: 'success',
        data: null
    });
};



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
 * Update the authenticated users profile
 *
 * PATCH /profile
 */
export const updateProfile = async (req: Request, res: Response) => {
    res.status(501).send({
        status: 'success',
        data: null
    });
};
