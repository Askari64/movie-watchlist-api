# Movie Watchlist API Documentation

This repository contains the backend API for the Movie Watchlist application. Built with **Node.js, Express, Prisma (PostgreSQL), and Zod (validation)**.

## Setup and Getting Started

### 1. Environment Variables
To run this project, you will need to add the following environment variables to your `.env` file:
*   `DATABASE_URL`="" (Postgres DB connection string)
*   `NODE_ENV`="development"
*   `JWT_SECRET`="" (Generate using `openssl rand -base64 32`)
*   `JWT_EXPIRES`="" (e.g. "7d")

### 2. Run Locally
Install dependencies and start the backend:
```bash
npm install
npm run dev
```

### 3. API Base URL & CORS
All API requests should be prefixed by the base server url:
```
http://localhost:5000
```
*(Ensure your server is running via `npm run dev`)*

**Important for Frontend Development:**
*   **CORS** is currently configured to accept requests from both `http://127.0.0.1:3000` and `http://localhost:3000`. You must run your frontend app on one of these URLs or change the CORS configuration in `src/server.js`.
*   **Authentication** is handled via HTTP-only cookies. In your frontend `fetch` or `axios` requests, you must include `credentials: "include"` (for fetch) or `withCredentials: true` (for axios) for the `jwtAccessToken` cookie to be sent with requests.

---

## 1. Authentication Routes

All authentication responses return standardized JSON. Once logged in, protected routes require the user context (typically implemented via HTTP-Only JWT cookies). The cookie set by the server is named `jwtAccessToken`.

### `POST /auth/signup`
Creates a new user account.
*   **Controller:** `signup`
*   **Body (JSON)**:
    *   `name` (string) - Min 2 characters.
    *   `email` (string) - Valid email format.
    *   `password` (string) - Min 6 characters.
*   **Success Response**: `201 Created`
    ```json
    {
      "status": "success",
      "message": "User created successfully"
    }
    ```
*   **Example Fetch Request**:
    ```javascript
    const response = await fetch("http://localhost:5000/auth/signup", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name: "John Doe", email: "john@example.com", password: "password123" })
    });
    const data = await response.json();
    ```

### `POST /auth/login`
Logs in a user and returns a token.
*   **Controller:** `login`
*   **Body (JSON)**:
    *   `email` (string)
    *   `password` (string)
*   **Success Response**: `200 OK`
    ```json
    {
      "message": "Login Successful",
      "data": {
        "user": { "id": "uuid", "email": "..." },
        "token": "jwt-token-string"
      }
    }
    ```
*   **Example Fetch Request**:
    ```javascript
    const response = await fetch("http://localhost:5000/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      // IMPORTANT: Add credentials to receive the HTTP-only cookie
      credentials: "include",
      body: JSON.stringify({ email: "john@example.com", password: "password123" })
    });
    const data = await response.json();
    ```

### `POST /auth/logout`
Logs out the current user by clearing the JWT access cookie.
*   **Controller:** `logout`
*   **Success Response**: `200 OK`
    ```json
    {
      "status": "success",
      "message": "logged out successfully"
    }
    ```
*   **Example Fetch Request**:
    ```javascript
    const response = await fetch("http://localhost:5000/auth/logout", {
      method: "POST",
      credentials: "include" // Needed to send the cookie to clear it
    });
    const data = await response.json();
    ```

---

## 2. Movie Routes

*Requires Authentication.* All routes begin with `/movies`.

### `GET /movies`
Get all movies with pagination.
*   **Controller:** `getMovies`
*   **Query Parameters**: 
    *   `page` (number, default: 1)
    *   `limit` (number, default: 50)
*   **Success Response**: `200 OK`
    ```json
    {
      "status": "success",
      "data": [ { /* Movie Object */ } ],
      "meta": { "totalMovies": 100, "page": 1, "limit": 10, "totalPages": 10 }
    }
    ```
*   **Example Fetch Request**:
    ```javascript
    const response = await fetch("http://localhost:5000/movies?page=1&limit=10", {
      method: "GET",
      credentials: "include" // Required for authenticated route
    });
    const data = await response.json();
    ```

### `GET /movies/:id`
Get a specific movie by its ID.
*   **Controller:** `getMovieById`
*   **URL Params**: `id` - The movie's UUID.
*   **Success Response**: `200 OK`
    ```json
    {
      "status": "success",
      "data": { /* Movie Object */ }
    }
    ```
