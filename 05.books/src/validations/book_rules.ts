/**
 * Validation Rules for Book resource
 */
import { body } from "express-validator";
import { getPublisher } from "../services/publisher_service";

/**
 * Validera att publisher id finns
 * 
 * @param value ID av publisher
 * @returns
 */


const validatePublisherExists = (value: number) => {
    // hämta publisher eller skicka error ifall den inte finns
    return getPublisher(value); //kan också skriva async await om man vill, men kanske lite onödigt 
};


export const createBookRules = [
	body("title")
		.isString().withMessage("title has to be a string").bail()
		.trim().isLength({ min: 3, max: 191 }).withMessage("title has to be 3-191 chars"),

	body("pages")
		.isInt({ min: 1 }).withMessage("has to be a positive integer"),

	body("publisherId")
		.optional()
		.isInt({ min: 1 }).withMessage("has to be a positive integer").bail()
        .custom(validatePublisherExists).withMessage('Publisher not found'),
];

export const updateBookRules = [
	body("title")
		.optional()
		.isString().withMessage("title has to be a string").bail()
		.trim().isLength({ min: 3, max: 191 }).withMessage("title has to be 3-191 chars"),

	body("pages")
		.optional()
		.isInt({ min: 1 }).withMessage("has to be a positive integer"),

	body("publisherId")
		.optional()
		.isInt({ min: 1 }).withMessage("has to be a positive integer").bail()
        .custom(validatePublisherExists).withMessage('Publisher not found'),
];