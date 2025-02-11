import express from "express";
import morgan from "morgan";
import rootRouter from "./routes/index";
import cors from "cors";
import cookieParser from "cookie-parser";

const app = express();
app.use(cookieParser());
app.use(cors());
app.use(express.json());
app.use(morgan("dev"));

// hämta ut index.ts i src/routes, där hämtar den sedan ut book.ts och author.ts
app.use(rootRouter);

export default app;