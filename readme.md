# Community Learning Hub

![MERN Stack](https://img.shields.io/badge/Stack-MERN-brightgreen)
![License](https://img.shields.io/badge/License-MIT-blue)

A full-stack community-driven platform for discovering educational content, engaging with curated feeds, and managing learning resources using the MERN stack (MongoDB, Express.js, React.js, Node.js).

---

## ✨ Features

### 🔒 Authentication System
- JWT-based user registration/login
- Role-based access control (User/Moderator/Admin)
- Protected routes and API endpoints

### 🪙 Credit Points System
- Earn credits for content engagement
- Spend credits to unlock premium resources
- Track transactions with detailed history
- Admin-managed credit rules

### 📰 Smart Feed Aggregator
- Real-time content aggregation from:
  - Twitter/X API
  - Reddit API
  - LinkedIn API
- Content cards with previews and metadata
- Save/Share/Report content functionality

### 🛠️ Admin Dashboard
- User management and role assignment
- Content moderation system
- Activity statistics and analytics
- Report resolution system

---

## 🛠️ Tech Stack

**Frontend:**
- React.js
- Tailwind CSS
- React Router
- Axios

**Backend:**
- Node.js
- Express.js
- MongoDB
- JWT Authentication

**Services:**
- Twitter API v2
- Reddit API
- LinkedIn API
- Redis Caching

---

## 🚀 Installation

### Prerequisites
- Node.js v18+
- MongoDB Atlas cluster
- Twitter/Reddit API credentials

## Backend Setup

```bash
cd backend
npm install
```

Create a `.env` file in `/backend` with the following content:

```
# MongoDB
MONGO_URI=your_mongodb_atlas_uri

# Auth
JWT_SECRET=your_jwt_secret_key
NODE_ENV=development
PORT=5000

# Twitter API
TWITTER_API_KEY=your_twitter_api_key
TWITTER_API_SECRET=your_twitter_api_secret
TWITTER_ACCESS_TOKEN=your_twitter_access_token
TWITTER_ACCESS_SECRET=your_twitter_access_secret

# Reddit API
REDDIT_CLIENT_ID=your_reddit_client_id
REDDIT_CLIENT_SECRET=your_reddit_client_secret
REDDIT_REFRESH_TOKEN=your_reddit_refresh_token
REDDIT_USER_AGENT=your_reddit_user_agent

# LinkedIn API
LINKEDIN_ACCESS_TOKEN=your_linkedin_access_token
LINKEDIN_COMPANY_ID=your_linkedin_company_id

# Redis Config
REDIS_HOST=your_redis_host
REDIS_PORT=6379
REDIS_PASSWORD=your_redis_password
```

## Frontend Setup

```bash
cd frontend
npm install
```

Create a `.env` file in `/frontend` with the following content:

```
REACT_APP_API_URL=http://localhost:5000
```
## ▶️ Running Locally

Start Backend:

```bash
cd backend
npm run dev
```

Start Frontend:

```bash
cd frontend
npm start
```

**Application URLs:**

- Backend: http://localhost:5000  
- Frontend: http://localhost:3000

## ☁️ Deployment

**(GCP):**

- Create Google Cloud Project  
- Deploy to Cloud Run/App Engine  
- Set environment variables in GCP console


**Database:**

- Configure MongoDB Atlas with proper IP whitelisting



## 🤝 Contributing
1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

---

## 📄 License
Distributed under the MIT License. See `LICENSE` for more information.

---