# 🎓 Smart Campus Utility App

A full-stack web application that helps students manage their daily campus life — tasks &
assignments, attendance, timetable, notices, and personal notes — from a single, responsive
dashboard.

Built with **React.js, Node.js, Express.js, MongoDB**, secured with **JWT authentication**, and
styled with **Tailwind CSS**.

---

## ✨ Features

- 🔐 **Secure authentication** — Register/login with JWT, passwords hashed with bcrypt
- 📊 **Dashboard** — At-a-glance attendance %, pending tasks, latest notices, and today's classes
- ✅ **Tasks & Assignments** — Create, edit, complete, filter, and delete tasks/assignments with priority & due dates
- 📅 **Attendance Tracker** — Mark present/absent per subject, see overall & subject-wise percentage with progress bars
- 🗓️ **Weekly Timetable** — Add and manage your class schedule, day by day
- 📢 **Notices Board** — Post and browse campus-wide announcements by category
- 📝 **Personal Notes** — Color-coded sticky notes with pin-to-top support
- 👤 **Profile Management** — Update personal & academic details, change password
- 📱 **Fully responsive** — Mobile-friendly sidebar navigation and layouts

---

## 🛠️ Tech Stack

| Layer      | Technology                                              |
|------------|----------------------------------------------------------|
| Frontend   | React.js (Vite), React Router, Tailwind CSS, Axios, Recharts, lucide-react |
| Backend    | Node.js, Express.js                                       |
| Database   | MongoDB with Mongoose ODM                                  |
| Auth       | JSON Web Tokens (JWT), bcrypt.js                            |

---

## 📁 Project Structure

```
smart-campus-app/
├── backend/
│   ├── config/          # MongoDB connection
│   ├── controllers/     # Route handler logic (CRUD operations)
│   ├── middleware/       # JWT auth guard & centralized error handler
│   ├── models/           # Mongoose schemas (User, Task, Attendance, Notice, Note, Timetable)
│   ├── routes/           # Express routers per resource
│   ├── server.js         # App entry point
│   ├── .env.example
│   └── package.json
│
├── frontend/
│   ├── src/
│   │   ├── api/           # Axios instance with JWT interceptor
│   │   ├── components/    # Navbar, Sidebar, ProtectedRoute, StatCard, Loader
│   │   ├── context/        # AuthContext (login/register/logout/session)
│   │   ├── pages/          # Login, Register, Dashboard, Tasks, Attendance,
│   │   │                    # Timetable, Notices, Notes, Profile
│   │   ├── App.jsx
│   │   ├── main.jsx
│   │   └── index.css
│   ├── tailwind.config.js
│   ├── .env.example
│   └── package.json
│
└── README.md
```

---

## ⚙️ Prerequisites

