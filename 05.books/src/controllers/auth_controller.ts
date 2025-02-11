/**
 * Register Controller
 */
import bcrypt from 'bcrypt';
import Debug from "debug";
import jwt, { TokenExpiredError } from "jsonwebtoken";
import { StringValue } from "ms";
import { Request, Response } from "express";
import { handlePrismaError } from "../exceptions/prisma";
import { matchedData } from "express-validator";
import { CreateAuthorData } from '../types/Author.types';
import { CreateUserData } from '../types/User.types';
import { createUser, getUserByEmail, getUserById } from '../services/user_service';
import { JwtAccessTokenPayload, JwtRefreshTokenPayload } from "../types/JWT.types";

// create new debug instance
const debug = Debug("prisma-books:auth_controller");

// get environment variable 
const ACCESS_TOKEN_LIFETIME = process.env.ACCESS_TOKEN_LIFETIME as StringValue || "15min"; // default 15min
const ACCESS_TOKEN_SECRET = process.env.ACCESS_TOKEN_SECRET;
const SALT_ROUNDS =  Number(process.env.SALT_ROUNDS) || 10;
const REFRESH_TOKEN_LIFETIME = process.env.REFRESH_TOKEN_LIFETIME as StringValue || "1h"; // default 1 hour
const REFRESH_TOKEN_SECRET = process.env.REFRESH_TOKEN_SECRET;

interface LoginRequestBody {
	email: string;
	password: string;
}


/**
 * Log in a user
 *
 * POST /login
 */
export const login = async (req: Request, res: Response) => {
    // get (destructure) email and password from request body
	const { email, password }: LoginRequestBody = matchedData(req);

	// find user with email, otherwise bail 🛑
    const user = await getUserByEmail(email);
	if (!user) {
		debug("User %s does not exist", email);
		res.status(401).send({ status: "fail", data: { message: "Authorization required" }});
		return;
	};


	// verify credentials against hash, otherwise bail 🛑
    const password_correct = await bcrypt.compare(password, user.password);
	if (!password_correct) {
		debug("Password for user %s was not correct", email);
		res.status(401).send({ status: "fail", data: { message: "Authorization required" }});
		return;
	};
	debug("✅ Password for user %s was correct 🥳", email);


	// construct access-token payload
    const payload: JwtAccessTokenPayload = {
		id: user.id,
		name: user.name,
		email: user.email,
	};


	// sign payload with access-token secret and get access-token
    if (!ACCESS_TOKEN_SECRET) {
		debug("🛑🛑🛑 ACCESS_TOKEN_SECRET missing in environment");
		res.status(500).send({ status: "error", message: "No access token secret defined" });
		return;
	};

	const access_token = jwt.sign(payload, ACCESS_TOKEN_SECRET, {
		expiresIn: ACCESS_TOKEN_LIFETIME,
	});


    // construct refresh-token payload
	const refresh_payload: JwtRefreshTokenPayload = {
		id: user.id,
	};
    

	// sign payload with refresh-token secret and get refresh-token
	if (!REFRESH_TOKEN_SECRET) {
		debug("🛑🛑🛑 REFRESH_TOKEN_SECRET missing in environment");
		res.status(500).send({ status: "error", message: "No refresh token secret defined" });
		return;
	};

	const refresh_token = jwt.sign(refresh_payload, REFRESH_TOKEN_SECRET, {
		expiresIn: REFRESH_TOKEN_LIFETIME,
	});


	// set refresh-token as a http-only cookie
	res.cookie("refresh_token", refresh_token, {
		httpOnly: true,
		sameSite: "strict",
		path: "/refresh",
	});


	// respond with access-token
	res.send({
		status: "success",
		data: {
			access_token,
		},
	});
};


/**
 * Issue a new access_token using a refresh_token
 *
 * POST /refresh
 */
export const refresh = async (req: Request, res: Response) => {

	// 1. Get refresh token from cookie 🍪
	debug("🍪 Cookies: %o", req.cookies);
	const refresh_token: string | undefined = req.cookies.refresh_token;

	if (!refresh_token) {
		debug("No refresh token found in cookies 😢");
		res.status(401).send({ status: "fail", data: { message: "Authorization required" }});
		return;
	};


	// 2. Verify refresh token and extract payload with user id
	if (!REFRESH_TOKEN_SECRET) {
		debug("🛑🛑🛑 REFRESH_TOKEN_SECRET missing in environment");
		res.status(500).send({ status: "error", message: "No refresh token secret defined" });
		return;
	};

	let refresh_payload: JwtRefreshTokenPayload;

	try {
		// verify token
		refresh_payload = jwt.verify(refresh_token, REFRESH_TOKEN_SECRET) as JwtRefreshTokenPayload;

	} catch (err) {
		debug("JWT Refresh Verify failed: %O", err);

		// if token has expired, let the user know
		if (err instanceof TokenExpiredError) {
			res.status(401).send({ status: "fail", message: "Refresh token has expired" });
			return;
		};

		res.status(401).send({ status: "fail", message: "Authorization denied" });
		return;
	};


	// 3. Find user's name and email
	const user = await getUserById(refresh_payload.id);

	if (!user) {
		debug("User with id %d does not exist", refresh_payload.id);
		res.status(401).send({ status: "fail", data: { message: "Authorization required" }});
		return;
	};


	// 4. Construct new access token payload
    const access_payload: JwtAccessTokenPayload = {
		id: user.id,
		name: user.name,
		email: user.email,
	};


	// 5. Sign payload with access token secret
    if (!ACCESS_TOKEN_SECRET) {
		debug("🛑🛑🛑 ACCESS_TOKEN_SECRET missing in environment");
		res.status(500).send({ status: "error", message: "No access token secret defined" });
		return;
	};

	const access_token = jwt.sign(access_payload, ACCESS_TOKEN_SECRET, {
		expiresIn: ACCESS_TOKEN_LIFETIME,
	});


	// 6. Respond with the new access token
	res.send({
		status: "success",
		data: {
			access_token,
		},
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
    };
};


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