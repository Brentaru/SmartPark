# Backend Integration Guide - Login & Register

## ✅ Completed Changes

### Backend Changes:
1. **Created AuthController.java** (`backend/src/main/java/com/appdev/smartpark/controller/AuthController.java`)
   - `/api/auth/register` - POST endpoint for user registration
   - `/api/auth/login` - POST endpoint for user login
   - Properly handles frontend's field naming (id, firstName, lastName, etc.)
   - Returns consistent JSON responses with `success`, `user`, and `error` fields

2. **Created CorsConfig.java** (`backend/src/main/java/com/appdev/smartpark/config/CorsConfig.java`)
   - Enables CORS for frontend communication
   - Allows requests from `http://localhost:3000` and `http://localhost:3001`

### Frontend Changes:
1. **Updated AuthContext.jsx** (`frontend/src/context/AuthContext.jsx`)
   - Replaced mock authentication with real Axios API calls
   - Connects to backend at `http://localhost:8080/api`
   - Stores user data in `localStorage` for session persistence
   - Proper error handling for network requests

2. **Login.jsx & Register.jsx** (No changes needed)
   - Already properly configured to work with the new AuthContext
   - Field validation and error display working correctly

---

## 🚀 How to Test

### 1. Start Backend Server
```powershell
cd backend
./mvnw spring-boot:run
```
Or on Windows:
```powershell
cd backend
.\mvnw.cmd spring-boot:run
```

Backend will start on `http://localhost:8080`

### 2. Start Frontend Server
```powershell
cd frontend
npm start
```

Frontend will start on `http://localhost:3000`

### 3. Test Registration Flow

1. Navigate to Register page
2. Fill in the form:
   - Student ID: `21-1234-567` (or any format)
   - First Name: `John`
   - Last Name: `Doe`
   - Email: `john.doe@cit.edu`
   - Contact: `09123456789`
   - Password: `Password123`
   - Confirm Password: `Password123`
3. Click "Create Account"
4. You should be automatically logged in and redirected to Dashboard

### 4. Test Login Flow

1. Navigate to Login page
2. Enter credentials:
   - ID: `john.doe@cit.edu` (use the email from registration)
   - Password: `Password123`
3. Click "Sign In"
4. You should be logged in and redirected to Dashboard

---

## 🔍 API Endpoints

### Register Endpoint
**POST** `/api/auth/register`

**Request Body:**
```json
{
  "firstName": "John",
  "lastName": "Doe",
  "email": "john.doe@cit.edu",
  "contactNumber": "09123456789",
  "password": "Password123",
  "role": "student"
}
```

**Success Response (201 Created):**
```json
{
  "success": true,
  "user": {
    "id": 1,
    "userID": 1,
    "firstName": "John",
    "lastName": "Doe",
    "email": "john.doe@cit.edu",
    "role": "student",
    "contact": "09123456789"
  },
  "message": "Registration successful"
}
```

**Error Response (409 Conflict):**
```json
{
  "success": false,
  "error": "Email already exists"
}
```

---

### Login Endpoint
**POST** `/api/auth/login`

**Request Body:**
```json
{
  "id": "john.doe@cit.edu",
  "password": "Password123"
}
```

**Success Response (200 OK):**
```json
{
  "success": true,
  "user": {
    "id": 1,
    "userID": 1,
    "firstName": "John",
    "lastName": "Doe",
    "email": "john.doe@cit.edu",
    "role": "student",
    "contact": "09123456789"
  },
  "message": "Login successful"
}
```

**Error Response (401 Unauthorized):**
```json
{
  "success": false,
  "error": "Invalid credentials"
}
```

---

## 🔐 Session Management

- User data is stored in `localStorage` after successful login/registration
- Session persists across page refreshes
- Logout clears `localStorage` and resets auth state
- No JWT tokens implemented yet (passwords are stored in plain text for development)

---

## ⚠️ Security Notes (For Production)

Current implementation is for **DEVELOPMENT ONLY**. Before production:

1. **Hash passwords** - Use BCrypt or similar in Spring Boot
2. **Implement JWT tokens** - For secure stateless authentication
3. **Add input validation** - Server-side validation for all fields
4. **Rate limiting** - Prevent brute force attacks
5. **HTTPS** - All production traffic should use SSL/TLS
6. **Remove wildcard CORS** - Restrict to specific frontend domain

---

## 🛠️ Troubleshooting

### Backend won't start?
- Check if port 8080 is available
- Verify Java 17+ is installed: `java -version`
- Check Maven wrapper permissions

### Frontend can't connect to backend?
- Verify backend is running on `http://localhost:8080`
- Check browser console for CORS errors
- Verify `REACT_APP_API_URL` is not set to a different URL

### "Email already exists" error?
- H2 database is in-memory and resets on server restart
- Restart backend to clear database
- Or use H2 console: `http://localhost:8080/h2-console`

### Login fails after registration?
- Check that you're using the **email** as the login ID
- Verify password matches what was entered during registration
- Check backend logs for detailed error messages

---

## 📊 Database Access (H2 Console)

Access H2 Console at: `http://localhost:8080/h2-console`

**Connection Details:**
- JDBC URL: `jdbc:h2:mem:smartparkdb`
- User Name: `sa`
- Password: (leave empty)

**View registered users:**
```sql
SELECT * FROM users;
```

---

## ✨ Features Implemented

✅ User Registration with validation
✅ User Login with credential verification
✅ Session persistence with localStorage
✅ Automatic redirect after login/register
✅ Error handling and user feedback
✅ CORS configuration for frontend-backend communication
✅ Field mapping between frontend and backend
✅ Role-based user creation (defaults to 'student')

---

## 🎯 Next Steps (Optional Enhancements)

1. Add JWT token-based authentication
2. Implement password hashing (BCrypt)
3. Add "Remember Me" functionality
4. Implement "Forgot Password" feature
5. Add email verification
6. Implement refresh tokens
7. Add user profile update functionality
8. Add logout endpoint on backend

---

## 📝 Notes

- Backend uses H2 in-memory database (data resets on restart)
- Frontend validation runs before backend submission
- All API responses follow consistent format: `{ success, user/error, message }`
- User roles: "student", "faculty", "guard", "admin"
