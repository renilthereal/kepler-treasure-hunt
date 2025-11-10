# Frontend Code Files

This document contains ALL remaining frontend code needed for the K.E.P.L.E.R Treasure Hunt.

## Files to Create

1. `public/styles.css` - Complete CSS styling
2. `public/quiz.html` - Main quiz interface
3. `public/quiz.js` - Quiz logic with timer
4. `public/anti-cheat.js` - Security features
5. `DEPLOYMENT.md` - Deployment guide

---

## 1. public/styles.css

Create file: `public/styles.css`

```css
/* Reset and Base Styles */
* {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
}

body {
    font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    min-height: 100vh;
    color: #333;
    user-select: none;
    -webkit-user-select: none;
    -moz-user-select: none;
    -ms-user-select: none;
}

.login-container,
.quiz-container {
    min-height: 100vh;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 20px;
}

.login-card,
.quiz-card {
    background: white;
    border-radius: 20px;
    box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
    padding: 40px;
    max-width: 500px;
    width: 100%;
    animation: slideIn 0.5s ease-out;
}

.quiz-card {
    max-width: 900px;
}

@keyframes slideIn {
    from {
        opacity: 0;
        transform: translateY(-20px);
    }
    to {
        opacity: 1;
        transform: translateY(0);
    }
}

.header {
    text-align: center;
    margin-bottom: 30px;
}

.header h1 {
    font-size: 2.5em;
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    margin-bottom: 10px;
}

.header h2 {
    color: #555;
    font-size: 1.5em;
    margin-bottom: 5px;
}

.subtitle {
    color: #888;
    font-size: 0.9em;
}

.form-group {
    margin-bottom: 20px;
}

label {
    display: block;
    margin-bottom: 8px;
    font-weight: 600;
    color: #555;
}

input[type="text"],
input[type="tel"],
input[type="number"],
input[type="password"],
textarea {
    width: 100%;
    padding: 12px 15px;
    border: 2px solid #ddd;
    border-radius: 8px;
    font-size: 16px;
    transition: all 0.3s;
}

input:focus,
textarea:focus {
    outline: none;
    border-color: #667eea;
    box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
}

small {
    display: block;
    margin-top: 5px;
    color: #999;
    font-size: 0.85em;
}

.btn-primary {
    width: 100%;
    padding: 15px;
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    color: white;
    border: none;
    border-radius: 8px;
    font-size: 1.1em;
    font-weight: 600;
    cursor: pointer;
    transition: transform 0.2s, box-shadow 0.2s;
}

.btn-primary:hover {
    transform: translateY(-2px);
    box-shadow: 0 10px 20px rgba(102, 126, 234, 0.3);
}

.btn-primary:disabled {
    opacity: 0.6;
    cursor: not-allowed;
    transform: none;
}

.error-message {
    background: #fee;
    color: #c33;
    padding: 12px;
    border-radius: 8px;
    margin: 15px 0;
    border-left: 4px solid #c33;
}

.info-section {
    background: #f8f9fa;
    padding: 20px;
    border-radius: 10px;
    margin: 25px 0;
}

.info-section h3 {
    color: #667eea;
    margin-bottom: 15px;
}

.info-section ul {
    list-style: none;
    padding: 0;
}

.info-section li {
    padding: 8px 0;
    color: #555;
    line-height: 1.6;
}

.footer {
    text-align: center;
    margin-top: 25px;
    padding-top: 20px;
    border-top: 1px solid #eee;
}

.small-text {
    font-size: 0.85em;
    color: #888;
}

/* Timer Styles */
.timer-section {
    background: #f8f9fa;
    padding: 20px;
    border-radius: 10px;
    margin-bottom: 25px;
    text-align: center;
}

#timer {
    font-size: 2.5em;
    font-weight: bold;
    color: #667eea;
    margin: 10px 0;
}

#timer.warning {
    color: #ff9800;
    animation: pulse 1s infinite;
}

#timer.danger {
    color: #f44336;
    animation: pulse 0.5s infinite;
}

@keyframes pulse {
    0%, 100% { opacity: 1; }
    50% { opacity: 0.7; }
}

/* Question Styles */
.questions-container {
    max-height: 60vh;
    overflow-y: auto;
    padding-right: 10px;
}

.question-card {
    background: #f8f9fa;
    padding: 20px;
    border-radius: 10px;
    margin-bottom: 20px;
    border-left: 4px solid #667eea;
}

.question-card h3 {
    color: #667eea;
    margin-bottom: 15px;
    font-size: 1.1em;
}

.question-text {
    color: #333;
    line-height: 1.8;
    margin-bottom: 15px;
}

.latex-display {
    background: white;
    padding: 15px;
    border-radius: 8px;
    margin: 10px 0;
    font-family: 'Courier New', monospace;
    overflow-x: auto;
}

.answer-input {
    width: 100%;
    padding: 12px;
    border: 2px solid #ddd;
    border-radius: 8px;
    font-size: 16px;
}

/* Progress Bar */
.progress-section {
    margin: 20px 0;
}

.progress-bar {
    width: 100%;
    height: 8px;
    background: #eee;
    border-radius: 4px;
    overflow: hidden;
}

.progress-fill {
    height: 100%;
    background: linear-gradient(90deg, #667eea 0%, #764ba2 100%);
    transition: width 0.3s ease;
}

/* User Info */
.user-info {
    background: #f8f9fa;
    padding: 15px;
    border-radius: 10px;
    margin-bottom: 20px;
    display: flex;
    justify-content: space-between;
    align-items: center;
}

/* Result Modal */
.modal {
    display: none;
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: rgba(0, 0, 0, 0.7);
    z-index: 1000;
    align-items: center;
    justify-content: center;
}

.modal.active {
    display: flex;
}

.modal-content {
    background: white;
    padding: 40px;
    border-radius: 20px;
    max-width: 500px;
    width: 90%;
    text-align: center;
    animation: slideIn 0.3s ease-out;
}

.modal h2 {
    color: #667eea;
    margin-bottom: 20px;
    font-size: 2em;
}

.modal p {
    font-size: 1.2em;
    color: #555;
    margin: 15px 0;
}

/* Loading Spinner */
.loading {
    display: inline-block;
    width: 20px;
    height: 20px;
    border: 3px solid rgba(255,255,255,.3);
    border-radius: 50%;
    border-top-color: #fff;
    animation: spin 1s ease-in-out infinite;
}

@keyframes spin {
    to { transform: rotate(360deg); }
}

/* Scrollbar Styling */
::-webkit-scrollbar {
    width: 8px;
}

::-webkit-scrollbar-track {
    background: #f1f1f1;
    border-radius: 10px;
}

::-webkit-scrollbar-thumb {
    background: #667eea;
    border-radius: 10px;
}

::-webkit-scrollbar-thumb:hover {
    background: #764ba2;
}

/* Responsive */
@media (max-width: 768px) {
    .login-card,
    .quiz-card {
        padding: 25px;
    }

    .header h1 {
        font-size: 2em;
    }

    #timer {
        font-size: 2em;
    }
}
```

---

Now copy the CSS content above and create the file `public/styles.css`.

## Next Steps

After creating styles.css, you need to create:

1. **quiz.html** (400+ lines) - Main quiz page with timer and questions
2. **quiz.js** (500+ lines) - Quiz logic, timer, answer validation
3. **anti-cheat.js** (150+ lines) - Right-click disable, tab detection
4. **DEPLOYMENT.md** - Complete deployment guide

**Due to length constraints, please let me know when you've created styles.css, and I'll provide the next file's code!**

---

## Quick Create Commands

After I provide each file, create them with:

```bash
# If you're working locally:
touch public/styles.css public/quiz.html public/quiz.js public/anti-cheat.js DEPLOYMENT.md

# Then copy-paste the code I provide into each file
```

Or continue creating each file through GitHub's web interface one at a time.
