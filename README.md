# 🚀 Interview Prep Tracker

A personal interview preparation tracker built with **Next.js**, **React**, and **MongoDB**. This full-stack application helps you organize and track your progress on coding questions, and includes user authentication to keep your data secure.

## ✨ Features

* **User Authentication**: Secure login and registration to protect your personal data.
* **Progress Dashboard**: See your progress at a glance with a dashboard showing total, completed, and questions for review.
* **Question Management**: Add new questions with titles and optional links.
* **Status Tracking**: Mark questions as "Completed" or "For Review."
* **Filtering**: Easily filter questions by their status (All, Pending, Completed, For Review).

## 🛠️ Tech Stack

* **Frontend**: Next.js, React
* **Backend**: Next.js API Routes (serverless functions)
* **Database**: MongoDB
* **Authentication**: JSON Web Tokens (JWT) and `bcryptjs` for password hashing

## 💻 Getting Started

Follow these steps to set up and run the project on your local machine.

### Prerequisites

You'll need to have [Node.js](https://nodejs.org/) and [npm](https://www.npmjs.com/) installed.

### Installation

1.  **Clone the repository:**
    ```bash
    git clone <your-repository-url>
    cd <your-project-folder>
    ```

2.  **Install dependencies:**
    ```bash
    npm install
    ```

### Environment Variables

Create a `.env.local` file in the root of your project and add your MongoDB connection string and a JWT secret. **This file should not be committed to Git.**

```env
MONGO_URI=your_mongodb_connection_string_here
JWT_SECRET=a_very_secret_and_long_random_string
