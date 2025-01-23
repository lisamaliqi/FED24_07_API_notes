import express from "express";
import prisma from "./prisma"; // importing the prisma instance we created
import morgan from "morgan";

const app = express();
app.use(express.json());
app.use(morgan("dev"));

/**
 * GET /
 */
app.get("/", (req, res) => {
	res.send({
		message: "I AM API, BEEP BOOP",
	});
});

/**
 * GET /phones
 *
 * Get all phones
 */
app.get("/phones", async (req, res) => {
    try {
		const phones = await prisma.phones.findMany();
		res.send(phones);
	} catch (err) {
		console.error(err);
		res.status(500).send({ message: "Something went wrong when querying the database" });
	}
});

/**
 * GET /phones/:phoneId
 *
 * Get a single phone
 */
app.get("/phones/:phoneId", async (req, res) => {
    const phoneId = Number(req.params.phoneId);
    
    if(!phoneId) {
        console.log('error!');
        res.status(404).send({
            message: 'Thats not a valid id',
        });
        return;
    };

    try {
        const phone = await prisma.phones.findUnique({
            where: {
                id: phoneId,
            }, 
            include: {
                user: true,
            },
        });

        if (!phone) {
			res.status(404).send({ message: "Phone Not Found" });
			return;
		};

        res.send(phone);

    } catch (err) {
        console.log('error!');
		res.status(500).send({ message: "Something went wrong when querying the database" });
    };

});

/**
 * GET /users
 *
 * Get all users
 */
app.get("/users", async (req, res) => {
    try {
        const users = await prisma.users.findMany();
        res.send(users);
    } catch (err) {
        console.log(err);
        res.status(500).send({
            message: 'Something went wrong with getting the users',
        });
    };
});

/**
 * GET /users/:userId
 *
 * Get a single user
 */
app.get("/users/:userId", async (req, res) => {
    const userId = Number(req.params.userId);

    if(!userId) {
        console.log('error!');
        res.status(404).send({
            message: 'Thats not a valid id',
        });
        return;
    };

    try {
        const user = await prisma.users.findUnique({
            where: {
                id: userId,
            },
            include: {
                phones: true,
            },
        });

        if(!user) {
            res.status(404).send({
                message: 'user not found',
            });
            return;
        };

        res.send(user);
        
    } catch (err) {
        console.log(err);
        res.status(500).send({
            message: 'Something went wrong',
        });
    };
});

export default app;