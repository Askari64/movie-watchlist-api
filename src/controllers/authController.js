import { prisma } from "../config/db.js";
import bcrypt from "bcryptjs";
import generateToken from "../utils/generateJWT.js";

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
    return signupErrorResponse(res);
  }
};

const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    //Check user email exists
    const user = await checkUserExists(email);
    if (!user) {
      return userEmailDoesNotExistsReponse(res, email);
    }

    //verify password
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return loginIncorrectPasswordResponse(res);
    }

    //Generate JWT Token
    const token = generateToken(user.id, res);

    return loginSuccessfulResponse(res, user, token);
  } catch (error) {
    return loginErrorResponse(res);
  }
};

const logout = async (req, res) => {
  logoutUser(res);
  logoutSuccessResponse(res);
};

export { signup, login, logout };

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

const logoutUser = (res) =>
  res.cookie("jwtAccessToken", "", {
    httpOnly: true,
    expires: new Date(0),
  });
//********** Responses **********

const userExistsReponse = (res, email) =>
  res.status(400).json({
    message: `User with email: ${email} already exists`,
  });

const userEmailDoesNotExistsReponse = (res, email) =>
  res.status(400).json({
    message: `User with email: ${email} does not exist`,
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

const signupErrorResponse = (res) =>
  res.status(500).json({
    status: "Error",
    message: "Internal Server Error - Unable to Signup at the moment",
  });

const loginErrorResponse = (res) =>
  res.status(500).json({
    status: "Error",
    message: "Internal Server Error - Unable to Login at the moment",
  });

const loginIncorrectPasswordResponse = (res) =>
  res.status(400).json({
    message: "email or password incorrect",
  });

const loginSuccessfulResponse = (res, user, token) =>
  res.status(200).json({
    message: "Login Successful",
    data: {
      user: {
        id: user.id,
        email: user.email,
      },
      token: token,
    },
  });

const logoutSuccessResponse = (res) =>
  res.status(200).json({
    status: "success",
    message: "logged out successfully",
  });