*   **Example Fetch Request**:
    ```javascript
    const movieId = "your-movie-uuid";
    const response = await fetch(`http://localhost:5000/movies/${movieId}`, {
      method: "GET",
      credentials: "include"
    });
    const data = await response.json();
    ```

### `POST /movies/add`
Add a new movie to the global database.
*   **Controller:** `addMovie`
*   **Body (JSON)**:
    *   `title` (string)
    *   `overview` (string, optional)
    *   `releaseYear` (integer)
    *   `genres` (array of strings)
    *   `runtime` (integer, optional)
    *   `posterURL` (string, optional)
*   **Success Response**: `201 Created`
    ```json
    {
      "status": "success",
      "message": "Movie Created Successfully",
      "movie": { /* Movie Object */ }
    }
    ```
*   **Example Fetch Request**:
    ```javascript
    const response = await fetch("http://localhost:5000/movies/add", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify({ 
        title: "Inception", 
        releaseYear: 2010, 
        genres: ["Sci-Fi", "Action"] 
      })
    });
    const data = await response.json();
    ```

### `PATCH /movies/:id`
Update an existing movie details. *User must be the creator of the movie.*
*   **Controller:** `updateMovie`
*   **URL Params**: `id` - The movie's UUID.
*   **Body (JSON)**: Uses the same validation schema as `POST /movies/add`. Required fields are `title`, `releaseYear`, and `genres`. Optional fields are `overview`, `runtime`, and `posterURL`.
*   **Success Response**: `200 OK`
    ```json
    {
      "status": "success",
      "data": { "updatedMovieData": { /* Updated Movie Object */ } }
    }
    ```
*   **Example Fetch Request**:
    ```javascript
    const movieId = "your-movie-uuid";
    const response = await fetch(`http://localhost:5000/movies/${movieId}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify({
        title: "Inception",
        releaseYear: 2010,
        genres: ["Sci-Fi", "Action"],
        runtime: 148,
        overview: "A thief who steals corporate secrets..."
      })
    });
    const data = await response.json();
    ```

### `DELETE /movies/:id`
Deletes a movie from the database. *User must be the creator, and the movie must not be in any user's watchlist.*
*   **Controller:** `deleteMovie`
*   **URL Params**: `id` - The movie's UUID.
*   **Success Response**: `200 OK`
    ```json
    {
      "status": "success",
      "message": "Movie Deleted"
    }
    ```
*   **Example Fetch Request**:
    ```javascript
    const movieId = "your-movie-uuid";
    const response = await fetch(`http://localhost:5000/movies/${movieId}`, {
      method: "DELETE",
      credentials: "include"
    });
    const data = await response.json();
    ```

---

## 3. Watchlist Routes

*Requires Authentication.* All routes begin with `/watchlist`.

### `GET /watchlist`
Gets the authenticated user's whole watchlist.
*   **Controller:** `getWatchlistItems`
*   **Success Response**: `200 OK`
    ```json
    {
      "status": "success",
      "data": [ { /* Watchlist Item Object */ } ]
    }
    ```
*   **Note**: If the user has no watchlist items, the current implementation returns `204`.

*   **Example Fetch Request**:
    ```javascript
    const response = await fetch("http://localhost:5000/watchlist", {
      method: "GET",
      credentials: "include"
    });
    const data = await response.json();
    ```

### `POST /watchlist`
Add a movie to the user's personal watchlist. Note that the frontend must provide an existing `movieId`.
*   **Controller:** `addToWatchlist`
*   **Body (JSON)**:
    *   `movieId` (string, UUID)
    *   `status` (enum: `"PLANNED", "WATCHING", "COMPLETED", "DROPPED"`, optional, default "PLANNED")
*   **Success Response**: `201 Created`
    ```json
    {
      "status": "Success",
      "data": { /* WatchlistItem Object */ }
    }
    ```
*   **Example Fetch Request**:
    ```javascript
    const response = await fetch("http://localhost:5000/watchlist", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify({ 
        movieId: "existing-movie-uuid", 
        status: "WATCHING"
      })
    });
    const data = await response.json();
    ```

### `PATCH /watchlist/:id`
Updates a watchlist item's status.
*   **Controller:** `updateWatchlistItem`
*   **URL Params**: `id` - The Watchlist Item's UUID.
*   **Body (JSON)**:
    *   `status` (enum: `"PLANNED", "WATCHING", "COMPLETED", "DROPPED"`)
*   **Success Response**: `200 OK`
    ```json
    {
      "status": "success",
      "data": { "watchlistItem": { /* Updated Watchlist Item Object */ } }
    }
    ```
*   **Example Fetch Request**:
    ```javascript
    const watchlistItemId = "your-watchlist-item-uuid";
    const response = await fetch(`http://localhost:5000/watchlist/${watchlistItemId}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify({ status: "COMPLETED" })
    });
    const data = await response.json();
    ```

### `DELETE /watchlist/:id`
Removes an entry from the user's watchlist.
*   **Controller:** `deleteFromWatchlist`
*   **URL Params**: `id` - The Watchlist Item's UUID.
*   **Success Response**: `200 OK`
    ```json
    {
      "status": "success",
      "message": "Movie deleted successfully"
    }
    ```
*   **Example Fetch Request**:
    ```javascript
    const watchlistItemId = "your-watchlist-item-uuid";
    const response = await fetch(`http://localhost:5000/watchlist/${watchlistItemId}`, {
      method: "DELETE",
      credentials: "include"
    });
    const data = await response.json();
    ```

---

## Data Models

### User Context & Prisma Schema Models Overview
*   **User**: `id`, `name`, `email`, `password`, `createdAt`
*   **Movie**: `id`, `title`, `overview`, `releaseYear`, `genres`, `runtime`, `posterURL`, `createdBy`, `createdAt`
*   **WatchlistItem**: `id`, `userId`, `movieId`, `status`, `createdAt`, `updatedAt`
