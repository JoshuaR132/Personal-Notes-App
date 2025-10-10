# 📝 Personal Notes App

A full-stack web application to create, view, update, and delete personal notes. Built with **React**, **Tailwind CSS**, **Node.js**, **Express**, and **MongoDB**. This project demonstrates a complete full-stack workflow, including frontend/backend integration, REST API design, and deployment readiness.


## 🌟 Features

- **Create, Read, Update, Delete (CRUD)** notes
- **Responsive design** for desktop and mobile
- **Dark mode support**
- **Search and filter** notes
- Notes are saved persistently in **MongoDB Atlas**
- **REST API** with Node.js and Express
- Frontend styled with **Tailwind CSS**
- Fully deployable to platforms like Vercel (frontend) and Render/Heroku (backend)


## 🛠️ Tech Stack

| Layer       | Technology           |
|------------|--------------------|
| Frontend    | React, Tailwind CSS, Axios |
| Backend     | Node.js, Express    |
| Database    | MongoDB Atlas       |
| Tools       | VS Code, Nodemon, dotenv |

## 🚀 Getting Started

### Prerequisites

- Node.js (LTS recommended)
- npm or yarn
- MongoDB Atlas account (for a hosted database)

### Installation

1. **Clone the repository:**

bash
git clone https://github.com/your-username/Personal-Notes-App.git
cd Personal-Notes-App


2. **Install backend dependencies:**

bash
cd backend
npm install


3. **Set up environment variables:**

Create a `.env` file in the backend folder:

env
PORT=5000
MONGO_URI=mongodb+srv://<username>:<password>@cluster0.mongodb.net/<dbname>?retryWrites=true&w=majority


4. **Run the backend server:**

bash
npm run dev


The backend will run on `http://localhost:5000`.

5. **Install frontend dependencies:**

bash
cd ../frontend
npm install


6. **Run the frontend:**

bash
npm start


The frontend will run on `http://localhost:3000` and communicate with the backend API.

## Usage

* Add a new note using the form.
* View all saved notes in a responsive grid.
* Delete notes with a single click.
* (Optional) Extend the app with features like editing, search, or tagging.

## Security & Best Practices

* API routes validate input data before saving to MongoDB.
* Environment variables are used to secure database credentials.
* CORS configured to allow frontend-backend communication.
* Can be extended with authentication for private notes per user.

## Deployment

* Frontend can be deployed to **Vercel** or **Netlify**.
* Backend can be deployed to **Render** or **Heroku**.
* MongoDB Atlas provides a cloud-hosted database for production.
* 

## Contributing

Contributions are welcome! Feel free to open an issue or submit a pull request for improvements.

## Contact
