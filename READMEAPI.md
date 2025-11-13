# SmartPark API Module

Simple and reusable API module for calling backend endpoints.

## 📖 How to Use

### Import the API you need:

```javascript
import { userAPI, parkingSlotAPI, vehicleAPI } from '../api/api';
```

## 🔐 User API Examples

### Register User
```javascript
const userData = {
  studentId: '21-1234-567',
  firstName: 'John',
  lastName: 'Doe',
  email: 'john@cit.edu',
  password: 'Test1234',
  role: 'student',
  contactNumber: '09123456789'
};

const result = await userAPI.register(userData);
if (result.success) {
  console.log('User registered:', result.data);
}
```

### Login User
```javascript
const result = await userAPI.login('21-1234-567', 'Test1234');
if (result.success) {
  console.log('Login successful:', result.data);
}
```

### Get All Users
```javascript
const result = await userAPI.getAllUsers();
if (result.success) {
  console.log('Users:', result.data);
}
```

## 🅿️ Parking Slot API Examples

### Get All Slots
```javascript
const result = await parkingSlotAPI.getAllSlots();
if (result.success) {
  console.log('All slots:', result.data);
}
```

### Get Available Slots
```javascript
const result = await parkingSlotAPI.getAvailableSlots();
if (result.success) {
  console.log('Available slots:', result.data);
}
```

### Get Slots by Area
```javascript
const result = await parkingSlotAPI.getSlotsByArea(1);
if (result.success) {
  console.log('Slots in area 1:', result.data);
}
```

## 🚗 Vehicle API Examples

### Get User's Vehicles
```javascript
const result = await vehicleAPI.getVehiclesByUser(userId);
if (result.success) {
  console.log('User vehicles:', result.data);
}
```

### Create Vehicle
```javascript
const vehicleData = {
  licensePlate: 'ABC1234',
  vehicleType: 'Car',
  color: 'Red',
  model: 'Toyota Corolla',
  userId: 1
};

const result = await vehicleAPI.createVehicle(vehicleData);
if (result.success) {
  console.log('Vehicle created:', result.data);
}
```

## 📝 Parking Record API Examples

### Create Parking Record (Park a Vehicle)
```javascript
const recordData = {
  userId: 1,
  vehicleId: 1,
  slotId: 5,
  entryTime: new Date().toISOString()
};

const result = await parkingRecordAPI.createRecord(recordData);
if (result.success) {
  console.log('Parking started:', result.data);
}
```

### Get User's Parking Records
```javascript
const result = await parkingRecordAPI.getRecordsByUser(userId);
if (result.success) {
  console.log('User records:', result.data);
}
```

### End Parking Session
```javascript
const result = await parkingRecordAPI.endSession(recordId);
if (result.success) {
  console.log('Parking ended:', result.data);
}
```

## 📍 Parking Area API Examples

### Get All Areas
```javascript
const result = await parkingAreaAPI.getAllAreas();
if (result.success) {
  console.log('All areas:', result.data);
}
```

### Create Parking Area
```javascript
const areaData = {
  areaName: 'Main Parking Lot',
  capacity: 50,
  location: 'Building A'
};

const result = await parkingAreaAPI.createArea(areaData);
if (result.success) {
  console.log('Area created:', result.data);
}
```

## 🔍 Response Format

All API calls return an object with this structure:

### Success Response:
```javascript
{
  success: true,
  data: { /* your data here */ }
}
```

### Error Response:
```javascript
{
  success: false,
  error: "Error message here"
}
```

## 💡 Tips

1. Always check `result.success` before using `result.data`
2. Handle errors gracefully with try-catch blocks
3. All functions are async, so use `await` or `.then()`
4. The API automatically formats requests for your backend

## 🎯 Available APIs

- `userAPI` - User authentication and management
- `parkingSlotAPI` - Parking slot operations
- `parkingAreaAPI` - Parking area management
- `parkingRecordAPI` - Parking records/sessions
- `vehicleAPI` - Vehicle management
- `guardAPI` - Guard/security operations

Happy coding! 🚀