- [Node.js](https://nodejs.org/) v18 or higher
- npm (comes with Node.js)
- A MongoDB instance — either:
  - Local MongoDB (`mongodb://127.0.0.1:27017`), or
  - A free [MongoDB Atlas](https://www.mongodb.com/atlas) cluster

---

## 🚀 Installation & Setup

### 1. Clone the repository

```bash
git clone https://github.com/<your-username>/smart-campus-app.git
cd smart-campus-app
```

### 2. Set up the backend

```bash
cd backend
npm install
cp .env.example .env
```

Edit `backend/.env` and fill in your values:

```env
MONGO_URI=mongodb://127.0.0.1:27017/smart-campus
PORT=5000
JWT_SECRET=replace_this_with_a_long_random_secret
JWT_EXPIRES_IN=7d
CLIENT_URL=http://localhost:5173
```

Start the backend server:

```bash
npm run dev     # uses nodemon for auto-reload
# or
npm start
```

The API will be running at `http://localhost:5000/api` and you should see:

```
MongoDB connected: 127.0.0.1
Server running on port 5000
```

### 3. Set up the frontend

Open a **new terminal window**:

```bash
cd frontend
npm install
cp .env.example .env
```

Edit `frontend/.env` if your backend URL differs from the default:

```env
VITE_API_URL=http://localhost:5000/api
```

Start the frontend dev server:

```bash
npm run dev
```

The app will be available at `http://localhost:5173`.

### 4. Create an account and explore

Open `http://localhost:5173/register`, create a student account, and you'll be redirected to
your personal dashboard.

---

## 🔑 Environment Variables Summary

**Backend (`backend/.env`)**

| Variable          | Description                                  |
|-------------------|-----------------------------------------------|
| `MONGO_URI`       | MongoDB connection string                      |
| `PORT`            | Port for the Express server (default `5000`)    |
| `JWT_SECRET`      | Secret used to sign/verify JWT tokens            |
| `JWT_EXPIRES_IN`  | JWT token expiry (e.g. `7d`)                     |
| `CLIENT_URL`      | Frontend origin allowed by CORS                  |

**Frontend (`frontend/.env`)**

| Variable        | Description                          |
|-----------------|---------------------------------------|
| `VITE_API_URL`  | Base URL of the backend REST API       |

---

## 📡 REST API Reference

All protected routes require an `Authorization: Bearer <token>` header.

### Auth — `/api/auth`
| Method | Endpoint         | Description           | Auth |
|--------|-------------------|------------------------|------|
| POST   | `/register`       | Register new student   | ❌   |
| POST   | `/login`          | Login & receive JWT      | ❌   |
| GET    | `/me`             | Get logged-in user        | ✅   |

### Profile — `/api/users`
| Method | Endpoint    | Description          | Auth |
|--------|--------------|------------------------|------|
| PUT    | `/profile`   | Update profile details  | ✅   |

### Tasks — `/api/tasks`
| Method | Endpoint | Description           | Auth |
|--------|-----------|------------------------|------|
| GET    | `/`       | List user's tasks       | ✅   |
| POST   | `/`       | Create a task/assignment | ✅   |
| PUT    | `/:id`    | Update a task            | ✅   |
| DELETE | `/:id`    | Delete a task            | ✅   |

### Attendance — `/api/attendance`
| Method | Endpoint | Description                              | Auth |
|--------|-----------|---------------------------------------------|------|
| GET    | `/`       | List records + overall & subject-wise stats    | ✅   |
| POST   | `/`       | Add an attendance record                       | ✅   |
| PUT    | `/:id`    | Update a record                                  | ✅   |
| DELETE | `/:id`    | Delete a record                                  | ✅   |

### Notices — `/api/notices`
| Method | Endpoint | Description       | Auth |
|--------|-----------|---------------------|------|
| GET    | `/`       | List all notices      | ✅   |
| POST   | `/`       | Post a new notice       | ✅   |
| PUT    | `/:id`    | Edit a notice            | ✅   |
| DELETE | `/:id`    | Delete a notice          | ✅   |

### Notes — `/api/notes`
| Method | Endpoint | Description       | Auth |
|--------|-----------|---------------------|------|
| GET    | `/`       | List user's notes      | ✅   |
| POST   | `/`       | Create a note            | ✅   |
| PUT    | `/:id`    | Update a note             | ✅   |
| DELETE | `/:id`    | Delete a note             | ✅   |

### Timetable — `/api/timetable`
| Method | Endpoint | Description          | Auth |
|--------|-----------|------------------------|------|
| GET    | `/`       | List user's timetable    | ✅   |
| POST   | `/`       | Add a class entry          | ✅   |
| PUT    | `/:id`    | Update an entry              | ✅   |
| DELETE | `/:id`    | Delete an entry              | ✅   |

---

## 🏗️ Building for Production

**Backend:** deploy as-is on any Node host (Render, Railway, Heroku, EC2). Set environment
variables on the host and run `npm start`.

**Frontend:**

```bash
cd frontend
npm run build
```

This outputs a static `dist/` folder you can deploy to Vercel, Netlify, or any static host.
Remember to set `VITE_API_URL` to your deployed backend URL before building.

---

## 📌 Notes for Reviewers / Contributors

- Passwords are hashed with bcrypt before being stored; plaintext passwords are never persisted.
- JWT tokens are stored in `localStorage` on the client and attached automatically to every
  API request via an Axios interceptor; a `401` response auto-logs the user out.
- All task, attendance, note, and timetable data is scoped to the logged-in user via the
  `user` field on each document and enforced in the controllers.
- Notices are shared across all users (campus-wide announcements) but can only be created by
  authenticated users.

---

## 📄 License

This project is open-source and available for educational use under the MIT License.
#   s m a r t - c a m p u s - u t i l i t y  
 