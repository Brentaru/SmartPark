# SmartPark Authentication Flow

## 🔄 Registration Flow

```
┌─────────────────┐
│   User Opens    │
│  Register Page  │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│  User Fills     │
│  Register Form  │
│  - Student ID   │
│  - First Name   │
│  - Last Name    │
│  - Email        │
│  - Contact      │
│  - Password     │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│   Click Submit  │
└────────┬────────┘
         │
         ▼
┌─────────────────────────────┐
│  Register.jsx               │
│  - Validates input          │
│  - Calls AuthContext        │
│    register(userData)       │
└────────┬────────────────────┘
         │
         ▼
┌─────────────────────────────┐
│  AuthContext.jsx            │
│  - Sends POST request to:   │
│    /api/auth/register       │
│  - Uses Axios               │
└────────┬────────────────────┘
         │
         ▼
┌─────────────────────────────┐
│  Backend: AuthController    │
│  @PostMapping("/register")  │
│  - Validates fields         │
│  - Checks duplicate email   │
│  - Creates User entity      │
└────────┬────────────────────┘
         │
         ▼
┌─────────────────────────────┐
│  UserService                │
│  - registerUser(user)       │
│  - Calls UserRepository     │
└────────┬────────────────────┘
         │
         ▼
┌─────────────────────────────┐
│  H2 Database                │
│  - Saves user to 'users'    │
│    table                    │
│  - Auto-generates userID    │
└────────┬────────────────────┘
         │
         ▼
┌─────────────────────────────┐
│  Response (201 Created)     │
│  {                          │
│    success: true,           │
│    user: {...},             │
│    message: "..."           │
│  }                          │
└────────┬────────────────────┘
         │
         ▼
┌─────────────────────────────┐
│  AuthContext.jsx            │
│  - Receives response        │
│  - Stores user in state     │
│  - Saves to localStorage    │
│  - Returns success          │
└────────┬────────────────────┘
         │
         ▼
┌─────────────────────────────┐
│  Register.jsx               │
│  - Shows success message    │
│  - Redirects to Dashboard   │
└─────────────────────────────┘
```

---

## 🔐 Login Flow

```
┌─────────────────┐
│   User Opens    │
│   Login Page    │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│  User Enters    │
│  Credentials    │
│  - ID (email)   │
│  - Password     │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│   Click Submit  │
└────────┬────────┘
         │
         ▼
┌─────────────────────────────┐
│  Login.jsx                  │
│  - Validates input          │
│  - Calls AuthContext        │
│    login(id, password)      │
└────────┬────────────────────┘
         │
         ▼
┌─────────────────────────────┐
│  AuthContext.jsx            │
│  - Sends POST request to:   │
│    /api/auth/login          │
│  - Uses Axios               │
└────────┬────────────────────┘
         │
         ▼
┌─────────────────────────────┐
│  Backend: AuthController    │
│  @PostMapping("/login")     │
│  - Validates credentials    │
│  - Calls UserService        │
└────────┬────────────────────┘
         │
         ▼
┌─────────────────────────────┐
│  UserService                │
│  - login(email, password)   │
│  - Queries UserRepository   │
│  - Verifies password        │
└────────┬────────────────────┘
         │
         ▼
┌─────────────────────────────┐
│  H2 Database                │
│  - Finds user by email      │
│  - Returns user data        │
└────────┬────────────────────┘
         │
         ▼
┌─────────────────────────────┐
│  Response (200 OK)          │
│  {                          │
│    success: true,           │
│    user: {...},             │
│    message: "..."           │
│  }                          │
└────────┬────────────────────┘
         │
         ▼
┌─────────────────────────────┐
│  AuthContext.jsx            │
│  - Receives response        │
│  - Stores user in state     │
│  - Saves to localStorage    │
│  - Returns success          │
└────────┬────────────────────┘
         │
         ▼
┌─────────────────────────────┐
│  Login.jsx                  │
│  - Shows welcome message    │
│  - Redirects to Dashboard   │
└─────────────────────────────┘
```

---

## 💾 Session Persistence Flow

