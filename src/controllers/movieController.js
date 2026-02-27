import { prisma } from "../config/db";

const getMovies = async (req, res) => {

    //TODO: Implement offset-based pagination

    
    //List all movies
    const allMovies = await prisma.movie.findMany()
};

const addMovie = async (req, res) => {};

const updateMovie = async (req, res) => {};

const deleteMovie = async (req, res) => {};

export { getMovies, addMovie, updateMovie, deleteMovie };

// Functions

// Responses
