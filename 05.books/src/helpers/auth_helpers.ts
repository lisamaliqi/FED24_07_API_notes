/**
 * Authentication helpers
 */

import Debug from "debug";
import { Request } from "express";

const debug = Debug("prisma-books:auth_helpers");

export const extractAndValidateAuthHeader = (req: Request, expectedType: "Basic" | "Bearer") => {
	// 1. Make sure Authorization header exists, otherwise bail 🛑
	if (!req.headers.authorization) {
		debug("Authorization header missing");
		throw new Error("Authorization header missing");
	};


	// 2. Split Authorization header on ` `
	const [authType, payload] = req.headers.authorization.split(" ");


	// 3. Check that Authorization type is of expected type, otherwise bail 🛑
	if (authType.toLowerCase() !== expectedType.toLowerCase()) {
		debug("Authorization type is %s and not the expected %s", authType, expectedType);
		throw new Error(`Expected ${expectedType} authentication but recevied ${authType}`);
	};


	// 4. Check that payload isn't empty
	if (!payload) {
		debug("Payload in authorization header is empty");
		throw new Error("Payload in authorization header is empty");
	};

	return payload;
};