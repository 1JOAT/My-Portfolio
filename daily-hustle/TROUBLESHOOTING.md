# Troubleshooting Guide for Daily Hustle App

## MongoDB Connection Issues

If you're having trouble connecting to MongoDB Atlas, follow these steps:

### 1. Get the Correct Connection String

1. Log in to MongoDB Atlas (https://cloud.mongodb.com)
2. Click on your cluster
3. Click the "Connect" button
4. Select "Connect your application"
5. Make sure "Node.js" is selected as the driver
6. Copy the connection string
7. Replace `<username>` and `<password>` with your actual MongoDB Atlas credentials
8. Add the database name after the hostname: `mongodb+srv://username:password@cluster0.xxxxx.mongodb.net/dailyhustle?retryWrites=true&w=majority`

### 2. Update .env File

Ensure your .env file has the correct format:

```
PORT=5050
MONGODB_URI=mongodb+srv://your-username:your-password@your-cluster.mongodb.net/dailyhustle?retryWrites=true&w=majority
```

Make sure there are no trailing spaces or line breaks after the connection string.

### 3. Check Network Access in MongoDB Atlas

1. In MongoDB Atlas, go to "Network Access" in the left sidebar
2. Make sure your current IP address is in the list of allowed IPs
3. If not, click "Add IP Address" and add your current IP (or "Allow Access from Anywhere" for testing)

### 4. Check Database User Credentials

1. In MongoDB Atlas, go to "Database Access" in the left sidebar
2. Ensure you have a user with read/write permissions
3. If needed, create a new user and update your connection string

### 5. Testing the Connection

You can test the connection using a terminal command:

```bash
node -e "const mongoose = require('mongoose'); mongoose.connect('your-connection-string').then(() => console.log('Connected!')).catch(err => console.error('Failed:', err))"
```

## App Styling Issues

The app now has improved styling with SafeAreaView for better display on modern devices with notches and home indicators.

### Make sure you have installed all necessary dependencies:

```bash
npm install react-native-safe-area-context
```

### API Connection Issues

If you're testing on a physical device:

1. Find your computer's IP address:
   - On Windows: Run `ipconfig` in Command Prompt
   - On macOS: Run `ifconfig` in Terminal
   - On Linux: Run `ip addr` in Terminal

2. Update both API_URL and SOCKET_URL in your code to use this IP:
   - In `src/api/api.ts`
   - In `src/api/socket.ts`

3. Make sure your device and computer are on the same network

4. Check if any firewall is blocking port 5050 