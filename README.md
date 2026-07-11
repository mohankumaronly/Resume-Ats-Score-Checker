# 🚀 Resume ATS Score Checker

> **AI-powered Resume Analyzer** that evaluates resumes for ATS compatibility, identifies missing keywords, and provides intelligent suggestions to improve your chances of getting shortlisted.

<div align="center">

## 🌐 Live Demo

### 🚀 **Try the Application Here**

## **👉 https://profileatsscore.vercel.app 👈**

**✨ Analyze your resume instantly with AI-powered ATS scoring.**

</div>

<p align="center">
  <img src="https://img.shields.io/badge/React-Frontend-61DAFB?style=for-the-badge&logo=react" />
  <img src="https://img.shields.io/badge/Spring_Boot-Backend-6DB33F?style=for-the-badge&logo=springboot" />
  <img src="https://img.shields.io/badge/PostgreSQL-Database-336791?style=for-the-badge&logo=postgresql" />
  <img src="https://img.shields.io/badge/Groq-AI-orange?style=for-the-badge" />
  <img src="https://img.shields.io/badge/License-MIT-yellow?style=for-the-badge" />
</p>

---

## 📖 About

Resume ATS Score Checker helps developers and job seekers optimize their resumes for Applicant Tracking Systems (ATS).

Simply upload your PDF resume, and the application uses AI to generate a complete analysis including ATS score, keyword suggestions, strengths, weaknesses, and personalized recommendations.

---

# ✨ Features

- 📄 Upload PDF Resume
- 🤖 AI Resume Analysis
- 📊 ATS Score (0–100)
- 🎯 Keyword Matching
- 💻 Technical Skills Evaluation
- 📈 Section-wise Score Breakdown
- 💡 AI Suggestions
- 📚 Recommended Skills
- 🔐 Email OTP Authentication
- 🌙 Responsive Dark UI

---

# 🛠 Tech Stack

| Frontend | Backend | Database | AI |
|-----------|----------|-----------|-----|
| React | Spring Boot | PostgreSQL | Groq |
| TypeScript | Java | Neon DB | Llama Model |
| Tailwind CSS | Spring Security | | |
| Vite | JWT | | |

---

# 📂 Project Structure

```text
Resume-Ats-Score-Checker/

├── frontend/
│   ├── src/
│   ├── public/
│   ├── package.json
│   └── vite.config.ts
│
├── backend/
│   ├── src/
│   ├── pom.xml
│   └── Dockerfile
│
├── README.md
└── LICENSE
```

---

# ⚙️ Getting Started

## 1. Clone Repository

```bash
git clone https://github.com/mohankumaronly/Resume-Ats-Score-Checker.git

cd Resume-Ats-Score-Checker
```

---

## 2. Backend

```bash
cd backend

cp .env.example .env

./mvnw clean install

./mvnw spring-boot:run
```

Runs on

```
http://localhost:8080
```

---

## 3. Frontend

```bash
cd frontend

npm install

npm run dev
```

Runs on

```
http://localhost:5173
```

---

# 🔑 Environment Variables

## Backend

```env
DB_URL=

DB_USERNAME=

DB_PASSWORD=

JWT_SECRET=

GROQ_API_KEY=

BREVO_USERNAME=

BREVO_SMTP_KEY=

BREVO_FROM_EMAIL=
```

---

## Frontend

```env
VITE_API_URL=http://localhost:8080
```

---

# 📡 REST API

## Authentication

| Method | Endpoint |
|---------|----------|
| POST | /api/auth/send-otp |
| POST | /api/auth/verify-otp |
| POST | /api/auth/resend-otp |

---

## Resume

| Method | Endpoint |
|---------|----------|
| POST | /api/resume/analyze |
| GET | /api/resume/health |

---

# 🧠 AI Report Includes

- ATS Score
- Resume Rating
- Missing Keywords
- Formatting Review
- Skills Analysis
- Project Evaluation
- Experience Review
- Resume Strengths
- Resume Weaknesses
- Personalized Suggestions

---

# 🚀 Deployment

| Service | Platform |
|----------|----------|
| Frontend | Vercel |
| Backend | Render |
| Database | Neon PostgreSQL |

---

# 🖥 Screenshots

## Home

_Add screenshot here_

---

## Upload Resume

_Add screenshot here_

---

## Analysis

_Add screenshot here_

---

# 🌟 Future Roadmap

- Resume History
- Resume Comparison
- JD Matching
- Resume Builder
- Download PDF Report
- Interview Preparation
- AI Resume Rewrite

---

# 🤝 Contributing

Contributions are welcome!

```bash
Fork → Clone → Create Branch → Commit → Push → Pull Request
```

---

# 📄 License

Licensed under the MIT License.

---

# 👨‍💻 Developer

**Mohan Kumar**

📧 mohankumaronly81@gmail.com

🐙 GitHub  
https://github.com/mohankumaronly

💼 LinkedIn  
https://linkedin.com/in/mohan-kumar

---

<p align="center">

⭐ If you found this project helpful, consider giving it a **Star**!

Made with ❤️ using React, Spring Boot & Groq AI

</p>
