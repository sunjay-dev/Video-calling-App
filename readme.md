# 📞 WebRTC Video Calling App

A real-time one-on-one video calling application built using **React**, **WebRTC**, **Socket.io**, and **Node.js**. Features include camera/audio toggle, room link sharing, negotiation handling, and call ending.

---

## 🚀 Features

- Peer-to-peer video calling using WebRTC
- Signaling via Socket.io
- Auto negotiation handling
- Toggle camera/microphone
- Shareable joining link
- Clean React-based UI
- Code base joining
---

## 🛠️ Tech Stack

- **Frontend:** React, Tailwind CSS
- **Backend:** Node.js, Express, Socket.io, Redis
- **Other:** WebRTC
- **UI Components:** reactVideoplayer, Material UI 

---

## 📦 Installation

### 1. Clone the repository

```bash
git clone https://github.com/sunjay-dev/Video-calling-App
cd video-call-app
````

### 2. Install dependencies

#### Backend (Node.js + Socket.io)

```bash
cd Backend
npm install
```

#### Frontend (React)

```bash
cd Frontend
npm install
```

---

## ▶️ Running Locally

### Start Backend

```bash
cd Backend
```
#### Create .env file
```bash
REDIS_HOST=REDIS_HOST_URI
REDIS_PASSWORD=REDIS_PASSWORD
REDIS_PORT=REDIS_PORT
PORT=PORT
```
```bash
npm start
```

### Start Frontend

```bash
cd Frontend
```
#### Create .env file
```bash
VITE_BACKEND_URL=BACKEND_URL
```
```bash
npm run dev
```

Open `http://localhost:5173` in your browser.

---

## 🌐 How It Works

1. A user creates a room.
2. The room link is shared with another user.
3. When the second user joins, WebRTC offer/answer exchange happens via Socket.io.
4. Media streams are transferred directly peer-to-peer.
5. Automatic re-negotiation is handled as needed.

---


## 🔐 Permissions

This app requires access to:

* 📷 Camera
* 🎤 Microphone

Make sure to allow permissions in your browser.

---

## 📁 Project Structure

```
/
├── Frontend/               # React frontend
│   └── components/       # UI components
│   └── context/          # Socket context
│   └── services/         # Peer (WebRTC) logic
│   └── App.jsx           
│   └── main.jsx          
│
├── Backend/               # Express + Socket.io backend
│   └── App.js  
|   └── server.js          
│   └── socket.js 
|
├── README.md
```

---

## 📸 Screenshots
#### Home
<img src="https://github.com/user-attachments/assets/5c17507d-8634-4326-99e9-4fbba025853e" width= "600">
<br />

#### Room 
<img src="https://github.com/user-attachments/assets/e7d67f64-3933-44e1-b60f-5d43d6afd416" width= "600">
<br />

#### 404 Page 
<img src="https://github.com/user-attachments/assets/889bff7b-cca2-4560-9cbb-ace71be46cdc" width= "600">

---
