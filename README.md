# 🚀 CodeSphere

### *Collaborative Real-time Code Editor*

[![React](https://img.shields.io/badge/Frontend-React-61DAFB?style=for-the-badge&logo=react&logoColor=black)](https://reactjs.org/)
[![Node](https://img.shields.io/badge/Backend-Node.js-339933?style=for-the-badge&logo=nodedotjs&logoColor=white)](https://nodejs.org/)
[![Docker](https://img.shields.io/badge/Infrastructure-Docker-2496ED?style=for-the-badge&logo=docker&logoColor=white)](https://www.docker.com/)
[![AWS](https://img.shields.io/badge/Cloud-AWS_EC2-FF9900?style=for-the-badge&logo=amazonaws&logoColor=white)](https://aws.amazon.com/)

---

## 📖 Overview

**CodeSphere** is a professional-grade, real-time collaborative workspace. Designed for seamless pair programming, it combines a synchronized code editor with a live chat system, all running within a high-performance, containerized production environment.

---

## ✨ Key Features

* **⚡ Real-time Sync:** Powered by **Socket.io** for sub-100ms synchronization.
* **💬 Integrated Chat:** Collaborate with your team without leaving the IDE.
* **🛡️ Production Grade:** Secured with **SSL/TLS** and managed via an **Nginx** reverse proxy.
* **🐳 Microservices:** Fully containerized using **Docker** for consistent environments.
* **🚀 CI/CD Ready:** Automated deployment pipeline via **GitHub Actions**.

---

## 🛠️ System Architecture

### Production Workflow
1.  **Client:** Securely connects via **HTTPS/WSS** to the cloud.
2.  **Reverse Proxy (Nginx):** Acts as the gatekeeper on the **AWS EC2** host, handling SSL termination.
3.  **Docker Network:** Traffic is routed to internal containers:
    * **Backend:** Node.js API & WebSocket Server (Port 5000)
    * **Database:** PostgreSQL (Port 5432)

---

## 📂 Project Structure

```text
├── backend/            # Express & WebSocket Server
│   ├── prisma/         # Schema & Migrations
│   └── server.js       # API Entry Point
├── frontend/           # React App (Vercel)
│   ├── src/components/ # Reusable UI components
│   └── src/pages/      # Dashboard & Editor
└── docker-compose.yml  # Container Orchestration
