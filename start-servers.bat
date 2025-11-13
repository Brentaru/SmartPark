@echo off
echo ================================================
echo SmartPark - Backend Integration Test
echo ================================================
echo.

echo Step 1: Starting Backend Server...
echo Starting Spring Boot application...
echo.

start cmd /k "title SmartPark Backend && cd /d %~dp0 && mvnw.cmd -f backend\pom.xml spring-boot:run"

timeout /t 10 /nobreak >nul

echo.
echo Step 2: Starting Frontend Server...
echo Starting React application...
echo.

start cmd /k "title SmartPark Frontend && cd /d %~dp0frontend && npm start"

echo.
echo ================================================
echo Both servers are starting!
echo ================================================
echo.
echo Backend: http://localhost:8080
echo Frontend: http://localhost:3000
echo H2 Console: http://localhost:8080/h2-console
echo.
echo Please wait for both servers to fully start...
echo Then test the Login and Register functionality.
echo.
echo Press any key to exit this window...
pause >nul
