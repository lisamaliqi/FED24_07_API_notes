import express from "express";
import morgan from "morgan";
import rootRouter from "./routes/index";

const app = express();
app.use(express.json());
app.use(morgan("dev"));

// hämta ut index.ts i src/routes, där hämtar den sedan ut book.ts och author.ts
app.use(rootRouter);

export default app;