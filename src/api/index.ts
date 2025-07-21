import postRoute from "./post";
import facebookAuthRoute from "./auth/facebook";
import type { Request, Response, NextFunction } from "express";


const express = require('express');
const api = express.Router();

// api.use((req: Request, res: Response, next: NextFunction) => {
//   console.log(`[API ROUTER] ${req.method} ${req.originalUrl}`);
//   next();
// });

api.use("/post", postRoute);
api.use("/auth/facebook", facebookAuthRoute);

// Base route
api.get("/", (req: Request, res: Response) => res.send(`Hello from API! ${req.url.toString()}`));

export default api;