```
┌─────────────────────────────┐
│  User Logs In Successfully  │
└────────┬────────────────────┘
         │
         ▼
┌─────────────────────────────┐
│  AuthContext                │
│  - Stores user in state     │
│  - Calls localStorage       │
│    .setItem('user', JSON)   │
└────────┬────────────────────┘
         │
         ▼
┌─────────────────────────────┐
│  Browser localStorage       │
│  {                          │
│    user: {                  │
│      userID: 1,             │
│      firstName: "...",      │
│      email: "...",          │
│      role: "student"        │
│    }                        │
│  }                          │
└─────────────────────────────┘
         │
         ▼
┌─────────────────────────────┐
│  User Refreshes Page        │
└────────┬────────────────────┘
         │
         ▼
┌─────────────────────────────┐
│  AuthContext useEffect      │
│  - Runs on mount            │
│  - Checks localStorage      │
│  - Finds existing user      │
│  - Sets currentUser state   │
└────────┬────────────────────┘
         │
         ▼
┌─────────────────────────────┐
│  User Remains Logged In     │
│  ✅ No re-login required    │
└─────────────────────────────┘
```

---

## 🚪 Logout Flow

```
┌─────────────────────────────┐
│  User Clicks Logout         │
└────────┬────────────────────┘
         │
         ▼
┌─────────────────────────────┐
│  Component calls            │
│  AuthContext.logout()       │
└────────┬────────────────────┘
         │
         ▼
┌─────────────────────────────┐
│  AuthContext.jsx            │
│  - Sets currentUser to null │
│  - Clears error state       │
│  - Removes from localStorage│
└────────┬────────────────────┘
         │
         ▼
┌─────────────────────────────┐
│  User Logged Out            │
│  - Redirected to Landing    │
│  - Session cleared          │
└─────────────────────────────┘
```

---

## 🔧 Technology Stack

```
┌─────────────────────────────────────────────────┐
│                   FRONTEND                      │
│  ┌──────────────────────────────────────────┐  │
│  │  React Components                        │  │
│  │  - Login.jsx                             │  │
│  │  - Register.jsx                          │  │
│  │  - Dashboard.jsx                         │  │
│  └────────────────┬─────────────────────────┘  │
│                   │                             │
│  ┌────────────────▼─────────────────────────┐  │
│  │  AuthContext (Context API)               │  │
│  │  - State Management                      │  │
│  │  - Authentication Logic                  │  │
│  └────────────────┬─────────────────────────┘  │
│                   │                             │
│  ┌────────────────▼─────────────────────────┐  │
│  │  Axios HTTP Client                       │  │
│  │  - API Requests                          │  │
│  │  - Error Handling                        │  │
│  └────────────────┬─────────────────────────┘  │
└───────────────────┼─────────────────────────────┘
                    │
                    │ HTTP POST/GET
                    │ JSON payloads
                    │
┌───────────────────▼─────────────────────────────┐
│                   BACKEND                       │
│  ┌──────────────────────────────────────────┐  │
│  │  AuthController                          │  │
│  │  - /api/auth/register                    │  │
│  │  - /api/auth/login                       │  │
│  └────────────────┬─────────────────────────┘  │
│                   │                             │
│  ┌────────────────▼─────────────────────────┐  │
│  │  UserService                             │  │
│  │  - Business Logic                        │  │
│  │  - Validation                            │  │
│  └────────────────┬─────────────────────────┘  │
│                   │                             │
│  ┌────────────────▼─────────────────────────┐  │
│  │  UserRepository (JPA)                    │  │
│  │  - Database Queries                      │  │
│  │  - CRUD Operations                       │  │
│  └────────────────┬─────────────────────────┘  │
│                   │                             │
│  ┌────────────────▼─────────────────────────┐  │
│  │  H2 Database (In-Memory)                 │  │
│  │  - users table                           │  │
│  │  - Auto-generated IDs                    │  │
│  └──────────────────────────────────────────┘  │
└─────────────────────────────────────────────────┘
```

---

## 📊 Data Flow

```
Frontend Form → AuthContext → Axios → Spring Boot Controller
     ↓                                         ↓
localStorage ← JSON Response ← Service ← Repository
                                              ↓
                                        H2 Database
```

---

## 🔑 Key Integration Points

1. **API Base URL:** `http://localhost:8080/api`
2. **Register Endpoint:** `/auth/register`
3. **Login Endpoint:** `/auth/login`
4. **Request Format:** JSON with proper field names
5. **Response Format:** `{ success, user, error, message }`
6. **Session Storage:** localStorage (client-side)
7. **CORS:** Enabled for localhost:3000
8. **Database:** H2 in-memory (resets on restart)

---

## ✅ Working Features

✅ User registration with validation
✅ User login with authentication
✅ Session persistence
✅ Error handling
✅ Auto-redirect after auth
✅ Logout functionality
✅ Role-based access
✅ CORS enabled
✅ Duplicate email prevention
✅ Password excluded from responses
