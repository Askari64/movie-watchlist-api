import { prisma } from "../config/db.js";

const DEFAULT_POSTER_URL =
  "https://cdn5.vectorstock.com/i/1000x1000/22/74/movie-poster-template-vector-16752274.jpg";

const getMovies = async (req, res) => {
  try {
    //offset-based pagination
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 50;
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

const getMovieById = async (req, res) => {
  try {
    const movieId = req.params.id;

    const movie = await findMovieExists(movieId);

    if (!movie) {
      return movieNotFoundErrorResponse(res);
    }

    getMovieByIdSuccessResponse(res, movie);
  } catch (error) {
    return getMovieByIdErrorResponse(res);
  }
};

const addMovie = async (req, res) => {
  try {
    const { title, overview, releaseYear, genres, runtime, posterURL } =
      req.body;
    const createdBy = req.user;

    // Use provided URL, fallback to default only if somehow missing
    const finalPosterURL = posterURL || DEFAULT_POSTER_URL;

    const movie = await createMovie(
      title,
      overview,
      releaseYear,
      genres,
      runtime,
      finalPosterURL,
      createdBy,
    );

    createMovieSuccessResponse(res, movie);
  } catch (error) {
    addMovieErrorResponse(res);
  }
};

const updateMovie = async (req, res) => {
  try {
    const movieId = req.params.id;
    const userId = req.user;
    const { title, overview, releaseYear, genres, runtime, posterURL } =
      req.body;

    //Find and verify ownership

    const movie = await findMovieExists(movieId);

    if (!movie) {
      return movieNotFoundErrorResponse(res);
    }

    if (movie.createdBy !== userId) {
      return userIsNotResourceOwnerResponse(res);
    }

    //Build update data
    const updateData = {};
    if (title !== undefined) updateData.title = title;
    if (overview !== undefined) updateData.overview = overview;
    if (releaseYear !== undefined) updateData.releaseYear = releaseYear;
    if (genres !== undefined) updateData.genres = genres;
    if (runtime !== undefined) updateData.runtime = runtime;
    if (posterURL !== undefined) {
      updateData.posterURL = posterURL || DEFAULT_POSTER_URL;
    }

    // update movie

    const updateMovie = await updateMovieData(movieId, updateData);

    return updatedMovieSuccessfullyResponse(res, updateMovie);
  } catch (error) {
    return updateMovieErrorResponse(res);
  }
};

const deleteMovie = async (req, res) => {
  try {
    //verify resouce exists

    const movieId = req.params.id;
    const userId = req.user;

    const movieItem = await findMovieExists(movieId);

    if (!movieItem) {
      return movieNotFoundErrorResponse(res);
    }

    // verify user is resource owner

    if (movieItem.createdBy !== userId) {
      return userIsNotResourceOwnerResponse(res);
    }

    // verify movie is not in any watchlist

    const movieInWatchlist = await findMovieInWatchlist(movieId);

    if (movieInWatchlist) {
      return movieInWatchlistCanNotBeDeletedResponse(res);
    }

    //delete movie
    deleteMovieFromDatabase(movieId);

    return movieDeletedSuccessfullyResponse(res);
  } catch (error) {
    return deleteMovieErrorResponse(res);
  }
};

export { getMovies, getMovieById, addMovie, updateMovie, deleteMovie };

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

const createMovie = (
  title,
  overview,
  releaseYear,
  genres,
  runtime,
  posterURL,
  createdBy,
) =>
  prisma.movie.create({
    data: {
      title,
      overview,
      releaseYear,
      genres,
      runtime,
      posterURL,
      createdBy,
    },
  });

const findMovieExists = (movieId) =>
  prisma.movie.findFirst({
    where: { id: movieId },
  });

const findMovieInWatchlist = (movieId) =>
  prisma.watchListItem.findFirst({
    where: { movieId: movieId },
  });

async function deleteMovieFromDatabase(movieId) {
  await prisma.movie.delete({
    where: { id: movieId },
  });
}

const updateMovieData = (movieId, updateData) =>
  prisma.movie.update({
    where: { id: movieId },
    data: updateData,
  });

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

const createMovieSuccessResponse = (res, movie) =>
  res.status(201).json({
    status: "success",
    message: "Movie Created Successfully",
    movie,
  });

const addMovieErrorResponse = (res) =>
  res.status(500).json({
    status: "error",
    message: "Internal Server Error - Can not add Movie at the moment",
  });

const movieNotFoundErrorResponse = (res) =>
  res.status(404).json({
    status: "error",
    message: "Movie not found",
  });

const userIsNotResourceOwnerResponse = (res) =>
  res.status(401).json({
    status: "error",
    message: "User not authorised to delete this movie",
  });

const movieInWatchlistCanNotBeDeletedResponse = (res) =>
  res.status(406).json({
    status: "error",
    message: "Movie can not be deleted due to being in Watchlist",
  });

const movieDeletedSuccessfullyResponse = (res) =>
  res.status(200).json({
    status: "success",
    message: "Movie Deleted",
  });

const deleteMovieErrorResponse = (res) =>
  res.status(500).json({
    status: "error",
    message: "Internal Server Error - Can not delete movie at the moment",
  });

const updateMovieErrorResponse = (res) =>
  res.status(500).json({
    status: "error",
    message: "Internal Server Error -  Can not update movie at the moment",
  });

const updatedMovieSuccessfullyResponse = (res, updateMovie) =>
  res.status(200).json({
    status: "success",
    data: {
      updatedMovieData: updateMovie,
    },
  });

const getMovieByIdSuccessResponse = (res, movie) =>
  res.status(200).json({
    status: "success",
    data: movie,
  });

const getMovieByIdErrorResponse = (res) =>
  res.status(500).json({
    status: "error",
    message: "Internal Server Error - Unable to fetch movie",
  });
