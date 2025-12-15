import { Request, Response, NextFunction } from "express";
import { verifyToken } from "../utils/jwt";

export function authMiddleware(req: Request, res: Response, next: NextFunction) {
  const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ message: "Відсутній або некоректний токен авторизації" });
  }
    const token = authHeader.split(" ")[1];
    try {
        const payload = verifyToken(token);
        req.user = payload;
        next();
    } catch (error) {
        return res.status(401).json({ message: "Некоректний або прострочений токен авторизації" });
    }
}