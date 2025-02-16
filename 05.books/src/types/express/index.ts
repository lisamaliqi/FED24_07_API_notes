/**
 * Extend types inside the Express namespace using module augmentation
 */

import { AuthenticatedUser } from "../Auth.types";



declare module "express-serve-static-core" {
	interface Request {
		user?: AuthenticatedUser;
    }
}