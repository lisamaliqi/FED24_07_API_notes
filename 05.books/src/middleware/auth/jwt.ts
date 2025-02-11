/**
 * JWT Authentication Middleware
 */
import Debug from "debug";
import { Request, Response, NextFunction } from "express";

// Create a new debug instance
const debug = Debug("prisma-books:jwt");


export const validateAccessToken = async (req: Request, res: Response, next: NextFunction) => {
	debug("Hello from auth/jwt! 🙋😎");

	// 1. Make sure Authorization header exists, otherwise bail 🛑
	if (!req.headers.authorization) {
		debug("Authorization header missing");
		res.status(401).send({ status: "fail", data: { message: "Authorization required" }});
		return;
	};


	// 2. Split Authorization header on ` `
	// "Bearer <token>"
	const [authType, token] = req.headers.authorization.split(" ");


	// 3. Check that Authorization Type is "Bearer", otherwise bail 🛑
	if (authType.toLowerCase() !== "bearer") {
		debug("Authorization Type isn't Bearer");
		res.status(401).send({ status: "fail", data: { message: "Authorization required" }});
		return;
	};


	// 4. Verify token and extract payload, otherwise bail 🛑


	// 5. Attach payload to request

    
	// 6. Profit 💰🤑
	next();
}