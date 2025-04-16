# Daily Hustle - React Native App

A mobile app for freelancers to track tasks, chat in real-time, and receive push notifications.

## Features

- Task Management: Create, organize, and track your tasks
- Real-time Chat: Communicate with team members instantly
- Push Notifications: Get alerts for task deadlines and new messages
- MongoDB Integration: All data is stored persistently on MongoDB Atlas

## Tech Stack

- React Native with TypeScript
- Socket.IO for real-time communication
- Expo Push Notifications
- MongoDB Atlas (free tier)
- Node.js/Express backend

## Installation

1. Clone this repository
2. Install dependencies:

```bash
npm install
```

## MongoDB Atlas Setup

1. Create a free MongoDB Atlas account at https://www.mongodb.com/cloud/atlas
2. Create a new cluster and get your connection string
3. Update the `.env` file with your MongoDB connection string:

```
MONGODB_URI=mongodb+srv://your-username:your-password@your-cluster.mongodb.net/daily-hustle
```

## Running the App

1. Start the Express server:

```bash
node server.js
```

2. In a separate terminal, start the React Native app:

```bash
npm start
```

3. Scan the QR code with the Expo Go app on your mobile device

## Deploying

### Free Deployment Options

1. Deploy the backend on a free service like Render or Railway
2. Use Expo's free tier for app distribution
3. Generate a free APK for Android:

```bash
expo build:android -t apk
```

## Customization

1. Change the developer name in `src/screens/AboutScreen.tsx`
2. Update the color scheme if desired
3. Add your own MongoDB sample data

## License

This project is open source and available under the MIT License. 