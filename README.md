<h1 align="center">🕌 Digital Kutab Learning Platform</h1>

<p align="center">
  A custom Islamic education platform .<br>
  It connects <strong>Admins</strong>, <strong>Teachers</strong>, and <strong>Students</strong> in one digital ecosystem for Quranic and academic learning.
</p>

---

## 🚀 Overview

The platform modernizes the traditional <em>Kutab</em> learning model while preserving its essence.  
Teachers can manage *Hifd* circles, run live sessions, and evaluate students digitally, while students track their progress and achievements in real time.

---

## 🎯 Core Features

### 👑 Admin
- Manage educational **paths**, **levels**, and **courses**  
- Invite and assign **teachers** to circles  
- Monitor platform activity and generate performance reports  

### 👨‍🏫 Teacher
- Manage assigned circles and courses  
- Conduct **live video sessions** (Jitsi integration)  
- Record **recitation quality**, **behavior**, and **progress**  
- Add notes, assignments, and assessments  

### 🧕 Student
- Join assigned circles and paths  
- Attend **live classes** or view recordings  
- Track **memorization** and **learning milestones**  
- Receive teacher feedback and progress reports  

---

## 🧩 Tech Stack

| Layer | Technology |
|-------|-------------|
| **Frontend** |  Angular + Angular Material UI |
| **Backend** | Laravel (RESTful API with Sanctum) |
| **Database** | MySQL |
| **Video Integration** | Jitsi Meet |
| **Hosting** | Laravel and Frontend on VPS (Hostinger)  |

---

## 🗂️ Repository Structure

This project is divided into two repositories:

- **Frontend:** <a href="#">Alkutab-FrontEnd</a> — Angular   
- **Backend:** <a href="https://github.com/AdamKourchi/Alkutab-BackEnd">Alkutab-BackEnd</a> — Laravel REST API  

Each repository contains its own setup and configuration.

---

## 🖼️ Screenshots

<p align="center">
  <img src="./screenshots/dashboard.png" alt="Dashboard" width="30%">
  &nbsp;
  <img src="./screenshots/teacher.png" alt="Teacher Circle" width="30%">
  &nbsp;
  <img src="./screenshots/student.png" alt="Student Progress" width="30%">
</p>

---

## ⚙️ Installation & Setup

### FrontEnd (Angular)
```bash
git clone https://github.com/AdamKourchi/Alkutab-FrontEnd.git
cd Alkutab-FrontEnd
npm install
ng serve
