import { errorhandler } from "./error.js";
import jwt from "jsonwebtoken";

export const verifyToken = (req, res, next) => {
    const token = req.cookies.acess_token;
    if (!token) return next(errorhandler(401, "Unauthorized"));
    jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
        if (err) return next(errorhandler(404, "Forbidden"));
        req.user = user;
        next();
    });
};
