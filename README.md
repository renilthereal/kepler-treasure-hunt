# K.E.P.L.E.R Treasure Hunt 🚀

> Online Physics Treasure Hunt for World Science Day 2025

Organized by **Indian Network of Physics Students (INPS)** for K.E.P.L.E.R - World Science Day 2025.

## 🎯 Overview

This is a secure, time-bound online physics treasure hunt system with:
- **94 registered participants** (first name login, phone password)
- **10 challenging physics questions**
- **60-minute timer** with auto-submit
- **Anti-cheat mechanisms** (tab switching detection, right-click disable, text selection blocking)
- **Perfect score reward**: Automatic redirect to Google Meet for live event
- **Unlimited attempts** until perfect score achieved
- **Real-time flagging** system for suspicious behavior

## 🏗️ Project Structure

```
kepler-treasure-hunt/
├── server.js              # Express server with auth & APIs
├── database.js            # SQLite database setup
├── init-db.js            # Populate DB with 94 participants
├── questions.json        # 10 physics questions with answers
├── package.json          # Dependencies
├── .env.example          # Environment variables template
├── treasure-hunt.db      # SQLite database (generated)
└── public/              # Frontend files (TO BE CREATED)
    ├── index.html       # Login page
    ├── quiz.html        # Main quiz interface
    ├── styles.css       # Styling
    ├── quiz.js          # Quiz logic & timer
    └── anti-cheat.js    # Security measures
```

## ⚡ Quick Start

### Prerequisites
- Node.js 18+ 
- npm or yarn

### Installation

```bash
# Clone the repository
git clone https://github.com/renilthereal/kepler-treasure-hunt.git
cd kepler-treasure-hunt

# Install dependencies
npm install

# Create environment file
cp .env.example .env

# Initialize database with participants
node init-db.js

# Start the server
npm start
```

Server will run on **http://localhost:3000**

## 🔐 Login Credentials

**Username**: First name only (case-insensitive)
**Password**: 10-digit phone number

**Example**:
- Username: `abdul` (for Abdul Minhaj)
- Password: `8076374618`

## 🎮 How It Works

1. **Login**: Participant enters first name + phone number
2. **Quiz Page**: All 10 questions displayed at once
3. **Timer**: 60-minute countdown starts automatically
4. **Answer**: Fill in all 10 answers (alphanumeric supported)
5. **Submit**: System validates answers
6. **Results**:
   - ✅ **Perfect (10/10)**: Redirect to Google Meet
   - ❌ **Partial**: Show score, allow retry

## 🛡️ Security Features

### Anti-Cheat Mechanisms
- ✅ Right-click disabled
- ✅ Text selection blocked
- ✅ Developer tools shortcuts disabled (F12, Ctrl+Shift+I, etc.)
- ✅ Copy/paste disabled
- ✅ Tab switching detection with flagging
- ✅ Page visibility tracking
- ✅ Automatic flagging on suspicious behavior

### Other Security
- Helmet.js for HTTP security headers
- Rate limiting (100 requests per 15 minutes)
- Session-based authentication
- CSRF protection
- SQL injection prevention

## 📊 Database Schema

### Users Table
```sql
CREATE TABLE users (
  id INTEGER PRIMARY KEY,
  username TEXT UNIQUE (case-insensitive),
  full_name TEXT,
  password TEXT (phone number),
  phone TEXT,
  score INTEGER DEFAULT 0,
  attempt_count INTEGER DEFAULT 0,
  flag_count INTEGER DEFAULT 0,
  perfect_score_achieved INTEGER DEFAULT 0,
  completed_at TEXT,
  created_at TEXT
);
```

### Attempts Table
```sql
CREATE TABLE attempts (
  id INTEGER PRIMARY KEY,
  user_id INTEGER,
  score INTEGER,
  time_spent INTEGER,
  answers TEXT (JSON),
  created_at TEXT
);
```

## 🔧 Configuration

Edit `.env` file:

```env
PORT=3000
NODE_ENV=production
SESSION_SECRET=your-super-secret-key
GOOGLE_MEET_URL=https://meet.google.com/ymy-sows-owk
QUIZ_DURATION_MINUTES=60
```

## 📝 API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/login` | Authenticate user |
| POST | `/api/logout` | End session |
| GET | `/api/me` | Get current user |
| GET | `/api/questions` | Fetch quiz questions |
| POST | `/api/submit` | Submit answers for grading |
| POST | `/api/flag` | Report anti-cheat violation |

## 🚀 Deployment to kepler.inps.info

See **DEPLOYMENT.md** for detailed Cloudflare deployment instructions.

### Quick Deploy Steps
1. Set up server with Node.js 18+
2. Clone repository and install dependencies
3. Configure environment variables
4. Initialize database: `node init-db.js`
5. Start with PM2: `pm2 start server.js`
6. Configure Nginx reverse proxy
7. Point Cloudflare DNS to your server
8. Enable SSL/TLS

## 📚 Technologies Used

- **Backend**: Node.js, Express.js
- **Database**: SQLite (better-sqlite3)
- **Session**: express-session
- **Security**: Helmet.js, express-rate-limit
- **Frontend**: Vanilla JavaScript, MathJax (for LaTeX)
- **Styling**: Custom CSS

## 👥 Participants

94 participants from the online registration are pre-loaded:
- Abdul Minhaj, Ahenjeeta Ghosh, Akhouri Rishabh, Akshansh Walimbe...
- Full list in `init-db.js`

## 📞 Support

For issues or questions:
- **Event**: K.E.P.L.E.R - World Science Day 2025
- **Organizer**: INPS (Indian Network of Physics Students)
- **Website**: https://www.inps.info/events-outreach/wsd

## 📄 License

MIT License - Free to use for educational purposes

## 🙏 Acknowledgments

- INPS Team for organizing K.E.P.L.E.R
- All 94 participants
- International Science Council (ISC)

---

**Built for World Science Day 2025** 🌍🔬
**Date**: November 10, 2025
