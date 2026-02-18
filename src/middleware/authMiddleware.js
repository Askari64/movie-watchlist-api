import jwt from "jsonwebtoken";
import { prisma } from "../config/db.js";

const authMiddleware = async (req, res, next) => {
    console.log('Auth middleware reached')

    next()
};

export { authMiddleware };
