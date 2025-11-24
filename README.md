# 🚑 AmbulanceJamii

### AI-Powered Emergency Response Optimization System

_MERN Stack | SDG 3: Good Health & Well-Being | Final Year Project_

**Live Demo:** https://ambulancejamii.netlify.app/

## 📌 Overview

AmbulanceJamii is an AI-powered emergency dispatch system designed to optimize ambulance response times in Kenya.  
The system uses **AI severity prediction**, **geolocation**, and **MERN stack technologies** to match patients with the nearest available ambulance and recommend hospitals with available bed capacity.

This project directly supports **SDG 3 – Good Health & Well-Being** by improving emergency healthcare coordination.

## 🧠 How the System Works (Step-by-Step)

### 🔹 1. User Initiates an Emergency Request

A user fills in an emergency form on the React frontend. The user's location is detected using HTML5 Geolocation.

### 🔹 2. Request Sent to Backend (Express API)

A POST request is sent to `/api/requests` containing patient details.

### 🔹 3. Backend Performs AI Severity Classification

The backend uses a Hugging Face NLP model to classify severity as HIGH, MEDIUM, or LOW.

### 🔹 4. Data Saved in MongoDB

The emergency request is stored in a MongoDB `requests` collection.

### 🔹 5. System Finds Nearest Ambulance

Using the Haversine formula, the system finds the nearest available ambulance.

### 🔹 6. Ambulance Assignment

Dispatcher assigns the nearest ambulance. Database updates status accordingly.

### 🔹 7. Hospital Load Balancing

The system identifies hospitals with available bed capacity.

### 🔹 8. Real-Time Dashboards

Different dashboards show real‑time data for dispatchers, drivers, and hospitals.

### 🔹 9. Completion & Analytics Logging

When a case is completed, analytics are updated for reporting.

## 🧱 Tech Stack (MERN + AI)

- **Frontend:** React.js, TypeScript, TailwindCSS
- **Backend:** Node.js, Express.js
- **Database:** MongoDB, Mongoose
- **AI:** Hugging Face NLP API
- **Other:** Google Geolocation API, GitHub, Gamma

## 🧪 Installation & Setup

### 1️⃣ Clone the Repository

```bash
git clone https://github.com/your-username/AmbulanceJamii.git
cd AmbulanceJamii
```

### 2️⃣ Install Dependencies

#### Backend:

```bash
cd backend
npm install
```

#### Frontend:

```bash
cd frontend
npm install
```

### 3️⃣ Configure Environment Variables

Create a `.env` file inside **backend**:

```
PORT=5000
MONGO_URI=your_mongodb_connection_string
HUGGINGFACE_API_KEY=your_hf_api_key
HF_MODEL=distilbert-base-uncased-finetuned-sst-2-english
```

### 4️⃣ Run the Backend

```bash
npm run dev
```

### 5️⃣ Run the Frontend

```bash
npm start
```

## 📊 Monetization Strategy

- SaaS subscription
- Pay‑per‑ambulance licensing
- Government integrations
- Premium analytics

## 🌍 SDG Impact – SDG 3

Improves emergency outcomes and reduces preventable deaths.

## 📆 Current Progress

✔ Architecture completed  
✔ UI mockups created  
✔ AI logic integrated  
⏳ Backend integration ongoing

## 🛤 Future Improvements

- ML route optimization
- Live GPS tracking
- IoT vitals
- National scaling

## 👤 Author

**Brian Mbura**  
GitHub: https://github.com/brianmbura
