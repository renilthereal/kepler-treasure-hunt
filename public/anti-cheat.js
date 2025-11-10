// Anti-Cheat Security Measures
let tabSwitchCount = 0;
let devToolsAttempts = 0;
let flagCount = 0;

// Disable right-click context menu
document.addEventListener('contextmenu', (e) => {
    e.preventDefault();
    return false;
});

// Disable text selection
document.addEventListener('selectstart', (e) => {
    if (!e.target.matches('.answer-input')) {
        e.preventDefault();
        return false;
    }
});

// Disable copy, cut, paste
document.addEventListener('copy', (e) => {
    if (!e.target.matches('.answer-input')) {
        e.preventDefault();
        return false;
    }
});

document.addEventListener('cut', (e) => {
    e.preventDefault();
    return false;
});

document.addEventListener('paste', (e) => {
    if (!e.target.matches('.answer-input')) {
        e.preventDefault();
        return false;
    }
});

// Disable keyboard shortcuts
document.addEventListener('keydown', (e) => {
    // F12, Ctrl+Shift+I, Ctrl+Shift+J, Ctrl+U, Ctrl+Shift+C
    if (
        e.key === 'F12' ||
        (e.ctrlKey && e.shiftKey && e.key === 'I') ||
        (e.ctrlKey && e.shiftKey && e.key === 'J') ||
        (e.ctrlKey && e.shiftKey && e.key === 'C') ||
        (e.ctrlKey && e.key === 'u') ||
        (e.ctrlKey && e.key === 'U')
    ) {
        e.preventDefault();
        flagSuspiciousActivity('Attempted to open developer tools');
        return false;
    }

    // Disable Ctrl+C, Ctrl+V, Ctrl+X (except in input fields)
    if (!e.target.matches('.answer-input')) {
        if ((e.ctrlKey && e.key === 'c') || (e.ctrlKey && e.key === 'v') || (e.ctrlKey && e.key === 'x')) {
            e.preventDefault();
            return false;
        }
    }
});

// Detect tab switching/visibility changes
document.addEventListener('visibilitychange', async () => {
    if (document.hidden) {
        tabSwitchCount++;
        flagCount++;
        
        // Send flag to server
        await sendFlagToServer('Tab switching detected');
        
        // Show warning
        showWarning(`Warning: Tab switching detected! (Count: ${tabSwitchCount})\n\nThis behavior is being tracked. Multiple violations may result in disqualification.`);
    }
});

// Detect DevTools opening (basic detection)
const devToolsChecker = () => {
    const threshold = 160;
    const widthThreshold = window.outerWidth - window.innerWidth > threshold;
    const heightThreshold = window.outerHeight - window.innerHeight > threshold;
    
    if (widthThreshold || heightThreshold) {
        devToolsAttempts++;
        flagSuspiciousActivity('Possible developer tools detected');
    }
};

// Check for DevTools every 1 second
setInterval(devToolsChecker, 1000);

// Prevent page unload attempts
window.addEventListener('beforeunload', (e) => {
    if (window.location.pathname === '/quiz.html') {
        e.preventDefault();
        e.returnValue = 'Are you sure you want to leave? Your progress may be lost.';
        return e.returnValue;
    }
});

// Flag suspicious activity
function flagSuspiciousActivity(reason) {
    flagCount++;
    console.warn(`Suspicious activity flagged: ${reason}`);
    
    // Send to server
    sendFlagToServer(reason);
}

// Send flag to server
async function sendFlagToServer(reason) {
    try {
        await fetch('/api/flag', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                reason: reason,
                timestamp: new Date().toISOString()
            })
        });
    } catch (error) {
        console.error('Failed to send flag:', error);
    }
}

// Show warning modal
function showWarning(message) {
    const modal = document.getElementById('warning-modal');
    const messageElement = document.getElementById('warning-message');
    const okButton = document.getElementById('warning-ok-btn');
    
    if (!modal || !messageElement) return;
    
    messageElement.textContent = message;
    modal.style.display = 'flex';
    
    okButton.onclick = () => {
        modal.style.display = 'none';
    };
}

// Log all flags on page unload
window.addEventListener('unload', () => {
    if (flagCount > 0) {
        navigator.sendBeacon('/api/flag', JSON.stringify({
            reason: `Session ended with ${flagCount} total flags`,
            timestamp: new Date().toISOString()
        }));
    }
});

console.log('Anti-cheat measures activated');
