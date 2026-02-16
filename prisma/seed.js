import "dotenv/config";
import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import pg from "pg";

const pool = new pg.Pool({ connectionString: process.env.DATABASE_URL });
const adapter = new PrismaPg(pool);

const prisma = new PrismaClient({
  adapter,
  log:
    process.env.NODE_ENV === "development"
      ? ["query", "error", "warn"]
      : ["error"]
});

const creatorId = "0956270a-f9c7-45ef-9dac-358db6442123";

const movies = [
  {
    title: "The Matrix",
    overview:
      "A computer hacker learns about the true nature of reality and his role in the war against its controllers.",
    releaseYear: 1999,
    genres: ["Action", "Sci-Fi"],
    runtime: 136,
    posterURL:
      "https://image.tmdb.org/t/p/w500/f89U3ADr1oiB1s9GkdPOEpXUk5H.jpg",
    createdBy: creatorId,
  },
  {
    title: "Inception",
    overview:
      "A thief who steals corporate secrets through dream-sharing technology is given the inverse task of planting an idea.",
    releaseYear: 2010,
    genres: ["Action", "Sci-Fi", "Thriller"],
    runtime: 148,
    posterURL:
      "https://image.tmdb.org/t/p/w500/9gk7adHYeDvHkCSEqAvQNLV5Uge.jpg",
    createdBy: creatorId,
  },
  {
    title: "The Shawshank Redemption",
    overview:
      "Two imprisoned men bond over a number of years, finding solace and eventual redemption through acts of common decency.",
    releaseYear: 1994,
    genres: ["Drama"],
    runtime: 142,
    posterURL:
      "https://image.tmdb.org/t/p/w500/q6y0Go1tsGEsmtFryDOJo3dEmqu.jpg",
    createdBy: creatorId,
  },
  {
    title: "The Dark Knight",
    overview:
      "When the menace known as the Joker emerges, Batman must accept one of the greatest psychological tests to fight injustice.",
    releaseYear: 2008,
    genres: ["Action", "Crime", "Drama"],
    runtime: 152,
    posterURL:
      "https://image.tmdb.org/t/p/w500/qJ2tW6WMUDux911r6m7haRef0WH.jpg",
    createdBy: creatorId,
  },
  {
    title: "Pulp Fiction",
    overview:
      "The lives of two mob hitmen, a boxer, a gangster and his wife intertwine in four tales of violence and redemption.",
    releaseYear: 1994,
    genres: ["Crime", "Drama"],
    runtime: 154,
    posterURL:
      "https://image.tmdb.org/t/p/w500/d5iIlFn5s0ImszYzBPb8JPIfbXD.jpg",
    createdBy: creatorId,
  },
  {
    title: "Forrest Gump",
    overview:
      "The presidencies of Kennedy and Johnson unfold through the perspective of an Alabama man with an IQ of 75.",
    releaseYear: 1994,
    genres: ["Drama", "Romance"],
    runtime: 142,
    posterURL:
      "https://image.tmdb.org/t/p/w500/arw2vcBveWOVZr6pxd9XTd1TdQa.jpg",
    createdBy: creatorId,
  },
  {
    title: "Fight Club",
    overview:
      "An insomniac office worker and a devil-may-care soap maker form an underground fight club that evolves into much more.",
    releaseYear: 1999,
    genres: ["Drama"],
    runtime: 139,
    posterURL:
      "https://image.tmdb.org/t/p/w500/pB8BM7pdSp6B6Ih7QZ4DrQ3PmJK.jpg",
    createdBy: creatorId,
  },
  {
    title: "Interstellar",
    overview:
      "A team of explorers travel through a wormhole in space in an attempt to ensure humanity's survival.",
    releaseYear: 2014,
    genres: ["Adventure", "Drama", "Sci-Fi"],
    runtime: 169,
    posterURL:
      "https://image.tmdb.org/t/p/w500/gEU2QniE6E77NI6lCU6MxlNBvIx.jpg",
    createdBy: creatorId,
  },
  {
    title: "Goodfellas",
    overview:
      "The story of Henry Hill and his life in the mob, covering his relationship with his wife and his partners in crime.",
    releaseYear: 1990,
    genres: ["Crime", "Drama"],
    runtime: 146,
    posterURL:
      "https://image.tmdb.org/t/p/w500/aKuFiU82s5ISJpGZp7YkIr3kCUd.jpg",
    createdBy: creatorId,
  },
  {
    title: "The Godfather",
    overview:
      "The aging patriarch of an organized crime dynasty transfers control of his clandestine empire to his reluctant son.",
    releaseYear: 1972,
    genres: ["Crime", "Drama"],
    runtime: 175,
    posterURL:
      "https://image.tmdb.org/t/p/w500/3bhkrj58Vtu7enYsRolD1fZdja1.jpg",
    createdBy: creatorId,
  },
  {
    title: "Parasite",
    overview:
      "Greed and class discrimination threaten the newly formed symbiotic relationship between the wealthy Park family and the destitute Kim clan.",
    releaseYear: 2019,
    genres: ["Drama", "Thriller"],
    runtime: 132,
    posterURL:
      "https://image.tmdb.org/t/p/w500/7IiTTgloJzvGI1TAYymCfbfl3vT.jpg",
    createdBy: creatorId,
  },
  {
    title: "The Lord of the Rings: The Return of the King",
    overview:
      "Gandalf and Aragorn lead the World of Men against Sauron's army to draw his gaze from Frodo and Sam as they approach Mount Doom.",
    releaseYear: 2003,
    genres: ["Adventure", "Fantasy", "Action"],
    runtime: 201,
    posterURL:
      "https://image.tmdb.org/t/p/w500/rCzpDGLbOoPwLjy3OAm5NUPOTrC.jpg",
    createdBy: creatorId,
  },
  {
    title: "Avengers: Endgame",
    overview:
      "After the devastating events of Infinity War, the Avengers assemble once more to reverse Thanos' actions and restore balance.",
    releaseYear: 2019,
    genres: ["Action", "Adventure", "Sci-Fi"],
    runtime: 181,
    posterURL:
      "https://image.tmdb.org/t/p/w500/or06FN3Dka5tukK1e9sl16pB3iy.jpg",
    createdBy: creatorId,
  },
  {
    title: "Spider-Man: Into the Spider-Verse",
    overview:
      "Teen Miles Morales becomes Spider-Man and must team up with other Spider-People from different dimensions.",
    releaseYear: 2018,
    genres: ["Action", "Adventure", "Animation"],
    runtime: 117,
    posterURL:
      "https://image.tmdb.org/t/p/w500/iiZZdoQBEYBv6id8su7ImL0oCbD.jpg",
    createdBy: creatorId,
  },
  {
    title: "Dune",
    overview:
      "A noble family becomes embroiled in a war for control over the galaxy's most valuable asset while its heir becomes troubled by visions.",
    releaseYear: 2021,
    genres: ["Adventure", "Sci-Fi"],
    runtime: 155,
    posterURL:
      "https://image.tmdb.org/t/p/w500/d5NXSklXo0qyIYkgV94XAgMIckC.jpg",
    createdBy: creatorId,
  },
  {
    title: "Gladiator",
    overview:
      "A former Roman General sets out to exact vengeance against the corrupt emperor who murdered his family and sent him into slavery.",
    releaseYear: 2000,
    genres: ["Action", "Adventure", "Drama"],
    runtime: 155,
    posterURL:
      "https://image.tmdb.org/t/p/w500/ty8TGRuvJLPUmAr1H1nRIsgwvim.jpg",
    createdBy: creatorId,
  },
  {
    title: "Joker",
    overview:
      "In Gotham City, mentally troubled comedian Arthur Fleck is disregarded and mistreated by society, leading to his transformation.",
    releaseYear: 2019,
    genres: ["Crime", "Drama", "Thriller"],
    runtime: 122,
    posterURL:
      "https://image.tmdb.org/t/p/w500/udDclJoHjfjb8Ekgsd4FDteOkCU.jpg",
    createdBy: creatorId,
  },
  {
    title: "The Silence of the Lambs",
    overview:
      "A young FBI cadet must receive the help of an incarcerated cannibal killer to catch another serial killer.",
    releaseYear: 1991,
    genres: ["Crime", "Drama", "Thriller"],
    runtime: 118,
    posterURL:
      "https://image.tmdb.org/t/p/w500/uS9m8OBk1A8eM9I042bx8XXpqAq.jpg",
    createdBy: creatorId,
  },
  {
    title: "Saving Private Ryan",
    overview:
      "Following the Normandy Landings, a group of U.S. soldiers go behind enemy lines to retrieve a paratrooper whose brothers have been killed.",
    releaseYear: 1998,
    genres: ["Drama", "War"],
    runtime: 169,
    posterURL:
      "https://image.tmdb.org/t/p/w500/uqx37WTn3RmEQQpYultBkp9QTYM.jpg",
    createdBy: creatorId,
  },
  {
    title: "Schindler's List",
    overview:
      "In German-occupied Poland during World War II, industrialist Oskar Schindler gradually becomes concerned for his Jewish workforce.",
    releaseYear: 1993,
    genres: ["Drama", "History", "War"],
    runtime: 195,
    posterURL:
      "https://image.tmdb.org/t/p/w500/sF1U4EUQS8YHUYjNl3pMGNIQyr0.jpg",
    createdBy: creatorId,
  },
];

const main = async () => {
  console.log("Seeding movies...");

  for (const movie of movies) {
    await prisma.movie.create({
      data: movie,
    });
    console.log(`Created movie: ${movie.title}`);
  }
  console.log("Movie Seeding Completed");
};

main()
  .catch((err) => {
    console.log(err);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
