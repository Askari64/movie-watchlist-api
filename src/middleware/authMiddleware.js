import jwt from "jsonwebtoken";
import { prisma } from "../config/db.js";

const authMiddleware = async (req, res, next) => {
  let token;

  //Read token from request
  const authHeader = req.headers.authorization;
  const authCookie = req.cookies?.jwtAccessToken;

  token =
    (authHeader?.startsWith("Bearer") ? authHeader?.split(" ")[1] : null) ??
    authCookie;

  if (!token) {
    return res.status(401).json({ error: "Unauthorised: Invalid or No token" });
  }

  //Verify token validity and if user exists

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const user = await prisma.user.findUnique({
      where: { id: decoded.id },
    });

    if (!user) {
      return res.status(401).json({ error: "User does not exist" });
    }

    req.user = user.id;
    next();
  } catch (error) {
    res.status(401).json({ error: "Not Authorised" });
  }
};

export { authMiddleware };
