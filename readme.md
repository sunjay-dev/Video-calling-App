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
cd video-calling-App
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
├── Assests/            # ScreenShots of App
├── README.md
```

---

## 📸 Screenshots

#### Home  
<img src="https://raw.githubusercontent.com/sunjay-dev/Video-calling-App/main/Assets/home.png" alt="Home page screenshot"  width="600"/>

#### Room  
<img src="https://raw.githubusercontent.com/sunjay-dev/Video-calling-App/main/Assets/room.png" alt="Room page screenshot"  width="600"/>

#### 404 Page  
<img src="https://raw.githubusercontent.com/sunjay-dev/Video-calling-App/main/Assets/404.png" alt="404 page screenshot"  width="600"/>

---