/**
 * HTTP basic authentication middleware
 */

import Debug from 'debug';
import bcrypt from "bcrypt";
import { Request, Response, NextFunction } from 'express';
import { getUserByEmail } from '../../services/user_service';

//create a new debug instance 
const debug = Debug('prisma-books:basic');

export const basic = async (req: Request, res: Response, next: NextFunction) => {
    debug('hello from auth/basic!!');

    // 1. Make sure Authorization header exists, otherwise bail📛
    debug('headers: %O', req.headers.authorization);
    
    // Om den är undefined eller inte finns
    if (!req.headers.authorization) {
        debug('Authorization header missing');
        res.status(401).send({ 
            status: 'fail', 
            data: { 
                message: 'Authorizaton required'
            }
        }); 
        return;
    };


    // 2. Split Authorization header on ` `
    // en string kan se ut såhär: 'Basic cGVsbGE6ZmFpbHdvcmQ='
    // [0] = basic                      authScheme
    // [1] = cGVsbGE6ZmFpbHdvcmQ=       base64Payload
    //splitta den i två delar, mellanrummet ska splitta på dom
    const [authType, base64Payload] = req.headers.authorization.split(' ');

    //hämta ut de två värdena
    debug('Auth Type: %O', authType);
    debug('Base64 Payload: %O', base64Payload);


    // 3. Check that Authorization schema is 'Basic', otherwise bail📛
    // Om authType inte är basic så ska det bli error
    // Gör om authType till all lowecase ifall användaren skriver BasIC ex
    if (authType.toLocaleLowerCase() !== 'basic') {
        debug('Authorization basic missing');
        res.status(401).send({ 
            status: 'fail', 
            data: { 
                message: 'Authorizaton required'
            }
        }); 
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



    // 9. Profile!
    next();
};