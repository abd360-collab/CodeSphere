🚀 CodeSphere: Collaborative Code Editor
A real-time, full-stack collaborative code editor that allows multiple users to write, run, and discuss code in a synchronized environment.

✨ Key Features
Real-time Collaboration: Synchronized code editing across multiple clients.

Integrated Code Execution: Run code snippets directly within the editor.

Live Project Chat: Real-time chat system for team communication while coding.

Secure Authentication: User signup and login system.

Persistent Storage: Projects and user data saved in a PostgreSQL database.

🛠️ Tech Stack
Frontend
React.js & Tailwind CSS for a responsive UI.

Socket.io-client for real-time WebSocket communication.

Vercel for high-performance frontend hosting.

Backend
Node.js & Express API.

Socket.io for the real-time websocket server.

Prisma ORM for interacting with the database.

PostgreSQL for relational data storage.

DevOps & Deployment
Docker & Docker Compose: Containerized microservices architecture.

AWS (EC2): Production backend hosting on Ubuntu.

Nginx: High-performance reverse proxy with SSL (Certbot).

GitHub Actions: CI/CD pipeline for automated deployments.

🏗️ Architecture Overview
The project is deployed using a professional production architecture:

Frontend: Hosted on Vercel, communicating over HTTPS/WSS.

Proxy Layer: Host-level Nginx on AWS handles SSL termination and redirects traffic to the Docker network.

Docker Network: * Backend Container: Running on Port 5000.

Database Container: PostgreSQL running on Port 5432.

🚀 Getting Started
Prerequisites
Node.js (v18+)

Docker & Docker Compose

Local Installation
Clone the repository:

Bash
git clone https://github.com/your-username/your-repo-name.git
cd your-repo-name
Setup Environment Variables:
Create a .env file in the backend folder:

Code snippet
DATABASE_URL="postgresql://user:password@localhost:5432/codesphere"
PORT=5000
Run with Docker:

Bash
docker compose up --build
Frontend Setup:

Bash
cd frontend
npm install
npm start
📝 License
This project is for educational purposes as part of a full-stack engineering portfolio.
