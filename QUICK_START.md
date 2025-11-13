# 🚀 Quick Start Guide - Backend Integration

## ⚡ Start Everything

```powershell
# Run this from the SmartPark directory
.\start-servers.bat
```

Wait for both servers to start (~30 seconds)

---

## 🌐 Access URLs

- **Frontend:** http://localhost:3000
- **Backend API:** http://localhost:8080/api
- **H2 Console:** http://localhost:8080/h2-console

---

## 🧪 Quick Test

### 1. Register a New User
1. Go to http://localhost:3000
2. Click "Sign up"
3. Fill the form:
   ```
   Student ID: 21-1234-567
   First Name: Test
   Last Name: User
   Email: test@cit.edu
   Contact: 09123456789
   Password: Test1234
   Confirm: Test1234
   ```
4. Click "Create Account"
5. ✅ Should redirect to Dashboard

### 2. Test Login
1. Logout (if logged in)
2. Click "Sign in"
3. Enter:
   ```
   ID: test@cit.edu
   Password: Test1234
   ```
4. Click "Sign In"
5. ✅ Should redirect to Dashboard

---

## 📡 Test with cURL (Optional)

### Register:
```powershell
curl -X POST http://localhost:8080/api/auth/register `
  -H "Content-Type: application/json" `
  -d '{\"firstName\":\"John\",\"lastName\":\"Doe\",\"email\":\"john@test.com\",\"contactNumber\":\"09123456789\",\"password\":\"Pass123\",\"role\":\"student\"}'
```

### Login:
```powershell
curl -X POST http://localhost:8080/api/auth/login `
  -H "Content-Type: application/json" `
  -d '{\"id\":\"john@test.com\",\"password\":\"Pass123\"}'
```

---

## 🔍 Check Database

1. Go to http://localhost:8080/h2-console
2. Use these settings:
   ```
   JDBC URL: jdbc:h2:mem:smartparkdb
   User Name: sa
   Password: (leave empty)
   ```
3. Click "Connect"
4. Run query:
   ```sql
   SELECT * FROM users;
   ```

---

## ❌ Stop Servers

Just close the terminal windows or press `Ctrl+C` in each terminal.

---

## 🐛 Issues?

### Backend not starting?
- Check Java 17+ installed: `java -version`
- Check port 8080 is free

### Frontend not starting?
- Run: `npm install` in frontend folder
- Check port 3000 is free

### Can't login?
- Use EMAIL (not student ID) for login
- Backend logs show detailed errors

---

## ✅ Success Indicators

- ✅ Backend starts with "Started SmartparkApplication"
- ✅ Frontend opens browser to localhost:3000
- ✅ Registration creates user in database
- ✅ Login redirects to dashboard
- ✅ User data appears in H2 console
- ✅ Session persists after page refresh

---

**Need Help?** Check `IMPLEMENTATION_SUMMARY.md` for full details.
