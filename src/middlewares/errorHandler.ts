import { ErrorRequestHandler, NextFunction } from "express-serve-static-core";
import { AppError } from "../utils/error";

const errorHandler: ErrorRequestHandler = (err, req, res, next) => {
    console.error(err); 

    if (err instanceof AppError) {
        res.status(err.statusCode).json({ error: err.message });
        return;
    }

    res.status(500).json({ error: err.message });
}

export default errorHandler;