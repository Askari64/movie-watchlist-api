import { prisma } from "../config/db.js";

const getMovies = async (req, res) => {
  try {
    //offset-based pagination
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const [movies, totalMovies] = await findAllMoviesAndCount(skip, limit);

    if (totalMovies <= 0) {
      return noMoviesFoundResponse(res);
    }

    getAllMoviesSuccessResoponse(res, movies, totalMovies, page, limit);
  } catch (error) {
    return getAllMoviesErrorResponse(res);
  }
};

const addMovie = async (req, res) => {};

const updateMovie = async (req, res) => {};

const deleteMovie = async (req, res) => {};

export { getMovies, addMovie, updateMovie, deleteMovie };

// Functions

const findAllMoviesAndCount = (skip, limit) =>
  prisma.$transaction([
    prisma.movie.findMany({
      skip,
      take: limit,
      orderBy: { createdAt: "asc" },
    }),
    prisma.movie.count(),
  ]);

// Responses

const getAllMoviesSuccessResoponse = (res, movies, totalMovies, page, limit) =>
  res.status(200).json({
    status: "success",
    data: movies,
    meta: {
      totalMovies,
      page,
      limit,
      totalPages: Math.ceil(totalMovies / limit),
    },
  });

const noMoviesFoundResponse = (res) =>
  res.status(204).json({
    stats: "success",
    message: "No Movie Found in Database",
  });

const getAllMoviesErrorResponse = (res) =>
  res.status(500).json({
    status: "error",
    message: "Server Error - Can not fetch Movies",
  });
