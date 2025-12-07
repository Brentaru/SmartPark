# 🅿️ SmartPark

School Parking Management System  
SmartPark is a web-based application designed to help schools efficiently manage parking spaces for students, staff, and visitors. It provides real-time monitoring, slot reservation, and administration features — making parking management smarter, faster, and more organized.

## 📑 Table of Contents
- [Features](#features)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Setup Instructions](#setup-instructions)
- [Developers](#developers)
- [About the Project](#about-the-project)
- [License](#license)

## Features
- **User Authentication** – Secure login and registration for students and administrators.
- **Real-Time Slot Monitoring** – View available and occupied parking slots instantly.
- **Parking Reservation System** – Reserve slots in advance to reduce congestion.
- **Admin Dashboard** – Manage users, slots, and monitor parking usage analytics.
- **Responsive UI** – Built with React for a smooth and modern experience.
- **API-Driven** – Backend powered by Spring Boot with RESTful endpoints.

## Tech Stack
**Frontend:**
- React.js
- HTML, CSS, JavaScript

**Backend:**
- Spring Boot (Java)
- Maven
- PostgreSQL (Supabase)

**Tools:**
- Visual Studio Code
- IntelliJ IDEA / Eclipse
- Git & GitHub

## Project Structure
```bash
SmartPark/
│
├── backend/                # Spring Boot backend
│   ├── src/
│   ├── pom.xml
│
├── frontend/               # React frontend
│   ├── src/
│   ├── public/
│   ├── package.json
│
├── .gitignore
├── README.md
└── mvnw, mvnw.cmd         # Maven wrappers
```

## Setup Instructions
1️⃣ Clone the repository
```bash
git clone https://github.com/Brentaru/SmartPark.git
cd SmartPark
```

2️⃣ Run the backend
```bash
cd backend
./mvnw spring-boot:run
```
or (Windows):
```bash
mvnw.cmd spring-boot:run
```
Backend runs at: http://localhost:8080

3️⃣ Run the frontend
```bash
cd ../frontend
npm install
npm start
```
Frontend runs at: http://localhost:3000

## Developers

| Name                | Role      |
|---------------------|-----------|  
| Brent Jelson Unabia | Developer |
| Jhon Gil Lauro      | Developer |
| Benz Leo Gamallo    | Developer |

## About the Project
SmartPark was developed as a school-based parking management system to address issues like limited parking, lack of monitoring, and inefficient manual tracking. By integrating modern technologies, it helps streamline the parking process, ensuring convenience and organization within school premises.

## License
This project is developed for academic purposes and is not licensed for commercial use unless otherwise stated.

---
