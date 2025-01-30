/**
 * Extend types inside the Express namespace
 */

import { User } from "@prisma/client";

declare global {
    namespace Express {
        export interface Request {
            user?: User;
        }
    }
}