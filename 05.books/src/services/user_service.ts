/**
 * User service 
 */

import prisma from "../prisma"
import { CreateUserData } from "../types/User.types";

/**
 * Get a User by email
 *
 * @param email Email of user to get
 */
export const getUserByEmail = async (email: string) => {
    return await prisma.user.findUnique({
        where: {
            email: email,
        },
    });
};



export const createUser = (data: CreateUserData) => {
    return prisma.user.create({
        data: data,


            // name: validateData.name,
            // email: validateData.email,
            // password: hashed_password, 
            // //gör jag ej detta så kommer mitt password inte bli hashat och därmed synas i db (INTE BRA)

            //gör detta istället för det där över, detta säger:
            //sprid ut det som finns i validateData, men skriv över password med hashed_password
            // ...validateData,
            // password: hashed_password,
    });
}