/**
 * HTTP basic authentication middleware
 */

import Debug from 'debug';
import bcrypt from "bcrypt";
import { Request, Response, NextFunction } from 'express';
import { getUserByEmail } from '../../services/user_service';
import { extractAndValidateAuthHeader } from "../../helpers/auth_helpers";

//create a new debug instance 
const debug = Debug('prisma-books:basic');


export const basic = async (req: Request, res: Response, next: NextFunction) => {
    debug('hello from auth/basic!!');

    let base64Payload: string;

	try {
		base64Payload = extractAndValidateAuthHeader(req, "Basic");

	} catch (err) {
		res.status(401).send({ 
            status: "fail", 
            data: { 
                message: "Authorization header is missing or not of the expected type" 
            }});

        return;
    };


    // 4. Decode credentials from base64 => ascii
    const decodePayload = Buffer.from(base64Payload, 'base64').toString('utf8');
    //detta avkodar base64 koden som skickas in från authorization
    debug('decoded payload: %s', decodePayload);


    // 5. Split credentials on `:`
    const [ email, plainTextPassword ] = decodePayload.split(':');
    debug('email: %O', email );
    debug('plainTextPassword: %O', plainTextPassword);
    

    // 5.5. Check tat user sent email and password
    // if not email or not plaintextpassword = STOP
    if (!email || !plainTextPassword) {
        //STOP
        debug('user did not send email or password');
        res.status(401).send({ 
            status: 'fail', 
            data: { 
                message: 'Authorizaton required'
            }
        }); 
        return;
    };


    // 6. Get user from database, otherwise bail📛
    const user = await getUserByEmail(email);
    if(!user) {
        debug('user %s does not exist', email);
        res.status(401).send({ 
            status: 'fail', 
            data: { 
                message: 'Authorizaton required'
            }
        }); 
        return;
    };


    // 7. Verify hash against credentials, otherwise bail📛
    debug('user did exist! %s exists', email);

    //detta blir antingen true eller false, jämför ifall password man skrivit in är samma som user har i password
    const password_correct =await bcrypt.compare(plainTextPassword, user.password);

    if(!password_correct) {
        debug('password for user %s was not correct', email);
        res.status(401).send({ 
            status: 'fail', 
            data: { 
                message: 'Authorizaton required'
            }
        }); 
        return;
    }
    debug('Password for user %s was correct!!✅', email);

    
    // 8. Attach user to request
    req.user = user;
    //user är ett objekt ELLER undefined (kolla /types/express/index.ts)


    // 9. Profile!
    next();
};