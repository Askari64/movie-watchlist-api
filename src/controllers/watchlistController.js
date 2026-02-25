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

const deleteFromWatchlist = async (req, res) => {
  try {
    //verify and find watchlist item

    const watchlistItemId = req.params.id;

    const watchlistItem = await findWatchlistItem(watchlistItemId);

    if (!watchlistItem) {
      return watchlistItemNotFoundResponse(res);
    }

    //ensure only owner can delete

    if (watchlistItem.userId !== req.user) {
      return notAllowedToDeleteWatchlistItem(res);
    }

    await deleteWatchlistItem(watchlistItemId);

    return watchlistItemDeletedSuccessfullyResponse(res);
  } catch (error) {
    watchlistItemDeletionErrorResponse(res);
  }
};

const updateWatchlistItem = async (req, res) => {
  try {
    const { rating, notes, status } = req.body;

    //find and verify ownership

    const watchlistItemId = req.params.id;

    const watchlistItem = await findWatchlistItem(watchlistItemId);

    if (!watchlistItem) {
      return watchlistItemNotFoundResponse(res);
    }

    //Ensure only user can update
    if (watchlistItem.userId !== req.user) {
      console.log(watchlistItem);
      console.log(`WatchlistItem User ID: ${watchlistItem.userId}`);
      console.log(` User ID: ${req.user}`);
      return notAllowedToUpdateWatchlistItem(res, watchlistItem);
    }

    //Build update data
    const updateData = {};
    if (status !== undefined) updateData.status = status.toUpperCase();
    if (rating !== undefined) updateData.rating = rating;
    if (notes !== undefined) updateData.notes = notes;

    const updatedItem = await updateWatchlistItemFunction(
      watchlistItemId,
      updateData,
    );

    updateWatchlistItemSuccessfullyResponse(res, updatedItem);
  } catch (error) {
    watchlistItemUpdateErrorResponse(res);
  }
};

const getWatchlistItems = async (req, res) => {}

export { addToWatchlist, deleteFromWatchlist, updateWatchlistItem, getWatchlistItems };

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

const findWatchlistItem = (watchlistItemId) =>
  prisma.watchListItem.findUnique({
    where: { id: watchlistItemId },
  });

const deleteWatchlistItem = (watchlistItemId) =>
  prisma.watchListItem.delete({
    where: {
      id: watchlistItemId,
    },
  });

const updateWatchlistItemFunction = (watchlistItemId, updateData) =>
  prisma.watchListItem.update({
    where: { id: watchlistItemId },
    data: updateData,
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

const watchlistItemNotFoundResponse = (res) =>
  res.status(404).json({
    error: "Watchlist item not found",
  });

const notAllowedToDeleteWatchlistItem = (res) =>
  res.status(403).json({
    error: "Not allowed to delete this watchlist item",
  });

const watchlistItemDeletedSuccessfullyResponse = (res) =>
  res.status(200).json({
    status: "success",
    message: "Movie deleted successfully",
  });

const watchlistItemDeletionErrorResponse = (res) =>
  res.status(500).json({
    status: "Error",
    message:
      "Internal Server Error - Unable to delete movie from watchlist at the moment",
  });

const notAllowedToUpdateWatchlistItem = (res) =>
  res.status(403).json({
    error: "Not allowed to update this watchlist item",
  });

const updateWatchlistItemSuccessfullyResponse = (res, updatedItem) =>
  res.status(200).json({
    status: "success",
    data: {
      watchlistItem: updatedItem,
    },
  });

const watchlistItemUpdateErrorResponse = (res) =>
  res.status(500).json({
    status: "Error",
    message:
      "Internal Server Error - Unable to update movie in watchlist at the moment",
  });
