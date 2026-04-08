# 🚀 CodeSphere

### *A High-Performance Collaborative Real-Time Code Editor*

[![React](https://img.shields.io/badge/Frontend-React-61DAFB?style=for-the-badge&logo=react&logoColor=black)](https://reactjs.org/)
[![Node](https://img.shields.io/badge/Backend-Node.js-339933?style=for-the-badge&logo=nodedotjs&logoColor=white)](https://nodejs.org/)
[![Docker](https://img.shields.io/badge/Infrastructure-Docker-2496ED?style=for-the-badge&logo=docker&logoColor=white)](https://www.docker.com/)
[![AWS](https://img.shields.io/badge/Cloud-AWS_EC2-FF9900?style=for-the-badge&logo=amazonaws&logoColor=white)](https://aws.amazon.com/)
[![GitHub Actions](https://img.shields.io/badge/CI/CD-GitHub_Actions-2088FF?style=for-the-badge&logo=githubactions&logoColor=white)](https://github.com/features/actions)

---

## 📖 Overview

**CodeSphere** is a professional-grade workspace designed for seamless pair programming. It combines a synchronized multi-user code editor with a real-time chat system, all running within a fully containerized, SSL-secured production environment.

---

## ✨ Key Features

* **⚡ Real-time Synchronization:** Powered by **Socket.io** for instantaneous code and chat updates.
* **💬 Integrated Project Chat:** Built-in communication channel for team collaboration.
* **🛡️ Production Grade Security:** Fully secured with **SSL/TLS** (Certbot) managed via a host-level **Nginx** reverse proxy.
* **🐳 Microservices Architecture:** Backend and Database are isolated using **Docker** containers for maximum stability.
* **🔄 Automated CI/CD:** Seamless deployment pipeline using **GitHub Actions** for the backend and **Vercel** for the frontend.

---

## 🛠️ Tech Stack

| Layer | Technologies |
| :--- | :--- |
| **Frontend** | React.js, Tailwind CSS, Socket.io-client |
| **Backend** | Node.js, Express, Socket.io |
| **Database** | PostgreSQL, Prisma ORM |
| **CI/CD** | **GitHub Actions**, Vercel |
| **Infrastructure** | Docker, Docker Compose, AWS EC2 (Ubuntu) |
| **Proxy & Security** | Nginx, Certbot (SSL), HTTPS/WSS Protocols |

---

## 🏗️ System Architecture

### Production Workflow
1.  **Traffic Entry:** Clients connect via **HTTPS/WSS** to `codesphere-api.duckdns.org`.
2.  **Reverse Proxy (Nginx):** A host-level Nginx instance on **AWS EC2** handles SSL termination.
3.  **Deployment Pipeline:** * **Frontend:** Auto-deployed to Vercel on every push to `main`.
    * **Backend:** **GitHub Actions** triggers a remote SSH script to pull the latest code and rebuild Docker containers on the EC2 instance.

---

## 📂 Project Structure

```text
├── .github/workflows/  # GitHub Actions CI/CD configuration
├── backend/            # Express & WebSocket Server
│   ├── prisma/         # Database Schema & Migrations
│   └── server.js       # Main API Entry Point
├── frontend/           # React App (Hosted on Vercel)
│   ├── src/components/ # Reusable UI components
│   └── src/pages/      # Dashboard & Project Editor
└── docker-compose.yml  # Microservices Orchestration
