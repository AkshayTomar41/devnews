# HackerNews Clone

A mini full-stack MERN application that scrapes the top 10 stories from HackerNews, saves them to a database, and allows users to register, login, and bookmark their favorite stories.

## Features

- **Web Scraper**: Scrapes top 10 stories from HackerNews (Title, URL, Points, Author, Posted Time).
- **Backend API**: Node.js & Express REST APIs with JWT authentication.
- **Frontend**: React application built with Vite, featuring a modern, dark-mode, responsive UI.
- **Bookmarks**: Authenticated users can bookmark and unbookmark stories.
- **Pagination**: Browse stories using pagination.

## Tech Stack

- **MongoDB** (Mongoose)
- **Express.js**
- **React.js** (Context API, React Router, Vite)
- **Node.js**
- **Axios & Cheerio** (for scraping)

## Environment Variables

Create a `.env` file in the `backend/` directory with the following variables:

```env
PORT=5000
MONGODB_URI=mongodb://127.0.0.1:27017/hackernews_clone
JWT_SECRET=supersecretkey_hacker_news_clone_12345
```

## Setup Instructions

### 1. Start MongoDB
Ensure that MongoDB is running locally on `127.0.0.1:27017`.

### 2. Setup Backend
1. Navigate to the `backend` directory: `cd backend`
2. Install dependencies: `npm install`
3. Start the server: `npm start` (or `node index.js`)
*Note: The server will automatically scrape HackerNews on startup.*

### 3. Setup Frontend
1. Navigate to the `frontend` directory: `cd frontend`
2. Install dependencies: `npm install`
3. Start the development server: `npm run dev`

### 4. Open in Browser
Visit `http://localhost:5173` to view the application.

## API Documentation

### Auth
- `POST /api/auth/register` - Register a new user
- `POST /api/auth/login` - Login user

### Stories
- `GET /api/stories?page=1&limit=10` - Get paginated stories
- `GET /api/stories/:id` - Get a single story
- `POST /api/stories/:id/bookmark` - Toggle bookmark (Auth required)

### Scraper
- `POST /api/scrape` - Manually trigger the scraper
