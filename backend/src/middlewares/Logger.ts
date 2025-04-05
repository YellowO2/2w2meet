import { Request, Response, NextFunction } from "express";

export const logger = (req: Request, res: Response, next: NextFunction) => {
	res.on("finish", () => {
		console.log(`[${new Date().toISOString()}] ${req.headers.origin} ${req.method} ${req.url} ${res.statusCode}`);
	});

	next();
};
