import { prisma } from "../config/db.js";

const addToWatchlist = async (req, res) => {
  try {
    const { movieId, status, rating, notes } = req.body;
    const userId = req.user;

    // Verify movie exists
    const movie = await verifyMovieExists(movieId);

    if (!movie) {
      return movieDoesNotExistResponse(res);
    }

    // Check if movie is already in watch list
    const movieExistInWatchlist = await verifyMovieExistsInWatchlist(
      movieId,
      userId,
    );

    if (movieExistInWatchlist) {
      return movieExistsInWatchlistResponse(res);
    }

    const watchlistItem = await createWatchlistItem(
      movieId,
      userId,
      status,
      rating,
      notes,
    );

    return watchlistItemCreationSuccessResponse(res, watchlistItem);
  } catch (error) {
    return watchlistItemCreationErrorResponse(res);
  }
};

const deleteFromWatchlist = async (req, res) => {};

export { addToWatchlist, deleteFromWatchlist };

// Functions

const verifyMovieExists = (movieId) =>
  prisma.movie.findUnique({
    where: {
      id: movieId,
    },
  });

const verifyMovieExistsInWatchlist = (movieId, userId) =>
  prisma.watchListItem.findUnique({
    where: {
      userId_movieId: {
        userId: userId,
        movieId: movieId,
      },
    },
  });

const createWatchlistItem = (movieId, userId, status, rating, notes) =>
  prisma.watchListItem.create({
    data: {
      movieId,
      userId,
      status: status || "PLANNED",
      rating,
      notes,
    },
  });

// Response

const movieDoesNotExistResponse = (res) =>
  res.status(404).json({
    error: "Movie does not exist",
  });

const movieExistsInWatchlistResponse = (res) =>
  res.status(400).json({
    error: "Movie already exists in watchlist",
  });

const watchlistItemCreationSuccessResponse = (res, watchlistItem) =>
  res.status(201).json({
    status: "Success",
    data: watchlistItem,
  });

const watchlistItemCreationErrorResponse = (res) =>
  res.status(500).json({
    status: "Error",
    message:
      "Internal Server Error - Unable to add movie to watchlist at the moment",
  });
