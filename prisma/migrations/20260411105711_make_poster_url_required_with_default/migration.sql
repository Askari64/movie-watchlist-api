/*
  Warnings:

  - Made the column `posterURL` on table `Movie` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "Movie" ALTER COLUMN "posterURL" SET NOT NULL,
ALTER COLUMN "posterURL" SET DEFAULT 'https://cdn5.vectorstock.com/i/1000x1000/22/74/movie-poster-template-vector-16752274.jpg';
