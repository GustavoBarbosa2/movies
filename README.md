# CineMujães Movie Browser

CineMujães is a full-stack web application that allows users to browse, search, and filter through a collection of movies. Users can view detailed information about each film and engage in discussions by adding, editing, and deleting comments. The application features a dynamic frontend built with vanilla JavaScript and a robust backend powered by Node.js, Express, and MongoDB.

## Features

- **Movie Gallery:** View a grid of movie posters with titles and genres.
- **Advanced Search & Filtering:**
    - Search for movies by title.
    - Filter movies by multiple genres.
    - Filter by release year, minimum runtime, and minimum IMDb rating.
- **Detailed Movie View:** Click on a movie to see a dedicated page with comprehensive details including plot, director, cast, runtime, and more.
- **Comment System:**
    - View all comments for a specific movie.
    - Add new comments.
    - Edit your existing comments.
    - Delete comments.

## Tech Stack

- **Backend:** Node.js, Express.js
- **Database:** MongoDB
- **Frontend:** HTML, CSS, Vanilla JavaScript
- **Environment Management:** dotenv

## Project Structure

The repository is organized into two main directories: `frontend` and `backend`.

```
/
├── backend/
│   ├── database.js     # MongoDB connection logic
│   └── index.js        # Express server and API endpoints
├── frontend/
│   ├── pages/          # HTML files for the main page and movie details
│   ├── scripts/        # Client-side JavaScript for interactivity
│   └── styles/         # CSS stylesheets
├── package.json        # Project dependencies and scripts
└── .env                # (To be created) Environment variables
```

## Getting Started

Follow these instructions to get a copy of the project up and running on your local machine.

### Prerequisites

- [Node.js](https://nodejs.org/) (which includes npm)
- A [MongoDB Atlas](https://www.mongodb.com/cloud/atlas) account and a cluster set up.

### Installation & Setup

1.  **Clone the repository:**
    ```sh
    git clone https://github.com/gustavobarbosa2/movies.git
    ```

2.  **Navigate to the project directory:**
    ```sh
    cd movies
    ```

3.  **Install NPM packages:**
    ```sh
    npm install
    ```

4.  **Create an environment file:**
    Create a `.env` file in the root of the project and add your MongoDB Atlas credentials.

    ```env
    # .env
    DBUSER=<your-database-username>
    DBPASSWORD=<your-database-password>
    CLUSTER_URL=<your-cluster-url>
    CLUSTER_NAME=<your-cluster-name>
    PORT=3000
    ```

    *The backend uses the `sample_mflix` database. Make sure it is loaded in your Atlas cluster.*

5.  **Start the server:**
    ```sh
    npm start
    ```
    The application will be running at `http://localhost:3000`.

## API Endpoints

The backend provides the following RESTful API endpoints:

| Method   | Endpoint                                   | Description                                          |
| :------- | :----------------------------------------- | :--------------------------------------------------- |
| `GET`    | `/`                                        | Serves the main movie gallery page.                  |
| `GET`    | `/movies`                                  | Fetches a list of up to 100 movies.                  |
| `GET`    | `/movies/:id`                              | Fetches detailed information for a specific movie.   |
| `GET`    | `/movies/:id/comments`                     | Retrieves all comments for a specific movie.         |
| `POST`   | `/movies/:id/comments`                     | Adds a new comment to a movie.                       |
| `PUT`    | `/movies/:movieId/comments/:commentId`     | Edits an existing comment.                           |
| `DELETE` | `/movies/:movieId/comments/:commentId`     | Deletes a specific comment.                          |
