import { prisma } from "../config/db.js";
import bcrypt from "bcryptjs";

const signup = async (req, res) => {
  try {
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

    const user = await createUser(name, email, hashedPassword);
    return createUserResponse(res, user);
  } catch (error) {
    return res.status(500).json({
      status: "Error",
      message: "Internal Server Error - Unable to Signup at the moment",
    });
  }
};

export { signup };

//********** Functions **********

const checkUserExists = (email) =>
  prisma.user.findUnique({
    where: { email: email },
  });

const createUser = (name, email, hashedPassword) =>
  prisma.user.create({
    data: {
      name,
      email,
      password: hashedPassword,
    },
  });
//********** Responses **********

const userExistsReponse = (res, email) =>
  res.status(400).json({
    message: `User with email: ${email} already exists`,
  });

const createUserResponse = (res, user) =>
  res.status(201).json({
    status: "success",
    data: {
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
      },
    },
  });
