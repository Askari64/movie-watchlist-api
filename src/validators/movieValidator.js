import z from "zod";

const addAndUpdateMovieSchema = z.object({
  title: z.string(),
  overview: z.string().optional(),
  releaseYear: z.coerce.number().int("Release Year must be an integer"),
  genres: z.array(z.string()),
  runtime: z.coerce.number().optional(),
  posterURL: z.string().optional(),
});

export { addAndUpdateMovieSchema };
