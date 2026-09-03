# AccountHub – Simple Auth Dashboard

A full-stack React + Express + MongoDB application with:

- Signup / Login
- Protected Dashboard
- Settings (edit name, email, password)
- Custom CSS
- Native `fetch` (no Axios)
- Password hashing inside the User model

## Project Structure

```
artifacts/
├── client/          # React (Vite)
└── server/          # Express + MongoDB
```

## Setup

### 1. Backend

```bash
cd server
npm install
```

Create / edit `.env`:

```
PORT=5000
MONGODB_URI=mongodb://127.0.0.1:27017/accounthub
# or your MongoDB Atlas connection string

JWT_SECRET=your_super_secret_key_here
```

Start the server:

```bash
npm run dev
# or
npm start
```

### 2. Frontend

```bash
cd client
npm install
npm install react-router-dom
npm run dev
```

Open http://localhost:5173

## Features

- JWT authentication
- Password hashing with bcrypt (in the model pre-save hook)
- Protected routes
- Update profile (name + email)
- Change password (requires current password)
- Clean custom CSS UI

## API Endpoints

| Method | Endpoint              | Description                | Auth |
|--------|-----------------------|----------------------------|------|
| POST   | /api/auth/signup      | Register new user          | No   |
| POST   | /api/auth/login       | Login                      | No   |
| GET    | /api/user/me          | Get current user           | Yes  |
| PUT    | /api/user/profile     | Update name / email        | Yes  |
| PUT    | /api/user/password    | Change password            | Yes  |

## Notes

- Make sure MongoDB is running locally or use a MongoDB Atlas URI.
- The JWT secret and MongoDB URI should be changed for production.
