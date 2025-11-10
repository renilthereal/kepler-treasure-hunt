// Quiz Application Logic
let questions = [];
let userAnswers = {};
let timeRemaining = 3600; // 60 minutes in seconds
let timerInterval = null;
let quizStartTime = Date.now();

// Initialize quiz on page load
document.addEventListener('DOMContentLoaded', async () => {
    // Check if user is authenticated
    const response = await fetch('/api/check-auth');
    if (!response.ok) {
        window.location.href = '/';
        return;
    }

    const data = await response.json();
    if (!data.authenticated) {
        window.location.href = '/';
        return;
    }

    // Display username
    document.getElementById('username-display').textContent = `Welcome, ${data.username}`;

    // Load questions
    await loadQuestions();

    // Start timer
    startTimer();

    // Setup submit button
    document.getElementById('submit-btn').addEventListener('click', submitQuiz);
});

// Load questions from server
async function loadQuestions() {
    try {
        const response = await fetch('/api/questions');
        if (!response.ok) throw new Error('Failed to load questions');

        questions = await response.json();
        renderQuestions();
    } catch (error) {
        console.error('Error loading questions:', error);
        alert('Failed to load questions. Please refresh the page.');
    }
}

// Render questions to the page
function renderQuestions() {
    const container = document.getElementById('questions-container');
    container.innerHTML = '';

    questions.forEach((q, index) => {
        const questionCard = document.createElement('div');
        questionCard.className = 'question-card';
        questionCard.innerHTML = `
            <div class="question-number">Question ${index + 1}</div>
            <div class="question-text">$$${q.question}$$</div>
            ${q.image ? `<img src="${q.image}" alt="Question ${index + 1}" class="question-image">` : ''}
            <input 
                type="text" 
                class="answer-input" 
                id="answer-${index}" 
                placeholder="Enter your answer"
                data-question-index="${index}"
            >
        `;
        container.appendChild(questionCard);

        // Add event listener for answer input
        const input = questionCard.querySelector('.answer-input');
        input.addEventListener('input', (e) => {
            userAnswers[index] = e.target.value.trim();
            checkAllAnswered();
        });
    });

    // Re-render MathJax
    if (window.MathJax) {
        MathJax.typesetPromise();
    }
}

// Check if all questions are answered
function checkAllAnswered() {
    const allAnswered = questions.every((_, index) => {
        return userAnswers[index] && userAnswers[index].length > 0;
    });

    document.getElementById('submit-btn').disabled = !allAnswered;
}

// Start countdown timer
function startTimer() {
    updateTimerDisplay();
    
    timerInterval = setInterval(() => {
        timeRemaining--;
        updateTimerDisplay();

        if (timeRemaining <= 0) {
            clearInterval(timerInterval);
            autoSubmitQuiz();
        }
    }, 1000);
}

// Update timer display
function updateTimerDisplay() {
    const minutes = Math.floor(timeRemaining / 60);
    const seconds = timeRemaining % 60;
    const display = `${minutes}:${seconds.toString().padStart(2, '0')}`;
    document.getElementById('timer').textContent = display;

    // Change color when time is running out
    const timerElement = document.getElementById('timer');
    if (timeRemaining < 300) { // Less than 5 minutes
        timerElement.style.color = '#e74c3c';
    }
}

// Submit quiz
async function submitQuiz() {
    // Disable submit button to prevent double submission
    const submitBtn = document.getElementById('submit-btn');
    submitBtn.disabled = true;
    submitBtn.textContent = 'Submitting...';

    try {
        const timeSpent = Math.floor((Date.now() - quizStartTime) / 1000);
        
        const response = await fetch('/api/submit', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                answers: userAnswers,
                timeSpent: timeSpent
            })
        });

        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.message || 'Submission failed');
        }

        const result = await response.json();
        handleResult(result);
    } catch (error) {
        console.error('Error submitting quiz:', error);
        alert('Failed to submit quiz: ' + error.message);
        submitBtn.disabled = false;
        submitBtn.textContent = 'Submit Answers';
    }
}

// Auto-submit when timer runs out
async function autoSubmitQuiz() {
    alert('Time is up! Your answers will be submitted automatically.');
    await submitQuiz();
}

// Handle quiz result
function handleResult(result) {
    // Stop timer
    if (timerInterval) {
        clearInterval(timerInterval);
    }

    const modal = document.getElementById('result-modal');
    const title = document.getElementById('result-title');
    const message = document.getElementById('result-message');
    const retryBtn = document.getElementById('retry-btn');

    if (result.score === 10) {
        // Perfect score - redirect to Google Meet
        title.textContent = '🎉 Congratulations!';
        message.textContent = `Perfect score! You got all ${result.score} out of ${result.total} questions correct. Redirecting to the meeting...`;
        retryBtn.style.display = 'none';
        
        modal.style.display = 'flex';
        
        // Redirect after 3 seconds
        setTimeout(() => {
            window.location.href = result.redirectUrl;
        }, 3000);
    } else {
        // Partial score - allow retry
        title.textContent = 'Good Try!';
        message.textContent = `You scored ${result.score} out of ${result.total}. You need a perfect score to proceed. Would you like to try again?`;
        retryBtn.style.display = 'block';
        
        modal.style.display = 'flex';
        
        retryBtn.addEventListener('click', () => {
            window.location.reload();
        });
    }
}

// Handle page visibility change (tab switching detection)
document.addEventListener('visibilitychange', () => {
    if (document.hidden) {
        // User switched away from the tab
        console.log('User switched tabs');
    }
});
