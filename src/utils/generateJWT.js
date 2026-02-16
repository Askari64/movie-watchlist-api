import jwt from "jsonwebtoken";

const generateToken = (userId, res) => {
  const payload = { id: userId };
  const token = jwt.sign(payload, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES || "7d",
  });

  res.cookie("jwtToken", token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "Production",
    sameSite: "strict",
    maxAge: 1000 * 60 * 60 * 24 * 7 // 7 days
  })

  return token
};

export default generateToken;