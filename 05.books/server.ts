
//Importera allt från alla andra filer vi har i dokumentet 05
import * as dotenv from "dotenv";


// Initiera vår dotenv så den läser vår .env fil
dotenv.config();

import app from "./src/app";
import Debug from "debug";
import http from "http";

// Läs PORT så den startar från env filen alternativt default på 3000
const PORT = Number(process.env.PORT) || 3000;

// Create a new debug instance
const debug = Debug("prisma-books:server");

/**
 * Create HTTP server.
 */
const server = http.createServer(app);

/**
 * Listen on provided port, on all network interfaces.
 */
server.listen(PORT);

/**
 * Event listener for HTTP server "error" event.
 */
server.on("error", (err: NodeJS.ErrnoException) => {
	if (err.syscall !== "listen") {
		throw err;
	}

	switch (err.code) {
		case "EACCES":
			console.error(`🦸🏻 Port ${PORT} requires elevated privileges`);
            debug(`🦸🏻 Port ${PORT} requires elevated privileges: %O`, err);
			process.exit(1);
			break;
		case "EADDRINUSE":
			console.error(`🛑 Port ${PORT} is already in use`);
            debug(`🛑 Port ${PORT} is already in use: %O`, err);
			process.exit(1);
			break;
		default:
            debug(`🚨 Unknown error, rethrowing: %O`, err);
			throw err;
	}
});

/**
 * Event listener for HTTP server "listening" event.
 */
server.on("listening", () => {
	console.log(`🚀 Yay, server started on http://localhost:${PORT}`);
});