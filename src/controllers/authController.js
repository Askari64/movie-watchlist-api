import { prisma } from "../config/db.js";
import bcrypt from "bcryptjs";

const signup = async (req, res) => {
  const { name, email, password } = req.body;

  //Check if user already exists

  const userExists = await checkUserExists(email);
  if (userExists) {
    return userExistsReponse(res, email);
  }

  // Hash Password

  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(password, salt);

  // Create User

  const user = await prisma.user.create({
    data: {
      name,
      email,
      password: hashedPassword,
    },
  });

  res.status(201).json({
    status: "success",
    data: {
      user: {
        id: user.id,
        name: name,
        email: email,
      },
    },
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
