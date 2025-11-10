require('dotenv').config();
const express = require('express');
const session = require('express-session');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const path = require('path');
const { getDatabase, initDatabase } = require('./database');
const questions = require('./questions.json');

const app = express();
const PORT = process.env.PORT || 3000;

// Initialize database
initDatabase();

// Security middleware
app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      scriptSrc: ["'self'", "'unsafe-inline'", "https://cdn.jsdelivr.net", "https://polyfill.io"],
      styleSrc: ["'self'", "'unsafe-inline'"],
      imgSrc: ["'self'", "data:", "https:"],
      connectSrc: ["'self'"]
    }
  }
}));

// Rate limiting
const limiter = rateLimit({
  windowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS) || 900000,
  max: parseInt(process.env.RATE_LIMIT_MAX_REQUESTS) || 100,
  message: 'Too many requests, please try again later.'
});
app.use('/api/', limiter);

// Body parser
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Session configuration
app.use(session({
  secret: process.env.SESSION_SECRET || 'your-secret-key-change-in-production',
  resave: false,
  saveUninitialized: false,
  cookie: {
    secure: process.env.NODE_ENV === 'production',
    httpOnly: true,
    maxAge: 24 * 60 * 60 * 1000 // 24 hours
  }
}));

// Serve static files
app.use(express.static('public'));

// Authentication middleware
function requireAuth(req, res, next) {
  if (!req.session.userId) {
    return res.status(401).json({ error: 'Not authenticated' });
  }
  next();
}

// API: Login
app.post('/api/login', (req, res) => {
  const { username, password } = req.body;
  
  if (!username || !password) {
    return res.status(400).json({ error: 'Username and password required' });
  }

  const db = getDatabase();
  const user = db.prepare(
    'SELECT * FROM users WHERE LOWER(username) = LOWER(?)'
  ).get(username.trim());

  if (!user) {
    return res.status(401).json({ error: 'Invalid username or password' });
  }

  // Check password (phone number)
  const cleanPassword = password.replace(/\D/g, '');
  const cleanUserPassword = user.password.replace(/\D/g, '');
  
  if (cleanPassword !== cleanUserPassword) {
    return res.status(401).json({ error: 'Invalid username or password' });
  }

  // Check if already has perfect score
  if (user.perfect_score_achieved) {
    return res.status(403).json({ 
      error: 'You have already completed the treasure hunt with a perfect score!',
      alreadyCompleted: true
    });
  }

  // Set session
  req.session.userId = user.id;
  req.session.username = user.username;
  
  res.json({ 
    success: true, 
    username: user.full_name,
    startTime: Date.now()
  });
});

// API: Logout
app.post('/api/logout', (req, res) => {
  req.session.destroy();
  res.json({ success: true });
});

// API: Get current user
app.get('/api/me', requireAuth, (req, res) => {
  const db = getDatabase();
  const user = db.prepare('SELECT id, username, full_name, flag_count FROM users WHERE id = ?').get(req.session.userId);
  
  if (!user) {
    return res.status(404).json({ error: 'User not found' });
  }
  
  res.json(user);
});

// API: Get questions
app.get('/api/questions', requireAuth, (req, res) => {
  // Return questions without correct answers
  const questionsWithoutAnswers = questions.map(q => ({
    id: q.id,
    question: q.question,
    latex: q.latex,
    image: q.image,
    type: q.type
  }));
  
  res.json(questionsWithoutAnswers);
});

// API: Submit answers
app.post('/api/submit', requireAuth, (req, res) => {
  const { answers, timeSpent } = req.body;
  
  if (!answers || !Array.isArray(answers)) {
    return res.status(400).json({ error: 'Invalid answers format' });
  }

  // Check all questions answered
  if (answers.length !== questions.length) {
    return res.status(400).json({ error: 'All questions must be answered' });
  }

  const db = getDatabase();
  const user = db.prepare('SELECT * FROM users WHERE id = ?').get(req.session.userId);
  
  if (user.perfect_score_achieved) {
    return res.status(403).json({ error: 'Already completed' });
  }

  // Grade answers
  let correctCount = 0;
  const results = answers.map((answer, index) => {
    const question = questions[index];
    const userAnswer = answer.answer.toString().trim().toLowerCase();
    const correctAnswer = question.correctAnswer.toString().trim().toLowerCase();
    
    const isCorrect = userAnswer === correctAnswer;
    if (isCorrect) correctCount++;
    
    return {
      questionId: question.id,
      isCorrect,
      userAnswer: answer.answer
    };
  });

  const score = correctCount;
  const isPerfect = score === questions.length;

  // Save attempt
  db.prepare(
    'INSERT INTO attempts (user_id, score, time_spent, answers) VALUES (?, ?, ?, ?)'
  ).run(user.id, score, timeSpent, JSON.stringify(results));

  // Update user record
  if (isPerfect) {
    db.prepare(
      'UPDATE users SET score = ?, attempt_count = attempt_count + 1, perfect_score_achieved = 1, completed_at = ? WHERE id = ?'
    ).run(score, new Date().toISOString(), user.id);
  } else {
    db.prepare(
      'UPDATE users SET score = ?, attempt_count = attempt_count + 1 WHERE id = ?'
    ).run(score, user.id);
  }

  res.json({
    success: true,
    score,
    totalQuestions: questions.length,
    isPerfect,
    results: isPerfect ? results : results.map(r => ({ questionId: r.questionId, isCorrect: r.isCorrect })),
    redirectUrl: isPerfect ? process.env.GOOGLE_MEET_URL : null
  });
});

// API: Report flag (anti-cheat)
app.post('/api/flag', requireAuth, (req, res) => {
  const { flagType, details } = req.body;
  
  const db = getDatabase();
  db.prepare(
    'UPDATE users SET flag_count = flag_count + 1, last_flag_type = ?, last_flag_time = ? WHERE id = ?'
  ).run(flagType, new Date().toISOString(), req.session.userId);
  
  res.json({ success: true });
});

// Serve index.html for root
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 K.E.P.L.E.R Treasure Hunt server running on port ${PORT}`);
  console.log(`📝 Environment: ${process.env.NODE_ENV || 'development'}`);
  console.log(`⏱️  Quiz duration: ${process.env.QUIZ_DURATION_MINUTES || 60} minutes`);
  console.log(`🔗 Google Meet URL: ${process.env.GOOGLE_MEET_URL}`);
});

module.exports = app;
