# SmartPark
SmartPark is a car parking management web-based project for Industry Electives and App Development

## 📋 Table of Contents
- [Prerequisites](#prerequisites)
- [Technology Stack](#technology-stack)
- [Installation](#installation)
- [Running the Application](#running-the-application)
- [Project Structure](#project-structure)
- [Troubleshooting](#troubleshooting)

## 🔧 Prerequisites

Before running SmartPark, ensure you have the following installed on your system:

### Required Software
1. **Java Development Kit (JDK) 17 or higher**
   - Download from: https://www.oracle.com/java/technologies/javase-downloads.html
   - Or use OpenJDK: https://adoptium.net/
   - Verify installation: `java -version`

2. **Node.js 16.x or higher and npm**
   - Download from: https://nodejs.org/
   - Verify installation: `node -v` and `npm -v`

3. **MySQL Database**
   - Download from: https://dev.mysql.com/downloads/mysql/
   - Make sure MySQL server is running
   - Note your database username and password

4. **Maven** (Optional - project includes Maven wrapper)
   - The project includes `mvnw` (Linux/Mac) and `mvnw.cmd` (Windows)
   - If you prefer global Maven: https://maven.apache.org/download.cgi

## 🛠️ Technology Stack

### Backend
- **Spring Boot 3.5.6**
- **Java 17**
- **Spring Data JPA** (for database operations)
- **MySQL** (database)
- **Maven** (dependency management)

### Frontend
- **React 19.2.0**
- **React Router** (for navigation)
- **CSS3** (styling)

## 📦 Installation

### Step 1: Clone the Repository
```bash
git clone https://github.com/Brentaru/SmartPark.git
cd SmartPark
```

### Step 2: Configure Database

1. Create a MySQL database for the project:
```sql
CREATE DATABASE smartpark;
```

2. Update the database configuration in `smartpark/src/main/resources/application.properties`:
```properties
spring.application.name=smartpark

# Database Configuration
spring.datasource.url=jdbc:mysql://localhost:3306/smartpark
spring.datasource.username=YOUR_MYSQL_USERNAME
spring.datasource.password=YOUR_MYSQL_PASSWORD
spring.datasource.driver-class-name=com.mysql.cj.jdbc.Driver

# JPA Configuration
spring.jpa.hibernate.ddl-auto=update
spring.jpa.show-sql=true
spring.jpa.properties.hibernate.dialect=org.hibernate.dialect.MySQLDialect
```

### Step 3: Install Backend Dependencies
```bash
cd smartpark
# On Windows:
mvnw.cmd clean install

# On Linux/Mac:
./mvnw clean install
```

### Step 4: Install Frontend Dependencies (First Time Only)
```bash
cd ui
npm install
```
⚠️ **Note**: You only need to run `npm install` once, or when `package.json` dependencies change.

## 🚀 Running the Application

### Quick Start (Windows PowerShell)

**First time setup?** Make sure you've completed Steps 1-4 above first!

You need **TWO separate PowerShell terminals** running simultaneously:

#### Terminal 1 - Backend Server:
```powershell
cd C:\Users\Administrator\SmartPark\smartpark
.\mvnw.cmd spring-boot:run
```
✅ Backend will start on **http://localhost:8080**
⏳ Wait for the message: "Started SmartparkApplication"

#### Terminal 2 - Frontend Server:
```powershell
cd C:\Users\Administrator\SmartPark\smartpark\ui
npm start
```
✅ Frontend will open automatically at **http://localhost:3000**

### Alternative: Run Both in One Command

In PowerShell, navigate to the project root and run:
```powershell
cd C:\Users\Administrator\SmartPark

# Start backend in background
Start-Job -ScriptBlock { cd C:\Users\Administrator\SmartPark\smartpark; .\mvnw.cmd spring-boot:run }

# Wait for backend to initialize
Start-Sleep -Seconds 15

# Start frontend (this will open your browser)
cd smartpark\ui
npm start
```

### Stopping the Application

**To stop the servers:**
- Press `Ctrl + C` in each terminal window
- Or close the terminal windows

**To stop background jobs (if using the alternative method):**
```powershell
Get-Job | Stop-Job
Get-Job | Remove-Job
```

## 📁 Project Structure

```
SmartPark/
│
├── README.md                          # This file
│
└── smartpark/                         # Main project folder
    │
    ├── mvnw, mvnw.cmd                # Maven wrapper scripts
    ├── pom.xml                        # Maven configuration
    │
    ├── src/
    │   ├── main/
    │   │   ├── java/                  # Backend Java source code
    │   │   │   └── com/appdev/smartpark/smartpark/
    │   │   │       └── SmartparkApplication.java
    │   │   └── resources/
    │   │       └── application.properties  # Backend configuration
    │   │
    │   └── test/                      # Backend tests
    │
    └── ui/                            # Frontend React application
        ├── package.json               # Node dependencies
        ├── public/                    # Static files
        │   └── index.html
        └── src/
            ├── App.js                 # Main React component
            ├── index.js               # Entry point
            └── components/
                ├── Auth/              # Login/Register components
                ├── Dashboard/         # Dashboard component
                └── LandingPage/       # Landing page component
```

## 🐛 Troubleshooting

### Backend Issues

**Problem: Port 8080 is already in use**
- Solution: Kill the process using port 8080 or change the port in `application.properties`:
  ```properties
  server.port=8081
  ```
  Don't forget to update the proxy in `ui/package.json` accordingly.

**Problem: Database connection errors**
- Verify MySQL is running: `mysql -u root -p`
- Check database name, username, and password in `application.properties`
- Ensure the database `smartpark` exists

**Problem: Maven build fails**
- Clear Maven cache: `mvnw.cmd clean`
- Delete `target` folder and rebuild

### Frontend Issues

**Problem: Port 3000 is already in use**
- Solution: Choose a different port when prompted, or kill the process:
  ```bash
  # Windows PowerShell:
  Get-Process -Id (Get-NetTCPConnection -LocalPort 3000).OwningProcess | Stop-Process
  ```

**Problem: npm install fails**
- Clear npm cache: `npm cache clean --force`
- Delete `node_modules` and `package-lock.json`, then run `npm install` again

**Problem: Cannot connect to backend**
- Verify the backend is running on http://localhost:8080
- Check the proxy setting in `ui/package.json` is correct: `"proxy": "http://localhost:8080"`

## 📝 Default Access

Once the application is running:
- **Frontend URL**: http://localhost:3000
- **Backend API**: http://localhost:8080
- Navigate through the landing page to login or register

## 🔄 Development Workflow

1. Make changes to backend code in `smartpark/src/main/java/`
2. Spring Boot DevTools will auto-reload the application
3. Make changes to frontend code in `smartpark/ui/src/`
4. React will hot-reload changes automatically
5. Test your changes in the browser

## 📞 Support

For issues or questions:
- Repository: https://github.com/Brentaru/SmartPark
- Create an issue on GitHub

---

**Happy Coding! 🚗💨**
