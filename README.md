# 🚀 DevNews - MERN HackerNews Scraper

DevNews is a full-stack MERN application that scrapes top stories from HackerNews and allows authenticated users to bookmark stories.

The project demonstrates:

* Web scraping using Cheerio
* JWT authentication
* REST API development
* MongoDB integration
* React frontend with Context API
* Full-stack deployment

---

# ✨ Features

## 🕵️ Web Scraper

* Scrapes top 10 stories from HackerNews
* Extracts:

  * Title
  * URL
  * Points
  * Author
  * Posted Time
* Stores scraped data in MongoDB
* Automatically runs on server startup
* Can also be triggered manually via API

## 🔐 Authentication

* User registration
* User login
* JWT-based authentication
* Protected routes

## 📰 Stories

* Fetch all stories
* Fetch single story
* Bookmark/unbookmark stories
* Protected bookmarks page

## 💻 Frontend

* React + Vite
* Context API for authentication state
* Responsive UI
* Bookmark persistence
* Clean and modern interface

---

# 🛠️ Tech Stack

## Backend

* Node.js
* Express.js
* MongoDB
* Mongoose
* JWT
* Cheerio
* Axios

## Frontend

* React.js
* Vite
* React Router DOM
* Context API
* Axios

---

# 📁 Folder Structure

```bash
backend/
├── controllers/
├── middleware/
├── models/
├── routes/
├── scraper/
├── utils/
├── server.js

frontend/
├── src/
│   ├── components/
│   ├── context/
│   ├── pages/
│   ├── services/
│   ├── App.jsx
│   └── main.jsx
```

---

# ⚙️ Environment Variables

Create a `.env` file inside the `backend` folder:

```env
PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_secret_key
CLIENT_URL=http://localhost:5173
```

---

# 🚀 Installation & Setup

## 1. Clone the Repository

```bash
git clone <your-repository-url>
cd devnews
```

---

## 2. Backend Setup

```bash
cd backend
npm install
npm run dev
```

Backend will run on:

```bash
http://localhost:5000
```

---

## 3. Frontend Setup

Open a new terminal:

```bash
cd frontend
npm install
npm run dev
```

Frontend will run on:

```bash
http://localhost:5173
```

---

# 📡 API Endpoints

## 🔐 Authentication Routes

| Method | Endpoint             | Description         |
| ------ | -------------------- | ------------------- |
| POST   | `/api/auth/register` | Register a new user |
| POST   | `/api/auth/login`    | Login user          |

---

## 📰 Story Routes

| Method | Endpoint                    | Description        |
| ------ | --------------------------- | ------------------ |
| GET    | `/api/stories`              | Fetch all stories  |
| GET    | `/api/stories/:id`          | Fetch single story |
| POST   | `/api/stories/:id/bookmark` | Toggle bookmark    |

---

## 🕵️ Scraper Route

| Method | Endpoint      | Description              |
| ------ | ------------- | ------------------------ |
| POST   | `/api/scrape` | Trigger scraper manually |

---

# 🔖 Bookmark Feature

Authenticated users can:

* Bookmark stories
* Remove bookmarks
* Access bookmarked stories from protected page

Bookmarks are stored in MongoDB and persist across sessions.

---

# 🌐 Deployment

## Frontend

Deployed on Vercel

## Backend

Deployed on Render / Railway

## Database

MongoDB Atlas

---

# 👨‍💻 Author

Akshay Tomer


