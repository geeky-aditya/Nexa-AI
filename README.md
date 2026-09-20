# 🤖 Nexa AI

Nexa AI is a full-stack AI chatbot application built using the **MERN stack** and the **OpenAI API**. It provides an interactive chat experience with user authentication, personalized chat history, and persistent conversations.

## 🚀 Features

- 🤖 AI-powered conversations using OpenAI API
- 🔐 User Registration and Login
- 🔑 JWT-based authentication
- 🔒 Password hashing using bcrypt
- 👤 User-specific chat history
- 💬 Create and manage multiple conversations
- 🗑️ Delete individual conversations
- 🔄 Persistent conversations using MongoDB
- 📱 Responsive and modern dark-themed UI
- ✨ Markdown and code formatting in AI responses
- 👋 Personalized welcome message for logged-in users
- 🚪 Logout functionality
- 👤 Guest users can chat without creating an account

## 🛠️ Tech Stack

### Frontend
- React.js
- Vite
- JavaScript
- CSS
- React Markdown
- Highlight.js

### Backend
- Node.js
- Express.js
- MongoDB
- Mongoose
- JWT
- bcrypt

### AI
- OpenAI API

### Development Tools
- Git
- GitHub
- VS Code
- Postman

## 📂 Project Structure

```text
Nexa-AI/
│
├── backend/
│   ├── middleware/
│   ├── models/
│   ├── routes/
│   ├── utils/
│   ├── .env
│   └── server.js
│
├── frontend/
│   ├── public/
│   └── src/
│       ├── assets/
│       ├── Chat.jsx
│       ├── ChatWindow.jsx
│       ├── Sidebar.jsx
│       ├── Login.jsx
│       ├── Signup.jsx
│       ├── AuthContext.jsx
│       └── App.jsx
│
└── .gitignore
