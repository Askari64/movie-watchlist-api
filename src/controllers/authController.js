import { prisma } from "../config/db.js";

const signup = async (req, res) => {
  const { name, email, password } = req.body;

  //Check if user already exists

  const userExists = await checkUserExists(email);
  if (userExists) {
    return userExistsReponse(res, email);
  }

  res.json({
    message: "🟢 User signup successful",
    name: name,
    email: email,
    password: password,
  });
};

export { signup };

//********** Functions **********

const checkUserExists = (email) =>
  prisma.user.findUnique({
    where: { email: email },
  });

//********** Responses **********

const userExistsReponse = (res, email) =>
  res.status(400).json({
    message: `User with email: ${email} already exists`,
  });
